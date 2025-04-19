const express = require('express');
const router = express.Router();
const {
    getAllAssignmentGrades,
    getAssignmentGradeById,
    addAssignmentGrade,
    updateAssignmentGrade,
    deleteAssignmentGrade
} = require('../db/assignmentgradesQueries');

//Get all assignmentGrades from the database
router.get('/', async (req, res) => {
    try {
        const assignmentGrades = await getAllAssignmentGrades();
        res.json(assignmentGrades);
    } catch (err) {
        console.error('Error fetching assignmentGrades:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Get one assignmentGrade by ID
router.get('/:id', async (req, res) => {
    try {
        const assignmentGrade = await getAssignmentGradeById(req.params.id);    
        if (!assignmentGrade) return res.status(404).json({ error: 'AssignmentGrade not found' });
        res.json(assignmentGrade);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Add a new assignmentGrade
router.post('/', async (req, res) => {
    try {
        await addAssignmentGrade(req.body);
        res.json({ message: 'AssignmentGrade added' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add AssignmentGrade' });
    }
});

//Update an existing assignmentGrade
router.put('/:id', async (req, res) => {
    try {
        await updateAssignmentGrade(req.params.id, req.body);
        res.json({ message: 'AssignmentGrade updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update AssignmentGrade' });
    }
});

//Delete an existing assignmentGrade
router.delete('/:id', async (req, res) => {
    try {
        await deleteAssignmentGrade(req.params.id);
        res.json({ message: 'AssignmentGrade deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete AssignmentGrade' });
    }
});

module.exports = router;