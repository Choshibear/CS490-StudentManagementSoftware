import React, { useState } from "react";
import { Typography, Paper, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/students/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.student)); 
                setMessage(`Welcome, ${data.student.firstName}!`);
                setTimeout(() => {
                    navigate("/"); // Redirect to Home after 1 second
                }, 1000);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('Server error');
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f5f5f5" }}>
            <Paper elevation={6} style={{ padding: "30px", width: "400px", textAlign: "center", borderRadius: "20px" }}>
                <img src="/logo.png" alt="Logo" style={{ width: "80px", marginBottom: "20px" }} />
                
                <Typography variant="h5" style={{ marginBottom: "20px" }}>
                    Login to Your Account
                </Typography>

                <TextField 
                    fullWidth 
                    label="Username" 
                    variant="outlined" 
                    margin="normal" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField 
                    fullWidth 
                    label="Password" 
                    type="password" 
                    variant="outlined" 
                    margin="normal" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    style={{ marginTop: "20px" }}
                    onClick={handleLogin}
                >
                    Login
                </Button>

                {message && (
                    <Typography variant="body1" style={{ marginTop: "20px", color: message.includes("Welcome") ? "green" : "red" }}>
                        {message}
                    </Typography>
                )}
            </Paper>
        </div>
    );
}

export default Login;
