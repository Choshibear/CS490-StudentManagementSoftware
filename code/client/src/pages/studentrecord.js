import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Collapse, Typography, Box, Paper, TextField, Button, Avatar, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, Upload, Add, Edit, Delete } from "@mui/icons-material";

const initialStudents = [
  {
    id: 1, firstName: "John", lastName: "Doe", grade: "5th", city: "New York", state: "NY",
    address: "123 Elm St", emergencyContact: "Jane Doe (Mother) - 123-456-7890",
    image: "/profile1.jpg", schedule: "Math, Science, English"
  },
  {
    id: 2, firstName: "Alice", lastName: "Smith", grade: "6th", city: "Los Angeles", state: "CA",
    address: "456 Oak St", emergencyContact: "Bob Smith (Father) - 987-654-3210",
    image: "/profile2.jpg", schedule: "History, Math, Art"
  },
];

function CollapsibleTable() {
  const [students, setStudents] = useState(initialStudents);
  const [openRow, setOpenRow] = useState(null);
  const [view, setView] = useState("table");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleEdit = () => {
    setView("form");
  };

  const handleDelete = () => {
    setStudents(students.filter(student => student.id !== selectedStudent.id));
    setDeleteConfirm(false);
    setSelectedStudent(null);
  };

  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setOpenRow(openRow === student.id ? null : student.id);
  };

  const handleSave = (studentData) => {
    if (selectedStudent) {
      setStudents(students.map(student => student.id === selectedStudent.id ? { ...student, ...studentData } : student));
    } else {
      setStudents([...students, { id: students.length + 1, ...studentData }]);
    }
    setView("table");
    setSelectedStudent(null);
  };

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button onClick={() => { setView("form"); setSelectedStudent(null); }} variant="contained">
          <Add sx={{ mr: 1 }} /> Add
        </Button>
        <Button onClick={handleEdit} variant="contained" disabled={!selectedStudent}>
          <Edit sx={{ mr: 1 }} /> Edit
        </Button>
        <Button onClick={() => setDeleteConfirm(true)} variant="contained" disabled={!selectedStudent}>
          <Delete sx={{ mr: 1 }} /> Delete
        </Button>
      </Box>
      {view === "table" ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}> ID </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}> First Name </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}> Last Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}> Grade </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}> City </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}> State </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <React.Fragment key={student.id}>
                  <TableRow onClick={() => handleRowClick(student)} sx={{ cursor: "pointer" }}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell>{student.lastName}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.city}</TableCell>
                    <TableCell>{student.state}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={openRow === student.id} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                          <Typography variant="h6">Details</Typography>
                          <Avatar src={student.image} sx={{ width: 80, height: 80, mb: 1 }} />
                          <Typography><b>Address:</b> {student.address}</Typography>
                          <Typography><b>Emergency Contact:</b> {student.emergencyContact}</Typography>
                          <Typography><b>Schedule:</b> {student.schedule}</Typography>
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
        <Paper sx={{ p: 3, maxWidth: 600, margin: "auto" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>{selectedStudent ? "Edit Student" : "Add New Student"}</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField label="First Name" defaultValue={selectedStudent?.firstName || ""} fullWidth />
            <TextField label="Last Name" defaultValue={selectedStudent?.lastName || ""} fullWidth />
            <TextField label="Grade" defaultValue={selectedStudent?.grade || ""} fullWidth />
            <TextField label="City" defaultValue={selectedStudent?.city || ""} fullWidth />
            <TextField label="State" defaultValue={selectedStudent?.state || ""} fullWidth />
            <TextField label="Address" defaultValue={selectedStudent?.address || ""} fullWidth />
            <TextField label="Emergency Contact" defaultValue={selectedStudent?.emergencyContact || ""} fullWidth sx={{ gridColumn: "span 2" }} />
            <Button component="label" variant="contained" sx={{ gridColumn: "span 2" }}>
              <Upload sx={{ mr: 1 }} /> Upload Image
              <input type="file" hidden accept="image/*" />
            </Button>
          </Box>
          <Button onClick={() => handleSave({})} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Save</Button>
        </Paper>
      )}

      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this student?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CollapsibleTable;
