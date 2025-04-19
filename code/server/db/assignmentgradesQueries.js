const getConnection = require('../db');

//Get all assignmentgrades from the database
async function getAllAssignmentGrades() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM assignmentgrades');
    await connection.end();
    return rows;
}

//Get one assignmentgrade by ID
//input: id
async function getAssignmentGradeById(id) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM assignmentgrades WHERE assignmentgradeid = ?', [id]);
    await connection.end();
    return rows[0];
}

//Add new assignmentgrade
//input: [assignmentgradeid, assignmentid, studentid, assignmentgrade]
async function addAssignmentGrade(assignmentgrade) {
    const connection = await getConnection();
    const {assignmentgradeid, assignmentid, studentid, grade } = assignmentgrade;
    const [result] = await connection.query(
        'INSERT INTO assignmentgrades (assignmentgradeid, assignmentid, studentid, assignmentgrade) VALUES (?, ?, ?, ?)',
        [assignmentgradeid, assignmentid, studentid, grade]
    );
    await connection.end();
    return result.insertId;
}

//Update assignmentgrade by ID
//input: id, [assignmentgradeid, assignmentid, studentid, assignmentgrade]
async function updateAssignmentGrade(id, updatedFields) {
    const connection = await getConnection();
    const { assignmentgradeid, assignmentid, studentid, assignmentgrade } = updatedFields;
    await connection.query(
        'UPDATE assignmentgrades SET assignmentgradeid = ?, assignmentid = ?, studentid = ?, assignmentgrade = ? WHERE assignmentgradeid = ?',
        [assignmentgradeid, assignmentid, studentid, assignmentgrade, id]
    );
    await connection.end();
}

//Delete assignmentgrade by ID
//input: id
async function deleteAssignmentGrade(id) {
    const connection = await getConnection();
    await connection.query('DELETE FROM assignmentgrades WHERE assignmentgradeid = ?', [id]);
    await connection.end();
}

module.exports = {
    getAllAssignmentGrades,
    getAssignmentGradeById,
    addAssignmentGrade,
    updateAssignmentGrade,
    deleteAssignmentGrade
};

