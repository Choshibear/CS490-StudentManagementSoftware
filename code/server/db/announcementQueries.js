const getConnection = require('../db');

// Get announcements for one or more grade levels
async function getAnnouncements(gradeLevels = []) {
  const connection = await getConnection();
  let rows;

  if (Array.isArray(gradeLevels) && gradeLevels.length > 0) {
    const placeholders = gradeLevels.map(() => '?').join(', ');
    [rows] = await connection.query(
      `SELECT * FROM announcements
       WHERE gradeLevelId IN (${placeholders}) OR gradeLevelId IS NULL
       ORDER BY date DESC`,
      gradeLevels
    );
  } else {
    [rows] = await connection.query(
      'SELECT * FROM announcements ORDER BY date DESC'
    );
  }

  await connection.end();
  return rows;
}

// Create new announcement
async function createAnnouncement({ title, content, author, date, gradeLevelId }) {
  const connection = await getConnection();
  await connection.query(
    'INSERT INTO announcements (title, content, author, date, gradeLevelId) VALUES (?, ?, ?, ?, ?)',
    [title, content, author, date, gradeLevelId || null]
  );
  await connection.end();
}

// 🗑️ Delete announcement by ID
async function deleteAnnouncement(id) {
  const connection = await getConnection();
  await connection.query('DELETE FROM announcements WHERE id = ?', [id]);
  await connection.end();
}

module.exports = {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement // <-- 👈 don't forget to export it!
};
