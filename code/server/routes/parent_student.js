module.exports = router;const express = require('express');
const router = express.Router();

const {
  linkParentStudent,
  unlinkParentStudent,
  getAllParentStudents
} = require('../db/parentstudentQueries');

//get all parent_student relationships
router.get('/', async (req, res) => {
  try {
    const parentStudents = await getAllParentStudents();
    res.json(parentStudents);
  } catch (err) {
    console.error('Error fetching parent-student relationships:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Link parent and student
router.post('/:parentId/students/:studentId', async (req, res) => {
  try {
    await linkParentStudent(req.params.parentId, req.params.studentId);
    res.json({ message: 'Relationship created' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create relationship' });
  }
});

// Unlink parent and student
router.delete('/:parentId/students/:studentId', async (req, res) => {
  try {
    await unlinkParentStudent(req.params.parentId, req.params.studentId);
    res.json({ message: 'Relationship removed' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove relationship' });
  }
});

module.exports = router;