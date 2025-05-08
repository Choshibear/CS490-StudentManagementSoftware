const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} = require('../db/announcementQueries');
const getConnection = require('../db');

// GET /api/announcements
router.get('/', async (req, res) => {
  const { gradeLevelId, role, userId } = req.query;

  try {
    if (role === 'parent') {
      const connection = await getConnection();
      const [rows] = await connection.query(`
        SELECT DISTINCT s.gradeLevelId
        FROM students s
        JOIN parent_student ps ON s.studentId = ps.studentId
        WHERE ps.parentId = ?
      `, [userId]);
      const gradeLevels = rows.map(r => r.gradeLevelId);
      await connection.end();

      const announcements = await getAnnouncements(gradeLevels);
      return res.json(announcements);
    }

    // For all other roles (student, teacher, admin)
    const announcements = await getAnnouncements(
      gradeLevelId ? [parseInt(gradeLevelId)] : []
    );
    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// POST /api/announcements
router.post('/', async (req, res) => {
  const { title, content, author, date, gradeLevelId } = req.body;
  try {
    await createAnnouncement({ title, content, author, date, gradeLevelId });
    res.status(201).json({ message: 'Announcement created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// DELETE /api/announcements/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await deleteAnnouncement(id); // ✅ using the helper now
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

module.exports = router;
