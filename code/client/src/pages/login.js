import React from "react";
import { Typography, Paper } from "@mui/material";

function Login() {
    return (
        <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h4">Login</Typography>
            <Typography variant="body1">Welcome to the Login Page.</Typography>
        </Paper>
    );
}

export default Login;