import React from "react";
import { Typography, Paper } from "@mui/material";

function Settings() {
    return (
        <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h4">Settings</Typography>
            <Typography variant="body1">Welcome to the Settings Page.</Typography>
        </Paper>
    );
}

export default Settings;