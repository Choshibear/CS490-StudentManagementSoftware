const getConnection = require('../db');

// Get all students
async function getAllStudents() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM students');
    await connection.end();
    return rows;
}

// Get one student by ID
//input: studentId
async function getStudentById(id) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM students WHERE studentId = ?', [id]);
    await connection.end();
    return rows[0];
}

// Add new student
//input: [firstName, lastName, dob, email, address, city, state, zip, phoneNumber, username, password]
async function addStudent(student) {
    const connection = await getConnection();
    const { firstName, lastName, dob, email, address, city, state, zip, phoneNumber, username, password, gradeLevelId } = student;
    const [result] = await connection.query(
        'INSERT INTO students (firstName, lastName, dob, email, address, city, state, zip, phoneNumber, username, password, gradeLevelId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [firstName, lastName, dob, email, address, city, state, zip, phoneNumber, username, password, gradeLevelId]
    );
    await connection.end();
    return result.insertId;
}

// Update student by ID
//input: id, [firstName, lastName, dob, email, address, city, state, zip, phoneNumber, username, password, gradeLevelId]
async function updateStudent(id, updatedFields) {
    const connection = await getConnection();
    const { firstName, lastName, dob, email, address, city, state, zip, phoneNumber, username, password, gradeLevelId } = updatedFields;
    await connection.query(
        'UPDATE students SET firstName = ?, lastName = ?, dob = ?, email = ?, address = ?, city = ?, state = ?, zip = ?, phoneNumber = ?, username = ?, password = ?, gradeLevelId = ? WHERE studentId = ?',
        [firstName, lastName, dob, email, address, city, state, zip, phoneNumber, username, password, gradeLevelId, id]
    );
    await connection.end();
}

// Delete student by ID
//input: id
async function deleteStudent(id) {
    const connection = await getConnection();
    await connection.query('DELETE FROM students WHERE studentId = ?', [id]);
    await connection.end();
}

module.exports = { getAllStudents, getStudentById, addStudent, updateStudent, deleteStudent };