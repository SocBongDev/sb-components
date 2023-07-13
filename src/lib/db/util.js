import xlsx from 'xlsx'
import fs from 'fs'
import unorm from 'unorm'
export function readRowsAndConvertToJson(worksheet, headers, subheaders) {
	const data = []
	const rowRange = xlsx.utils.decode_range(worksheet['!ref'])

	let currentMainHeader = null
	let previousMainHeader = null
	let rowObj = {}

	for (let rowIdx = rowRange.s.r + 2; rowIdx <= rowRange.e.r; rowIdx++) {
		const row = []
		for (let colIdx = rowRange.s.c; colIdx <= rowRange.e.c; colIdx++) {
			const cellAddress = xlsx.utils.encode_cell({ r: rowIdx, c: colIdx })
			const cell = worksheet[cellAddress]
			const cellValue = cell ? cell.v : null
			row.push(cellValue)
		}

		for (let colIdx = 0; colIdx < row.length; colIdx++) {
			const cellValue = row[colIdx]
			currentMainHeader = headers[colIdx]
			if (currentMainHeader == null || currentMainHeader == undefined || currentMainHeader == '') {
				currentMainHeader = previousMainHeader
			}
			if (!(currentMainHeader in rowObj)) {
				rowObj[currentMainHeader] = {} // Assign an empty object
			}
			if (isHasSubHeader(currentMainHeader, headers)) {
				const subHeader = subheaders[colIdx]
				if (cellValue !== undefined && cellValue !== null) {
					rowObj[currentMainHeader][subHeader] = cellValue
				} else {
					rowObj[currentMainHeader][subHeader] = ''
				}
			} else {
				if (currentMainHeader && cellValue !== undefined && cellValue !== null) {
					rowObj[currentMainHeader] = cellValue
				} else {
					rowObj[currentMainHeader] = ''
				}
			}

			previousMainHeader = currentMainHeader
		}

		if (Object.keys(rowObj).length > 0) {
			data.push(rowObj)
		}

		// Reset the row object for the next row
		rowObj = {}
	}

	const result = data

	// Output the JSON to a file
	const outputFilename = 'output.json'
	fs.writeFileSync(outputFilename, JSON.stringify(data, null, 4))

	console.log(`JSON data written to file: ${outputFilename}`)
	return result
}

export function readExcelFile(filePath, sheetName) {
	const workbook = xlsx.readFile(filePath)
	const worksheet = workbook.Sheets[sheetName]

	return worksheet
}

export function getRowValues(worksheet, range) {
	const cells = xlsx.utils.sheet_to_json(worksheet, { range, header: 1, defval: null })
	return Object.values(cells[0])
}

function sanitizeHeader(header) {
	if (typeof header === 'string') {
		// Remove specific symbols, while preserving diacritics
		const sanitizedHeader = header.replace(/[`~!@.,<>?;'ơ\]=]/g, '').toLowerCase()
		return sanitizedHeader
	}
	return ''
}

export function checkHeader(header, expectedMainHeader, expectedSubHeader, acceptableHeaders) {
	const errors = []

	// Check if the acceptableHeaders object is empty
	if (Object.keys(acceptableHeaders).length === 0) {
		errors.push('The acceptableHeaders object is empty.')
	}

	for (let i = 0; i < header.length; i++) {
		const cellValue = sanitizeHeader(header[i])
		const expectedMain = expectedMainHeader && expectedMainHeader[i]
		const expectedSub = expectedSubHeader && expectedSubHeader[i]

		if (cellValue !== sanitizeHeader(expectedMain) && expectedMain !== null) {
			if (acceptableHeaders[expectedMain]) {
				const acceptableValues = acceptableHeaders[expectedMain].map(sanitizeHeader)
				if (!acceptableValues.includes(cellValue)) {
					errors.push(
						`Expected main header "${expectedMain}" at index ${i}, found "${cellValue}" but acceptable values are ${acceptableValues}`
					)
				}
			} else {
				errors.push(`Expected main header "${expectedMain}" at index ${i}, found "${cellValue}"`)
			}
		}

		if (cellValue !== sanitizeHeader(expectedSub) && expectedSub !== null) {
			if (acceptableHeaders[expectedSub]) {
				const acceptableValues = acceptableHeaders[expectedSub].map(sanitizeHeader)
				if (!acceptableValues.includes(cellValue)) {
					errors.push(
						`Expected sub header "${expectedSub}" at index ${i}, found "${cellValue}" but acceptable values are ${acceptableValues}`
					)
				}
			} else {
				errors.push(`Expected sub header "${expectedSub}" at index ${i}, found "${cellValue}"`)
			}
		}
	}

	return errors
}

export function checkHeaderFile(
	worksheet,
	mainHeaderRanges,
	subHeaderRange,
	expectedMainHeader,
	expectedSubHeader,
	acceptableHeaders
) {
	let mainHeader = []
	for (const range of mainHeaderRanges) {
		const values = getRowValues(worksheet, range)
		mainHeader = mainHeader.concat(values)
	}

	// Check if the main header matches the expected format
	const mainHeaderErrors = checkHeader(mainHeader, expectedMainHeader, null, acceptableHeaders)
	if (mainHeaderErrors.length > 0) {
		console.error('Main header errors:', mainHeaderErrors)
		return false
	}

	// Check if the sub header matches the expected format
	const subHeader = getRowValues(worksheet, subHeaderRange)
	const subHeaderErrors = checkHeader(subHeader, null, expectedSubHeader, acceptableHeaders)
	if (subHeaderErrors.length > 0) {
		console.error('Sub header errors:', subHeaderErrors)
		return false
	}

	console.log('Main header:', mainHeader)
	console.log('Sub header:', subHeader)

	return true
}
function isHasSubHeader(currentHeader, headers) {
	const currentIndex = headers.indexOf(currentHeader)
	const nextValue = headers[currentIndex + 1]

	return nextValue === null
}
export const transformDataKeys = (data, mapping) => {
	const transformedData = {}
	for (const [key, value] of Object.entries(mapping)) {
		if (typeof value === 'object') {
			transformedData[key] = transformDataKeys(data, value)
		} else {
			transformedData[key] = data[value] || null
		}
	}
	return transformedData
}

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
			const nonEmptyKeys = Object.keys(value).filter(key => value[key] !== '');
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
  