const getConnection = require('../db');

// Get all attendances
async function getAllAttendances() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM attendance');
    await connection.end();
    return rows;
}

//Get one attendance by ID
//input: id
async function getAttendanceById(id) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM attendance WHERE id = ?', [id]);
    await connection.end();
    return rows[0];
}
//Get one attendance by student ID
//input: studentId
async function getAttendanceByStudentId(studentId) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM attendance WHERE student_id = ?', [studentId]);
    await connection.end();
    return rows[0];
}
//Get one attendance by date
//input: date
async function getAttendanceByDate(date) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM attendance WHERE date = ?', [date]);
    await connection.end();
    return rows[0];
}

//add a new attendance to the database
//input: attendance[student_id, date, status]
async function addAttendance(attendance) {
    const connection = await getConnection();
    const { student_id, date, status } = attendance;
    const [result] = await connection.query(
        'INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)',
        [student_id, date, status]
    );
    await connection.end();
    return result.insertId;
}
//update an existing attendance in the database
//input: attendance[id, student_id, date, status]
async function updateAttendance(attendance) {
    const connection = await getConnection();
    const { id, student_id, date, status } = attendance;
    const [result] = await connection.query(
        'UPDATE attendance SET student_id = ?, date = ?, status = ? WHERE id = ?',
        [student_id, date, status, id]
    );
    await connection.end();
    return result.insertId;
}

//delete an existing attendance from the database
//input: id
async function deleteAttendance(id) {
    const connection = await getConnection();
    await connection.query('DELETE FROM attendance WHERE id = ?', [id]);
    await connection.end();
}
module.exports = { getAllAttendances };