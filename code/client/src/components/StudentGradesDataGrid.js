import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";

export default function StudentGradesDataGrid() {
  const [rows, setRows] = useState([]);
  const [courses, setCourses] = useState([]);
  const [types, setTypes] = useState([]);
  const [filterCourse, setFilterCourse] = useState("");
  const [user, setUser] = useState(null);

  // Load user from localStorage (student or parent)
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u && (u.role === "student" || u.role === "parent")) {
      setUser(u);
    }
  }, []);

  // Fetch initial data: grades, assignments, courses, enrollments, types, parent-student mapping
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        // Parallel API calls
        const endpoints = [
          axios.get("http://localhost:5000/api/assignmentgrades"),
          axios.get("http://localhost:5000/api/assignments"),
          axios.get("http://localhost:5000/api/courses"),
          axios.get("http://localhost:5000/api/enrollments"),
          axios.get("http://localhost:5000/api/assignmenttypes"),
        ];
        // If parent, also fetch parent-student link
        if (user.role === "parent") {
          endpoints.push(axios.get("http://localhost:5000/api/parent_student"));
        }
        const [gRes, aRes, cRes, eRes, tRes, psRes] = await Promise.all(endpoints);
        const grades = gRes.data;
        const assignments = aRes.data;
        const allCourses = cRes.data;
        const enrollments = eRes.data;
        const typeData = tRes.data;
        setTypes(typeData);

        // Determine studentIds array
        let studentIds = [];
        if (user.role === "student") {
          studentIds = [user.studentId];
        } else if (user.role === "parent") {
          const ps = psRes.data;
          studentIds = ps
            .filter(link => link.parentId === user.parentId)
            .map(link => link.studentId);
        }
        // Determine courses enrolled by these students
        const myEnrolls = enrollments.filter(e => studentIds.includes(e.studentId));
        const courseIds = new Set(myEnrolls.map(e => e.courseId));
        const allowedCourses = allCourses.filter(c => courseIds.has(c.courseId));
        setCourses(allowedCourses);

        // Combine grade + assignment + type data with percentage grade
        const myGrades = grades.filter(g =>
          studentIds.includes(g.studentId) && courseIds.has(g.courseId)
        );
        const combined = myGrades.map(g => {
          const assignment = assignments.find(a =>
            a.assignmentId === g.assignmentId && a.courseId === g.courseId
          );
          const pts = g.assignmentPoints;
          const poss = assignment?.possiblePoints;
          const grade = poss && poss > 0
            ? `${((pts / poss) * 100).toFixed(0)}%`
            : "";
          const typeName = typeData.find(t => t.typeId === assignment?.assignmentTypeID)?.typeName || "";
          return {
            id: `${g.studentId}-${g.courseId}-${g.assignmentId}`,
            courseName: allowedCourses.find(c => c.courseId === g.courseId)?.courseName || "",
            assignmentType: typeName,
            assignmentName: assignment?.assignmentName || "",
            assignmentPoints: pts,
            possiblePoints: poss,
            grade,
          };
        });
        setRows(combined);
      } catch (err) {
        console.error("Load failed:", err);
      }
    })();
  }, [user]);

  // Apply course filter
  const displayed = filterCourse
    ? rows.filter(r => r.courseName === filterCourse)
    : rows;

  // Columns: Type included, Description removed
  const columns = [
    { field: "courseName", headerName: "Course", width: 250 },
    { field: "assignmentType", headerName: "Type", width: 150 },
    { field: "assignmentName", headerName: "Title", width: 200 },
    { field: "assignmentPoints", headerName: "Student Points", width: 150 },
    { field: "possiblePoints", headerName: "Points Possible", width: 150 },
    { field: "grade", headerName: "Assignment Grade", width: 150 },
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
          pageSizeOptions={[10, 30, 50, 100]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          disableSelectionOnClick
          disableColumnMenu
        />
      </Box>
    </Box>
  );
}

// Styles
const toolbarStyles = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  padding: "12px 16px",
  height: "70px",
  fontSize: "1.1rem",
  backgroundColor: "#f5f5f5",
};

const containerStyles = {
  width: '100%',
  '& .actions': { color: 'text.secondary' },
  '& .textPrimary': { color: 'text.primary' },
};
