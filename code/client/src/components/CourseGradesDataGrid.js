// src/components/CourseGradesDataGrid.js
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from "@mui/material";
import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

export default function CourseGradesDataGrid() {
  const [user, setUser]               = useState(null);
  const [parentLinks, setParentLinks] = useState([]);
  const [studentGpa, setStudentGpa]   = useState(null);
  const [courseGrades, setCourseGrades] = useState([]);
  const [courses, setCourses]         = useState([]);
  const [filterCourse, setFilterCourse] = useState("");

  // Load user + parent_student links if needed
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (u && (u.role === "student" || u.role === "parent")) {
      setUser(u);
      if (u.role === "parent") {
        api.get("/parent_student")
           .then(r => setParentLinks(r.data))
           .catch(console.error);
      }
    }
  }, []);

  // Fetch the student record to get GPA
  useEffect(() => {
    if (!user) return;
    // determine which studentId applies
    const sid = user.role === "student"
      ? user.studentId
      : parentLinks.find(pl => pl.parentId === user.parentId)?.studentId;
    if (!sid) return;

    api.get(`/students/${sid}`)
      .then(r => {
        setStudentGpa(r.data.studentGpa);
      })
      .catch(console.error);
  }, [user, parentLinks]);

  // Fetch course grades + courses
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [cgRes, cRes] = await Promise.all([
          api.get("/coursegrades"),
          api.get("/courses")
        ]);

        // build the list of studentIds
        let studentIds = [];
        if (user.role === "student") {
          studentIds = [user.studentId];
        } else {
          studentIds = parentLinks
            .filter(pl => pl.parentId === user.parentId)
            .map(pl => pl.studentId);
        }

        // filter to only those students
        const allCG = cgRes.data.filter(cg =>
          studentIds.includes(cg.studentId)
        );

        // pick latest per course
        const latestMap = {};
        allCG.forEach(cg => {
          const cid = cg.courseId;
          if (
            !latestMap[cid] ||
            new Date(cg.date) > new Date(latestMap[cid].date)
          ) {
            latestMap[cid] = cg;
          }
        });
        const latestArr = Object.values(latestMap);

        // courses in which those grades live
        const allCourses = cRes.data;
        const enrolledCourses = allCourses.filter(c =>
          Object.prototype.hasOwnProperty.call(latestMap, c.courseId)
        );

        setCourses(enrolledCourses);
        setFilterCourse("");

        // format rows
        const rows = latestArr.map(cg => ({
          id:          cg.courseGradeId,
          courseName:  enrolledCourses.find(c => c.courseId === cg.courseId)
                        ?.courseName || "",
          courseGrade: cg.courseGrade,
          courseAvg:   cg.courseAvg != null ? `${cg.courseAvg}%` : "",
          feedback:    cg.feedback || ""
        }));

        setCourseGrades(rows);
      } catch (err) {
        console.error("Error loading course grades:", err);
      }
    })();
  }, [user, parentLinks]);

  const displayed = filterCourse
    ? courseGrades.filter(r => r.courseName === filterCourse)
    : courseGrades;

  const columns = [
    { field: "courseName", headerName: "Course",      width: 300 },
    { field: "courseGrade", headerName: "Course Grade", width: 130 },
    { field: "courseAvg",   headerName: "Course Avg",   width: 130 },
    { field: "feedback",    headerName: "Feedback",     width: 400 }
  ];

  return (
    <Box>
      {/* Toolbar with filter on the left, GPA on the right */}
      <Box sx={{ ...toolbarStyles, justifyContent: "space-between" }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel shrink sx={{
            transform:    "translate(14px, -9px) scale(0.75)",
            fontSize:     "0.75rem"
          }}>
            Filter by Course
          </InputLabel>
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

        <Typography variant="subtitle1">
          GPA: {studentGpa != null ? parseFloat(studentGpa).toFixed(2) : "—"}
        </Typography>
      </Box>

      {/* DataGrid */}
      <Box sx={containerStyles}>
        <DataGrid
          rows={displayed}
          columns={columns}
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } }
          }}
          disableColumnMenu
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
}

const toolbarStyles = {
  display:       "flex",
  alignItems:    "center",
  gap:           2,
  padding:       "12px 16px",
  height:        "70px",
  fontSize:      "1.1rem",
  backgroundColor: "#f5f5f5"
};

const containerStyles = {
  width: "100%",
  "& .textPrimary": { color: "text.primary" }
};
