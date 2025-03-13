import React from "react";
import { Typography, Paper } from "@mui/material";

function StudentRecord() {
    return (
        <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h4">Student Record</Typography>
            <Typography variant="body1">Welcome to the Student Record Page.</Typography>
        </Paper>
    );
}

export default StudentRecord;