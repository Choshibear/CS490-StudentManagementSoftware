import React, { useState } from 'react';
import { 
  Container,
  Typography,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import AttendanceList from '../components/attendanceComponent';

const AttendancePage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Sample courses - replace with your actual data
  const courses = [
    { id: 'all', name: 'All Students' },
    { id: 'math101', name: 'Mathematics 101' },
    { id: 'eng201', name: 'English 201' }
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Daily Attendance
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Select Course</InputLabel>
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              label="Select Course"
            >
              {courses.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Attendance Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: 200 }}
          />
        </Box>

        <Paper elevation={3} sx={{ p: 2 }}>
          <AttendanceList 
            courseId={selectedCourse} 
            date={selectedDate}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default AttendancePage;