import React, { useState } from "react";
import { Typography, Paper, Tabs, Tab, Box } from "@mui/material";
import Grid from '@mui/material/Grid2';
import StudentGradesDataGrid from '../components/StudentGradesDataGrid';
import CourseGradesDataGrid from '../components/CourseGradesDataGrid';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`gradebook-tabpanel-${index}`}
      aria-labelledby={`gradebook-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `gradebook-tab-${index}`,
    'aria-controls': `gradebook-tabpanel-${index}`,
  };
}

export default function StudentGradebook() {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Paper elevation={3} style={{ padding: "20px" }}>
      <Typography variant="h4" align="center">Grade Book</Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Welcome to the Student Grade Book Page.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Gradebook Tabs" centered>
          <Tab label="Course Grades" {...a11yProps(0)} />
          <Tab label="Assignment Grades" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={tabIndex} index={0}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <CourseGradesDataGrid />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <StudentGradesDataGrid />
          </Grid>
        </Grid>
      </TabPanel>
    </Paper>
  );
}
