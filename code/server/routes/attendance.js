const express = require('express');
const router = express.Router();

const {
    getAllAttendances,
    getAttendanceById,
    getAllAttendancesForStudent,
    getAllAttendancesForDate,
    addAttendance,
    updateAttendance,
    deleteAttendance
} = require('../db/attendanceQueries');

//Get all attendances from the database
router.get('/', async (req, res) => {
    try {
        const attendances = await getAllAttendances();
        res.json(attendances);
    } catch (err) {
        console.error('Error fetching attendances:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Get one attendance by ID
router.get('/:id', async (req, res) => {
    try {
        const attendance = await getAttendanceById(req.params.id);
        if (!attendance) return res.status(404).json({ error: 'Attendance not found' });
        res.json(attendance);
    } catch (err) {
        console.error('Error fetching attendance:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Get all attendances for a specific student
router.get('/student/:studentId', async (req, res) => {
    try {
        const attendances = await getAllAttendancesForStudent(req.params.studentId);
        res.json(attendances);
    } catch (err) {
        console.error('Error fetching attendances for student:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//get all attendances for a specific date
router.get('/date/:date', async (req, res) => {
    try {
        const attendances = await getAllAttendancesForDate(req.params.date);
        res.json(attendances);
    } catch (err) {
        console.error('Error fetching attendances for date:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Add a new attendance
router.post('/', async (req, res) => {
    try {
        await addAttendance(req.body);
        res.json({ message: 'Attendance added' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add Attendance' });
    }
});

//Update an existing attendance
router.put('/:id', async (req, res) => {
    try {
        await updateAttendance(req.params.id, req.body);
        res.json({ message: 'Attendance updated' });
    } catch (err) {
        console.error('Error updating attendance:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Delete an attendance
router.delete('/:id', async (req, res) => {
    try {
        await deleteAttendance(req.params.id);
        res.json({ message: 'Attendance deleted' });
    } catch (err) {
        console.error('Error deleting attendance:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;