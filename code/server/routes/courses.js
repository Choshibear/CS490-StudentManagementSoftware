const express = require('express');
const router = express.Router();

const { 
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourse,
  deleteCourse

 } = require('../db/courseQueries');

//Get all courses from the database
router.get('/', async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Get one course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Add a new course
router.post('/', async (req, res) => {
  try {
    const course = await addCourse(req.body);
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add course' });
  }
});

//Update an existing course
router.put('/:id', async (req, res) => {
  try {
    await updateCourse(req.params.id, req.body);
    res.json({ message: 'Course updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

//Delete an existing course
router.delete('/:id', async (req, res) => {
  try {
    await deleteCourse(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

module.exports = router;