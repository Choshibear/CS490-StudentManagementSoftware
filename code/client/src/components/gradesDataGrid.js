import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

export default function GradesDataGrid() {
  const [user, setUser] = useState(null);
  const [gradesData, setGradesData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Load user from localStorage
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

  // Fetch grades and assignments, compute courseAvg & courseGrade
  useEffect(() => {
    if (!selectedCourseId) return;
    (async () => {
      try {
        // Load assignment grades and assignments
        const [gRes, aRes] = await Promise.all([
          api.get(`/assignmentgrades/course/${selectedCourseId}`),
          api.get('/assignments')
        ]);
        const grades = gRes.data;
        const assignments = aRes.data.filter(a => a.courseId === selectedCourseId);

        // Build weight/possible map
        const assignInfo = assignments.reduce((map, a) => {
          map[a.assignmentName] = { weight: a.weight || 0, possible: a.possiblePoints || 0 };
          return map;
        }, {});
        const totalWeight = assignments.reduce((sum, a) => sum + (a.weight || 0), 0);

        // Group by student
        const studentMap = {};
        grades.forEach(row => {
          const sid = row.student_id;
          if (!studentMap[sid]) studentMap[sid] = { id: sid, student: row.student_name };
          studentMap[sid][row.assignmentName] = row.assignmentPoints || 0;
        });

        // Compute courseAvg and letter grade
        const combined = Object.values(studentMap).map(r => {
          let weightedSum = 0;
          assignments.forEach(a => {
            const pts = r[a.assignmentName] || 0;
            const info = assignInfo[a.assignmentName];
            if (info.possible > 0) {
              weightedSum += (pts / info.possible) * (info.weight || 0);
            }
          });
          const avgNum = totalWeight ? (weightedSum / totalWeight) * 100 : 0;
          const courseAvg = `${avgNum.toFixed(2)}%`;
          // Letter grade scale
          let courseGrade = 'F';
          if (avgNum >= 97) courseGrade = 'A+';
          else if (avgNum >= 93) courseGrade = 'A';
          else if (avgNum >= 90) courseGrade = 'A-';
          else if (avgNum >= 87) courseGrade = 'B+';
          else if (avgNum >= 83) courseGrade = 'B';
          else if (avgNum >= 80) courseGrade = 'B-';
          else if (avgNum >= 77) courseGrade = 'C+';
          else if (avgNum >= 73) courseGrade = 'C';
          else if (avgNum >= 70) courseGrade = 'C-';
          else if (avgNum >= 67) courseGrade = 'D+';
          else if (avgNum >= 60) courseGrade = 'D';
          return { ...r, courseGrade, courseAvg };
        });
        setGradesData(combined);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    })();
  }, [selectedCourseId]);

  // Build columns: student, courseGrade, courseAvg, assignments...
  const getColumns = () => {
    const assignmentNames = gradesData.length
      ? Object.keys(gradesData[0]).filter(
          k => !['id','student','courseAvg','courseGrade'].includes(k)
        )
      : [];
    const assignmentCols = assignmentNames.map(name => ({
      field: name,
      headerName: name,
      width: 150,
      editable: user?.role === 'teacher'
    }));
    return [
      { field: 'student', headerName: 'Student', width: 200 },
      { field: 'courseGrade', headerName: 'Course Grade', width: 120 },
      { field: 'courseAvg', headerName: 'Course Avg', width: 120 },
      ...assignmentCols
    ];
  };

  // Handle teacher edits only
  const handleRowUpdate = async (newRow, oldRow) => {
    if (user?.role !== 'teacher') return oldRow;
    const studentId = newRow.id;
    const changed = Object.keys(newRow).find(
      key => newRow[key] !== oldRow[key] && !['id','student','courseAvg','courseGrade'].includes(key)
    );
    if (!changed) return oldRow;
    try {
      await api.put('/assignmentgrades/update', { studentId, courseId: selectedCourseId, assignmentName: changed, points: newRow[changed] });
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
        processRowUpdate={handleRowUpdate}
        onProcessRowUpdateError={err => console.error(err)}
        slots={{ toolbar: EditToolbar }}
        slotProps={{ toolbar: { courses, selectedCourseId, setSelectedCourseId } }}
        experimentalFeatures={{ newEditingApi: true }}
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        pageSizeOptions={[10, 30, 50, 100]}
        disableColumnMenu
      />
    </Box>
  );
}

const EditToolbar = ({ courses, selectedCourseId, setSelectedCourseId }) => (
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
          <MenuItem key={c.courseId} value={c.courseId}>
            {c.courseName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </GridToolbarContainer>
);

const toolbarStyles = {
  display: 'flex', alignItems: 'center', gap: 2,
  padding: '12px 16px', height: '70px', fontSize: '1.1rem', backgroundColor: '#f5f5f5'
};
const containerStyles = {
  width: '100%', '& .actions': { color: 'text.secondary' }, '& .textPrimary': { color: 'text.primary' }
};
