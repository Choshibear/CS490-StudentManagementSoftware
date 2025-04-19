const express = require('express');
const router = express.Router();

const {
    getAllEnrollments,
    getEnrollmentById,
    addEnrollment,
    updateEnrollment,
    deleteEnrollment
} = require('../db/enrollmentQueries');

//Get all enrollments from the database
router.get('/', async (req, res) => {
    try {
        const enrollments = await getAllEnrollments();
        res.json(enrollments);
    } catch (err) {
        console.error('Error fetching enrollments:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Get one enrollment by ID
router.get('/:id', async (req, res) => {
    try {
        const enrollment = await getEnrollmentById(req.params.id);
        if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
        res.json(enrollment);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Create a new enrollment
router.post('/', async (req, res) => {
    try {
        const newEnrollment = await addEnrollment(req.body);
        res.status(201).json(newEnrollment);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Update an existing enrollment
router.put('/:id', async (req, res) => {
    try {
        await updateEnrollment(req.params.id, req.body);
        res.json({ message: 'Enrollment updated' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Delete an existing enrollment
router.delete('/:id', async (req, res) => {
    try {
        await deleteEnrollment(req.params.id);
        res.json({ message: 'Enrollment deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;