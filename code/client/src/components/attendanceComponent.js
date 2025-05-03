import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Button,
  Typography,
  Box
} from '@mui/material';
import emailjs from '@emailjs/browser';


// Sample student data - replace with your actual data
const sampleStudents = [
  { id: 1, name: 'John Doe', course: 'math101', parentEmail: 'rubymjaber@gmail.com' },
  { id: 2, name: 'Jane Smith', course: 'eng201', parentEmail: 'parent2@email.com' },
  { id: 3, name: 'Bob Johnson', course: 'math101', parentEmail: 'parent3@email.com' }
];

const AttendanceList = ({ courseId, date }) => {
  const [attendance, setAttendance] = useState({});

  const handleStatusChange = (studentId, newStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: newStatus
    }));
  };

  const handleSave = async () => {
    for (const student of filteredStudents) {
      const status = attendance[student.id] || 'present';
  
      // Save to DB
      await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          date,
          status
        })
      });
  
      // Send Email if Absent
      if (status === 'absent') {
        console.log(`Sending email to ${student.parentEmail} for ${student.name}`);  // ADD THIS
      
        emailjs.send(
          'service_9l13mc9',
          'template_mrqn8xj',
          {
            to_email: student.parentEmail,
            subject: `Absence Notification for ${student.name}`,
            name: "School Attendance System",
            message: `${student.name} was marked absent on ${date}.`
          },
          '6QhI_O5nZGxvlp3xU'
        );
      }
      
    }
  
    alert('Attendance saved and emails sent for absent students!');
  };
  
  const filteredStudents = courseId === 'all' 
    ? sampleStudents 
    : sampleStudents.filter(student => student.course === courseId);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {date || 'Select a date'} - {courseId === 'all' ? 'All Students' : courseId}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map(student => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>
                  <FormControl fullWidth size="small">
                    <Select
                      value={attendance[student.id] || 'present'}
                      onChange={(e) => handleStatusChange(student.id, e.target.value)}
                    >
                      <MenuItem value="present">Present</MenuItem>
                      <MenuItem value="absent">Absent</MenuItem>
                      <MenuItem value="late">Late</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          disabled={!date}
        >
          Save Attendance
        </Button>
      </Box>
    </Box>
  );
};

export default AttendanceList;