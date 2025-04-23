const express = require('express');
const router = express.Router();



router.use('/assignmentgrades', require('./assignmentgrades'));
router.use('/assignments', require('./assignments'));
router.use('/assignmenttypes', require('./assignmenttypes'));
router.use('/coursegrades', require('./coursegrades'));
router.use('/enrollments', require('./enrollments'));
router.use('/courses', require('./courses'));
router.use('/gradelevels', require('./gradelevels'));
router.use('/students', require('./students'));
router.use('/teachers', require('./teachers'));

module.exports = router;
