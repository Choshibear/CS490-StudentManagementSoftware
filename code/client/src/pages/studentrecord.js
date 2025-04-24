import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import { Upload, Add, Edit, Delete } from "@mui/icons-material";
import { ThemeContext } from "../ThemeContext";

// Sample student data
const initialStudents = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    grade: "5th",
    city: "New York",
    state: "NY",
    address: "123 Elm St",
    emergencyContact: "Jane Doe (Mother) - 123-456-7890",
    image: "profile1.jpg",
    schedule: "Math, Science, English"
  },
  {
    id: 2,
    firstName: "Alice",
    lastName: "Smith",
    grade: "6th",
    city: "Los Angeles",
    state: "CA",
    address: "456 Oak St",
    emergencyContact: "Bob Smith (Father) - 987-654-3210",
    image: "profile2.jpg",
    schedule: "History, Math, Art"
  }
];

function StudentRecord() {
  const { scheme } = useContext(ThemeContext);
  const [students, setStudents] = useState(initialStudents);
  const [openRow, setOpenRow] = useState(null);
  const [view, setView] = useState("table");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [nextId, setNextId] = useState(initialStudents.length + 1);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    grade: "",
    city: "",
    state: "",
    address: "",
    emergencyContact: "",
    image: ""
  });

  const handleEdit = () => {
    if (selectedStudent) {
      setView("form");
      setFormData({ ...selectedStudent });
    }
  };

  const handleDelete = () => {
    setStudents(students.filter(s => s.id !== selectedStudent.id));
    setDeleteConfirm(false);
    setSelectedStudent(null);
  };

  const handleRowClick = student => {
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null);
      setOpenRow(null);
    } else {
      setSelectedStudent(student);
      setOpenRow(student.id);
    }
  };

  const handleSave = () => {
    let errors = {};
    Object.keys(formData).forEach(key => {
      if (key !== "image" && !formData[key]) {
        errors[key] = "This field is required";
      }
    });
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    if (selectedStudent) {
      setStudents(
        students.map(s => (s.id === selectedStudent.id ? { ...s, ...formData } : s))
      );
    } else {
      const newStudent = { id: nextId, ...formData };
      setStudents([...students, newStudent]);
      setNextId(nextId + 1);
    }

    setView("table");
    setSelectedStudent(null);
    setOpenRow(null);
    setFormData({
      firstName: "",
      lastName: "",
      grade: "",
      city: "",
      state: "",
      address: "",
      emergencyContact: "",
      image: ""
    });
  };

  const handleCancel = () => {
    setView("table");
    setSelectedStudent(null);
    setOpenRow(null);
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: scheme.mainBg,
        color: scheme.text,
        minHeight: "100vh",
        p: 3
      }}
    >
      {view === "table" && (
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Button
            onClick={() => { setView("form"); setSelectedStudent(null); }}
            variant="contained"
            sx={{
              backgroundColor: scheme.accent,
              color: scheme.text,
              '&:hover': { backgroundColor: scheme.text, color: scheme.accent }
            }}
          >
            <Add sx={{ mr: 1 }} /> Add
          </Button>
          <Button
            onClick={handleEdit}
            variant="contained"
            disabled={!selectedStudent}
            sx={{
              backgroundColor: scheme.accent,
              color: scheme.text,
              '&:hover': { backgroundColor: scheme.text, color: scheme.accent }
            }}
          >
            <Edit sx={{ mr: 1 }} /> Edit
          </Button>
          <Button
            onClick={() => setDeleteConfirm(true)}
            variant="contained"
            disabled={!selectedStudent}
            sx={{
              backgroundColor: scheme.accent,
              color: scheme.text,
              '&:hover': { backgroundColor: scheme.text, color: scheme.accent }
            }}
          >
            <Delete sx={{ mr: 1 }} /> Delete
          </Button>
        </Box>
      )}

      {view === "table" ? (
        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: scheme.panelBg,
            color: scheme.text,
            boxShadow: 5
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: scheme.panelBg }}>
                {['ID','First Name','Last Name','Grade','City','State'].map(head => (
                  <TableCell key={head} sx={{ fontWeight: 'bold', color: scheme.text }}>
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map(student => (
                <React.Fragment key={student.id}>
                  <TableRow
                    onClick={() => handleRowClick(student)}
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: openRow === student.id ? scheme.accent : 'inherit',
                      '&:hover': { backgroundColor: scheme.panelBg }
                    }}
                  >
                    <TableCell sx={{ color: scheme.text }}>{student.id}</TableCell>
                    <TableCell sx={{ color: scheme.text }}>{student.firstName}</TableCell>
                    <TableCell sx={{ color: scheme.text }}>{student.lastName}</TableCell>
                    <TableCell sx={{ color: scheme.text }}>{student.grade}</TableCell>
                    <TableCell sx={{ color: scheme.text }}>{student.city}</TableCell>
                    <TableCell sx={{ color: scheme.text }}>{student.state}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse in={openRow === student.id} timeout="auto" unmountOnExit>
                        <Box sx={{ m: 2 }}>
                          <Typography variant="h6" sx={{ color: scheme.text }}>Details</Typography>
                          <Avatar src={student.image} sx={{ width: 80, height: 80, mb: 1 }} />
                          <Typography sx={{ color: scheme.text }}><b>Address:</b> {student.address}</Typography>
                          <Typography sx={{ color: scheme.text }}><b>Emergency:</b> {student.emergencyContact}</Typography>
                          <Typography sx={{ color: scheme.text }}><b>Schedule:</b> {student.schedule}</Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper
          sx={{
            p: 3,
            maxWidth: 600,
            mx: 'auto',
            backgroundColor: scheme.panelBg,
            color: scheme.text
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, color: scheme.text }}>
            {selectedStudent ? 'Edit Student' : 'Add New Student'}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {['firstName','lastName','grade','city','state','address','emergencyContact'].map(field => (
              <TextField
                key={field}
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                value={formData[field]}
                onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                fullWidth
                error={!!formErrors[field]}
                helperText={formErrors[field]}
                sx={{ backgroundColor: scheme.mainBg }}
              />
            ))}

            <Button
              component="label"
              variant="contained"
              sx={{
                gridColumn: 'span 2',
                backgroundColor: scheme.accent,
                color: scheme.text,
                '&:hover': { backgroundColor: scheme.text, color: scheme.accent }
              }}
            >
              <Upload sx={{ mr: 1 }} /> Upload Image
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {formData.image && (
              <Avatar src={formData.image} sx={{ width: 100, height: 100, gridColumn: 'span 2' }} />
            )}
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              onClick={handleSave}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: scheme.accent,
                color: scheme.text,
                '&:hover': { backgroundColor: scheme.text, color: scheme.accent }
              }}
            >Save</Button>
            <Button
              onClick={handleCancel}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: scheme.mainBg,
                color: scheme.text,
                '&:hover': { backgroundColor: scheme.panelBg }
              }}
            >Cancel</Button>
          </Box>
        </Paper>
      )}

      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle sx={{ color: scheme.text }}>Confirm Delete</DialogTitle>
        <DialogContent sx={{ color: scheme.text }}>
          <Typography sx={{ color: scheme.text }}>Are you sure you want to delete this student?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)} sx={{ color: scheme.text }}>Cancel</Button>
          <Button onClick={handleDelete} sx={{ color: scheme.accent }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default StudentRecord;
