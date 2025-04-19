const getConnection = require('../db');

// Get all gradelevels
async function getAllGradeLevels() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM gradelevels');
    await connection.end();
    return rows;
}

// Get one gradelevel by ID
//input: id
async function getGradeLevelById(id) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM gradelevels WHERE gradeLevelId = ?', [id]);
    await connection.end();
    return rows[0];
}

// Add a new gradelevel
//input: gradeLevel
async function addGradeLevel(gradeLevel) {
    const connection = await getConnection();
    const { gradeLevel: level } = gradeLevel;
    const [result] = await connection.query(
        'INSERT INTO gradelevels (gradeLevel) VALUES (?)',
        [level]
    );
    await connection.end();
    return result.insertId;
}

// Update gradelevel by ID
//input: id, [gradeLevel]
async function updateGradeLevel(id, updatedFields) {
    const connection = await getConnection();
    const { gradeLevel } = updatedFields;
    await connection.query(
        'UPDATE gradelevels SET gradeLevel = ? WHERE gradeLevelId = ?',
        [gradeLevel, id]
    );
    await connection.end();
}

// Delete gradelevel by ID
//input: id
async function deleteGradeLevel(id) {
    const connection = await getConnection();
    await connection.query('DELETE FROM gradelevels WHERE gradeLevelId = ?', [id]);
    await connection.end();
}

module.exports = {
    getAllGradeLevels,
    getGradeLevelById,
    addGradeLevel,
    updateGradeLevel,
    deleteGradeLevel
};