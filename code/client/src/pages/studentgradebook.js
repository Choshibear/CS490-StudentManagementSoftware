import React from "react";
import { Typography, Paper } from "@mui/material";
import Grid from '@mui/material/Grid2';
import StudentGradesDataGrid from '../components/StudentGradesDataGrid';

function StudentGradebook() {
    return (
        <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h4">Grade Book</Typography>
            <Typography variant="body1">Welcome to the Student Grade Book Page.</Typography>

            <Grid container spacing={2} style={{ marginTop: "20px", justifyContent: "center" }}>
                <Grid item xs={12}>
                    <StudentGradesDataGrid />
                </Grid>
            </Grid>

        </Paper>
    );
}

export default StudentGradebook;