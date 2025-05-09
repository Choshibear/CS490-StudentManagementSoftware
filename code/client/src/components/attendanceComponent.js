// src/components/attendanceComponent.js
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Button
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import emailjs from "@emailjs/browser";

const api = axios.create({ baseURL: "http://localhost:5000/api" });

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}



export default function AttendanceComponent({ mode }) {
  // State & Refs
  const [user, setUser]                     = useState(null);
  const [courses, setCourses]               = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate]     = useState("");
  const [attendance, setAttendance]         = useState([]);
  const [students, setStudents]             = useState([]);
  const [parentLinks, setParentLinks]       = useState([]);
  const [parents, setParents]               = useState([]);
  const [loading, setLoading]               = useState(false);

  const [isEditing, setIsEditing]           = useState(false);
  const originalRef                         = useRef([]);
  const [rows, setRows]                     = useState([]);

  // 1) Load EmailJS once
  useEffect(() => {
    emailjs.init("BcM6k3-K6n9WgAEdN");
  }, []);

  // 2) Load current user
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []);

  // 3) Load courses filtered by role
  useEffect(() => {
    if (!user) return;
    api.get("/courses")
      .then(res => {
        let list = res.data;
        if (user.role === "teacher") {
          list = list.filter(c => c.teacherId === user.teacherId);
        }
        setCourses(list);
      })
      .catch(console.error);
  }, [user]);

  // 4) Load parent⇄student and parent info
  useEffect(() => {
    api.get("/parent_student").then(res => setParentLinks(res.data)).catch(console.error);
    api.get("/parents").then(res => setParents(res.data)).catch(console.error);
  }, []);

  // Helper: map studentId → parentEmail
  const studentToParentEmail = React.useMemo(() => {
    const m = {};
    parentLinks.forEach(link => {
      const p = parents.find(x => x.parentId === link.parentId);
      if (p) m[link.studentId] = p.email;
    });
    return m;
  }, [parentLinks, parents]);

  // 5) Load enrollments + attendance when course/date change
  useEffect(() => {
    if (!selectedCourse || !selectedDate) {
      setAttendance([]);
      return;
    }
    setLoading(true);
    (async () => {
      try {
        const { data: allEnroll }   = await api.get("/enrollments");
        const enrolls               = allEnroll.filter(e => e.courseId === selectedCourse);
        const { data: allStudents } = await api.get("/students");
        setStudents(allStudents);

        const { data: attRes } = await api.get("/attendance", {
          params: { courseId: selectedCourse, date: selectedDate }
        });

        const combined = enrolls.map(e => {
          const ex = attRes.find(a => a.studentId === e.studentId);
          return ex || {
            attendanceId:   null,
            studentId:      e.studentId,
            courseId:       selectedCourse,
            attendanceDate: selectedDate,
            status:         "Present",
            remarks:        ""
          };
        });
        setAttendance(combined);
        if (mode === "view") originalRef.current = combined.map(r => ({ ...r }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [mode, selectedCourse, selectedDate]);

  // 6) Build DataGrid rows
  useEffect(() => {
    setRows(
      attendance.map(r => {
        const s = students.find(x => x.studentId === r.studentId) || {};
        return {
          id:          r.attendanceId,
          studentName: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
          status:      r.status,
          remarks:     r.remarks
        };
      })
    );
  }, [attendance, students]);

  // --- TAKE MODE Handlers ---
  const updateField = (key, field, value) => {
    setAttendance(at =>
      at.map(r =>
        (r.attendanceId === key || (r.attendanceId == null && r.studentId === key))
          ? { ...r, [field]: value }
          : r
      )
    );
  };

  const handleSaveTake = async () => {
    if (!selectedCourse || !selectedDate) return;
    setLoading(true);
    try {
      // create placeholders
      await api.post(`/attendance/${selectedCourse}/${selectedDate}`);
      // re-fetch real rows
      const { data: newRes } = await api.get("/attendance", {
        params: { courseId: selectedCourse, date: selectedDate }
      });
      // persist statuses/remarks
      await Promise.all(
        newRes.map(row => {
          const local = attendance.find(r => r.studentId === row.studentId);
          return api.put(`/attendance/${row.attendanceId}`, {
            status:  local?.status  ?? row.status,
            remarks: local?.remarks ?? row.remarks
          });
        })
      );

      // send emails to absentees
      let sentCount = 0;
for (const r of attendance) {
  if (r.status === "Absent") {
    const pEmail = studentToParentEmail[r.studentId];
    if (!pEmail) {
      console.warn(`No parent email found for student ${r.studentId}`);
      continue;
    }
    const stud = students.find(s => s.studentId === r.studentId) || {};
    const name = `${stud.firstName} ${stud.lastName}`.trim();
    const cName = courses.find(c => c.courseId === selectedCourse)?.courseName || "Unknown Course";

    try {
      const resp = await emailjs.send(
        "service_4rqd0ij",       // your Service ID
        "template_3zy6ewa",      // your Template ID
        {
          to_email: pEmail,
          from_name: "School Attendance System",
          reply_email: 'noreply@school.com',
          subject: `Absence Notice for ${name}`,
          student_name: name,
          course_name:     cName,
          attendance_date: selectedDate,          
        },
        "BcM6k3-K6n9WgAEdN"      // your User ID (public key)
      );
      console.log("EmailJS response:", resp);
      sentCount++;
    } catch (err) {
      console.error("EmailJS error sending to", pEmail, err);
    }
  }
}

alert(
  `Attendance saved!\n\n` +
  (sentCount
    ? `Sent ${sentCount} absence notice${sentCount>1?'s':''}.`
    : `No absences to notify.`)
);
    } catch (err) {
      console.error(err);
      alert("Error saving attendance.");
    } finally {
      setLoading(false);
    }
  };

  // --- VIEW MODE Handlers ---
  const startEdit        = () => setIsEditing(true);
  const cancelEdit       = () => {
    setAttendance(originalRef.current);
    setIsEditing(false);
  };
  const saveView         = async () => {
    setLoading(true);
    try {
      await Promise.all(
        attendance.map(r =>
          api.put(`/attendance/${r.attendanceId}`, {
            status:  r.status,
            remarks: r.remarks
          })
        )
      );
      setIsEditing(false);
      alert("Changes saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving changes.");
    } finally {
      setLoading(false);
    }
  };
  const processRowUpdate = newRow => {
    setAttendance(at =>
      at.map(r =>
        r.attendanceId === newRow.id
          ? { ...r, status: newRow.status, remarks: newRow.remarks }
          : r
      )
    );
    return newRow;
  };

  const selectedCourseName =
  courses.find(c => c.courseId === selectedCourse)?.courseName || "—";

  // --- RENDER ---
  return (
    <Box>
      {/* Toolbar */}
      <Box sx={toolbarStyles}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Course</InputLabel>
          <Select
            value={selectedCourse}
            label="Course"
            onChange={e => setSelectedCourse(e.target.value)}
          >
            <MenuItem value=""><em>— Select Course —</em></MenuItem>
            {courses.map(c => (
              <MenuItem key={c.courseId} value={c.courseId}>
                {c.courseName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Date"
          type="date"
          size="small"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {/* Take Mode */}
      {mode === "take" && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
          {formatDate(selectedDate)} &nbsp;|&nbsp; {selectedCourseName}
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance.map(r => {
                  const s   = students.find(st => st.studentId === r.studentId) || {};
                  const name = s.firstName
                    ? `${s.firstName} ${s.lastName}`
                    : r.studentId;
                  return (
                    <TableRow key={r.studentId}>
                      <TableCell>{name}</TableCell>
                      <TableCell>
                        <FormControl fullWidth size="small">
                          <Select
                            value={r.status}
                            onChange={e =>
                              updateField(r.studentId, "status", e.target.value)
                            }
                          >
                            <MenuItem value="Present">Present</MenuItem>
                            <MenuItem value="Absent">Absent</MenuItem>
                            <MenuItem value="Tardy">Tardy</MenuItem>
                            <MenuItem value="Excused">Excused</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          value={r.remarks}
                          onChange={e =>
                            updateField(r.studentId, "remarks", e.target.value)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button
              variant="contained"
              onClick={handleSaveTake}
              disabled={!selectedDate || loading}
            >
              Save Attendance
            </Button>
          </Box>
        </Box>
      )}

      {/* View Mode */}
      {mode === "view" && (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              mb: 1,
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <Typography variant="h6">
            Viewing: {formatDate(selectedDate)} &nbsp;|&nbsp; {selectedCourseName}
            </Typography>
            {isEditing ? (
              <>
                <Button onClick={cancelEdit} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  onClick={saveView}
                  variant="contained"
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={startEdit} variant="contained">
                Edit
              </Button>
            )}
          </Box>

          <Box sx={{ height: 600, ...containerStyles }}>
            <DataGrid
              rows={rows.filter(r => r.id != null)}
              columns={[
                { field: "studentName", headerName: "Student", width: 200 },
                {
                  field: "status",
                  headerName: "Status",
                  width: 140,
                  editable: isEditing,
                  type: "singleSelect",
                  valueOptions: ["Present", "Absent", "Tardy", "Excused"]
                },
                {
                  field: "remarks",
                  headerName: "Remarks",
                  width: 200,
                  editable: isEditing
                }
              ]}
              editMode="row"
              processRowUpdate={processRowUpdate}
              onProcessRowUpdateError={console.error}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 }
                }
              }}
              pageSizeOptions={[10, 30, 50, 100]}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

const toolbarStyles = {
  display: "flex",
  alignItems: "center",
  gap: 2,
  padding: "12px 16px",
  backgroundColor: "#f5f5f5",
};

const containerStyles = {
  width: '100%',
  '& .actions': { color: 'text.secondary' },
  '& .textPrimary': { color: 'text.primary' },
};
