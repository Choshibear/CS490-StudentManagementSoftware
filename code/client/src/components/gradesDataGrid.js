// src/components/gradesDataGrid.js
import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

export default function GradesDataGrid({ onStudentClick }) {
  const [user, setUser]                         = useState(null);
  const [gradesData, setGradesData]             = useState([]);
  const [courses, setCourses]                   = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u) setUser(u);
  }, []);

  useEffect(() => {
    if (!user) return;
    api.get("/courses").then(res => {
      let data = res.data;
      if (user.role === "teacher") {
        data = data.filter(c => c.teacherId === user.teacherId);
      }
      setCourses(data);
      if (!selectedCourseId && data.length) {
        setSelectedCourseId(data[0].courseId);
      }
    });
  }, [user]);

  useEffect(() => {
    if (!selectedCourseId) return;
    (async () => {
      const [gRes, aRes] = await Promise.all([
        api.get(`/assignmentgrades/course/${selectedCourseId}`),
        api.get("/assignments")
      ]);
      const grades      = gRes.data;
      const assignments = aRes.data.filter(a => a.courseId === selectedCourseId);

      // map each assignmentName → weight & possible
      const info = {};
      assignments.forEach(a => {
        info[a.assignmentName] = {
          weight:   a.weight || 0,
          possible: a.possiblePoints || 0
        };
      });
      const totalW = assignments.reduce((sum, a) => sum + (a.weight||0), 0);

      // group by student
      const byStudent = {};
      grades.forEach(r => {
        if (!byStudent[r.student_id]) {
          byStudent[r.student_id] = {
            id:      r.student_id,
            student: r.student_name
          };
        }
        byStudent[r.student_id][r.assignmentName] = r.assignmentPoints||0;
      });

      // compute courseAvg & letter
      const rows = Object.values(byStudent).map(r => {
        let ws = 0;
        assignments.forEach(a => {
          const pts = r[a.assignmentName]||0;
          const { possible, weight } = info[a.assignmentName];
          if (possible > 0) {
            ws += (pts/possible)*weight;
          }
        });
        const pct       = totalW ? (ws/totalW)*100 : 0;
        const courseAvg = `${pct.toFixed(2)}%`;
        let courseGrade = 'F';
        if      (pct>=97) courseGrade='A+'; 
        else if (pct>=93) courseGrade='A'; 
        else if (pct>=90) courseGrade='A-'; 
        else if (pct>=87) courseGrade='B+'; 
        else if (pct>=83) courseGrade='B'; 
        else if (pct>=80) courseGrade='B-'; 
        else if (pct>=77) courseGrade='C+'; 
        else if (pct>=73) courseGrade='C'; 
        else if (pct>=70) courseGrade='C-'; 
        else if (pct>=67) courseGrade='D+'; 
        else if (pct>=60) courseGrade='D';
        return { ...r, courseAvg, courseGrade };
      });

      setGradesData(rows);
    })();
  }, [selectedCourseId]);

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
      { field: 'student',     headerName: 'Student',      width: 200 },
      { field: 'courseGrade', headerName: 'Course Grade', width: 120 },
      { field: 'courseAvg',   headerName: 'Course Avg',   width: 120 },
      ...assignmentCols
    ];
  };

  const handleRowUpdate = async (newRow, oldRow) => {
    if (user?.role !== 'teacher') return oldRow;
    const changed = Object.keys(newRow).find(
      k => newRow[k] !== oldRow[k] &&
           !['id','student','courseAvg','courseGrade'].includes(k)
    );
    if (!changed) return oldRow;
    await api.put('/assignmentgrades/update', {
      studentId:      newRow.id,
      courseId:       selectedCourseId,
      assignmentName: changed,
      points:         newRow[changed]
    });
    return newRow;
  };

  return (
    <Box sx={containerStyles}>
      <DataGrid
        rows={gradesData}
        columns={getColumns()}
        processRowUpdate={handleRowUpdate}
        onProcessRowUpdateError={err => console.error(err)}
        onRowClick={params => {
          if (onStudentClick) {
            onStudentClick(params.id, selectedCourseId, params.row.student);
          }
        }}
        slots={{ toolbar: EditToolbar }}
        slotProps={{ toolbar: { courses, selectedCourseId, setSelectedCourseId } }}
        experimentalFeatures={{ newEditingApi: true }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 }}
        }}
        pageSizeOptions={[10,30,50,100]}
        disableColumnMenu
        autoHeight
      />
    </Box>
  );
}

const EditToolbar = ({ courses, selectedCourseId, setSelectedCourseId }) => (
  <GridToolbarContainer sx={toolbarStyles}>
    <FormControl size="small" sx={{ minWidth: 200 }}>
      <InputLabel>Filter by Course</InputLabel>
      <Select
        value={selectedCourseId}
        onChange={e => setSelectedCourseId(Number(e.target.value))}
        label="Filter by Course"
      >
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
  display:"flex",alignItems:"center",gap:2,
  padding:"12px 16px",height:"70px",
  fontSize:"1.1rem",backgroundColor:"#f5f5f5"
};
const containerStyles = {
  width:"100%",
  "& .actions":     { color:"text.secondary" },
  "& .textPrimary": { color:"text.primary" }
};
