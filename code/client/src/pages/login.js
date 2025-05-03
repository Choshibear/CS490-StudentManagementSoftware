import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button
} from "@mui/material";
import { ThemeContext } from "../ThemeContext";

function Login() {
  const { scheme } = useContext(ThemeContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  
  // Redirect to home if already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage(`Welcome, ${data.user.firstName}!`);
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Server error");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: scheme.mainBg,
        color: scheme.text
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 360,
          textAlign: "center",
          borderRadius: 2,
          backgroundColor: scheme.panelBg,
          color: scheme.text
        }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: 80, marginBottom: 20 }}
        />

        <Typography variant="h5" sx={{ mb: 2, color: scheme.text }}>
          Login to Your Account
        </Typography>

        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
          sx={{
            backgroundColor: scheme.mainBg,
            input: { color: scheme.text },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: scheme.text }
          }}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          sx={{
            backgroundColor: scheme.mainBg,
            input: { color: scheme.text },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: scheme.text }
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{
            mt: 2,
            backgroundColor: scheme.accent,
            color: scheme.text,
            '&:hover': { backgroundColor: scheme.text, color: scheme.accent }
          }}
        >
          Login
        </Button>

        {message && (
          <Typography
            variant="body1"
            sx={{ mt: 2, color: message.includes("Welcome") ? "green" : "red" }}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default Login;
