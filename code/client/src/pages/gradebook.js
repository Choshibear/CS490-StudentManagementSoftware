import React from "react";
import { Typography, Paper } from "@mui/material";

function Gradebook() {
    return (
        <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h4">Grade Book</Typography>
            <Typography variant="body1">Welcome to the Grade Book Page.</Typography>
        </Paper>
    );
}

export default Gradebook;