import React, { useState, useEffect } from "react";
import {
  Box, Typography,
  Table, TableHead, TableRow, TableCell, TableBody,
  TextField, Button
} from "@mui/material";
// existing imports…
import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:5000/api" });

export default function FeedbackTable({ studentId, courseId }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!studentId || !courseId) return;
    api.get(`/assignmentgrades/course/${courseId}`)
       .then(res => {
         setData(res.data.filter(r => r.student_id === studentId));
       })
       .catch(console.error);
  }, [studentId, courseId]);

  // **NEW**: call the feedback endpoint
  const handleSave = async (assignmentId, newFeedback) => {
    // optimistically update UI
    setData(rows =>
      rows.map(r =>
        r.assignmentId === assignmentId
          ? { ...r, feedback: newFeedback }
          : r
      )
    );

    // server call
    await api.put('/assignmentgrades/feedback', {
      studentId,
      courseId,
      assignmentId,
      feedback: newFeedback  // never undefined
    });
  };

  return (
    <Box sx={{ p: 2, backgroundColor: "#fafafa" }}>
      {/* …table head… */}
      <TableBody>
        {data.map(r => (
          <TableRow key={r.assignmentId}>
            <TableCell>{r.assignmentName}</TableCell>
            <TableCell>
              <TextField
                fullWidth
                value={r.feedback ?? ""}
                onChange={e => {
                  const val = e.target.value;
                  setData(rows =>
                    rows.map(x =>
                      x.assignmentId === r.assignmentId
                        ? { ...x, feedback: val }
                        : x
                    )
                  );
                }}
              />
            </TableCell>
            <TableCell>
              <Button
                size="small"
                onClick={() => handleSave(r.assignmentId, r.feedback ?? null)}
              >
                Save
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Box>
  );
}
