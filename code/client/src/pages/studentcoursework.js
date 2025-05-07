import React from "react";
import { Typography, Paper } from "@mui/material";
import Grid from '@mui/material/Grid2';
import StudentAssignmentDataGrid from '../components/StudentAssignmentDataGrid';


function StudentCoursework() { 
    return (
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Typography variant="h4">Coursework</Typography>
        <Typography variant="body1">Welcome to the Student Coursework Page.</Typography>      
  
        <Grid
          container
          spacing={2}
          style={{ marginTop: "20px", justifyContent: "center" }}
        >
          <Grid item xs={12}>
            <StudentAssignmentDataGrid />
          </Grid>
        </Grid>
      </Paper>
    );
  }

export default StudentCoursework;
