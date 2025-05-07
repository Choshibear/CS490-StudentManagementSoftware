import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

export default function StudentAssignmentDataGrid() {
  const [rows, setRows] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [types, setTypes] = useState([]);
  const [filterCourse, setFilterCourse] = useState('');
  const [user, setUser] = useState(null);

  // Load user (student, parent, or teacher)
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    if (u && ['student','parent','teacher'].includes(u.role)) setUser(u);
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        // Fetch base data
        const endpoints = [
          api.get('/assignments'),
          api.get('/courses'),
          api.get('/assignmenttypes'),
          api.get('/enrollments')
        ];
        if (user.role === 'parent') endpoints.push(api.get('/parent_student'));
        const [aRes, cRes, tRes, eRes, psRes] = await Promise.all(endpoints);

        const assignments = aRes.data;
        const allC = cRes.data;
        const typeData = tRes.data;
        const enrollData = eRes.data;
        setAllCourses(allC);
        setTypes(typeData);

        // Determine accessible studentIds
        let studentIds = [];
        if (user.role === 'student') {
          studentIds = [user.studentId];
        } else if (user.role === 'parent') {
          const links = psRes.data;
          studentIds = links
            .filter(link => link.parentId === user.parentId)
            .map(link => link.studentId);
        }
        // Teacher sees all students

        // Determine allowed courses
        let allowedC = [];
        if (user.role === 'teacher') {
          allowedC = allC.filter(c => c.teacherId === user.teacherId);
        } else {
          const myEnrolls = enrollData.filter(e => studentIds.includes(e.studentId));
          const allowedIds = new Set(myEnrolls.map(e => e.courseId));
          allowedC = allC.filter(c => allowedIds.has(c.courseId));
        }
        setCourses(allowedC);

        // Filter assignments by allowed courses
        const allowedIds = new Set(allowedC.map(c => c.courseId));
        const allowedA = assignments.filter(a => allowedIds.has(a.courseId));
        setRows(allowedA);
      } catch (err) {
        console.error('Load failed:', err);
      }
    })();
  }, [user]);

  // Filter view by course name
  const displayed = filterCourse
    ? rows.filter(r =>
        courses.find(c => c.courseId === r.courseId)?.courseName === filterCourse
      )
    : rows;

  // Define columns, resolving assignmentTypeID safely
  const columns = [
    { field: 'assignmentId', headerName: 'ID', width: 80 },
    {
      field: 'assignmentTypeID',
      headerName: 'Type',
      width: 150,
      renderCell: (params) => {
        const row = params.row || {};
        // support both uppercase/lowercase ID keys
        const typeId = row.assignmentTypeID ?? row.assignmentTypeId;
        const typeObj = types.find(t => t.typeId === typeId);
        return typeObj ? typeObj.typeName : '';
      }
    },
    { field: 'assignmentName', headerName: 'Title', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'dueDate', headerName: 'Due Date', width: 150 },
    { field: 'possiblePoints', headerName: 'Points', width: 120 },
    {
      field: 'courseId',
      headerName: 'Course',
      width: 180,
      renderCell: (params) => {
        const cid = params.value;
        const courseObj = courses.find(c => c.courseId === cid);
        return courseObj ? courseObj.courseName : '';
      }
    }
  ];

  return (
    <Box>
      {/* Toolbar */}
      <Box sx={toolbarStyles}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel shrink sx={{
              transform: "translate(14px, -9px) scale(0.75)",
              fontSize: "0.75rem",
            }}>Filter by Course</InputLabel>
          <Select
            value={filterCourse}
            displayEmpty
            onChange={e => setFilterCourse(e.target.value)}
          >
            <MenuItem value=""><em>All Courses</em></MenuItem>
            {courses.map(c => (
              <MenuItem key={c.courseId} value={c.courseName}>
                {c.courseName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* DataGrid */}
      <Box sx={{ height: 600, ...containerStyles }}>
        <DataGrid
          rows={displayed}
          columns={columns}
          getRowId={r => r.assignmentId}
          pageSizeOptions={[10, 30, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
}

// Styles
const toolbarStyles = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  padding: '12px 16px',
  height: '70px',
  fontSize: '1.1rem',
  backgroundColor: '#f5f5f5'
};
const containerStyles = {
  width: '100%',
  '& .actions': { color: 'text.secondary' },
  '& .textPrimary': { color: 'text.primary' }
};
