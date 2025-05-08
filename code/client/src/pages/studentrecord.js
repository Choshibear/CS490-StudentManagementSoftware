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
  DialogTitle,
  TextField,
  Grid
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { ThemeContext } from "../ThemeContext";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

// Sorting helpers
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}
function getComparator(order, orderBy) {
  return order === "desc"
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

  // Data state
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [parents, setParents] = useState([]);
  const [parentLinks, setParentLinks] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [courseGrades, setCourseGrades] = useState([]);

  // UI state
  const [openRow, setOpenRow] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("studentId");

  // Dialog state
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  // Form state
  const studentTemplate = {
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phoneNumber: "",
    gradeLevelId: "",
    studentNotes: ""
  };
  const [formStudent, setFormStudent] = useState(studentTemplate);
  const [formParents, setFormParents] = useState({});

  // Initial data fetch
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);

    Promise.all([
      api.get("/students"),
      api.get("/parent_student"),
      api.get("/parents"),
      api.get("/enrollments"),
      api.get("/courses"),
      api.get("/teachers"),
      api.get("/coursegrades")
    ])
      .then(([sRes, plRes, pRes, eRes, cRes, tRes, cgRes]) => {
        let allStudents = sRes.data;
        const allEnroll = eRes.data;
        const allCourses = cRes.data;

        // Teacher sees only their students
        if (u.role === "teacher") {
          const myCourseIds = new Set(
            allCourses.filter(c => c.teacherId === u.teacherId).map(c => c.courseId)
          );
          const studentIds = new Set(
            allEnroll.filter(e => myCourseIds.has(e.courseId)).map(e => e.studentId)
          );
          allStudents = allStudents.filter(s => studentIds.has(s.studentId));
        }

        setStudents(allStudents);
        setParentLinks(plRes.data);
        setParents(pRes.data);
        setEnrollments(allEnroll);
        setCoursesList(cRes.data);
        setTeachers(tRes.data);
        setCourseGrades(cgRes.data);
      })
      .catch(console.error);
  }, []);

  // Refresh helper
  const refreshStudents = async () => {
    const res = await api.get("/students");
    let list = res.data;
    if (user.role === "teacher") {
      const myCourseIds = new Set(
        coursesList.filter(c => c.teacherId === user.teacherId).map(c => c.courseId)
      );
      const studentIds = new Set(
        enrollments.filter(e => myCourseIds.has(e.courseId)).map(e => e.studentId)
      );
      list = list.filter(s => studentIds.has(s.studentId));
    }
    setStudents(list);
  };

  // Sorting handlers
  const handleRequestSort = prop => {
    const isAsc = orderBy === prop && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(prop);
  };
  const sortedStudents = stableSort(students, getComparator(order, orderBy));

  // Expand/collapse and fetch fresh
  const handleRowClick = async s => {
    const id = s.studentId;
    const opening = openRow !== id;
    if (opening) {
      try {
        const { data: fresh } = await api.get(`/students/${id}`);
        setStudents(prev =>
          prev.map(st => (st.studentId === id ? { ...st, ...fresh } : st))
        );
        setSelectedStudent({ ...s, ...fresh });
      } catch {
        setSelectedStudent(s);
      }
    } else {
      setSelectedStudent(null);
    }
    setOpenRow(opening ? id : null);
  };

  // Add student
  const handleAddOpen = () => {
    setFormStudent(studentTemplate);
    setOpenAdd(true);
  };
  const handleAddClose = () => setOpenAdd(false);
  const handleAddSave = async () => {
    try {
      await api.post("/students", formStudent);
      await refreshStudents();
      setOpenAdd(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Edit student & parents
  const handleEditOpen = () => {
    if (!selectedStudent) return;
    setFormStudent({
      firstName: selectedStudent.firstName,
      lastName: selectedStudent.lastName,
      dob: selectedStudent.dob,
      email: selectedStudent.email,
      address: selectedStudent.address,
      city: selectedStudent.city,
      state: selectedStudent.state,
      zip: selectedStudent.zip,
      phoneNumber: selectedStudent.phoneNumber,
      gradeLevelId: selectedStudent.gradeLevelId,
      studentNotes: selectedStudent.studentNotes || ""
    });
    const seed = {};
    parentLinks
      .filter(pl => pl.studentId === selectedStudent.studentId)
      .forEach(pl => {
        const p = parents.find(x => x.parentId === pl.parentId) || {};
        seed[p.parentId] = {
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          email: p.email || "",
          phoneNumber: p.phoneNumber || "",
          address: p.address || "",
          city: p.city || "",
          state: p.state || "",
          zip: p.zip || ""
        };
      });
    setFormParents(seed);
    setOpenEdit(true);
  };
  const handleEditClose = () => setOpenEdit(false);

  const handleEditSave = async () => {
    try {
      // 1) Update the student record
      await api.put(
        `/students/${selectedStudent.studentId}`,
        formStudent
      );
  
      // 2) Update each linked parent
      const links = parentLinks.filter(
        pl => pl.studentId === selectedStudent.studentId
      );
      await Promise.all(
        links.map(pl => {
          const parentPayload = formParents[pl.parentId];
          // you might want to log to verify:
          console.log("Updating parent", pl.parentId, parentPayload);
          return api.put(`/parents/${pl.parentId}`, parentPayload);
        })
      );
  
      // 3) Re-load everything so the UI reflects the changes
      await Promise.all([
        refreshStudents(),                       // reloads your students table
        api.get("/parents").then(r => setParents(r.data)),
        api.get("/parent_student").then(r => setParentLinks(r.data))
      ]);
  
      // 4) Finally, close the dialog
      setOpenEdit(false);
    } catch (err) {
      console.error("Error saving edits:", err);
      // optionally show a toast or alert here
    }
  };

  // Delete student
  const handleDelete = async () => {
    try {
      await api.delete(`/students/${selectedStudent.studentId}`);
      setDeleteConfirm(false);
      setSelectedStudent(null);
      await refreshStudents();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box sx={{ bgcolor: scheme.mainBg, color: scheme.text, p: 3 }}>
      {/* Top bar */}
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          disabled={user?.role !== "admin"}
          onClick={handleAddOpen}
        >
          Add Student
        </Button>
        <Button
          variant="contained"
          startIcon={<Edit />}
          disabled={user?.role !== "admin" || !selectedStudent}
          onClick={handleEditOpen}
        >
          Edit Student & Parents
        </Button>
        <Button
          variant="contained"
          startIcon={<Delete />}
          disabled={user?.role !== "admin" || !selectedStudent}
          onClick={() => setDeleteConfirm(true)}
        >
          Delete Student
        </Button>
      </Box>

      {/* Students table */}
      <TableContainer component={Paper} sx={{ backgroundColor: scheme.panelBg }}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "studentId",
                "firstName",
                "lastName",
                "gradeLevelId",
                "studentGpa"
              ].map((f, i) => (
                <TableCell
                  key={f}
                  sx={{ color: scheme.text }}
                  sortDirection={orderBy === f ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === f}
                    direction={orderBy === f ? order : "asc"}
                    onClick={() => handleRequestSort(f)}
                  >
                    {["ID", "First Name", "Last Name", "Grade Level", "GPA"][i]}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStudents.map(s => {
              const linkedPL = parentLinks.filter(
                pl => pl.studentId === s.studentId
              );
              const studentEnrollments = enrollments.filter(
                e => e.studentId === s.studentId
              );

              return (
                <React.Fragment key={s.studentId}>
                  <TableRow
                    hover
                    onClick={() => handleRowClick(s)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{s.studentId}</TableCell>
                    <TableCell>{s.firstName}</TableCell>
                    <TableCell>{s.lastName}</TableCell>
                    <TableCell>{s.gradeLevelId}</TableCell>
                    <TableCell>
                      {!isNaN(s.studentGpa)
                        ? parseFloat(s.studentGpa).toFixed(2)
                        : ""}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0 }}>
                      <Collapse
                        in={openRow === s.studentId}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ display: "flex", m: 2, gap: 4 }}>
                          {/* LEFT COLUMN */}
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle1">
                              <b>Student Contact</b>
                            </Typography>
                            <Box sx={{ mb: 2, backgroundColor: scheme.mainBg }}>
                            <Typography>
                              <b>DOB:</b> {new Date(s.dob).toLocaleDateString()}
                            </Typography>
                            <Typography>
                              <b>Email:</b> {s.email}
                            </Typography>
                            <Typography>
                              <b>Address:</b> {s.address}, {s.city}, {s.state}{" "}
                              {s.zip}
                            </Typography>
                            <Typography>
                              <b>Phone:</b> {s.phoneNumber}
                            </Typography>
                            </Box>

                            <Typography variant="subtitle1" sx={{ mt: 3 }}>
                              <b>Parent Contact</b>
                            </Typography>
                            {linkedPL.map(pl => {
                              const p =
                                parents.find(x => x.parentId === pl.parentId) ||
                                {};
                              return (
                                <Box key={pl.parentId} sx={{ mb: 2, backgroundColor: scheme.mainBg }}>
                                  <Typography>
                                    <b>Name:</b> {p.firstName} {p.lastName}
                                  </Typography>
                                  <Typography>
                                    <b>Email:</b> {p.email}
                                  </Typography>
                                  <Typography>
                                    <b>Phone:</b> {p.phoneNumber}
                                  </Typography>
                                  <Typography>
                                    <b>Address:</b> {p.address}, {p.city},{" "}
                                    {p.state} {p.zip}
                                  </Typography>
                                </Box>
                              );
                            })}

                            {/* Student Notes moved under Parent */}
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="subtitle1">
                                <b>Student Notes</b>
                              </Typography>
                              <Typography>{s.studentNotes || "—"}</Typography>
                            </Box>
                          </Box>

                          {/* RIGHT COLUMN */}
                          <Box sx={{ flex: 1 }}>
                            {studentEnrollments.length > 0 && (
                              <>
                                <Typography
                                  variant="subtitle1"
                                  sx={{ mb: 1 }}
                                >
                                  <b>Enrolled Courses</b>
                                </Typography>
                                <Table size="small" sx={{ backgroundColor: scheme.mainBg }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell>
                                        <b>Course</b>
                                      </TableCell>
                                      <TableCell>
                                        <b>Teacher</b>
                                      </TableCell>
                                      <TableCell>
                                        <b>Grade</b>
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {studentEnrollments.map(e => {
                                      const course =
                                        coursesList.find(
                                          c => c.courseId === e.courseId
                                        ) || {};
                                      const teacher =
                                        teachers.find(
                                          t =>
                                            t.teacherId ===
                                            course.teacherId
                                        ) || {};
                                      const cg =
                                        courseGrades.find(
                                          cg =>
                                            cg.studentId === s.studentId &&
                                            cg.courseId === e.courseId
                                        ) || {};
                                      return (
                                        <TableRow key={e.courseId}>
                                          <TableCell>
                                            {course.courseName}
                                          </TableCell>
                                          <TableCell>
                                            {teacher.firstName}{" "}
                                            {teacher.lastName}
                                          </TableCell>
                                          <TableCell>
                                            {cg.courseGrade} ({cg.courseAvg}
                                            %)
                                          </TableCell>
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

      {/* Delete confirmation */}
      <Dialog
        open={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Delete this student?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={openAdd} onClose={handleAddClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Student</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.keys(studentTemplate).map(key => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={key}
                  type={key === "dob" ? "date" : "text"}
                  value={formStudent[key]}
                  onChange={e =>
                    setFormStudent(f => ({ ...f, [key]: e.target.value }))
                  }
                  fullWidth
                  InputLabelProps={
                    key === "dob" ? { shrink: true } : undefined
                  }
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddClose}>Cancel</Button>
          <Button onClick={handleAddSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Student & Parents Dialog */}
      <Dialog open={openEdit} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Student & Parent Info</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
            <b>Student Details</b>
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(studentTemplate).map(key => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  label={key}
                  type={key === "dob" ? "date" : "text"}
                  value={formStudent[key]}
                  onChange={e =>
                    setFormStudent(f => ({ ...f, [key]: e.target.value }))
                  }
                  fullWidth
                  InputLabelProps={
                    key === "dob" ? { shrink: true } : undefined
                  }
                />
              </Grid>
            ))}
          </Grid>

          <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
            <b>Parent Contact(s)</b>
          </Typography>
          {selectedStudent &&
            parentLinks
              .filter(pl => pl.studentId === selectedStudent.studentId)
              .map(pl => {
                const pId = pl.parentId;
                const pData = formParents[pId] || {};
                return (
                  <Box
                    key={pId}
                    sx={{ border: 1, borderColor: "divider", p: 2, mb: 2 }}
                  >
                    <Typography variant="subtitle2">
                      Parent ID: {pId}
                    </Typography>
                    <Grid container spacing={2}>
                      {[
                        "firstName",
                        "lastName",
                        "email",
                        "phoneNumber",
                        "address",
                        "city",
                        "state",
                        "zip"
                      ].map(field => (
                        <Grid item xs={12} sm={6} key={field}>
                          <TextField
                            label={field}
                            value={pData[field] || ""}
                            onChange={e =>
                              setFormParents(fp => ({
                                ...fp,
                                [pId]: { ...fp[pId], [field]: e.target.value }
                              }))
                            }
                            fullWidth
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                );
              })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSave}>Save All</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
