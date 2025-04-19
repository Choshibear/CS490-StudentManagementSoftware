const getConnection = require('../db');

// Get all teachers
async function getAllTeachers() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM teachers');
    await connection.end();
    return rows;
}

// Get one teacher by ID
//input: teacherId
async function getTeacherById(id) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM teachers WHERE teacherId = ?', [id]);
    await connection.end();
    return rows[0];
}
// Add new teacher
//input: [firstName, lastName, email, address, city, state, zip, phoneNumber, username, password]
async function addTeacher(teacher) {
    const connection = await getConnection();
    const { firstName, lastName, email, address, city, state, zip, phoneNumber, username, password } = teacher;
    const [result] = await connection.query(
        'INSERT INTO teachers (firstName, lastName, email, address, city, state, zip, phoneNumber, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, address, city, state, zip, phoneNumber, username, password]
    );
    await connection.end();
    return result.insertId;
}

// Update teacher by ID
//input: id, [firstName, lastName, email, address, city, state, zip, phoneNumber, username, password]
async function updateTeacher(id, updatedFields) {
    const connection = await getConnection();
    const { firstName, lastName, email, address, city, state, zip, phoneNumber, username, password } = updatedFields;
    await connection.query(
        'UPDATE teachers SET firstName = ?, lastName = ?, email = ?, address = ?, city = ?, state = ?, zip = ?, phoneNumber = ?, username = ?, password = ? WHERE teacherId = ?',
        [firstName, lastName, email, address, city, state, zip, phoneNumber, username, password, id]
    );
    await connection.end();
}

// Delete teacher by ID
//input: id
async function deleteTeacher(id) {
    const connection = await getConnection();
    await connection.query('DELETE FROM teachers WHERE teacherId = ?', [id]);
    await connection.end();
}

module.exports = { getAllTeachers, getTeacherById, addTeacher, updateTeacher, deleteTeacher };