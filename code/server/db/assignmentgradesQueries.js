const getConnection = require('../db');

//Get all assignmentgrades from the database
async function getAllAssignmentGrades() {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM assignmentgrades');
    await connection.end();
    return rows;
}

//Get one assignmentgrade by ID
//input: id
async function getAssignmentGradeById(id) {
    const connection = await getConnection();
    const [rows] = await connection.query('SELECT * FROM assignmentgrades WHERE assignmentgradeid = ?', [id]);
    await connection.end();
    return rows[0];
}



//Get assignmentgrades by courseId
//input: courseId
async function getAssignmentGradesByCourseId(courseId) {
    const connection = await getConnection();
    const query =`
     SELECT
       s.studentId AS student_id,
       CONCAT(s.firstName, ' ', s.lastName) AS student_name,
       a.assignmentId,
       a.assignmentName,
       ag.assignmentPoints
     FROM
       students s
     JOIN enrollments e ON s.studentId = e.studentId
     JOIN assignments a ON a.courseId = e.courseId
     LEFT JOIN assignmentgrades ag ON ag.studentId = s.studentId AND ag.assignmentId = a.assignmentId
     WHERE
       a.courseId = ?
     ORDER BY
       student_name, a.assignmentId;
   `;
    const [rows] = await connection.query(query, [courseId]);
    await connection.end();
    return rows;
}



//Add new assignmentgrade
//input: [assignmentgradeid, assignmentid, studentid, assignmentgrade]
async function addAssignmentGrade(assignmentgrade) {
    const connection = await getConnection();
    const {assignmentgradeid, assignmentid, studentid, grade } = assignmentgrade;
    const [result] = await connection.query(
        'INSERT INTO assignmentgrades (assignmentgradeid, assignmentid, studentid, assignmentgrade) VALUES (?, ?, ?, ?)',
        [assignmentgradeid, assignmentid, studentid, grade]
    );
    await connection.end();
    return result.insertId;
}


//Update assignmentgrade
async function updateAssignmentGrade(fields) {
    const connection = await getConnection();
    const { studentId, courseId, assignmentName, points } = fields;
    //const { assignmentgradeid, assignmentid, studentid, points } = updatedFields;

     // 1. Find the assignmentId based on courseId and assignment name
     const [assignmentRows] = await connection.execute(
        `SELECT assignmentId FROM assignments WHERE courseId = ? AND assignmentName = ?`,
        [courseId, assignmentName]
    );

    console.log('Assignment lookup result:', assignmentRows);

    if (assignmentRows.length === 0) {
        console.error('Assignment not found for the given courseId and assignmentName');
        await connection.end();
        return;
    }

    const assignmentId = assignmentRows[0].assignmentId;

     // 2. Check if grade already exists
     const [existingGrade] = await connection.execute(
        `SELECT assignmentGradeId FROM assignmentgrades WHERE studentId = ? AND assignmentId = ?`,
        [studentId, assignmentId]
    );

    // 3. Insert or Update grade
    if (existingGrade.length > 0) {
        await connection.execute(
          `UPDATE assignmentgrades SET assignmentPoints = ? WHERE studentId = ? AND assignmentId = ?`,
          [points, studentId, assignmentId]
        );
      } else {
        await connection.execute(
          `INSERT INTO assignmentgrades (assignmentPoints, studentId, assignmentId, courseId)
           VALUES (?, ?, ?, ?)`,
          [points, studentId, assignmentId, courseId]
        );
      }    
    
    await connection.end();
}




//Delete assignmentgrade by ID
//input: id
async function deleteAssignmentGrade(id) {
    const connection = await getConnection();
    await connection.query('DELETE FROM assignmentgrades WHERE assignmentgradeid = ?', [id]);
    await connection.end();
}

module.exports = {
    getAllAssignmentGrades,
    getAssignmentGradeById,
    getAssignmentGradesByCourseId,
    addAssignmentGrade,
    updateAssignmentGrade,
    deleteAssignmentGrade
};

