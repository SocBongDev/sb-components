-- Create Student Table
CREATE TABLE student (
  id SERIAL PRIMARY KEY,
  grade TEXT,
  first_name TEXT,
  last_name TEXT,
  enroll_date DATE,
  dob DATE,
  phone_1 TEXT,
  phone_2 TEXT,
  zalo TEXT,
  birth_year TEXT,
  sex TEXT,
  ethnic TEXT,
  birth_place TEXT,
  temp_res TEXT,
  perm_res_province TEXT,
  perm_res_district TEXT,
  perm_res_commune TEXT
);

-- Create Parent Table
CREATE TABLE parent (
  id SERIAL PRIMARY KEY,
  student_id INT REFERENCES student(id),
  father_name TEXT,
  father_dob INT,
  father_occupation TEXT,
  mother_name TEXT,
  mother_dob INT,
  mother_occupation TEXT,
  landlord TEXT,
  roi TEXT,
  birthplace TEXT,
  res_registration TEXT
);
