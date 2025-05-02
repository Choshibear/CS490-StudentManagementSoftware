const getConnection = require('../db');

async function getAllAssignments() {
  const conn = await getConnection();
  const [rows] = await conn.query('SELECT * FROM assignments');
  conn.end();
  return rows;
}

async function getAssignmentById(id) {
  const conn = await getConnection();
  const [rows] = await conn.query(
    'SELECT * FROM assignments WHERE assignmentId = ?', [id]
  );
  conn.end();
  return rows[0];
}

async function addAssignment(a) {
  const {
    assignmentTypeID,
    assignmentName,
    description,
    dueDate,
    possiblePoints,
    weight,
    courseId
  } = a;
  const conn = await getConnection();
  const [result] = await conn.execute(
    `INSERT INTO assignments
       (assignmentTypeID, assignmentName, description, dueDate, possiblePoints, weight, courseId)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [assignmentTypeID, assignmentName, description, dueDate, possiblePoints, weight, courseId]
  );
  conn.end();
  return result.insertId;
}

async function updateAssignment(id, a) {
  const {
    assignmentTypeID,
    assignmentName,
    description,
    dueDate,
    possiblePoints,
    weight,
    courseId
  } = a;
  const conn = await getConnection();
  await conn.execute(
    `UPDATE assignments SET
       assignmentTypeID = ?,
       assignmentName   = ?,
       description      = ?,
       dueDate          = ?,
       possiblePoints   = ?,
       weight           = ?,
       courseId         = ?
     WHERE assignmentId = ?`,
    [assignmentTypeID, assignmentName, description, dueDate, possiblePoints, weight, courseId, id]
  );
  conn.end();
}

async function deleteAssignment(id) {
  const conn = await getConnection();
  await conn.execute(
    'DELETE FROM assignments WHERE assignmentId = ?', [id]
  );
  conn.end();
}

// NEW: delete all grades for a given assignment
async function deleteByAssignmentId(assignmentId) {
  const conn = await getConnection();
  await conn.execute(
    'DELETE FROM assignmentgrades WHERE assignmentId = ?',
    [assignmentId]
  );
  await conn.end();
}

module.exports = {
  getAllAssignments,
  getAssignmentById,
  addAssignment,
  updateAssignment,
  deleteAssignment,
  deleteByAssignmentId
};
