// server/db/coursegradeQueries.js

// Correctly require your shared DB connection helper.
// This will load server/db/index.js if that’s where getConnection lives.
const getConnection = require('../db');

/**
 * Get all coursegrades.
 */
async function getAllCourseGrades() {
  const conn = await getConnection();
  const [rows] = await conn.query('SELECT * FROM coursegrades');
  await conn.end();
  return rows;
}

/**
 * Get one coursegrade by its primary key.
 */
async function getCourseGradeById(id) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    'SELECT * FROM coursegrades WHERE courseGradeId = ?',
    [id]
  );
  await conn.end();
  return rows[0];
}

/**
 * Add a full coursegrade record.
 * Expects { studentId, courseId, courseGrade, feedback, courseAvg }.
 */
async function addCourseGrade(courseGrade) {
  const conn = await getConnection();
  const { studentId, courseId, courseGrade: grade, feedback, courseAvg } = courseGrade;
  const [result] = await conn.query(
    'INSERT INTO coursegrades (studentId, courseId, courseGrade, feedback, courseAvg) VALUES (?, ?, ?, ?, ?)',
    [studentId, courseId, grade, feedback, courseAvg]
  );
  await conn.end();
  return result.insertId;
}

/**
 * Update a full coursegrade record by primary key.
 * Expects the same fields as addCourseGrade plus the id in the URL.
 */
async function updateCourseGrade(id, updatedFields) {
  const conn = await getConnection();
  const { studentId, courseId, courseGrade, feedback, courseAvg } = updatedFields;
  await conn.query(
    `UPDATE coursegrades
        SET studentId   = ?,
            courseId    = ?,
            courseGrade = ?,
            feedback    = ?,
            courseAvg   = ?
      WHERE courseGradeId = ?`,
    [studentId, courseId, courseGrade, feedback, courseAvg, id]
  );
  await conn.end();
}

/**
 * Delete a coursegrade by primary key.
 */
async function deleteCourseGrade(id) {
  const conn = await getConnection();
  await conn.query('DELETE FROM coursegrades WHERE courseGradeId = ?', [id]);
  await conn.end();
}

/**
 * Upsert only the feedback field:
 * - INSERT a new row with nulls for other columns if none exists
 * - UPDATE feedback if the (studentId, courseId) pair already exists
 *
 * Requires a UNIQUE KEY on (studentId, courseId).
 */
async function upsertCourseFeedback({ studentId, courseId, feedback }) {
  const conn = await getConnection();
  const [result] = await conn.query(
    `
    INSERT INTO coursegrades
      (studentId, courseId, courseGrade, feedback, courseAvg)
    VALUES
      (?,         ?,        NULL,        ?,        NULL)
    ON DUPLICATE KEY UPDATE
      feedback = VALUES(feedback)
    `,
    [studentId, courseId, feedback]
  );
  await conn.end();
  return result;
}

module.exports = {
  getAllCourseGrades,
  getCourseGradeById,
  addCourseGrade,
  updateCourseGrade,
  deleteCourseGrade,
  upsertCourseFeedback
};
