const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent,
  findStudentByUsername
} = require('../db/studentQueries');

//Get all students from the database
router.get('/', async (req, res) => {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Get one student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await getStudentById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Create a new student
router.post('/', async (req, res) => {
  try {
    const newStudent = await addStudent(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Update an existing student
router.put('/:id', async (req, res) => {
  try {
    await updateStudent(req.params.id, req.body);
    res.json({ message: 'Student updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

//Delete an existing student
router.delete('/:id', async (req, res) => {
  try {
    await deleteStudent(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

module.exports = router;