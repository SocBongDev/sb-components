import { exportTemplateStudentList, readStudentListFile, exportAttendance} from './excel.js';

const class_name = 'Lop01'

const filePath = `src/lib/Danh_sach_lop_${class_name}.xlsx`;
const sheetName = 'Sheet1';
let branch_id = 1
let class_room_id = 1
await readStudentListFile(filePath, sheetName, class_room_id, branch_id);

await exportAttendance(branch_id, class_room_id)
