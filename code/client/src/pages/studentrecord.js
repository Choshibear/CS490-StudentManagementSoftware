import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Collapse, Typography, Box, Paper, TextField, Button, Avatar, Dialog, DialogActions, DialogContent, DialogTitle
} from "@mui/material";
import {Upload, Add, Edit, Delete } from "@mui/icons-material";

// Sample student data
const initialStudents = [
  {
    id: 1, firstName: "John", lastName: "Doe", grade: "5th", city: "New York", state: "NY",
    address: "123 Elm St", emergencyContact: "Jane Doe (Mother) - 123-456-7890",
    image: "profile1.jpg", schedule: "Math, Science, English"
  },
  {
    id: 2, firstName: "Alice", lastName: "Smith", grade: "6th", city: "Los Angeles", state: "CA",
    address: "456 Oak St", emergencyContact: "Bob Smith (Father) - 987-654-3210",
    image: "profile2.jpg", schedule: "History, Math, Art"
  },
];

function StudentRecord() {
  const [students, setStudents] = useState(initialStudents); // State to hold student data
  const [openRow, setOpenRow] = useState(null); // State to track open row
  const [view, setView] = useState("table"); // State to track view
  const [selectedStudent, setSelectedStudent] = useState(null); // State to track selected student
  const [deleteConfirm, setDeleteConfirm] = useState(false); // State to track delete confirmation
  const [nextId, setNextId] = useState(initialStudents.length + 1);// State to hold next ID
  const [formErrors, setFormErrors] = useState({}); // State to hold form errors
  // State to hold form data
  const [formData, setFormData] = useState({ 
    firstName: "",
    lastName: "",
    grade: "",
    city: "",
    state: "",
    address: "",
    emergencyContact: "",
    image: "",
  });

  const handleEdit = () => {
  if (selectedStudent) {
    // Edit existing student
    setView("form");
    setFormData({ ...selectedStudent });
  }
};

  const handleDelete = () => {
    setStudents(students.filter(student => student.id !== selectedStudent.id));
    setDeleteConfirm(false);
    setSelectedStudent(null);
  };

  const handleRowClick = (student) => {
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null);
      setOpenRow(null);
    } else {
      setSelectedStudent(student);
      setOpenRow(student.id);
    }
  };

  const handleSave = () => {
    //Check for empty fields
    let errors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "image" && !formData[key]) {
        errors[key] = "This field is required";
      }
    });

    // If there are errors, update the state and prevent saving
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Clear previous errors
    setFormErrors({});

    if (selectedStudent) {
      // Update existing student
      const updatedStudents = students.map((student) =>
        student.id === selectedStudent.id ? { ...student, ...formData } : student
      );
      setStudents(updatedStudents);

    } else {
      // Add new student with a unique ID
      const newStudent = { id: nextId, ...formData };
      setStudents([...students, newStudent]);
      setNextId(nextId + 1); // Increment the counter for next use
    }
  
    // Reset form & return to table view
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
      image: "",
    });
  };
  

  const handleCancel = () => {
    setView("table");
    setSelectedStudent(null);
    setOpenRow(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    // Main Container
    <Box >
      {view === "table" && (
      <Box sx={{ display: "flex", gap: 5, mb: 2 }}>
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
      )}
      {view === "table" ? (
        // Table View
        <TableContainer component={Paper} sx ={{ boxShadow: 5 }}>
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
                  <TableRow
                    onClick={() => handleRowClick(student)}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: openRow === student.id ? "#ffffb3" : "inherit",
                      '&:hover': { backgroundColor: "#ffffcc" }
                    }}
                  >
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell>{student.lastName}</TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.city}</TableCell>
                    <TableCell>{student.state}</TableCell>
                  </TableRow>
                  {/* Nested Row for Student Details*/}
                  <TableRow > 
                    <TableCell colSpan={6} sx={{ p: 0 }}>
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
        // Form View
        <Paper sx={{ p: 3, maxWidth: 600, margin: "auto" }}>
          <Typography variant="h5" sx={{ mb: 2 }}>{selectedStudent ? "Edit Student" : "Add New Student"}</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              fullWidth
              error={!!formErrors.firstName}
              helperText={formErrors.firstName}
            />

            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              fullWidth
              error={!!formErrors.lastName}
              helperText={formErrors.lastName}
            />

            <TextField
              label="Grade"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              fullWidth
              error={!!formErrors.grade}
              helperText={formErrors.grade}
            />

            <TextField
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              fullWidth
              error={!!formErrors.city}
              helperText={formErrors.city}
            />

            <TextField
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              fullWidth
              error={!!formErrors.state}
              helperText={formErrors.state}
            />

            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
              error={!!formErrors.address}
              helperText={formErrors.address}
            />

            <TextField
              label="Emergency Contact"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              fullWidth
              error={!!formErrors.emergencyContact}
              helperText={formErrors.emergencyContact}
            />
            <Button component="label" variant="contained" sx={{ gridColumn: "span 2" }}>
              <Upload sx={{ mr: 1 }} /> Upload Image
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {formData.image && <Avatar src={formData.image} sx={{ width: 100, height: 100, gridColumn: "span 2" }} />}
          </Box>
          <Button onClick={() => handleSave({})} variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Save</Button>
          <Button onClick={() => handleCancel({})} variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>Cancel</Button>
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
