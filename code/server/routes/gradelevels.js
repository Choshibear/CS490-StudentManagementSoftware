const express = require('express');
const router = express.Router();
const {
  getAllGradeLevels,
  getGradeLevelById,
  addGradeLevel,
  updateGradeLevel,
  deleteGradeLevel
} = require('../db/gradelevelQueries');

//Get all grade levels from the database
router.get('/', async (req, res) => {
  try {
    const gradeLevels = await getAllGradeLevels();
    res.json(gradeLevels);
  } catch (err) {
    console.error('Error fetching grade levels:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Get one grade level by ID
router.get('/:id', async (req, res) => {
  try {
    const gradeLevel = await getGradeLevelById(req.params.id);
    if (!gradeLevel) return res.status(404).json({ error: 'Grade level not found' });
    res.json(gradeLevel);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Add a new grade level to the database
router.post('/', async (req, res) => {
  try {
    const newGradeLevel = await addGradeLevel(req.body);
    res.status(201).json(newGradeLevel);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Update an existing grade level in the database
router.put('/:id', async (req, res) => {
  try {
    await updateGradeLevel(req.params.id, req.body);
    res.json({ message: 'Grade level updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update grade level' });
  }
});

//Delete an existing grade level
router.delete('/:id', async (req, res) => {
  try {
    await deleteGradeLevel(req.params.id);
    res.json({ message: 'Grade level deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete grade level' });
  }
})

module.exports = router;