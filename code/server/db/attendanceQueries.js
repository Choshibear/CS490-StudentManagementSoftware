const getConnection = require('../db');

/** Bulk‐create (or skip) for all enrolled students */
async function bulkCreateAttendance(courseId, attendanceDate) {
  const conn = await getConnection();
  const [enrolls] = await conn.query(
    'SELECT studentId FROM enrollments WHERE courseId = ?', [courseId]
  );
  if (enrolls.length) {
    const values = enrolls.map(e => [
      e.studentId,
      courseId,
      attendanceDate,
      'Present',
      null
    ]);
    await conn.query(
      `INSERT INTO attendance
         (studentId, courseId, attendanceDate, status, remarks)
       VALUES ?
       ON DUPLICATE KEY UPDATE
         attendanceDate = VALUES(attendanceDate)`,
      [values]
    );
  }
  await conn.end();
}

/** Fetch attendance+student info for a course & date */
async function getAttendancesByCourseAndDate(courseId, attendanceDate) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    `SELECT
       a.attendanceId,
       a.studentId,
       a.status,
       a.remarks,
       s.firstName,
       s.lastName
     FROM attendance a
     JOIN students s ON a.studentId = s.studentId
     WHERE a.courseId = ? AND a.attendanceDate = ?`,
    [courseId, attendanceDate]
  );
  await conn.end();
  return rows;
}

/** Update one attendance row */
async function updateAttendance({ id, status, remarks }) {
  const conn = await getConnection();
  await conn.query(
    'UPDATE attendance SET status = ?, remarks = ? WHERE attendanceId = ?',
    [status, remarks, id]
  );
  await conn.end();
}

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


//delete an existing attendance from the database
//input: id
async function deleteAttendance(id) {
  const connection = await getConnection();
  await connection.query('DELETE FROM attendance WHERE id = ?', [id]);
  await connection.end();
}
  
  // Get all attendances for a given student
async function getAllAttendancesForStudent(studentId) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    `SELECT a.*, c.courseName
     FROM attendance a
     JOIN courses c ON c.courseId = a.courseId
     WHERE a.studentId = ?`,
    [studentId]
  );
  await conn.end();
  return rows;
}

// Get attendances for all students linked to a parent
async function getAllAttendancesForParent(parentId) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    `SELECT a.*, c.courseName, ps.studentId
     FROM attendance a
     JOIN courses c       ON c.courseId  = a.courseId
     JOIN parent_student ps ON ps.studentId = a.studentId
     WHERE ps.parentId = ?`,
    [parentId]
  );
  await conn.end();
  return rows;
  }
  

module.exports = {
  bulkCreateAttendance,
  getAttendancesByCourseAndDate,
  updateAttendance,
  getAllAttendances,
  getAttendanceById,
  deleteAttendance,
  getAllAttendancesForStudent,
  getAllAttendancesForParent
  };
  