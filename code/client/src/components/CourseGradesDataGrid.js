import React, { useEffect, useState } from "react";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

export default function CourseGradesDataGrid() {
  const [user, setUser] = useState(null);
  const [courseGrades, setCourseGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filterCourse, setFilterCourse] = useState("");

  // Load current user (student)
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u?.role === "student") setUser(u);
  }, []);

  // Fetch course grades and courses
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [cgRes, cRes] = await Promise.all([
          api.get("/coursegrades"),
          api.get("/courses")
        ]);
        // Filter for this student and pick latest per course
        const allCG = cgRes.data.filter(cg =>
          (cg.student_id ?? cg.studentId) === user.studentId
        );
        const latestMap = {};
        allCG.forEach(cg => {
          const cid = cg.course_id ?? cg.courseId;
          const existing = latestMap[cid];
          const cgDate = new Date(cg.date);
          if (!existing || cgDate > new Date(existing.date)) {
            latestMap[cid] = cg;
          }
        });
        const latestArr = Object.values(latestMap);
        // Build course list for filter
        const allCourses = cRes.data;
        const enrolledCourses = allCourses.filter(c => latestMap[c.courseId]);
        setCourses(enrolledCourses);
        setFilterCourse("");
        // Map rows
        const rows = latestArr.map(cg => {
          const cid = cg.course_id ?? cg.courseId;
          const course = enrolledCourses.find(c => c.courseId === cid) || {};
          const grade = cg.course_grade ?? cg.courseGrade;
          const avgVal = cg.course_avg ?? cg.courseAvg;
          return {
            id: cg.course_grade_id ?? cg.courseGradeId,
            courseName: course.courseName || "",
            courseGrade: grade || "",
            courseAvg: avgVal != null ? `${avgVal}%` : ""
          };
        });
        setCourseGrades(rows);
      } catch (err) {
        console.error("Error loading course grades:", err);
      }
    })();
  }, [user]);

  // Filter rows by course
  const displayed = filterCourse
    ? courseGrades.filter(r => r.courseName === filterCourse)
    : courseGrades;

  const columns = [
    { field: "courseName", headerName: "Course", width: 300 },
    { field: "courseGrade", headerName: "Course Grade", width: 130 },
    { field: "courseAvg", headerName: "Course Avg", width: 130 },
    { field: "feedback", headerName: "Feedback", width: 400 }
  ];

  return (
    <Box>
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
      <Box sx={containerStyles}>
        <DataGrid
          rows={displayed}
          columns={columns}
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
          disableColumnMenu
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
}

const toolbarStyles = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  padding: "12px 16px",
  height: "70px",
  fontSize: "1.1rem",
  backgroundColor: "#f5f5f5"
};
const containerStyles = { width: "100%", "& .textPrimary": { color: "text.primary" } };
