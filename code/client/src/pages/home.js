import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { ThemeContext } from "../ThemeContext";

function Home() {
  const { scheme } = useContext(ThemeContext);
  const [user, setUser] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
    <Box
      sx={{
        bgcolor: scheme.mainBg,
        color: scheme.text,
        minHeight: "100vh",
        p: 3
      }}
    >
      {/* Welcome Card */}
      <Paper
        elevation={3}
        sx={{
          backgroundColor: scheme.accent,
          color: scheme.panelBg,
          p: 4,
          borderRadius: 2
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="text.secondary">
          Welcome to the {user?.role?.toUpperCase()} page, {user?.firstName} {user?.lastName}!
        </Typography>
      </Paper>

      {/* Info Cards */}
      <Grid container spacing={3} mt={3}>
        {/* Events */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: scheme.panelBg,
              color: scheme.text
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="bold">Upcoming Events</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body2" fontWeight="bold">
                APR 17 – Parent-Teacher Conference
              </Typography>
              <Typography variant="body2" color="text.secondary">
                3:00 PM - 7:00 PM
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Announcements */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: scheme.panelBg,
              color: scheme.text
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="bold">School Announcements</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body2" fontWeight="bold">
                Early Dismissal Next Friday
              </Typography>
              <Typography variant="caption" color="text.secondary">
                By Principal Williams • Apr 14, 2025
              </Typography>
              <Typography variant="body2" mt={1}>
                Students will be dismissed at 12:30 PM next Friday for teacher professional development.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Assignments Due */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: scheme.panelBg,
              color: scheme.text
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography fontWeight="bold">Assignments Due</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="body2" fontWeight="bold">
                Math Worksheet: Fractions
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Due Today
              </Typography>
              <Box
                mt={0.5}
                px={1}
                py={0.2}
                display="inline-block"
                bgcolor={scheme.accent}
                color={scheme.panelBg}
                fontSize="0.75rem"
                borderRadius={1}
              >
                Needs Grading
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
