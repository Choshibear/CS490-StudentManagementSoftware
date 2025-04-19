const express = require('express');
const router = express.Router();
const {
  getAllTeachers,
  getTeacherById,
  addTeacher,
  updateTeacher,
  deleteTeacher
} = require('../db/teacherQueries');
//Get all teachers from the database
router.get('/', async (req, res) => {
  try {
    const teachers = await getAllTeachers();
    res.json(teachers);
  } catch (err) {
    console.error('Error fetching teachers:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Get one teacher by ID
router.get('/:id', async (req, res) => {
  try {
    const teacher = await getTeacherById(req.params.id);
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    console.error('Error fetching teacher:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Add a new teacher
router.post('/', async (req, res) => {
  try {
    const teacher = await addTeacher(req.body);
    res.status(201).json(teacher);
  } catch (err) {
    console.error('Error adding teacher:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Update an existing teacher
router.put('/:id', async (req, res) => {
  try {
    await updateTeacher(req.params.id, req.body);
    res.json({ message: 'Teacher updated' });
  } catch (err) {
    console.error('Error updating teacher:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Delete a teacher
router.delete('/:id', async (req, res) => {
  try {
    await deleteTeacher(req.params.id);
    res.json({ message: 'Teacher deleted' });
  } catch (err) {
    console.error('Error deleting teacher:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
