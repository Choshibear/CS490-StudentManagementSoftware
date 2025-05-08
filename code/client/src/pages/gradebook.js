import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import GradesDataGrid from "../components/gradesDataGrid";
import FeedbackTable from "../components/FeedbackTable";

export default function Gradebook() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState({
    studentId:   null,
    courseId:    null,
    studentName: ""    // ← now track the name too
  });
  const [courseFeedback, setCourseFeedback] = useState("");
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // grid row click now also hands you the name
  const handleStudentClick = (studentId, courseId, studentName) => {
    setSelected({ studentId, courseId, studentName });
    setOpen(true);
  };

  // when dialog opens, fetch course-level feedback
  useEffect(() => {
    if (!open) return;
    setLoadingFeedback(true);
    axios
      .get(
        `http://localhost:5000/api/coursegrades?studentId=${selected.studentId}&courseId=${selected.courseId}`
      )
      .then((res) => {
        const cg = res.data.find(
          (c) =>
            c.studentId === selected.studentId &&
            c.courseId  === selected.courseId
        );
        setCourseFeedback(cg?.feedback || "");
      })
      .catch(console.error)
      .finally(() => setLoadingFeedback(false));
  }, [open, selected]);

  // send the updated course feedback
  const handleSaveCourseFeedback = async () => {
    try {
      await axios.put("http://localhost:5000/api/coursegrades/feedback", {
        studentId: selected.studentId,
        courseId:  selected.courseId,
        feedback:  courseFeedback
      });
      setOpen(false);
    } catch (err) {
      console.error("Failed to save course feedback:", err);
    }
  };

  return (
    <Paper elevation={3} style={{ padding: 20, textAlign: "center" }}>
      <Typography variant="h4">Grade Book</Typography>
      <Typography variant="body1">Welcome to the Grade Book Page.</Typography>

      <Grid
        container
        spacing={2}
        style={{ marginTop: 20, justifyContent: "center" }}
      >
        <Grid item xs={12}>
          {/* pass the new 3-arg handler */}
          <GradesDataGrid onStudentClick={handleStudentClick} />
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        {/* now shows the student’s name */}
        <DialogTitle>
          Feedback for Student “{selected.studentName}”
        </DialogTitle>

        <DialogContent dividers>
          {/* per-assignment feedback */}
          {selected.studentId && (
            <FeedbackTable
              studentId={selected.studentId}
              courseId={selected.courseId}
            />
          )}

          {/* course-level feedback */}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Course Feedback
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            disabled={loadingFeedback}
            value={courseFeedback}
            onChange={(e) => setCourseFeedback(e.target.value)}
            placeholder="Teacher notes for the overall course…"
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveCourseFeedback}>Save Course Feedback</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
