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

// Sample student data - replace with your actual data
const sampleStudents = [
  { id: 1, name: 'John Doe', course: 'math101' },
  { id: 2, name: 'Jane Smith', course: 'eng201' },
  { id: 3, name: 'Bob Johnson', course: 'math101' }
];

const AttendanceList = ({ courseId, date }) => {
  const [attendance, setAttendance] = useState({});

  const handleStatusChange = (studentId, newStatus) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: newStatus
    }));
  };

  const handleSave = () => {
    // Add your save logic here
    console.log('Saving attendance:', attendance);
    alert('Attendance saved successfully!');
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