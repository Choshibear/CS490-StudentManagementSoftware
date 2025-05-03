const express = require('express');
const router = express.Router();
const {
  getAllAdmins
} = require('../db/adminQueries');
const {
  getAllTeachers
} = require('../db/teacherQueries');
const {
  getAllParents
} = require('../db/parentQueries');
const {
  getAllStudents
} = require('../db/studentQueries');
const { roleAuth } = require('../middleware/authMiddleware');

// Get all users (Admin only)
router.get('/', roleAuth(['admin']), async (req, res) => {
  try {
    const [admins, teachers, parents, students] = await Promise.all([
      getAllAdmins(),
      getAllTeachers(),
      getAllParents(),
      getAllStudents()
    ]);

    const users = [
      ...admins.map(a => ({ 
        ...a, 
        role: 'admin',
        id: a.adminId,
        displayName: `${a.firstName} ${a.lastName}`
      })),
      ...teachers.map(t => ({
        ...t,
        role: 'teacher',
        id: t.teacherId,
        displayName: `${t.firstName} ${t.lastName}`
      })),
      ...parents.map(p => ({
        ...p,
        role: 'parent',
        id: p.parentId,
        displayName: `${p.firstName} ${p.lastName}`
      })),
      ...students.map(s => ({
        ...s,
        role: 'student',
        id: s.studentId,
        displayName: `${s.firstName} ${s.lastName}`
      }))
    ];

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

module.exports = router;