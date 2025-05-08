const express = require('express');
const router  = express.Router();
const {
  bulkCreateAttendance,
  getAttendancesByCourseAndDate,
  updateAttendance,
  getAllAttendances,
  getAttendanceById,
  deleteAttendance,
  getAllAttendancesForStudent,
  getAllAttendancesForParent
} = require('../db/attendanceQueries');

router.use(express.json());

// 1) Bulk‐create on Save in Take mode
router.post('/:courseId/:date', async (req, res) => {
  try {
    await bulkCreateAttendance(req.params.courseId, req.params.date);
    res.json({ message: 'Attendance rows ready' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create attendance rows' });
  }
});

// 2) Fetch attendance+student info
router.get('/', async (req, res) => {
  const { courseId, date } = req.query;
  if (courseId && date) {
    try {
      const rows = await getAttendancesByCourseAndDate(courseId, date);
      return res.json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to load attendance' });
    }
  }
  // fallback: all
  const all = await getAllAttendances();
  res.json(all);
});

// 3) Update one
router.put('/:id', async (req, res) => {
  try {
    await updateAttendance({ id: req.params.id, ...req.body });
    res.json({ message: 'Attendance updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const a = await getAttendanceById(req.params.id);
    if (!a) return res.status(404).json({ error: 'Not found' });
    res.json(a);
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await deleteAttendance(req.params.id);
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/attendance/student /: studentId
router.get('/student/:studentId', async (req, res) => {
  try {
    const rows = await getAllAttendancesForStudent(req.params.studentId);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
});

// GET /api/attendance/parent/:parentId
router.get('/parent/:parentId', async (req, res) => {
  try {
    const rows = await getAllAttendancesForParent(req.params.parentId);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
});

module.exports = router;
