import { exportTemplateStudentList, readStudentListFile } from './excel.js';

const class_name = 'LopMam123'
// Usage example:
// exportTemplateStudentList('LopMam123');

const filePath = `src/lib/Danh_sach_lop_${class_name}.xlsx`;
const sheetName = 'Sheet1';
readStudentListFile(filePath, sheetName);
