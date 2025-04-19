const express = require('express');
const router = express.Router();
const {
    getAllCourseGrades,
    getCourseGradeById,
    addCourseGrade,
    updateCourseGrade,
    deleteCourseGrade
} = require('../db/coursegradeQueries');

//Get all coursegrades from the database
router.get('/', async (req, res) => {
    try {
        const courseGrades = await getAllCourseGrades();
        res.json(courseGrades);
    } catch (err) {
        console.error('Error fetching coursegrades:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Get one coursegrade by ID
router.get('/:id', async (req, res) => {
    try {
        const courseGrade = await getCourseGradeById(req.params.id);
        if (!courseGrade) return res.status(404).json({ error: 'CourseGrade not found' });
        res.json(courseGrade);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Add a new coursegrade
router.post('/', async (req, res) => {
    try {
        const courseGrade = await addCourseGrade(req.body); 
        res.status(201).json(courseGrade);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add coursegrade' });
    }
});

//Update an existing coursegrade
router.put('/:id', async (req, res) => {
    try {
        await updateCourseGrade(req.params.id, req.body);
        res.json({ message: 'CourseGrade updated' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update coursegrade' });
    }
});

//Delete an existing coursegrade
router.delete('/:id', async (req, res) => {
    try {
        await deleteCourseGrade(req.params.id);
        res.json({ message: 'CourseGrade deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete coursegrade' });
    }
});

module.exports = router;