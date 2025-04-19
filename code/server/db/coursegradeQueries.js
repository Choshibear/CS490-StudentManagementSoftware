const getConnection = require('../db');

// Get all coursegrades
async function getAllCourseGrades() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM coursegrades');
    await connection.end();
    return rows;
}

// Get one coursegrade by ID
//input: id
async function getCourseGradeById(id) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM coursegrades WHERE courseGradeId = ?', [id]);
    await connection.end();
    return rows[0];
}

// Add a new coursegrade
//input: [studentId, courseId, courseGrade, feedback, courseAvg]
async function addCourseGrade(courseGrade) {
    const connection = await getConnection();
    const { studentId, courseId, courseGrade: grade, feedback, courseAvg } = courseGrade;
    const [result] = await connection.query(
        'INSERT INTO coursegrades (studentId, courseId, courseGrade, feedback, courseAvg) VALUES (?, ?, ?, ?, ?)',
        [studentId, courseId, grade, feedback, courseAvg]
    );
    await connection.end();
    return result.insertId;
}

// Update coursegrade by ID
//input: id, [studentId, courseId, courseGrade, feedback, courseAvg]
async function updateCourseGrade(id, updatedFields) {
    const connection = await getConnection();
    const { studentId, courseId, courseGrade, feedback, courseAvg } = updatedFields;
    await connection.query(
        'UPDATE coursegrades SET studentId = ?, courseId = ?, courseGrade = ?, feedback = ?, courseAvg = ? WHERE courseGradeId = ?',
        [studentId, courseId, courseGrade, feedback, courseAvg, id]
    );
    await connection.end();
}

// Delete coursegrade by ID
//input: id
async function deleteCourseGrade(id) {
    const connection = await getConnection();
    await connection.query('DELETE FROM coursegrades WHERE courseGradeId = ?', [id]);
    await connection.end();
}

module.exports = {
    getAllCourseGrades,
    getCourseGradeById,
    addCourseGrade,
    updateCourseGrade,
    deleteCourseGrade
};