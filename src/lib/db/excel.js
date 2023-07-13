import fs from 'fs'
import {
	readExcelFile,
	getRowValues,
	checkHeaderFile,
	readRowsAndConvertToJson,
	transformDataKeys,
	extractData
} from './util.js'
import { insertClassRoom } from './class_room.js'
import { insertParent } from './parent.js'
import { insertStudent } from './student.js'
import { attributeMappings } from './keyword_mapping.js'
// Export Template file
export function exportTemplateStudentList(class_name) {
	let originalFileName = 'src/lib/Danh_sach_hoc_sinh.xlsx'
	let newFileName = `src/lib/Danh_sach_lop_${class_name}.xlsx`

	let readStream = fs.createReadStream(originalFileName)
	let writeStream = fs.createWriteStream(newFileName)

	readStream.pipe(writeStream)

	readStream.on('error', (err) => {
		console.error('Error reading the original file:', err)
	})

	writeStream.on('error', (err) => {
		console.error('Error creating the new file:', err)
	})

	writeStream.on('finish', () => {
		console.log('File renamed successfully.')
	})
}

export function readStudentListFile(filePath, sheetName) {
	let worksheet = readExcelFile(filePath, sheetName)

	// Define the expected main and sub header rows
	let expectedMainHeader = [
		'LỚP',
		'HỌ VÀ TÊN LÓT',
		'TÊN HỌC SINH',
		'NGÀY NHẬP HỌC',
		'SINH NGÀY',
		'SỐ ĐIỆN THOẠI',
		null,
		'ZALO',
		'NĂM SINH',
		'GIỚI TÍNH',
		null,
		'DÂN TỘC',
		'NƠI SINH HS',
		'THÔNG TIN CHA',
		null,
		null,
		'THÔNG TIN MẸ',
		null,
		null,
		'THƯỜNG TRÚ',
		null,
		null,
		'TẠM TRÚ',
		'CHỦ NHÀ TRỌ',
		'BC PHỔ CẬP',
		'KHAI SINH',
		'HỘ KHẨU'
	]

	let expectedSubHeader = [
		null,
		null,
		null,
		null,
		null,
		'ĐT1',
		'ĐT2',
		null,
		null,
		'NAM',
		'NỮ',
		null,
		null,
		'HỌ VÀ TÊN',
		'NĂM SINH',
		'NGHỀ NGHIỆP',
		'HỌ VÀ TÊN',
		'NĂM SINH',
		'NGHỀ NGHIỆP',
		'TỈNH',
		'HUYỆN',
		'XÃ',
		null,
		null,
		null,
		null,
		null
	]

	let acceptableHeaders = {
		'HỌ VÀ TÊN LÓT': ['HỌ VÀ TÊN', 'HỌ'],
		'TÊN HỌC SINH': ['TÊN', 'TÊN RIÊNG', 'TÊN HS'],
		'NGÀY NHẬP HỌC': ['NHẬP HỌC'],
		'SINH NGÀY': ['SINH NHẬT', 'NGÀY SINH'],
		'SỐ ĐIỆN THOẠI': ['SDT', 'SĐT', 'SỐ ĐT', 'SỐ DT'],
		DT1: ['ĐT1', 'SĐT1', 'SDT1'],
		DT2: ['ĐT2', 'SĐT2', 'SDT2']
	}

	let mainHeaderRanges = [
		'A1:E1', // Range before "Số điện thoại"
		'F1:G1', // Range of "Số điện thoại" merged cells
		'H1:I1', // Range after "Số điện thoại" merged cells and before "GIỚI TÍNH"
		'J1:K1', // Range of "GIỚI TÍNH" merged cells
		'L1:M1', // Range after "GIỚI TÍNH" merged cells and before "THÔNG TIN CHA"
		'N1:P1', // Range of "THÔNG TIN CHA" merged cells
		'Q1:S1', // Range of "THÔNG TIN MẸ" merged cells
		'T1:V1' // Range of "THƯỜNG TRÚ" merged cells
	]
	let mainHeaderRange = 'A1:AA1'
	let subHeaderRange = 'A2:AA2'

	let headers = getRowValues(worksheet, mainHeaderRange)
	let subheaders = getRowValues(worksheet, subHeaderRange)

	let checkHeadersResult = checkHeaderFile(
		worksheet,
		mainHeaderRanges,
		subHeaderRange,
		expectedMainHeader,
		expectedSubHeader,
		acceptableHeaders
	)
	if (!checkHeadersResult) {
		console.error('Header check failed.')
		return
	} else {
		headers = expectedMainHeader
		subHeaderRange = expectedSubHeader
	}
	let data = readRowsAndConvertToJson(worksheet, headers, subheaders)
	// const studentData = transformDataKeys(data, attributeMappings.student);
	let extractedData = extractData(data, attributeMappings)
	let studentData = extractedData.map(item => item.student);
	let parentData  =  extractedData.map(item => item.paren);
	const student = insertStudent(studentData)
	for (const data of extractedData) {

		// Process the student object as needed
	}

	// for (const data of extractedData) {
	// 	const parentData = insertParent(data.parentData)
	// 	// Process the student object as needed
	// }
}
