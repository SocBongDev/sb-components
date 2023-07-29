import xlsx from 'xlsx';
import fs from 'fs';
import unorm from 'unorm';
import { attributeMappings, attributeOrder } from './keyword_mapping.js';
import { insertStudent, selectIdFromStudentData, getStudentsFromClassroom } from './student.js';
import { DateTime } from 'luxon';
import { insertParent } from './parent.js';
import xlsxPopulate from 'xlsx-populate';
import { supabase } from './supabase.js';
// export function readRowsAndConvertToJson(worksheet, headers, subheaders) {
// 	const data = [];
// 	const rowRange = xlsx.utils.decode_range(worksheet['!ref']);

// 	let currentMainHeader = null;
// 	let previousMainHeader = null;
// 	let rowObj = {};

// 	for (let rowIdx = rowRange.s.r + 2; rowIdx <= rowRange.e.r; rowIdx++) {
// 		const row = [];
// 		for (let colIdx = rowRange.s.c; colIdx <= rowRange.e.c; colIdx++) {
// 			const cellAddress = xlsx.utils.encode_cell({ r: rowIdx, c: colIdx });
// 			const cell = worksheet[cellAddress];
// 			const cellValue = cell ? cell.v : null;
// 			row.push(cellValue);
// 		}

// 		for (let colIdx = 0; colIdx < row.length; colIdx++) {
// 			const cellValue = row[colIdx];
// 			currentMainHeader = headers[colIdx];
// 			if (currentMainHeader == null || currentMainHeader == undefined || currentMainHeader == '') {
// 				currentMainHeader = previousMainHeader;
// 			}
// 			if (!(currentMainHeader in rowObj)) {
// 				rowObj[currentMainHeader] = {}; // Assign an empty object
// 			}
// 			if (isHasSubHeader(currentMainHeader, headers)) {
// 				const subHeader = subheaders[colIdx];
// 				if (cellValue !== undefined && cellValue !== null) {
// 					rowObj[currentMainHeader][subHeader] = cellValue;
// 				} else {
// 					rowObj[currentMainHeader][subHeader] = '';
// 				}
// 			} else {
// 				if (currentMainHeader && cellValue !== undefined && cellValue !== null) {
// 					rowObj[currentMainHeader] = cellValue;
// 				} else {
// 					rowObj[currentMainHeader] = '';
// 				}
// 			}

// 			previousMainHeader = currentMainHeader;
// 		}

// 		if (Object.keys(rowObj).length > 0) {
// 			data.push(rowObj);
// 		}

// 		// Reset the row object for the next row
// 		rowObj = {};
// 	}

// 	const result = data;

// 	// Output the JSON to a file
// 	const outputFilename = 'output.json';
// 	fs.writeFileSync(outputFilename, JSON.stringify(data, null, 4));

// 	console.log(`JSON data written to file: ${outputFilename}`);
// 	return result;
// }


// Function to check if a row is valid based on certain criteria.
function isValidRow(row) {
	// Add your criteria here to determine if the row is valid.
	// For example, you might check if all required columns have values.
  
	// For demonstration purposes, let's assume the first column (index 0) is required.
	return row[0] !== undefined && row[0] !== null && row[0] !== '';
  }
export function readRowsAndConvertToJson(worksheet, headers, subheaders) {
	const data = [];
	const rowRange = xlsx.utils.decode_range(worksheet['!ref']);
  
	let currentMainHeader = null;
	let previousMainHeader = null;
	let rowObj = {};
  
	for (let rowIdx = rowRange.s.r + 2; rowIdx <= rowRange.e.r; rowIdx++) {
	  const row = [];
	  for (let colIdx = rowRange.s.c; colIdx <= rowRange.e.c; colIdx++) {
		const cellAddress = xlsx.utils.encode_cell({ r: rowIdx, c: colIdx });
		const cell = worksheet[cellAddress];
		const cellValue = cell ? cell.v : null;
		row.push(cellValue);
	  }
  
	  if (!isValidRow(row)) {
		// Skip this row if it's not valid based on the criteria.
		continue;
	  }
  
	  for (let colIdx = 0; colIdx < row.length; colIdx++) {
		const cellValue = row[colIdx];
		currentMainHeader = headers[colIdx];
		if (currentMainHeader == null || currentMainHeader == undefined || currentMainHeader == '') {
		  currentMainHeader = previousMainHeader;
		}
		if (!(currentMainHeader in rowObj)) {
		  rowObj[currentMainHeader] = {}; // Assign an empty object
		}
		if (isHasSubHeader(currentMainHeader, headers)) {
		  const subHeader = subheaders[colIdx];
		  if (cellValue !== undefined && cellValue !== null) {
			rowObj[currentMainHeader][subHeader] = cellValue;
		  } else {
			rowObj[currentMainHeader][subHeader] = '';
		  }
		} else {
		  if (currentMainHeader && cellValue !== undefined && cellValue !== null) {
			rowObj[currentMainHeader] = cellValue;
		  } else {
			rowObj[currentMainHeader] = '';
		  }
		}
  
		previousMainHeader = currentMainHeader;
	  }
  
	  if (Object.keys(rowObj).length > 0) {
		data.push(rowObj);
	  }
  
	  // Reset the row object for the next row
	  rowObj = {};
	}
  
	const result = data;
  
	// Output the JSON to a file
	const outputFilename = 'output.json';
	fs.writeFileSync(outputFilename, JSON.stringify(data, null, 4));
  
	console.log(`JSON data written to file: ${outputFilename}`);
	return result;
  }
	export function readExcelFile(filePath, sheetName) {
		const workbook = xlsx.readFile(filePath);
		const worksheet = workbook.Sheets[sheetName];

		return worksheet;
	}

export function getRowValues(worksheet, range) {
	const cells = xlsx.utils.sheet_to_json(worksheet, { range, header: 1, defval: null });
	return Object.values(cells[0]);
}

