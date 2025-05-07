import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer
} from "@mui/x-data-grid";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button
} from "@mui/material";
import {
  Add as AddIcon,
} from '@mui/icons-material';
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

export default function GradesDataGrid() {
  const [user, setUser] = useState(null);
  const [gradesData, setGradesData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u) setUser(u);
  }, []);

  // Fetch and filter courses based on teacher role
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res = await api.get("/courses");
        let data = res.data;
        if (user.role === 'teacher') {
          data = data.filter(c => c.teacherId === user.teacherId);
        }
        setCourses(data);
        if (!selectedCourseId && data.length > 0) {
          setSelectedCourseId(data[0].courseId);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!selectedCourseId) return;
    (async () => {
      try {
        const res = await api.get(
          `/assignmentgrades/course/${selectedCourseId}`
        );
        const grouped = groupData(res.data);
        setGradesData(grouped);
      } catch (err) {
        console.error("Error fetching gradebook:", err);
      }
    })();
  }, [selectedCourseId]);

  const groupData = rows => {
    const studentMap = {};
    rows.forEach(row => {
      if (!studentMap[row.student_id]) {
        studentMap[row.student_id] = { id: row.student_id, student: row.student_name };
      }
      studentMap[row.student_id][row.assignmentName] = row.assignmentPoints || '';
    });
    return Object.values(studentMap);
  };

  const getColumns = () => {
    const assignmentNames = gradesData.length
      ? Object.keys(gradesData[0]).filter(k => k !== 'id' && k !== 'student')
      : [];
    const assignmentCols = assignmentNames.map(name => ({
      field: name,
      headerName: name,
      width: 150,
      editable: user?.role === 'teacher',
    }));
    return [
      { field: 'student', headerName: 'Student', width: 200 },
      ...assignmentCols
    ];
  };

  const handleRowUpdate = async (newRow, oldRow) => {
    if (user?.role !== 'teacher') return oldRow;
    const studentId = newRow.id;
    const changed = Object.keys(newRow).find(
      key => newRow[key] !== oldRow[key] && key !== 'id' && key !== 'student'
    );
    if (!changed) return oldRow;
    const points = newRow[changed];
    try {
      await api.put('/assignmentgrades/update', { studentId, courseId: selectedCourseId, assignmentName: changed, points });
      return newRow;
    } catch (err) {
      console.error('Error updating grade:', err);
      return oldRow;
    }
  };

  return (
    <Box sx={containerStyles}>
      <DataGrid
        rows={gradesData}
        columns={getColumns()}
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        pageSizeOptions={[10, 30, 50, 100]}
        slots={{ toolbar: props => <EditToolbar {...props} user={user} /> }}
        slotProps={{ toolbar: { courses, selectedCourseId, setSelectedCourseId } }}
        processRowUpdate={handleRowUpdate}
        onProcessRowUpdateError={err => console.error(err)}
        experimentalFeatures={{ newEditingApi: true }}
        disableColumnMenu
      />
    </Box>
  );
}

const EditToolbar = ({ courses, selectedCourseId, setSelectedCourseId, user }) => (
  <GridToolbarContainer sx={toolbarStyles}>
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Filter by Course</InputLabel>
      <Select
        value={selectedCourseId ?? ''}
        label="Filter by Course"
        onChange={e => setSelectedCourseId(Number(e.target.value))}
      >
        <MenuItem value=""><em>All Courses</em></MenuItem>
        {courses.map(c => (
          <MenuItem key={c.courseId} value={c.courseId}>{c.courseName}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </GridToolbarContainer>
);

const toolbarStyles = { display: 'flex', alignItems: 'center', gap: 2, padding: '12px 16px', height: '70px', fontSize: '1.1rem', backgroundColor: '#f5f5f5' };
const containerStyles = { width: '100%', '& .actions': { color: 'text.secondary' }, '& .textPrimary': { color: 'text.primary' } };
