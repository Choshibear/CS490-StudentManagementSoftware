// server/db/assignmentGradesQueries.js
const getConnection = require('../db');

// Fetch all grades
async function getAllAssignmentGrades() {
  const conn = await getConnection();
  const [rows] = await conn.query('SELECT * FROM assignmentgrades');
  await conn.end();
  return rows;
}

// Fetch grades by courseId
async function getAssignmentGradesByCourseId(courseId) {
  const conn = await getConnection();
  const query = `
    SELECT
      s.studentId    AS student_id,
      CONCAT(s.firstName, ' ', s.lastName) AS student_name,
      a.assignmentId,
      a.assignmentName,
      ag.assignmentPoints,
      ag.feedback
    FROM students s
    JOIN enrollments e
      ON s.studentId = e.studentId
    JOIN assignments a
      ON a.courseId = e.courseId
    LEFT JOIN assignmentgrades ag
      ON ag.studentId    = s.studentId
     AND ag.assignmentId = a.assignmentId
     AND ag.courseId     = e.courseId
    WHERE a.courseId = ?
    ORDER BY student_name, a.assignmentId
  `;
  const [rows] = await conn.query(query, [courseId]);
  await conn.end();
  return rows;
}

// Create one blank grade per student for a new assignment
async function addGradesForAssignment(assignmentId, courseId) {
  const conn = await getConnection();
  await conn.execute(
    `INSERT INTO assignmentgrades (assignmentPoints, studentId, assignmentId, courseId)
       SELECT NULL, studentId, ?, ?
         FROM enrollments
        WHERE courseId = ?`,
    [assignmentId, courseId, courseId]
  );
  await conn.end();
}

// Update an existing grade.
// Expects: { studentId, courseId, assignmentName, points }
async function updateAssignmentGrade({ studentId, courseId, assignmentName, points }) {
  const conn = await getConnection();

  // 1) Look up assignmentId by (courseId, assignmentName)
  const [assignRows] = await conn.execute(
    `SELECT assignmentId
       FROM assignments
      WHERE courseId = ? AND assignmentName = ?`,
    [courseId, assignmentName]
  );

  if (assignRows.length === 0) {
    await conn.end();
    throw new Error(`No assignment '${assignmentName}' found for course ${courseId}`);
  }
  const assignmentId = assignRows[0].assignmentId;

  // 2) Perform the update
  await conn.execute(
    `UPDATE assignmentgrades
        SET assignmentPoints = ?
      WHERE studentId    = ?
        AND assignmentId = ?
        AND courseId     = ?`,
    // note: pass JS null if you really intend SQL NULL
    [points, studentId, assignmentId, courseId]
  );

  await conn.end();
}

// Delete by composite key
async function deleteAssignmentGrade({ studentId, assignmentId, courseId }) {
  const conn = await getConnection();
  await conn.execute(
    `DELETE FROM assignmentgrades
      WHERE studentId    = ?
        AND assignmentId = ?
        AND courseId     = ?`,
    [studentId, assignmentId, courseId]
  );
  await conn.end();
}

async function addGradesForAssignment(assignmentId, courseId) {
  const conn = await getConnection();
  await conn.execute(
    `INSERT INTO assignmentgrades
       (assignmentPoints, studentId, assignmentId, courseId)
     SELECT NULL, studentId, ?, ?
       FROM enrollments
      WHERE courseId = ?`,
    [assignmentId, courseId, courseId]
  );
  await conn.end();
}

module.exports = {
  getAllAssignmentGrades,
  getAssignmentGradesByCourseId,
  addGradesForAssignment,
  updateAssignmentGrade,
  deleteAssignmentGrade,
  addGradesForAssignment
};