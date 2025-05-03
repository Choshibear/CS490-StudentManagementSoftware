import React from "react";
import { Typography, Paper } from "@mui/material";
import Grid from '@mui/material/Grid2';
import AssignmentDataGrid from '../components/assignmentDataGrid';


function Coursework() { 
    return (
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Typography variant="h4">Coursework</Typography>
        <Typography variant="body1">Welcome to the Coursework Page.</Typography>      
  
        <Grid
          container
          spacing={2}
          style={{ marginTop: "20px", justifyContent: "center" }}
        >
          <Grid item xs={12}>
            <AssignmentDataGrid />
          </Grid>
        </Grid>
      </Paper>
    );
  }

export default Coursework;
