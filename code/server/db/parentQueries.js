const getConnection = require('../db');

// Get all parents
async function getAllParents() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM parents');
    await connection.end();
    return rows;
}

// Get one parent by ID
//input: parentId
async function getParentById(id) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM parents WHERE parentId = ?', [id]);
    await connection.end();
    return rows[0];
}

// Get parents by student ID
//input: studentId
async function getParentsByStudentId(studentId) {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT p.* 
      FROM parents p
      JOIN parent_student ps ON p.parentId = ps.parentId
      WHERE ps.studentId = ?
    `, [studentId]);
    await connection.end();
    return rows;
}

//get  parent by username
async function getParentByUsername(username) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM parents WHERE username = ?', [username]);
    await connection.end();
    return rows[0];
}

//get children by parent ID
async function getChildrenByParentId(parentId) {
    const connection = await getConnection();
    const [rows] = await connection.query(`
      SELECT s.* 
      FROM students s
      JOIN parent_student ps ON s.studentId = ps.studentId
      WHERE ps.parentId = ?
    `, [parentId]);
    await connection.end();
    return rows;
  }

//add new parent
//input: [firstName, lastName, email, address, city, state, zip, phoneNumber, username, password]
async function addParent(parent) {
    const connection = await getConnection();
    const { firstName, lastName, email, address, city, state, zip, phoneNumber, username, password } = parent;
    const [result] = await connection.query(
        'INSERT INTO parents (firstName, lastName, email, address, city, state, zip, phoneNumber, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, address, city, state, zip, phoneNumber, username, password]
    );
    await connection.end();
    return result.insertId;
}

//update parent by ID
//input: id, [firstName, lastName, email, address, city, state, zip, phoneNumberd]
async function updateParent(id, updatedFields) {
    const connection = await getConnection();
    const { firstName, lastName, email, address, city, state, zip, phoneNumber } = updatedFields;
    await connection.query(
        'UPDATE parents SET firstName = ?, lastName = ?, email = ?, address = ?, city = ?, state = ?, zip = ?, phoneNumber = ? WHERE parentId = ?',
        [firstName, lastName, email, address, city, state, zip, phoneNumber, id]
    );
    await connection.end();
}

//delete parent by ID
//input: id
async function deleteParent(id) {
    const connection = await getConnection();
    await connection.query('DELETE FROM parents WHERE parentId = ?', [id]);
    await connection.end();
}

module.exports = { 
    getAllParents, 
    getParentById, 
    getParentsByStudentId, 
    getParentByUsername, 
    getChildrenByParentId, 
    addParent, 
    updateParent, 
    deleteParent
};