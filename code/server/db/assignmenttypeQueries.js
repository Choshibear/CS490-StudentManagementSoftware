const getConnection = require('../db');

// Get all assignment types
async function getAllAssignmentTypes() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM assignmenttypes');
    await connection.end();
    return rows;
}

// Get one assignment type by ID
//input: id
async function getAssignmentTypeById(id) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM assignmenttypes WHERE typeId = ?', [id]);
    await connection.end();
    return rows[0];
}

// Add new assignment type
//input: [typeName]
async function addAssignmentType(assignmentType) {
    const connection = await getConnection();
    const { typeName } = assignmentType;
    const [result] = await connection.query(
        'INSERT INTO assignmenttypes (typeName) VALUES (?)',
        [typeName]
    );
    await connection.end();
    return result.insertId;
}

// Update assignment type by ID
//input: id, [typeName]
async function updateAssignmentType(id, updatedFields) {
    const connection = await getConnection();
    const { typeName } = updatedFields;
    await connection.query(
        'UPDATE assignmenttypes SET typeName = ? WHERE typeId = ?',
        [typeName, id]
    );
    await connection.end();
}

// Delete assignment type by ID
//input: id
async function deleteAssignmentType(id) {
    const connection = await getConnection();
    await connection.query('DELETE FROM assignmenttypes WHERE typeId = ?', [id]);
    await connection.end();
}

module.exports = {
    getAllAssignmentTypes,
    getAssignmentTypeById,
    addAssignmentType,
    updateAssignmentType,
    deleteAssignmentType
};