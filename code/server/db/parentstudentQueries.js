const getConnection = require('../db');

//get all parent_student relationships
async function getAllParentStudents() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM parent_student');
    await connection.end();
    return rows;
}

// Link parent to student
async function linkParentStudent(parentId, studentId) {
  const connection = await getConnection();
  await connection.query(
    'INSERT INTO parent_student (parentId, studentId) VALUES (?, ?)',
    [parentId, studentId]
  );
  await connection.end();
}

// Unlink parent from student
async function unlinkParentStudent(parentId, studentId) {
  const connection = await getConnection();
  await connection.query(
    'DELETE FROM parent_student WHERE parentId = ? AND studentId = ?',
    [parentId, studentId]
  );
  await connection.end();
}

module.exports = { linkParentStudent, unlinkParentStudent, getAllParentStudents };