import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Modal,
  TextField,
  Button,
  MenuItem,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemeContext } from "../ThemeContext";
import axios from "axios";

function Home() {
  const { scheme } = useContext(ThemeContext);
  const [user, setUser] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [gradeLevel, setGradeLevel] = useState("all");

  const fetchAnnouncements = () => {
    axios
      .get("http://localhost:5000/api/announcements", {
        params: {
          gradeLevelId:
            "gradeLevelId" in user && user.gradeLevelId !== null
              ? user.gradeLevelId
              : null,
          role: user.role,
          userId: user.parentId || user.teacherId || user.adminId || user.studentId
        }
      })
      .then((res) => setAnnouncements(res.data))
      .catch((err) => console.error("Error fetching announcements", err));
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchAnnouncements();
  }, [user]);

  const handlePost = () => {
    if (!title || !content) return;

    axios
      .post("http://localhost:5000/api/announcements", {
        title,
        content,
        gradeLevelId: gradeLevel === "all" ? null : Number(gradeLevel),
        author: `${user.firstName} ${user.lastName}`,
        date: new Date().toLocaleDateString("en-CA")
      })
      .then(() => {
        fetchAnnouncements();
        setOpen(false);
        setTitle("");
        setContent("");
        setGradeLevel("all");
      })
      .catch((err) => {
        console.error("Failed to post announcement", err);
        alert("Failed to post announcement");
      });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this announcement?");
    if (!confirmDelete) return;
  
    axios
      .delete(`http://localhost:5000/api/announcements/${id}`)
      .then(() => fetchAnnouncements())
      .catch((err) => {
        console.error("Failed to delete announcement", err);
        alert("Failed to delete announcement");
      });
  };
  
  return (
    <Box sx={{ bgcolor: scheme.mainBg, color: scheme.text, minHeight: "100vh", p: 3 }}>
      <Paper elevation={3} sx={{ backgroundColor: scheme.accent, color: scheme.panelBg, p: 4, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="text.secondary">
          Welcome to the {user?.role?.toUpperCase()} page, {user?.firstName} {user?.lastName}!
        </Typography>
      </Paper>

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: scheme.panelBg, color: scheme.text }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="bold">Upcoming Events</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body2" fontWeight="bold">APR 17 – Parent-Teacher Conference</Typography>
              <Typography variant="body2" color="text.secondary">3:00 PM - 7:00 PM</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: scheme.panelBg, color: scheme.text }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="bold">School Announcements</Typography>
              {user?.role === "admin" && (
                <Box>
                  <Typography
                    component="span"
                    onClick={() => setOpen(true)}
                    sx={{ fontSize: "1.5rem", color: "#2196f3", cursor: "pointer", mr: 1 }}
                  >
                    +
                  </Typography>
                </Box>
              )}
            </Box>
            <Box mt={2}>
              {announcements.length === 0 ? (
                <Typography variant="body2">No announcements yet.</Typography>
              ) : (
                announcements.map((a) => (
                  <Box key={a.id} mb={2} position="relative">
                    <Typography variant="body2" fontWeight="bold">{a.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      By {a.author} • {new Date(a.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" mt={1}>{a.content}</Typography>
                    {user?.role === "admin" && (
                      <IconButton
                        onClick={() => handleDelete(a.id)}
                        sx={{ position: "absolute", top: 0, right: 0 }}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, borderRadius: 2, bgcolor: scheme.panelBg, color: scheme.text }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="bold">Assignments Due</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body2" fontWeight="bold">Math Worksheet: Fractions</Typography>
              <Typography variant="caption" color="text.secondary">Due Today</Typography>
              <Box mt={0.5} px={1} py={0.2} display="inline-block" bgcolor={scheme.accent} color={scheme.panelBg} fontSize="0.75rem" borderRadius={1}>
                Needs Grading
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "#fff", p: 4, borderRadius: 1, width: 400 }}>
          <Typography variant="h6" mb={2}>Create New Announcement</Typography>
          <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Content" multiline minRows={3} value={content} onChange={(e) => setContent(e.target.value)} sx={{ mb: 2 }} />
          <TextField select fullWidth label="Target Grade" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} sx={{ mb: 2 }}>
            <MenuItem value="all">All Grades</MenuItem>
            {[1, 2, 3, 4, 5, 6, 7].map((g) => (
              <MenuItem key={g} value={g}>Grade {g}</MenuItem>
            ))}
          </TextField>
          <Box display="flex" justifyContent="space-between">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handlePost} variant="contained">Post Announcement</Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Home;