function sanitizeHeader(header) {
	if (typeof header === 'string') {
		// Remove specific symbols, while preserving diacritics
		const sanitizedHeader = header.replace(/[`~!@.,<>?;'ơ\]=]/g, '').toLowerCase();
		return sanitizedHeader;
	}
	return '';
}

export function checkHeader(header, expectedMainHeader, expectedSubHeader, acceptableHeaders) {
	const errors = [];

	// Check if the acceptableHeaders object is empty
	if (Object.keys(acceptableHeaders).length === 0) {
		errors.push('The acceptableHeaders object is empty.');
	}

	for (let i = 0; i < header.length; i++) {
		const cellValue = sanitizeHeader(header[i]);
		const expectedMain = expectedMainHeader && expectedMainHeader[i];
		const expectedSub = expectedSubHeader && expectedSubHeader[i];

		if (cellValue !== sanitizeHeader(expectedMain) && expectedMain !== null) {
			if (acceptableHeaders[expectedMain]) {
				const acceptableValues = acceptableHeaders[expectedMain].map(sanitizeHeader);
				if (!acceptableValues.includes(cellValue)) {
					errors.push(
						`Expected main header "${expectedMain}" at index ${i}, found "${cellValue}" but acceptable values are ${acceptableValues}`
					);
				}
			} else {
				errors.push(`Expected main header "${expectedMain}" at index ${i}, found "${cellValue}"`);
			}
		}

		if (cellValue !== sanitizeHeader(expectedSub) && expectedSub !== null) {
			if (acceptableHeaders[expectedSub]) {
				const acceptableValues = acceptableHeaders[expectedSub].map(sanitizeHeader);
				if (!acceptableValues.includes(cellValue)) {
					errors.push(
						`Expected sub header "${expectedSub}" at index ${i}, found "${cellValue}" but acceptable values are ${acceptableValues}`
					);
				}
			} else {
				errors.push(`Expected sub header "${expectedSub}" at index ${i}, found "${cellValue}"`);
			}
		}
	}

	return errors;
}

export function checkHeaderFile(
	worksheet,
	mainHeaderRanges,
	subHeaderRange,
	expectedMainHeader,
	expectedSubHeader,
	acceptableHeaders
) {
	let mainHeader = [];
	for (const range of mainHeaderRanges) {
		const values = getRowValues(worksheet, range);
		mainHeader = mainHeader.concat(values);
	}

	// Check if the main header matches the expected format
	const mainHeaderErrors = checkHeader(mainHeader, expectedMainHeader, null, acceptableHeaders);
	if (mainHeaderErrors.length > 0) {
		console.error('Main header errors:', mainHeaderErrors);
		return false;
	}

	// Check if the sub header matches the expected format
	const subHeader = getRowValues(worksheet, subHeaderRange);
	const subHeaderErrors = checkHeader(subHeader, null, expectedSubHeader, acceptableHeaders);
	if (subHeaderErrors.length > 0) {
		console.error('Sub header errors:', subHeaderErrors);
		return false;
	}

	console.log('Main header:', mainHeader);
	console.log('Sub header:', subHeader);

	return true;
}
function isHasSubHeader(currentHeader, headers) {
	const currentIndex = headers.indexOf(currentHeader);
	const nextValue = headers[currentIndex + 1];

	return nextValue === null;
}
export const transformDataKeys = (data, mapping) => {
	const transformedData = {};
	for (const [key, value] of Object.entries(mapping)) {
		if (typeof value === 'object') {
			transformedData[key] = transformDataKeys(data, value);
		} else {
			transformedData[key] = data[value] || null;
		}
	}
	return transformedData;
};

export function extractData(dictData, mapping) {
	const result = [];

	for (const dict of dictData) {
		const entityData = {};

		for (const entity in mapping) {
			entityData[entity] = {};

			for (const attribute in mapping[entity]) {
				const key = mapping[entity][attribute];
				const keys = key.split('.');

				let value = dict;
				for (const k of keys) {
					value = value[k];
					if (typeof value === 'undefined') break;
				}

				// Handle special case for "sex" attribute
				if (attribute === 'sex' && typeof value === 'object' && value !== null) {
					const nonEmptyKeys = Object.keys(value).filter((key) => value[key] !== '');
					if (nonEmptyKeys.length > 0) {
						value = nonEmptyKeys[0];
					} else {
						value = null; // Set to null if all keys have empty values
					}
				}

				entityData[entity][attribute] = value;
			}
		}

		result.push(entityData);
	}
	return result;
}
//   export async function insertStudentAndParent(data, class_room_id, branch_id) {
// 	try {
// 	  let extractedData = extractData(data, attributeMappings);
// 	  let studentData = extractedData.map((item) => ({
// 		...item.student,
// 		class_room_id: class_room_id, // Add the class_room_id to the student data
// 	  }));

// 	  studentData = preprocessDate('dob', studentData); // Preprocess the 'dob' date field
// 	  studentData = preprocessDate('enroll_date', studentData);
// 	  studentData = removeDuplicateStudents(studentData);

// 	  // Get all students from the database for the specified class
// 	  const allStudentData = await getStudentsFromClassroom(branch_id, class_room_id);

// 	  // Create a map of existing student data with the unique identifier
// 	  const existingStudentMap = new Map();
// 	  allStudentData.forEach((student) => {
// 		const identifier = `${student.first_name}-${student.last_name}-${student.dob || 'null'}`;
// 		existingStudentMap.set(identifier, student);
// 	  });

// 	  // Filter out the student data that are already in the database
// 	  const newStudentData = studentData.filter((student) => {
// 		const identifier = `${student.first_name}-${student.last_name}-${student.dob || 'null'}`;
// 		return !existingStudentMap.has(identifier);
// 	  });

// 	  await insertStudent(newStudentData, class_room_id);
// 	  // Select 'id' from the insertedStudentData and maintain the same order as studentData
// 	  const studentIds = await selectIdFromStudentData(allStudentData);

// 	  let parentData = extractedData.map((item) => item.parent);
// 	  parentData = preprocessDate('dob', parentData); // Preprocess the 'dob' date field
// 	  parentData = processParentData(parentData, studentIds);
// 	  parentData = parentData.flat();
// 	  await insertParent(parentData);

// 	  // Log the mapped all student data with the new data inserted
// 	  console.log('Mapped all student data:', [...allStudentData, ...newStudentData]);
// 	} catch (error) {
// 	  console.error('Error inserting student and parent data:', error);
// 	}
//   }

// export async function insertStudentAndParent(data, class_room_id, branch_id) {
// 	try {
// 	  let extractedData = extractData(data, attributeMappings);
// 	  let studentData = extractedData.map((item) => ({
// 		...item.student,
// 		class_room_id: class_room_id, // Add the class_room_id to the student data
// 	  }));

// 	  studentData = preprocessDate('dob', studentData); // Preprocess the 'dob' date field
// 	  studentData = preprocessDate('enroll_date', studentData);
// 	  studentData = removeDuplicateStudents(studentData);
// 	  await insertStudent(studentData, class_room_id);

// 	  // Get all students from the database for the specified class
// 	  const allstudentData = await getStudentsFromClassroom(branch_id, class_room_id);

// 	  // Select 'id' from the insertedStudentData and maintain the same order as studentData
// 	  const studentIds = await selectIdFromStudentData(allstudentData);

// 	  // Map 'allstudentData' to match the order of 'studentData' using 'studentIds'
// 	  const mappedAllStudentData = studentIds.map((studentId) => {
// 		return allstudentData.find((student) => student.id === studentId);
// 	  });

// 	  let parentData = extractedData.map((item) => item.parent);
// 	  parentData = preprocessDate('dob', parentData); // Preprocess the 'dob' date field
// 	  parentData = preprocessDate('enroll_date', parentData);
// 	  parentData = processParentData(parentData, studentIds);
// 	  parentData = parentData.flat();
// 	  await insertParent(parentData);

// 	  // 'mappedAllStudentData' now contains the students in the same order as 'studentData'
// 	  console.log('Mapped all student data:', mappedAllStudentData);
// 	} catch (error) {
// 	  console.error('Error inserting student and parent data:', error);
// 	}
//   }

export async function insertStudentAndParent(data, class_room_id, branch_id) {
	let transformedData = data.map((item) => {
		// Step 1: Transform student data
		const student = {
			class_room_id: class_room_id,
			grade: item['LỚP'],
			first_name: item['HỌ VÀ TÊN LÓT'],
			last_name: item['TÊN HỌC SINH'],
			enroll_date: item['NGÀY NHẬP HỌC'],
			dob: item['SINH NGÀY'],
			birth_year: item['NĂM SINH'],
			sex: item['GIỚI TÍNH']['NỮ'] === 'x' ? 'Nữ' : 'Nam',
			ethnic: item['DÂN TỘC'],
			birth_place: item['NƠI SINH HS'],
			temp_res: item['TẠM TRÚ'],
			perm_res_province: item['THƯỜNG TRÚ']['TỈNH'],
			perm_res_district: item['THƯỜNG TRÚ']['HUYỆN'],
			perm_res_commune: item['THƯỜNG TRÚ']['XÃ']
		};

		// Step 2: Transform parent data
		const father = {
			student_id: null,
			phone_number: item['SỐ ĐIỆN THOẠI']['ĐT1'],
			name: item['THÔNG TIN CHA']['HỌ VÀ TÊN'],
			dob: item['THÔNG TIN CHA']['NĂM SINH'],
			sex: 'NAM',
			occupation: item['THÔNG TIN CHA']['NGHỀ NGHIỆP'],
			zalo: item['ZALO'],
			landlord: item['CHỦ NHÀ TRỌ'],
			roi: item['BC PHỔ CẬP'],
			birthplace: item['KHAI SINH'],
			res_registration: item['HỘ KHẨU']
		};

		const mother = {
			student_id: null,
			phone_number: item['SỐ ĐIỆN THOẠI']['ĐT2'],
			name: item['THÔNG TIN MẸ']['HỌ VÀ TÊN'],
			dob: item['THÔNG TIN MẸ']['NĂM SINH'],
			sex: 'NỮ',
			occupation: item['THÔNG TIN MẸ']['NGHỀ NGHIỆP'],
			zalo: item['ZALO'],
			landlord: item['CHỦ NHÀ TRỌ'],
			roi: item['BC PHỔ CẬP'],
			birthplace: item['KHAI SINH'],
			res_registration: item['HỘ KHẨU']
		};

		return { student, parents: [father, mother] };
	});
	transformedData = preprocessDate('dob', transformedData);
	transformedData = preprocessDate('enroll_date', transformedData);
	let dbStudentParentData = await getStudentAndParentData(class_room_id);
	// Assuming transformedData and dbStudentParentData are already defined
	const finalData = mergeData(
		removeDuplicateStudents([...transformedData, ...dbStudentParentData]),
		dbStudentParentData
	);
	// Modify finalData to set id to null for students with no id
	// finalData.forEach((item) => {
	// 	if (!item.student.id) {
	// 	item.student.id = null;
	// 	}
	// });
	await pushToDatabase(finalData);
}

// Step 3: Get mapped parent data based on student_id
function getMappedParentData(studentId, data) {
	const parentData = data.find((item) => item[0].id === studentId);
	return parentData ? parentData[1] : [];
}

// Step 3: Get mapped parent data based on student_id
async function getMappedDbStudentData(branch_id, class_room_id, data) {
	const studentIds = data.map((item) => item.student.id);
	const dbStudentData = await getStudentsFromClassroom(branch_id, class_room_id);
	return dbStudentData.map((student) => ({
		student: student,
		parent: getMappedParentData(student.id, studentIds, data)
	}));
}

// function processParentData(data, studentIds) {
// 	const parentsArray = [];

// 	data.forEach((element, index) => {
// 	  const father = {
// 		student_id: studentIds[index], // Add studentId to the father object
// 		phone_number: element.phone_1 || null, // Set to null if empty or undefined
// 		name: element.father_name || null, // Set to null if empty or undefined
// 		dob: element.father_dob || null, // Set to null if empty or undefined
// 		occupation: element.father_occupation || null, // Set to null if empty or undefined
// 		zalo: element.zalo || null, // Set to null if empty or undefined
// 		landlord: element.landlord || null, // Set to null if empty or undefined
// 		roi: element.roi || null, // Set to null if empty or undefined
// 		birthplace: element.birthplace || null, // Set to null if empty or undefined
// 		res_registration: element.res_registration || null, // Set to null if empty or undefined
// 	  };

// 	  const mother = {
// 		student_id: studentIds[index], // Add studentId to the mother object
// 		phone_number: element.phone_2 || null, // Set to null if empty or undefined
// 		name: element.mother_name || null, // Set to null if empty or undefined
// 		dob: element.mother_dob || null, // Set to null if empty or undefined
// 		occupation: element.mother_occupation || null, // Set to null if empty or undefined
// 		zalo: element.zalo || null, // Set to null if empty or undefined
// 		landlord: element.landlord || null, // Set to null if empty or undefined
// 		roi: element.roi || null, // Set to null if empty or undefined
// 		birthplace: element.birthplace || null, // Set to null if empty or undefined
// 		res_registration: element.res_registration || null, // Set to null if empty or undefined
// 	  };

// 	  // Check if both father and mother objects have at least one non-empty attribute
// 	  if (Object.values(father).some((value) => value !== "" && value !== " " && value !== null) ||
// 		  Object.values(mother).some((value) => value !== "" && value !== " " && value !== null)) {
// 		const parents = [father, mother];
// 		parentsArray.push(parents);
// 	  }
// 	});

// 	return parentsArray;
//   }

function processParentData(data, studentIds) {
	const parentsArray = [];

	data.forEach((element, index) => {
		const father = {
			student_id: studentIds[index], // Add studentId to the father object
			phone_number: element.SỐ_ĐIỆN_THOẠI.ĐT1 || null, // Set to null if empty or undefined
			name: element.THÔNG_TIN_CHA['HỌ VÀ TÊN'] || null, // Set to null if empty or undefined
			dob: element.THÔNG_TIN_CHA['NĂM SINH'] || null, // Set to null if empty or undefined
			occupation: element.THÔNG_TIN_CHA['NGHỀ NGHIỆP'] || null, // Set to null if empty or undefined
			zalo: element.ZALO || null, // Set to null if empty or undefined
			landlord: element['THƯỜNG TRÚ']?.TỈNH || null, // Set to null if empty or undefined
			roi: element['THƯỜNG TRÚ']?.HUYỆN || null, // Set to null if empty or undefined
			birthplace: element.NƠI_SINH_HS || null, // Set to null if empty or undefined
			res_registration: element['THƯỜNG TRÚ']?.XÃ || null // Set to null if empty or undefined
		};

		const mother = {
			student_id: studentIds[index], // Add studentId to the mother object
			phone_number: element.SỐ_ĐIỆN_THOẠI.ĐT2 || null, // Set to null if empty or undefined
			name: element.THÔNG_TIN_MẸ['HỌ VÀ TÊN'] || null, // Set to null if empty or undefined
			dob: element.THÔNG_TIN_MẸ['NĂM SINH'] || null, // Set to null if empty or undefined
			occupation: element.THÔNG_TIN_MẸ['NGHỀ NGHIỆP'] || null, // Set to null if empty or undefined
			zalo: element.ZALO || null, // Set to null if empty or undefined
			landlord: element['THƯỜNG TRÚ']?.TỈNH || null, // Set to null if empty or undefined
			roi: element['THƯỜNG TRÚ']?.HUYỆN || null, // Set to null if empty or undefined
			birthplace: element.NƠI_SINH_HS || null, // Set to null if empty or undefined
			res_registration: element['THƯỜNG TRÚ']?.XÃ || null // Set to null if empty or undefined
		};

		// Check if both father and mother objects have at least one non-empty attribute
		if (
			Object.values(father).some((value) => value !== '' && value !== ' ' && value !== null) ||
			Object.values(mother).some((value) => value !== '' && value !== ' ' && value !== null)
		) {
			const parents = [father, mother];
			parentsArray.push(parents);
		}
	});

	return parentsArray;
}

// function preprocessDate(dateKey, data) {
// 	data.forEach((row) => {
// 		if (row[dateKey]) {
// 			const dateFormats = [
// 				'dd/MM/yyyy',
// 				'dd/M/yyyy',
// 				'd/MM/yyyy',
// 				'd/M/yyyy',
// 				'dd/MM/yy',
// 				'dd/M/yy',
// 				'd/MM/yy',
// 				'd/M/yy',
// 				'yyyy/M/dd',
// 				'yyyy/MM/d',
// 				'yyyy/M/d',
// 				'yy/MM/dd',
// 				'yy/M/dd',
// 				'yy/MM/d',
// 				'yy/M/d'
// 			];

// 			let formattedDate = null;
// 			let validDateFound = false;

// 			for (const format of dateFormats) {
// 				try {
// 					const parsedDate = DateTime.fromFormat(row[dateKey], format);
// 					if (parsedDate.isValid) {
// 						formattedDate = parsedDate.toFormat('yyyy/MM/dd');
// 						validDateFound = true;
// 						break; // Exit the loop once a valid date is found
// 					}
// 				} catch (error) {
// 					// Ignore the error and continue to the next format
// 				}
// 			}

// 			if (!validDateFound) {
// 				formattedDate = null;
// 			}
// 			row[dateKey] = formattedDate;
// 		}
// 	});
// 	for (let i = 0; i < data.length; i++) {
// 		if (data[i][dateKey] === '' || data[i][dateKey] === '' || data[i][dateKey] === ' ') {
// 			data[i][dateKey] = null;
// 		}
// 	}
// 	return data;
// }

function preprocessDate(dateKey, data) {
	data.forEach((item) => {
		const row = item.student; // Extracting the student object from the item
		if (row[dateKey]) {
			const dateFormats = [
				'dd/MM/yyyy',
				'dd/M/yyyy',
				'd/MM/yyyy',
				'd/M/yyyy',
				'dd/MM/yy',
				'dd/M/yy',
				'd/MM/yy',
				'd/M/yy',
				'yyyy/M/dd',
				'yyyy/MM/d',
				'yyyy/M/d',
				'yy/MM/dd',
				'yy/M/dd',
				'yy/MM/d',
				'yy/M/d'
			];

			let formattedDate = null;
			let validDateFound = false;

			for (const format of dateFormats) {
				try {
					const parsedDate = DateTime.fromFormat(row[dateKey], format);
					if (parsedDate.isValid) {
						formattedDate = parsedDate.toFormat('yyyy/MM/dd');
						validDateFound = true;
						break; // Exit the loop once a valid date is found
					}
				} catch (error) {
					// Ignore the error and continue to the next format
				}
			}

			if (!validDateFound) {
				formattedDate = null;
			}
			row[dateKey] = formattedDate;
		}
	});

	// Additional loop to handle empty date strings
	for (let i = 0; i < data.length; i++) {
		const row = data[i].student;
		if (row[dateKey] === '' || row[dateKey] === ' ' || row[dateKey] === null) {
			row[dateKey] = null;
		}
	}

	return data;
}

// Function to flatten the merged data into one flat data row.
function flattenData(studentData, fatherData, motherData) {
	const flatData = {};

	// Student data
	Object.keys(studentData).forEach((key) => {
		flatData[`student.${key}`] = studentData[key];
	});

	// Father data
	Object.keys(fatherData).forEach((key) => {
		flatData[`father.${key}`] = fatherData[key];
	});

	// Mother data
	Object.keys(motherData).forEach((key) => {
		flatData[`mother.${key}`] = motherData[key];
	});

	return attributeOrder.map((attribute) => flatData[attribute]);
}

// Function to merge student and parent data based on student_id
export function mergeStudentParentData(studentData, parentData) {
	const mergedData = [];

	studentData.forEach((student) => {
		const parents = parentData.filter((parent) => parent.student_id === student.id);

		if (parents.length > 0) {
			mergedData.push([student, parents]);
		}
	});

	return mergedData;
}

function modifyFlattenedData(flatData) {
	// Modify the flatData as needed
	let sex = flatData[9]; // Assuming 'student.sex' is at index 9
	sex = sex.toUpperCase();

	if (sex === 'NAM') {
		// Replace with 'x', ''
		flatData.splice(9, 1, 'x', '', ...flatData.slice(10));
	} else if (sex === 'NỮ') {
		// Replace with '', 'x'
		flatData.splice(9, 1, '', 'x', ...flatData.slice(10));
	}

	// Add other modifications if needed

	return flatData; // Return the modified flatData
}

export async function writeDataToTemplate(dataItem) {
	const templatePath = './src/lib/Attendance.xlsx';
	const newFilePath = './src/lib/NewAttendance.xlsx';

	try {
		// Step 1: Load the template file using xlsx-populate.
		const workbook = await xlsxPopulate.fromFileAsync(templatePath);

		// Step 2: Get the target worksheet.
		const worksheet = workbook.sheet('Sheet1'); // Replace 'Sheet1' with the actual sheet name.
		let rowIndex = 2;
		// Step 3: Loop through each element in dataItem and write the data to the new worksheet.
		//   let rowIndex = worksheet.lastUsedRow() + 1; // Start after the original data
		for (const item of dataItem) {
			const studentData = item[0];
			const fatherData = item[1][0];
			const motherData = item[1][1];

			const flatData = flattenData(studentData, fatherData, motherData);
			// Call the function to modify the flattenedData array
			const modifiedData = modifyFlattenedData(flatData);

			// Write the modifiedData to the worksheet starting from the 3rd row
			rowIndex++; // Move to the next row
			for (let colIndex = 0; colIndex < modifiedData.length; colIndex++) {
				const cellAddress = xlsx.utils.encode_cell({ r: rowIndex, c: colIndex });
				worksheet.cell(cellAddress).value(modifiedData[colIndex]);
			}
		}

		// Step 4: Save the new workbook to a new file.
		await workbook.toFileAsync(newFilePath);
		console.log('Data written to the new file:', newFilePath);
	} catch (error) {
		console.error('Error writing data to the new file:', error);
	}
}

export async function getStudentAndParentData(class_room_id) {
	try {
		// Step 1: Fetch all students from the specified class room of the branch
		const { data: students, error: studentError } = await supabase
			.from('student')
			.select('*')
			.eq('class_room_id', class_room_id);

		if (studentError) {
			throw new Error(`Error fetching students: ${studentError.message}`);
		}

		// Step 2: Get parent data for each student using their ID
		const studentAndParentData = await Promise.all(
			students.map(async (student) => {
				try {
					// Fetch all parents associated with the student ID
					const { data: parents, error: parentError } = await supabase
						.from('parent')
						.select('*')
						.eq('student_id', student.id);

					if (parentError) {
						console.error(
							`Error fetching parents for student ID ${student.id}: ${parentError.message}`
						);
						return {
							student: student,
							parents: [] // Empty array for parents if an error occurs
						};
					}

					// Map the student and their parents
					return {
						student: student,
						parents: parents
					};
				} catch (error) {
					console.error(`Error fetching parents for student ID ${student.id}: ${error.message}`);
					return {
						student: student,
						parents: [] // Empty array for parents if an error occurs
					};
				}
			})
		);

		return studentAndParentData;
	} catch (error) {
		console.error('Error getting student and parent data:', error);
		return [];
	}
}
// Function to remove duplicates based on the specified rules
function removeDuplicateStudents(data) {
	const students = data.map((item) => item.student); // Extracting students from the data
	const duplicates = findDuplicates(students);
	const result = [];

	data.forEach((item, index) => {
		if (!duplicates.some((indexes) => indexes.includes(index))) {
			result.push(item);
		}
	});

	duplicates.forEach((duplicateIndexes) => {
		const duplicateStudents = duplicateIndexes.map((index) => students[index]);
		const hasNullDob = duplicateStudents.some((student) => !student.dob);

		if (hasNullDob) {
			// Insert all duplicate records as separate students
			duplicateIndexes.forEach((index) => {
				const { student, parents } = data[index];
				result.push({ student, parents });
			});
		} else {
			// Insert the first record and ignore the subsequent duplicates
			const [firstDuplicateIndex, ...otherDuplicateIndexes] = duplicateIndexes;
			result.push(data[firstDuplicateIndex]);

			otherDuplicateIndexes.forEach((index) => {
				const { parents } = data[index];
				result.push({ student: students[index], parents });
			});
		}
	});

	return result;
}

function removeDuplicatesByKey(arr, keyFn) {
	const seen = new Set();
	return arr.filter((item) => {
		const key = keyFn(item);
		return seen.has(key) ? false : seen.add(key);
	});
}
// Helper function to merge student data and parent data
function mergeData(transformedData, dbStudentParentData) {
	const finalData = [];
	const studentIdMap = new Map();

	// Remove duplicates from transformedData based on first_name, last_name, and dob
	transformedData = removeDuplicatesByKey(transformedData, (item) => {
		const { first_name, last_name, dob } = item.student;
		return `${first_name}-${last_name}-${dob}`;
	});

	// Process dbStudentParentData
	dbStudentParentData.forEach((item) => {
		const { student, parents } = item;
		const key = `${student.first_name}-${student.last_name}-${student.dob}`;

		if (!studentIdMap.has(key)) {
			// If the student doesn't exist in the map, add it to the map with its ID
			const insertedIndex = finalData.push(item) - 1;
			studentIdMap.set(key, insertedIndex);
		} else {
			// If the student already exists in the map, update the parent data (if available)
			const index = studentIdMap.get(key);
			const existingParents = finalData[index].parents;

			if (parents) {
				// Update the parent data with student ID
				const updatedParents = parents.map((parent) => {
					return { ...parent, student_id: finalData[index].student.id };
				});

				// Ensure both transformedData and dbStudentParentData have parent data
				const mergedParents = [
					...(updatedParents || existingParents || [null]), // First parent from dbStudentParentData (or null if not available)
					...(existingParents || updatedParents || [null]) // Second parent from transformedData (or null if not available)
				];

				// Update the parents data in the finalData
				finalData[index].parents = mergedParents;
			}
		}
	});

	// Process transformedData
	transformedData.forEach((item) => {
		const { student, parents } = item;
		const key = `${student.first_name}-${student.last_name}-${student.dob}`;

		if (!studentIdMap.has(key)) {
			// If the student doesn't exist in the map, add it to the finalData with its ID
			finalData.push(item);
			studentIdMap.set(key, finalData.length - 1);
		} else {
			// If the student already exists in the map, update the student_id and parent data (if available)
			const index = studentIdMap.get(key);
			const existingItem = finalData[index];

			// If the existing item doesn't have a student_id but the new item does, update the student_id
			if (!existingItem.student.id && item.student.id) {
				existingItem.student.id = item.student.id;
			}

			if (parents) {
				// Update the parent data with student ID
				const updatedParents = parents.map((parent) => {
					return { ...parent, student_id: existingItem.student.id };
				});

				// Ensure both transformedData and dbStudentParentData have parent data
				const mergedParents = [
					...(updatedParents || existingItem.parents || [null]), // First parent from transformedData (or null if not available)
					...(existingItem.parents || updatedParents || [null]) // Second parent from dbStudentParentData (or null if not available)
				];

				// Update the parents data in the finalData
				existingItem.parents = mergedParents;
			}
		}
	});

	return finalData;
}

function areDatesEqual(date1, date2) {
	if (!date1 || !date2) {
		return false;
	}
	const date1Obj = new Date(date1);
	const date2Obj = new Date(date2);
	return date1Obj.getTime() === date2Obj.getTime();
}

// Helper function to find duplicates in an array of student objects
function findDuplicates(students) {
	const duplicates = new Map();
	students.forEach((student, index) => {
		const key = `${student.first_name}-${student.last_name}`;
		if (duplicates.has(key)) {
			duplicates.get(key).push(index);
		} else {
			duplicates.set(key, [index]);
		}
	});
	return Array.from(duplicates.values()).filter((indexes) => indexes.length > 1);
}
//   async function pushToDatabase(data) {
// 	try {
// 	  for (const item of data) {
// 		const studentData = item.student;
// 		let student_id = studentData.id;

// 		// Step 1: Insert or update the student
// 		if (!student_id) {
// 		  // If student_id is not present, it means the student is new and needs to be inserted.
// 		  // Insert the student and get the newly generated student_id.
// 		  try {
// 			const { data: newStudentData, error: newStudentError } = await supabase
// 			  .from('student')
// 			  .insert({
// 				...studentData,
// 				enroll_date: new Date(),
// 			  })
// 			  .single();

// 			if (newStudentError) {
// 			  throw newStudentError;
// 			}

// 			student_id = newStudentData.id; // Get the student_id from the insertion
// 		  } catch (error) {
// 			console.error('Error inserting student:', error);
// 			continue;
// 		  }
// 		} else {
// 		  // If student_id is present, it means the student already exists and needs to be updated.
// 		  // Update the student with the provided student_id.
// 		  try {
// 			const { error: updateStudentError } = await supabase
// 			  .from('student')
// 			  .update(studentData)
// 			  .eq('id', student_id)
// 			  .single();

// 			if (updateStudentError) {
// 			  throw updateStudentError;
// 			}
// 		  } catch (error) {
// 			console.error('Error updating student:', error);
// 			continue;
// 		  }
// 		}

// 		// Step 2: Insert or update parents with the obtained student_id
// 		for (const parent of item.parents) {
// 		  // Insert or update parent with the obtained student_id
// 		  let parentStudentId = parent.student_id;

// 		  if (!parentStudentId) {
// 			// If parent's student_id is not present, assign the student_id obtained earlier to it
// 			parentStudentId = student_id;
// 		  }

// 		  const { data: existingParentData } = await supabase
// 			.from('parent')
// 			.select('id')
// 			.eq('student_id', parentStudentId)
// 			.single();

// 		  if (existingParentData) {
// 			// If parent with the student_id exists, update the parent with the existingParentData.id
// 			try {
// 			  const { error: updateParentError } = await supabase
// 				.from('parent')
// 				.update(parent)
// 				.eq('id', existingParentData.id)
// 				.single();

// 			  if (updateParentError) {
// 				throw updateParentError;
// 			  }
// 			} catch (error) {
// 			  console.error('Error updating parent:', error);
// 			}
// 		  } else {
// 			// If parent with the student_id does not exist, insert the parent with the student_id
// 			try {
// 			  const { error: parentInsertError } = await supabase.from('parent').insert({
// 				student_id: parentStudentId,
// 				name: parent.name,
// 				dob: parent.dob,
// 				phone_number: parent.phone_number,
// 				zalo: parent.zalo,
// 				occupation: parent.occupation,
// 				landlord: parent.landlord,
// 				roi: parent.roi,
// 				birthplace: parent.birthplace,
// 				res_registration: parent.res_registration,
// 			  });

// 			  if (parentInsertError) {
// 				throw parentInsertError;
// 			  }
// 			} catch (error) {
// 			  console.error('Error inserting parent:', error);
// 			}
// 		  }
// 		}
// 	  }
// 	  console.log('Data pushed to the database successfully.');
// 	} catch (error) {
// 	  console.error('Error pushing data to the database:', error);
// 	}
//   }

// async function pushToDatabase(data) {
// 	try {
// 		for (const item of data) {
// 			const studentData = item.student;
// 			let student_id = studentData.id;

// 			// Step 1: Insert or update the student
// 			if (!student_id) {
// 				// If student_id is not present, it means the student is new and needs to be inserted.
// 				// Insert the student and get the newly generated student_id.
// 				try {
// 					const { data: newStudentData, error: newStudentError } = await supabase
// 						.from('student')
// 						.insert({
// 							...studentData
// 						})
// 						.single();

// 					if (newStudentError) {
// 						throw newStudentError;
// 					}

// 					// Query for the student to get the student_id
// 					const { data: newStudentQueryData, error: newStudentQueryError } = await supabase
// 						.from('student')
// 						.select('id')
// 						.eq('first_name', studentData.first_name) // Adjust the query criteria as needed
// 						.eq('last_name', studentData.last_name)
// 						.eq('dob', studentData.dob)
// 						.single();

// 					if (newStudentQueryError) {
// 						throw newStudentQueryError;
// 					}

// 					student_id = newStudentQueryData.id;
// 				} catch (error) {
// 					console.error('Error inserting student:', error);
// 					continue;
// 				}
// 			} else {
// 				// If student_id is present, it means the student already exists and needs to be updated.
// 				// Update the student with the provided student_id.
// 				try {
// 					const { error: updateStudentError } = await supabase
// 						.from('student')
// 						.update(studentData)
// 						.eq('id', student_id)
// 						.single();

// 					if (updateStudentError) {
// 						throw updateStudentError;
// 					}
// 				} catch (error) {
// 					console.error('Error updating student:', error);
// 					continue;
// 				}
// 			}

// 			// Step 2: Insert or update parents with the obtained student_id
// 			for (const parent of item.parents) {
// 				// Insert or update parent with the obtained student_id
// 				let parentStudentId = parent.student_id;

// 				if (!parentStudentId) {
// 					parentStudentId = student_id;
// 				}

// 				if (!parent.id) {
// 					// If parent's id is not present, check if the parent exists based on name and student_id
// 					const { data: existingParentData } = await supabase
// 						.from('parent')
// 						.select('id')
// 						.eq('student_id', parentStudentId)
// 						.eq('name', parent.name)
// 						.single();

// 					if (existingParentData) {
// 						// If parent with the student_id and name exists, update the parent with the existingParentData.id
// 						try {
// 							const { error: updateParentError } = await supabase
// 								.from('parent')
// 								.update(parent)
// 								.eq('id', existingParentData.id)
// 								.single();

// 							if (updateParentError) {
// 								throw updateParentError;
// 							}
// 						} catch (error) {
// 							console.error('Error updating parent:', error);
// 						}
// 					} else {
// 						// If parent with the student_id and name does not exist, insert the parent with the student_id
// 						try {
// 							const { error: parentInsertError } = await supabase.from('parent').insert({
// 								student_id: parentStudentId,
// 								name: parent.name,
// 								dob: parent.dob,
// 								sex: parent.sex,
// 								phone_number: parent.phone_number,
// 								zalo: parent.zalo,
// 								occupation: parent.occupation,
// 								landlord: parent.landlord,
// 								roi: parent.roi,
// 								birthplace: parent.birthplace,
// 								res_registration: parent.res_registration
// 							});

// 							if (parentInsertError) {
// 								throw parentInsertError;
// 							}
// 						} catch (error) {
// 							console.error('Error inserting parent:', error);
// 						}
// 					}
// 				} else {
// 					// If parent's id is present, it means the parent already exists and needs to be updated.
// 					// Update the parent with the provided parent.id
// 					try {
// 						const { error: updateParentError } = await supabase
// 							.from('parent')
// 							.update(parent)
// 							.eq('id', parent.id)
// 							.single();

// 						if (updateParentError) {
// 							throw updateParentError;
// 						}
// 					} catch (error) {
// 						console.error('Error updating parent:', error);
// 					}
// 				}
// 			}
// 		}
// 		console.log('Data pushed to the database successfully.');
// 	} catch (error) {
// 		console.error('Error pushing data to the database:', error);
// 	}
// }

async function pushToDatabase(data) {
	try {
	  for (const item of data) {
		const studentData = item.student;
		let student_id = studentData.id;
  
		// Step 1: Insert or update the student
		if (student_id === null || student_id === undefined) {
		  // If student_id is not present, it means the student is new and needs to be inserted.
		  // Insert the student and get the newly generated student_id.
		  try {
			const { data: newStudentData, error: newStudentError } = await supabase
			  .from('student')
			  .insert({
				...studentData,
			  })
			  .single();
  
			if (newStudentError) {
			  throw newStudentError;
			}
			if (studentData.dob != null || studentData.dob != undefined){
				// Query for the student to get the student_id
				const { data: newStudentQueryData, error: newStudentQueryError } = await supabase
				.from('student')
				.select('id')
				.eq('first_name', studentData.first_name) // Adjust the query criteria as needed
				.eq('last_name', studentData.last_name)
				.eq('dob', studentData.dob)
				.single();
	
				if (newStudentQueryError) {
					throw newStudentQueryError;
				}
				student_id = newStudentQueryData.id;
			}
			else{
				// Query for the student to get the student_id
				const { data: newStudentQueryData, error: newStudentQueryError } = await supabase
				.from('student')
				.select('id')
				.eq('first_name', studentData.first_name) // Adjust the query criteria as needed
				.eq('last_name', studentData.last_name)
				.single();
	
				if (newStudentQueryError) {
					throw newStudentQueryError;
				}
				student_id = newStudentQueryData.id;
			}
  

		  } catch (error) {
			console.error('Error inserting student:', error);
			// Query for the student to get the student_id
			const { data: newStudentQueryData, error: newStudentQueryError } = await supabase
			.from('student')
			.select('id')
			.eq('first_name', studentData.first_name) // Adjust the query criteria as needed
			.eq('last_name', studentData.last_name)
			.single();

			if (newStudentQueryError) {
			throw newStudentQueryError;
			}

			student_id = newStudentQueryData.id;
			continue;
		  }
		} else {
		  // If student_id is present, it means the student already exists and needs to be updated.
		  // Update the student with the provided student_id.
		  try {
			const { error: updateStudentError } = await supabase
			  .from('student')
			  .update(studentData)
			  .eq('id', student_id)
			  .single();
  
			if (updateStudentError) {
			  throw updateStudentError;
			}
		  } catch (error) {
			console.error('Error updating student:', error);
			continue;
		  }
		}
  
		// Step 2: Insert or update parents with the obtained student_id
		for (const parent of item.parents) {
		  // Insert or update parent with the obtained student_id
		  let parentStudentId = parent.student_id;
  
		  if (parentStudentId === null || parentStudentId === undefined) {
			parentStudentId = student_id;
			parent.student_id = parentStudentId
		  }
  
		  if (parent.sex != null || parent.sex != undefined) {
			// If parent's name is not present, check if the parent exists based on name and student_id
			const { data: existingParentData } = await supabase
			  .from('parent')
			  .select('id')
			  .eq('student_id', parentStudentId)
			  .eq('sex', parent.sex)
			  .single();
  
			if (existingParentData != null || existingParentData != undefined) {
			  // If parent with the student_id and sex exists, update the parent with the existingParentData.id
			  try {
				const { error: updateParentError } = await supabase
				  .from('parent')
				  .update(parent)
				  .eq('id', existingParentData.id)
				  .single();
  
				if (updateParentError) {
				  throw updateParentError;
				}
			  } catch (error) {
				console.error('Error updating parent:', error);
			  }
			} else {
			  // If parent with the student_id and sex does not exist, insert the parent with the student_id
			  try {
				const { error: parentInsertError } = await supabase.from('parent').insert({
				  student_id: parentStudentId,
				  name: parent.name,
				  dob: parent.dob,
				  sex: parent.sex,
				  phone_number: parent.phone_number,
				  zalo: parent.zalo,
				  occupation: parent.occupation,
				  landlord: parent.landlord,
				  roi: parent.roi,
				  birthplace: parent.birthplace,
				  res_registration: parent.res_registration,
				});
  
				if (parentInsertError) {
				  throw parentInsertError;
				}
			  } catch (error) {
				console.error('Error inserting parent:', error);
			  }
			}
		  } else {
			// If parent's name is present, it means the parent already exists and needs to be updated.
			// Update the parent with the provided parent.id
			try {
			  const { error: updateParentError } = await supabase
				.from('parent')
				.update(parent)
				.eq('id', parent.id)
				.single();
  
			  if (updateParentError) {
				throw updateParentError;
			  }
			} catch (error) {
			  console.error('Error updating parent:', error);
			}
		  }
		}
	  }
	  console.log('Data pushed to the database successfully.');
	} catch (error) {
	  console.error('Error pushing data to the database:', error);
	}
  }
  