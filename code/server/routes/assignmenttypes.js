const express = require('express');
const router = express.Router();
const {
    getAllAssignmentTypes,
    getAssignmentTypeById,
    addAssignmentType,
    updateAssignmentType,
    deleteAssignmentType
} = require('../db/assignmenttypeQueries');

//Get all AssignmentTypes from the database
router.get('/', async (req, res) => {
    try {
        const assignmentTypes = await getAllAssignmentTypes();
        res.json(assignmentTypes);
    } catch (err) {
        console.error('Error fetching assignmentTypes:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Get one AssignmentType by ID
router.get('/:id', async (req, res) => {
    try {
        const assignmentType = await getAssignmentTypeById(req.params.id);
        if (!assignmentType) return res.status(404).json({ error: 'AssignmentType not found' });
        res.json(assignmentType);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Add a new AssignmentType
router.post('/', async (req, res) => {
    try {
        await addAssignmentType(req.body);
        res.json({ message: 'AssignmentType added' });
    } catch (err) { 
        res.status(500).json({ error: 'Failed to add AssignmentType' });
    }
});

//Update an existing AssignmentType
router.put('/:id', async (req, res) => {
    try {
        await updateAssignmentType(req.params.id, req.body);
        res.json({ message: 'AssignmentType updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update AssignmentType' });
    }
});

//Delete an existing AssignmentType
router.delete('/:id', async (req, res) => {
    try {
        await deleteAssignmentType(req.params.id);
        res.json({ message: 'AssignmentType deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete AssignmentType' });
    }
});

module.exports = router;