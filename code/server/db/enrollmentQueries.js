const getConnection = require('../db');

// Get all enrollments
async function getAllEnrollments() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM enrollments');
    await connection.end();
    return rows;
}

// Get one enrollment by ID
//input: id
async function getEnrollmentById(id) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM enrollments WHERE enrollmentId = ?', [id]);
    await connection.end();
    return rows[0];
}

// Add new enrollment
//input: [studentId, courseId, enrollmentDate]
async function addEnrollment(enrollment) {
    const connection = await getConnection();
    const { studentId, courseId, enrollmentDate } = enrollment;
    const [result] = await connection.query(
        'INSERT INTO enrollments (studentId, courseId, enrollmentDate) VALUES (?, ?, ?)',
        [studentId, courseId, enrollmentDate]
    );
    await connection.end();
    return result.insertId;
}

// Update enrollment by ID
//input: id, [studentId, courseId, enrollmentDate]
async function updateEnrollment(id, updatedFields) {
    const connection = await getConnection();
    const { studentId, courseId, enrollmentDate } = updatedFields;
    await connection.query(
        'UPDATE enrollments SET studentId = ?, courseId = ?, enrollmentDate = ? WHERE enrollmentId = ?',
        [studentId, courseId, enrollmentDate, id]
    );
    await connection.end();
}

// Delete enrollment by ID
//input: id
async function deleteEnrollment(id) {
    const connection = await getConnection();
    await connection.query('DELETE FROM enrollments WHERE enrollmentId = ?', [id]);
    await connection.end();
}

module.exports = {
    getAllEnrollments,
    getEnrollmentById,
    addEnrollment,
    updateEnrollment,
    deleteEnrollment
};