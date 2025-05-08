// server/routes/coursegrades.js
const express = require('express');
const router  = express.Router();

const {
  getAllCourseGrades,
  getCourseGradeById,
  addCourseGrade,
  updateCourseGrade,
  deleteCourseGrade,
  upsertCourseFeedback
} = require('../db/coursegradeQueries');

router.use(express.json());

// GET /api/coursegrades
router.get('/', async (req, res) => {
  try {
    const all = await getAllCourseGrades();
    res.json(all);
  } catch (err) {
    console.error('Error fetching coursegrades:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/coursegrades/:id
router.get('/:id', async (req, res) => {
  try {
    const cg = await getCourseGradeById(req.params.id);
    if (!cg) return res.status(404).json({ error: 'CourseGrade not found' });
    res.json(cg);
  } catch (err) {
    console.error('Error fetching coursegrade:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/coursegrades/feedback
// Upsert just the feedback field for a student+course
router.put('/feedback', async (req, res) => {
  try {
    console.log('PUT /feedback payload:', req.body);
    await upsertCourseFeedback(req.body);
    res.json({ message: 'Course feedback saved' });
  } catch (err) {
    console.error('Error saving course feedback:', err);
    res.status(500).json({ error: 'Failed to save course feedback' });
  }
});

// PUT /api/coursegrades/:id
// Update the full record by primary key
router.put('/:id', async (req, res) => {
  try {
    await updateCourseGrade(req.params.id, req.body);
    res.json({ message: 'CourseGrade updated' });
  } catch (err) {
    console.error('Error updating coursegrade:', err);
    res.status(500).json({ error: 'Failed to update coursegrade' });
  }
});

// POST /api/coursegrades
router.post('/', async (req, res) => {
  try {
    const newId = await addCourseGrade(req.body);
    res.status(201).json({ courseGradeId: newId });
  } catch (err) {
    console.error('Error adding coursegrade:', err);
    res.status(500).json({ error: 'Failed to add coursegrade' });
  }
});

// DELETE /api/coursegrades/:id
router.delete('/:id', async (req, res) => {
  try {
    await deleteCourseGrade(req.params.id);
    res.json({ message: 'CourseGrade deleted' });
  } catch (err) {
    console.error('Error deleting coursegrade:', err);
    res.status(500).json({ error: 'Failed to delete coursegrade' });
  }
});

module.exports = router;
