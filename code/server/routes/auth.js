const express = require('express');
const router = express.Router();
const { getAdminByUsername } = require('../db/adminQueries');
const { getTeacherByUsername } = require('../db/teacherQueries');
const { getParentByUsername } = require('../db/parentQueries');
const { getStudentByUsername } = require('../db/studentQueries'); // Fixed import

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const checkUser = async (getUserFn, role) => {
      const user = await getUserFn(username);
      if (user && user.password === password) {
        return { ...user, role };
      }
      return null;
    };

    const user = 
      await checkUser(getAdminByUsername, 'admin') ||
      await checkUser(getTeacherByUsername, 'teacher') ||
      await checkUser(getParentByUsername, 'parent') ||
      await checkUser(getStudentByUsername, 'student'); // Now using correct function

    if (user) {
      const { password: _, ...safeUser } = user;
      res.json({ 
        message: "Login successful",
        user: safeUser
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;