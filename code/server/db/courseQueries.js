const getConnection = require('../db');

// Get all courses
async function getAllCourses() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM courses');
    await connection.end();
    return rows;
}

// Get one course by ID
//inputs: id
async function getCourseById(id) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM courses WHERE courseId = ?', [id]);
    await connection.end();
    return rows[0];
}

// Add new course
//inputs: [courseName, teacherId]
async function addCourse(course) {
    const connection = await getConnection();
    const { courseName, teacherId } = course;
    const [result] = await connection.query(
        'INSERT INTO courses (courseName, teacherId) VALUES (?, ?)',
        [courseName, teacherId]
    );
    await connection.end();
    return result.insertId;
}

// Update course by ID
//inputs:id, [courseName, teacherId]
async function updateCourse(id, updatedFields) {
    const connection = await getConnection();
    const { courseName, teacherId } = updatedFields;
    await connection.query(
        'UPDATE courses SET courseName = ?, teacherId = ? WHERE courseId = ?',
        [courseName, teacherId, id]
    );
    await connection.end();
}

// Delete course by ID
//inputs: id
async function deleteCourse(id) {
    const connection = await getConnection();
    await connection.query('DELETE FROM courses WHERE courseId = ?', [id]);
    await connection.end();
}

module.exports = { getAllCourses, getCourseById, addCourse, updateCourse, deleteCourse };