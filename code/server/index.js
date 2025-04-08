const getConnection = require('./db');
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mysql = require('mysql2/promise');

const app = express();  

// Set the port for the server to listen on
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable cross origin resource sharing

// Enable JSON body parsing
app.use(express.json());

//default route, displays a message if the server is running
app.get("/", (req, res) => {
    res.send("Server is running!");
});

//testing to make sure server can fetch Teachers from database
app.get('/Teachers', (req, res) => {
    db.query('SELECT * FROM Teachers', (err, results) => {
      if (err) {
        console.error('Error fetching Teachers:', err);
        res.status(500).json({ error: 'Failed to fetch Teachers' });
      } else {
        res.json(results);
      }
    });
  });  


  //testing to make sure server can fetch Students from database
  app.get('/Students', (req, res) => {
    db.query('SELECT * FROM Students', (err, results) => {
      if (err) {
        console.error('Error fetching Students:', err);
        res.status(500).json({ error: 'Failed to fetch Students' });
      } else {
        res.json(results);
      }
    });
  });  


    //testing to make sure server can fetch GradeLevels from database
  app.get('/GradeLevels', (req, res) => {
    db.query('SELECT * FROM GradeLevels', (err, results) => {
      if (err) {
        console.error('Error fetching GradeLevels:', err);
        res.status(500).json({ error: 'Failed to fetch GradeLevels' });
      } else {
        res.json(results);
      }
    });
  });  



  //testing to make sure server can fetch Enrollments from database
  app.get('/Enrollments', (req, res) => {
    db.query('SELECT * FROM Enrollments', (err, results) => {
      if (err) {
        console.error('Error fetching Enrollments:', err);
        res.status(500).json({ error: 'Failed to fetch Enrollments' });
      } else {
        res.json(results);
      }
    });
  }); 


  //testing to make sure server can fetch CourseGrades from database
  app.get('/CourseGrades', (req, res) => {
    db.query('SELECT * FROM CourseGrades', (err, results) => {
      if (err) {
        console.error('Error fetching CourseGrades:', err);
        res.status(500).json({ error: 'Failed to fetch CourseGrades' });
      } else {
        res.json(results);
      }
    });
  });


    //testing to make sure server can fetch AssignmentTypes from database
  app.get('/AssignmentTypes', (req, res) => {
    db.query('SELECT * FROM AssignmentTypes', (err, results) => {
      if (err) {
        console.error('Error fetching AssignmentTypes:', err);
        res.status(500).json({ error: 'Failed to fetch AssignmentTypes' });
      } else {
        res.json(results);
      }
    });
  });


  
  //testing coursework table fetch
  app.get("/api/Assignments/Courses", async (req, res) => {
    const sql = `
      SELECT
        assignment.assignmentId,
        assignmenttype.typeName,  
        assignment.assignmentName,
        assignment.description,
        assignment.dueDate,
        assignment.possiblePoints,
        assignment.weight,
	      course.courseName
      FROM
        assignments assignment
      JOIN
	      assignmenttypes assignmenttype ON assignment.assignmentTypeId = assignmenttype.typeId
      JOIN
        courses course ON assignment.courseId = course.courseId
      `;
      
      try {
        const connection = await getConnection();
        const [results] = await connection.execute(sql);
        await connection.end();
        res.json(results);
      } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ error: 'Database error' });
      }
    });


app.get('/api/gradebook/course/:courseId', async (req, res) => {
  const courseId = req.params.courseId;
  const query = `
    SELECT
      s.studentId AS student_id,
      CONCAT(s.firstName, ' ', s.lastName) AS student_name,
      a.assignmentId,
      a.assignmentName,
      ag.assignmentPoints
    FROM
      Students s
    JOIN Enrollments e ON s.studentId = e.studentId
    JOIN Assignments a ON a.courseId = e.courseId
    LEFT JOIN AssignmentGrades ag ON ag.studentId = s.studentId AND ag.assignmentId = a.assignmentId
    WHERE
      a.courseId = ?
    ORDER BY
      student_name, a.assignmentId;
  `;

  try {
    const connection = await getConnection();
    const [results] = await connection.execute(query, [courseId]);
    await connection.end();
    res.json(results);
  } catch (error) {
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/courses', async (req, res) => {
  const query = `SELECT courseId, courseName FROM Courses`;

  try {
    const connection = await getConnection();
    const [results] = await connection.execute(query);
    await connection.end();
    res.json(results);
  } catch (error) {
    console.error('Failed to fetch courses:', error);
    res.status(500).json({ error: 'Database error' });
  }
});


app.put('/api/assignmentgrades/update', async (req, res) => {
  const { studentId, courseId, assignmentName, points } = req.body;

  try {
    const connection = await getConnection();


    // 1. Find the assignmentId based on courseId and assignment name
    const [assignmentRows] = await connection.execute(
      `SELECT assignmentId FROM Assignments WHERE courseId = ? AND assignmentName = ?`,
      [courseId, assignmentName]
    );

    console.log('Assignment lookup result:', assignmentRows);

    if (assignmentRows.length === 0) {
      await connection.end();
      return res.status(404).json({ message: "Assignment not found." });
    }

    const assignmentId = assignmentRows[0].assignmentId;

    // 2. Check if grade already exists
    const [existingGrade] = await connection.execute(
      `SELECT assignmentGradeId FROM AssignmentGrades WHERE studentId = ? AND assignmentId = ?`,
      [studentId, assignmentId]
    );

    // 3. Insert or Update grade
    if (existingGrade.length > 0) {
      await connection.execute(
        `UPDATE AssignmentGrades SET assignmentPoints = ? WHERE studentId = ? AND assignmentId = ?`,
        [points, studentId, assignmentId]
      );
    } else {
      await connection.execute(
        `INSERT INTO AssignmentGrades (assignmentPoints, studentId, assignmentId, courseId)
         VALUES (?, ?, ?, ?)`,
        [points, studentId, assignmentId, courseId]
      );
    }

    await connection.end();
    res.json({ message: "Grade updated successfully." });
  } catch (err) {
    console.error("Grade update error:", err);
    res.status(500).json({ message: "Server error while updating grade." });
  }
});

//start the server, listening on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
