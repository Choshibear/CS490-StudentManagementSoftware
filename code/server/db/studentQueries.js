// server/db/studentQueries.js

const getConnection = require('../db');

// Fetch all students
async function getAllStudents() {
  const connection = await getConnection();
  const [rows] = await connection.query('SELECT * FROM students');
  await connection.end();
  return rows;
}

// Fetch one student by ID
async function getStudentById(id) {
  const connection = await getConnection();
  const [rows] = await connection.query(
    'SELECT * FROM students WHERE studentId = ?',
    [id]
  );
  await connection.end();
  return rows[0];
}

// Fetch one student by username (for login)
async function getStudentByUsername(username) {
  const connection = await getConnection();
  const [rows] = await connection.query(
    'SELECT * FROM students WHERE username = ?',
    [username]
  );
  await connection.end();
  return rows[0];
}

// Add a new student (including studentNotes)
async function addStudent(student) {
  const connection = await getConnection();
  const {
    firstName,
    lastName,
    dob,
    email,
    address,
    city,
    state,
    zip,
    phoneNumber,
    username,
    password,
    gradeLevelId,
    studentNotes      // ← pick up from req.body
  } = student;

  const [result] = await connection.query(
    `INSERT INTO students
       (firstName, lastName, dob, email, address, city, state, zip, phoneNumber,
        username, password, gradeLevelId, studentNotes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      firstName,
      lastName,
      dob,
      email,
      address,
      city,
      state,
      zip,
      phoneNumber,
      username,
      password,
      gradeLevelId,
      studentNotes
    ]
  );

  await connection.end();
  return result.insertId;
}

// Update an existing student by ID
// (only the fields we want—no username/password here)
async function updateStudent(id, updatedFields) {
  const connection = await getConnection();
  const {
    firstName,
    lastName,
    dob,
    email,
    address,
    city,
    state,
    zip,
    phoneNumber,
    gradeLevelId,
    studentNotes    // ← pick up from req.body
  } = updatedFields;

  await connection.query(
    `UPDATE students
        SET firstName    = ?,
            lastName     = ?,
            dob          = ?,
            email        = ?,
            address      = ?,
            city         = ?,
            state        = ?,
            zip          = ?,
            phoneNumber  = ?,
            gradeLevelId = ?,
            studentNotes = ?    -- only update notes here
      WHERE studentId    = ?`,
    [
      firstName,
      lastName,
      dob,
      email,
      address,
      city,
      state,
      zip,
      phoneNumber,
      gradeLevelId,
      studentNotes,
      id
    ]
  );

  await connection.end();
}

// Delete a student
async function deleteStudent(id) {
  const connection = await getConnection();
  await connection.query(
    'DELETE FROM students WHERE studentId = ?',
    [id]
  );
  await connection.end();
}

module.exports = {
  getAllStudents,
  getStudentById,
  getStudentByUsername,
  addStudent,
  updateStudent,
  deleteStudent
};
