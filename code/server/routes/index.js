const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/admins', require('./admins'));
router.use('/parents', require('./parents'));
router.use('/assignmentgrades', require('./assignmentgrades'));
router.use('/assignments', require('./assignments'));
router.use('/assignmenttypes', require('./assignmenttypes'));
router.use('/attendance', require('./attendance'));
router.use('/coursegrades', require('./coursegrades'));
router.use('/enrollments', require('./enrollments'));
router.use('/courses', require('./courses'));
router.use('/gradelevels', require('./gradelevels'));
router.use('/students', require('./students'));
router.use('/teachers', require('./teachers'));
router.use('/messages', require('./messages'));
router.use('/parent_student', require('./parent_student'));

module.exports = router;