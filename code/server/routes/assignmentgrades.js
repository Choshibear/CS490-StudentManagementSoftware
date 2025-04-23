const express = require('express');
const router = express.Router();
const {
    getAllAssignmentGrades,
    getAssignmentGradeById,
    getAssignmentGradesByCourseId,
    addAssignmentGrade,
    updateAssignmentGrade,
    deleteAssignmentGrade
} = require('../db/assignmentgradesQueries');

router.use(express.json());



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


//Get assignmentGrades by courseId
router.get('/course/:courseId', async (req, res) => {
    try {
        const assignmentGradesByCourse = await getAssignmentGradesByCourseId(req.params.courseId);
        res.json(assignmentGradesByCourse);
    } catch (err) {
        console.error('Error fetching grades by course:', err);
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
router.put('/update', async (req, res) => {
    try {
        await updateAssignmentGrade(req.body);
        res.json({ message: 'AssignmentGrade updated' });
    } catch (err) {
        console.error("Grade update error:", err);
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