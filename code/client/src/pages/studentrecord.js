import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Collapse,
  Typography,
  Box,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { ThemeContext } from "../ThemeContext";

// Sorting utilities
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
  const stabilized = array.map((el, idx) => [el, idx]);
  stabilized.sort((a, b) => {
    const cmp = comparator(a[0], b[0]);
    if (cmp !== 0) return cmp;
    return a[1] - b[1];
  });
  return stabilized.map(el => el[0]);
}

export default function StudentRecord() {
  const { scheme } = useContext(ThemeContext);
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [parentLinks, setParentLinks] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courseGrades, setCourseGrades] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('studentId');

  // Load user and all data
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'));
    setUser(u);
    Promise.all([
      axios.get("http://localhost:5000/api/students"),
      axios.get("http://localhost:5000/api/parent_student"),
      axios.get("http://localhost:5000/api/parents"),
      axios.get("http://localhost:5000/api/enrollments"),
      axios.get("http://localhost:5000/api/courses"),
      axios.get("http://localhost:5000/api/teachers"),
      axios.get("http://localhost:5000/api/coursegrades")
    ]).then(([sRes, plRes, pRes, eRes, cRes, tRes, cgRes]) => {
      let allStudents = sRes.data;
      const allEnroll = eRes.data;
      const allCourses = cRes.data;
      // Role-based student filter
      if (u.role === 'teacher') {
        // find courses taught by this teacher
        const myCourseIds = new Set(
          allCourses.filter(c => c.teacherId === u.teacherId).map(c => c.courseId)
        );
        // find students enrolled in those courses
        const studentIds = new Set(
          allEnroll.filter(e => myCourseIds.has(e.courseId)).map(e => e.studentId)
        );
        allStudents = allStudents.filter(s => studentIds.has(s.studentId));
      }
      // if admin or other, no filter
      setStudents(allStudents);
      setParentLinks(plRes.data);
      setParents(pRes.data);
      setEnrollments(allEnroll);
      setCoursesList(allCourses);
      setTeachers(tRes.data);
      setCourseGrades(cgRes.data);
    }).catch(err => console.error(err));
  }, []);

  const handleRowClick = (student) => {
    const id = student.studentId;
    setOpenRow(prev => prev === id ? null : id);
    setSelectedStudent(prev => prev && prev.studentId === id ? null : student);
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      await axios.delete(`http://localhost:5000/api/students/${selectedStudent.studentId}`);
      setDeleteConfirm(false);
      setSelectedStudent(null);
      // refresh students
      const res = await axios.get("http://localhost:5000/api/students");
      let updated = res.data;
      if (user.role === 'teacher') {
        // reapply teacher filter
        const myCourseIds = new Set(
          coursesList.filter(c => c.teacherId === user.teacherId).map(c => c.courseId)
        );
        const studentIds = new Set(
          enrollments.filter(e => myCourseIds.has(e.courseId)).map(e => e.studentId)
        );
        updated = updated.filter(s => studentIds.has(s.studentId));
      }
      setStudents(updated);
    } catch(err) { console.error(err); }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedStudents = stableSort(students, getComparator(order, orderBy));

  return (
    <Box sx={{ bgcolor: scheme.mainBg, color: scheme.text, p: 3 }}>
      <TableContainer component={Paper} sx={{ backgroundColor: scheme.panelBg }}>
        <Table>
          <TableHead>
            <TableRow>
              {['studentId','firstName','lastName','gradeLevelId'].map((field, idx) => (
                <TableCell key={field} sx={{ color: scheme.text }} sortDirection={orderBy === field ? order : false}>
                  <TableSortLabel
                    active={orderBy === field}
                    direction={orderBy === field ? order : 'asc'}
                    onClick={() => handleRequestSort(field)}
                  >{['ID','First Name','Last Name','Grade Level'][idx]}</TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStudents.map((s) => {
              const linkedParents = parentLinks
                .filter(pl => pl.studentId === s.studentId)
                .map(pl => parents.find(p => p.parentId === pl.parentId))
                .filter(Boolean);
              const studentEnrollments = enrollments.filter(e => e.studentId === s.studentId);
              return (
                <React.Fragment key={s.studentId}>
                  <TableRow hover onClick={() => handleRowClick(s)} sx={{ cursor: 'pointer' }}>
                    <TableCell sx={{ color: scheme.text }}>{s.studentId}</TableCell>
                    <TableCell sx={{ color: scheme.text }}>{s.firstName}</TableCell>
                    <TableCell sx={{ color: scheme.text }}>{s.lastName}</TableCell>
                    <TableCell sx={{ color: scheme.text }}>{s.gradeLevelId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} sx={{ p: 0 }}>
                      <Collapse in={openRow === s.studentId} timeout="auto" unmountOnExit>
                        <Box sx={{ display: 'flex', m: 2, color: scheme.text, gap: 4 }}>
                          {/* Left: Student & Parent Info */}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1 }}><b>Student Contact</b></Typography>
                            <Typography><b>DOB:</b> {new Date(s.dob).toLocaleDateString()}</Typography>
                            <Typography><b>Email:</b> {s.email}</Typography>
                            <Typography><b>Address:</b> {s.address}, {s.city}, {s.state} {s.zip}</Typography>
                            <Typography><b>Phone:</b> {s.phoneNumber}</Typography>
                            {linkedParents.length > 0 && (
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle1"><b>Parent Contact</b></Typography>
                                {linkedParents.map(p => (
                                  <Box key={p.parentId} sx={{ mb: 1 }}>
                                    <Typography><b>Name:</b> {p.firstName} {p.lastName}</Typography>
                                    <Typography><b>Email:</b> {p.email}</Typography>
                                    <Typography><b>Phone:</b> {p.phoneNumber}</Typography>
                                    <Typography><b>Address:</b> {p.address}, {p.city}, {p.state} {p.zip}</Typography>
                                  </Box>
                                ))}
                              </Box>
                            )}
                          </Box>
                          {/* Right: Enrolled Courses Table */}
                          <Box sx={{ flex: 1 }}>
                            {studentEnrollments.length > 0 && (
                              <>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}><b>Enrolled Courses</b></Typography>
                                <Table size="small" sx={{ backgroundColor: scheme.mainBg }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell sx={{ fontWeight: 'bold' }}>Course</TableCell>
                                      <TableCell sx={{ fontWeight: 'bold' }}>Teacher</TableCell>
                                      <TableCell sx={{ fontWeight: 'bold' }}>Grade</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {studentEnrollments.map(e => {
                                      const course = coursesList.find(c => c.courseId === e.courseId) || {};
                                      const teacher = teachers.find(t => t.teacherId === course.teacherId) || {};
                                      const cg = courseGrades.find(cg => cg.studentId === s.studentId && cg.courseId === e.courseId) || {};
                                      return (
                                        <TableRow key={e.courseId}>
                                          <TableCell>{course.courseName}</TableCell>
                                          <TableCell>{teacher.firstName} {teacher.lastName}</TableCell>
                                          <TableCell>{cg.courseGrade} ({cg.courseAvg}%)</TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </>
                            )}
                          </Box>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" startIcon={<Add />} disabled>
          Add
        </Button>
        <Button variant="contained" startIcon={<Edit />} disabled={!selectedStudent}>
          Edit
        </Button>
        <Button variant="contained" startIcon={<Delete />} onClick={() => setDeleteConfirm(true)} disabled={!selectedStudent}>
          Delete
        </Button>
      </Box>

      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Delete this student?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
