const express = require('express');
const router = express.Router();

const {
  getAllAssignments,
  getAssignmentById,
  addAssignment,
  updateAssignment,
  deleteAssignment
} = require('../db/assignmentQueries');


//Get all assignments from the database
router.get('/', async (req, res) => {
  try {
    const assignments = await getAllAssignments();
    res.json(assignments);
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Get one assignment by ID
router.get('/:id', async (req, res) => {
  try {
    const assignment = await getAssignmentById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Create a new assignment
router.post('/', async (req, res) => {
  try {
    const id = await addAssignment(req.body);
    const assignment = await getAssignmentById(id); // <-- fetch the full new record
    res.status(201).json({ message: 'Assignment created', id });
  } catch (err) {
    console.error('Error adding assignment:', err);
    res.status(500).json({ error: 'Failed to add assignment' });
  }
});

//Update an existing assignment
router.put('/:id', async (req, res) => {
  try {
    await updateAssignment(req.params.id, req.body);
    const updatedAssignment = await getAssignmentById(req.params.id); // Fetch updated row
    res.json(updatedAssignment); // Return updated row
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

//Delete an existing assignment
router.delete('/:id', async (req, res) => {
  try {
    await deleteAssignment(req.params.id);
    res.json({ message: 'Assignment deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});
module.exports = router;
