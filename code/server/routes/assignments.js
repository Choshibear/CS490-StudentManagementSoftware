const express = require('express');
const router  = express.Router();
const {
  getAllAssignments,
  getAssignmentById,
  addAssignment,
  updateAssignment,
  deleteAssignment,
  deleteByAssignmentId
} = require('../db/assignmentQueries');

const { addGradesForAssignment } = require('../db/assignmentgradesQueries');

// GET /api/assignments
router.get('/', async (req, res) => {
  try {
    res.json(await getAllAssignments());
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    // 1) Create the assignment
    const id = await addAssignment(req.body);

    // 2) Fetch the new row to get its courseId
    const newRow = await getAssignmentById(id);

    // 3) Seed assignmentgrades for every enrolled student
    await addGradesForAssignment(id, newRow.courseId);

    // 4) Return the created assignment
    res.status(201).json(newRow);
  } catch (err) {
    console.error('Create assignment error:', err);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

/*

// POST /api/assignments
router.post('/', async (req, res) => {
  try {
    const id = await addAssignment(req.body);
    const newRow = await getAssignmentById(id);
    res.status(201).json(newRow);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});
*/

// PUT /api/assignments/:id
router.put('/:id', async (req, res) => {
  try {
    await updateAssignment(req.params.id, req.body);
    const updated = await getAssignmentById(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});


/*
// DELETE /api/assignments/:id
router.delete('/:id', async (req, res) => {
  try {
    await deleteAssignment(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});
*/

// DELETE /api/assignments/:id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    // 1) remove any grades pointing to this assignment
    await deleteByAssignmentId(id);
    // 2) now delete the assignment itself
    await deleteAssignment(id);
    res.json({ message: 'Assignment and its grades deleted.' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

module.exports = router;
