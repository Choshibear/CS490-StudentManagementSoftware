import React from "react";
import { Typography, Paper } from "@mui/material";
import Grid from '@mui/material/Grid2';
import UserManagementComponent from "../components/UserManagementComponent";

function UserManagement() {
    return (
        <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h4">User Management</Typography>
            <Typography variant="body1">Welcome to the User Management Page.</Typography>

            <Grid container spacing={2} style={{ marginTop: "20px", justifyContent: "center" }}>
                <Grid item xs={12}>
                    <UserManagementComponent/>
                </Grid>
            </Grid>

        </Paper>
    );
}

export default UserManagement;