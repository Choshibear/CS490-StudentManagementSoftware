import React from "react";
import { Typography, Paper, TextField, Button } from "@mui/material";

function Login() {
    return (
        <div style={{ 
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "#f8fbff", /* Very light blue */
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: 30,
            padding: 0,
            overflow: "hidden"
        }}>
            <Paper elevation={3} style={{ 
                padding: "30px", width: "350px", textAlign: "center", borderRadius: "10px",
                backgroundColor: "white"
            }}>
                <img src="/logo.png" alt="Logo" style={{ width: "80px", marginBottom: "15px" }} />


                <TextField 
                    fullWidth 
                    label="Email" 
                    variant="outlined" 
                    margin="normal" 
                    InputProps={{ style: { borderRadius: "10px" } }}
                />

                <TextField 
                    fullWidth 
                    label="Password" 
                    type="password" 
                    variant="outlined" 
                    margin="normal" 
                    InputProps={{ style: { borderRadius: "10px" } }}
                />

                <Typography variant="body2" style={{ marginTop: "5px", color: "#1976d2", cursor: "pointer" }}>
                    Forgot Password?
                </Typography>

                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    style={{ marginTop: "15px", borderRadius: "10px", padding: "10px" }}>
                    LOGIN
                </Button>
            </Paper>
        </div>
    );
}

export default Login;
