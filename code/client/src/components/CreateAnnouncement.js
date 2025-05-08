import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper
} from "@mui/material";
import axios from "axios";

const gradeLevels = [
    { id: null, name: "All Grades" },
    { id: 1, name: "1st" },
    { id: 2, name: "2nd" },
    { id: 3, name: "3rd" },
    { id: 4, name: "4th" },
    { id: 5, name: "5th" },
    { id: 6, name: "6th" },
    { id: 7, name: "7th" }
  ];  

function CreateAnnouncement() {
const [form, setForm] = useState({
  title: "",
  content: "",
  author: "",
  date: new Date().toISOString().split("T")[0],
  gradeLevelId: null
});

useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setForm((prev) => ({
        ...prev,
        author: `${userData.firstName} ${userData.lastName}`
      }));
    }
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "gradeLevelId" ? (value === "null" ? null : Number(value)) : value
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/announcements", form);
      alert("Announcement created!");
      setForm({
        title: "",
        content: "",
        author: "",
        date: new Date().toISOString().split("T")[0],
        gradeLevelId: null
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create announcement");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 600, margin: "auto", mt: 4 }}>
      <Typography variant="h6" mb={2}>
        Create New Announcement
      </Typography>
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Content"
        name="content"
        value={form.content}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        select
        fullWidth
        label="Target Grade"
        name="gradeLevelId"
        value={form.gradeLevelId ?? "null"}
        onChange={handleChange}
        margin="normal"
      >
        {gradeLevels.map((g) => (
          <MenuItem key={g.id} value={g.id ?? "null"}>
            {g.name}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Post Announcement
      </Button>
    </Paper>
  );
}

export default CreateAnnouncement;
