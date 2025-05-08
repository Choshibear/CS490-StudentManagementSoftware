// src/pages/AttendanceView.js
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';



export default function AttendanceView() {
  const [user, setUser]           = useState(null);
  const [rows, setRows]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [filterCourse, setFilterCourse] = useState('');
  const [filterDate, setFilterDate]     = useState('');

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    setUser(u);
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    let url;
    if (user.role === 'student') {
      url = `/api/attendance/student/${user.studentId}`;
    } else if (user.role === 'parent') {
      url = `/api/attendance/parent/${user.parentId}`;
    } else {
      setRows([]);
      setLoading(false);
      return;
    }

    axios.get(url)
      .then(res => {
        const data = res.data.map(a => ({
          id:     a.attendanceId,
          course: a.courseName,
          date:   a.attendanceDate,
          status: a.status,
          remarks:a.remarks
        }));
        setRows(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  // derive unique filter options
  const courses = Array.from(new Set(rows.map(r => r.course))).sort();
  const dates   = Array.from(new Set(rows.map(r => r.date))).sort();

  // apply filters
  const displayed = rows.filter(r =>
    (!filterCourse || r.course === filterCourse) &&
    (!filterDate   || r.date   === filterDate)
  );

  const columns = [
    { field: 'course',  headerName: 'Course', width: 200 },
    {
      field: 'date', headerName: 'Date', width: 120,
      renderCell: params =>(() => {
        const d = new Date(params.value);
        if (isNaN(d)) return '';
        const mm = String(d.getMonth()+1).padStart(2,'0');
        const dd = String(d.getDate()).padStart(2,'0');
        const yyyy = d.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
      })()
     },
    { field: 'status',  headerName: 'Status', width: 120 },
    { field: 'remarks', headerName: 'Remarks', width: 200 },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="h4">Attendance Records</Typography>
      <Typography variant="body1" gutterBottom>
        {user?.role === 'student'
          ? 'Here is your attendance history.'
          : 'Here are your linked student(s) attendance records.'}
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
        <Grid item xs={12}>
          {/* Toolbar */}
          <Box sx={toolbarStyles}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Course</InputLabel>
              <Select
                value={filterCourse}
                label="Course"
                onChange={e => setFilterCourse(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Courses</em>
                </MenuItem>
                {courses.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 200 }}>
  <InputLabel>Date</InputLabel>
  <Select
    value={filterDate}
    label="Date"
    onChange={e => setFilterDate(e.target.value)}
  >
    <MenuItem value="">
      <em>All Dates</em>
    </MenuItem>
    {dates.map(raw => {
      // raw might be "2025-05-08T07:00:00.000Z" or similar
      const dt = new Date(raw);
      // Format as MM/DD/YYYY
      const mm = String(dt.getMonth() + 1).padStart(2, "0");
      const dd = String(dt.getDate()).padStart(2, "0");
      const yyyy = dt.getFullYear();
      return (
        <MenuItem key={raw} value={raw}>
          {`${mm}/${dd}/${yyyy}`}
        </MenuItem>
      );
    })}
  </Select>
</FormControl>
          </Box>

          <Box sx={{ height: 600, ...containerStyles }}>
            <DataGrid
              loading={loading}
              rows={displayed}
              columns={columns}
              disableSelectionOnClick
              pageSizeOptions={[10, 20, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } }
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

const toolbarStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    padding: '12px 16px',
    backgroundColor: '#f5f5f5',
    marginBottom: '16px'
};
  
const containerStyles = {
    width: '100%',
    '& .actions': { color: 'text.secondary' },
    '& .textPrimary': { color: 'text.primary' },
  };
  