const getConnection = require('../db');

// Get all assignments
async function getAllAssignments() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM assignments');
    await connection.end();
    return rows;
}

// Get assignment by ID
//input: id
async function getAssignmentById(id) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM assignments WHERE assignmentId = ?', [id]);
    await connection.end();
    return rows[0];
}

// Add new assignment
//input: [assignmentTypeID, assignmentName, description, dueDate, possiblePoints, weight, courseId]
async function addAssignment(assignment) {
    const connection = await getConnection();
    const { assignmentTypeID, assignmentName, description, dueDate, possiblePoints, weight, courseId } = assignment;
    const [result] = await connection.query(
        'INSERT INTO assignments (assignmentTypeID, assignmentName, description, dueDate, possiblePoints, weight, courseId) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [assignmentTypeID, assignmentName, description, dueDate, possiblePoints, weight, courseId]
    );
    await connection.end();
    return result.insertId;
}

// Update assignment
//input: id, [assignmentTypeID, assignmentName, description, dueDate, possiblePoints, weight, courseId]
async function updateAssignment(id, updatedFields) {
    const connection = await getConnection();
    const { assignmentTypeID, assignmentName, description, dueDate, possiblePoints, weight, courseId } = updatedFields;
    await connection.query(
        'UPDATE assignments SET assignmentTypeID = ?, assignmentName = ?, description = ?, dueDate = ?, possiblePoints = ?, weight = ?, courseId = ? WHERE assignmentId = ?',
        [assignmentTypeID, assignmentName, description, dueDate, possiblePoints, weight, courseId, id]
    );
    await connection.end();
}

// Delete assignment
//input: id
async function deleteAssignment(id) {
    const connection = await getConnection();
    await connection.query('DELETE FROM assignments WHERE assignmentId = ?', [id]);
    await connection.end();
}

module.exports = { getAllAssignments, getAssignmentById, addAssignment, updateAssignment, deleteAssignment };