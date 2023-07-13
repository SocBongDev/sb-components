import { attributeMappings } from './keyword_mapping.js'
import { supabase } from './supabase.js'
import { DateTime } from 'luxon'
// Function to insert a student record
export const insertStudent = async (studentData) => {
  try {
    preprocessDate('dob', studentData); // Preprocess the 'dob' date field
    preprocessDate('enroll_date', studentData);
    const { data, error, response } = await supabase.from('student').insert(studentData);

    if (error) {
      throw new Error(`Error inserting student: ${error.message}`);
    }

    console.log('Student inserted successfully:', data);
  } catch (error) {
    console.error('Error inserting student:', error);
    // console.log('Error data:', studentData); // Print the student data causing the error
  }
};

function preprocessDate(dateKey, data) {
  data.forEach((row) => {
    if (row[dateKey]) {
      let formattedDate = null;

      try {
        let parsedDate = DateTime.fromFormat(row[dateKey], 'dd/MM/yyyy');
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'dd/M/yyyy');
        }
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'd/MM/yyyy');
        }
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'd/M/yyyy');
        }
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'dd/MM/yy');
        }
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'dd/M/yy');
        }
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'd/MM/yy');
        }
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'd/M/yy');
        }
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'yyyy/M/dd');
        }
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'yyyy/MM/d');
        }
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'yyyy/M/d');
        }
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'yy/MM/dd');
        }
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'yy/M/dd');
        }
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'yy/MM/d');
        }
        if (!parsedDate.isValid) {
          parsedDate = DateTime.fromFormat(row[dateKey], 'yy/M/d');
        }
        formattedDate = parsedDate.toFormat('yyyy/MM/dd');
      } catch (error) {
        // Handle the error here
        formattedDate = null;
      }

      row[dateKey] = formattedDate;
    }
    else{
      row[dateKey] = null;
    }
  });
}
function preprocessInterger(key, data){
  data.forEach((row) => {
    if (!row[key]) {
      row[dataKey] = 0
    }
  });
}