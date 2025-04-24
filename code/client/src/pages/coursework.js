import React from "react";
import { Typography, Paper } from "@mui/material";
import Grid from '@mui/material/Grid2';
import AssignmentDataGrid from '../components/assignmentDataGrid';


export default function Coursework() { 
    return (
      <Paper
        elevation={3}
        style={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          alignItems: "stretch", // stretch children to fill width
          width: "100%",
          height: "100%", // allow Paper to grow with content
          boxSizing: "border-box"
        }}
      >
        <Typography variant="h4">Coursework</Typography>
        <Typography variant="body1">Welcome to the Coursework Page.</Typography>      
  
        <Grid
          container
          spacing={2}
          style={{ marginTop: "20px" }}
        >
          <Grid item xs={12}>
            <AssignmentDataGrid />
          </Grid>
        </Grid>
      </Paper>
    );
  }




//export default Coursework;
