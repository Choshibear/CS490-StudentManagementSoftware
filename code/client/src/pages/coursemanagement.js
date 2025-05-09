import React from "react";
import { Typography, Paper } from "@mui/material";
import Grid from '@mui/material/Grid';
import CourseManagementComponent from "../components/courseManagementComponent";

function CourseManagement() {
    return (
        <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h4">Course Management</Typography>
            <Typography variant="body1">Manage school courses and enrollments</Typography>

            <Grid container spacing={2} style={{ marginTop: "20px", justifyContent: "center" }}>
                <Grid item xs={12}>
                    <CourseManagementComponent/>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default CourseManagement;