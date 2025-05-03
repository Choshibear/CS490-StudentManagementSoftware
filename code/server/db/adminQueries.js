//FIX QUERIES

const getConnection = require('../db');

//Get all admins from the database
const getAllAdmins = async () => {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM admins');
    return rows;
};

//get one admin by ID
const getAdminById = async (id) => {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM admins WHERE adminId = ?', [id]);
    return rows[0];
};

//get one admin by username
const getAdminByUsername = async (username) => {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM admins WHERE username = ?', [username]);
    return rows[0];
};

//add new admin
const addAdmin = async (admin) => {
    const connection = await getConnection();
    const [rows] = await connection.query(
      'INSERT INTO admins (firstName, lastName, email, username, password) VALUES (?, ?, ?, ?, ?)',
      [admin.firstName, admin.lastName, admin.email, admin.username, admin.password]
    );
    return rows;
  };
//update one admin by ID
const updateAdminById = async (id, admin) => {
    const connection = await getConnection();
    const [rows] = await connection.query('UPDATE admins SET firstName = ?, lastName = ?, email = ?, username = ?, password = ? WHERE adminId = ?', [admin.firstName, admin.lastName, admin.email, admin.username, admin.password, id]);
    return rows;
};

//delete one admin by ID
const deleteAdminById = async (id) => {
    const connection = await getConnection();
    const [rows] = await connection.query('DELETE FROM admins WHERE adminId = ?', [id]);
    return rows;
};

module.exports = {
    getAllAdmins,
    getAdminById,
    getAdminByUsername,
    addAdmin,
    updateAdminById,
    deleteAdminById
};