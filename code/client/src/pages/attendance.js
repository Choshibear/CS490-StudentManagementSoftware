import React, { useState } from "react";
import {
  Typography,
  Paper,
  Tabs,
  Tab,
  Box
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import AttendanceComponent from "../components/attendanceComponent";

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`attendance-tabpanel-${index}`}
      aria-labelledby={`attendance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `attendance-tab-${index}`,
    "aria-controls": `attendance-tabpanel-${index}`
  };
}

export default function AttendancePage() {
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (_e, val) => setTabIndex(val);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" align="center">
        Daily Attendance
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Select a course and date below to take or view attendance.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 2 }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          aria-label="Attendance Tabs"
          centered
        >
          <Tab label="Take Attendance" {...a11yProps(0)} />
          <Tab label="View Attendance" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={tabIndex} index={0}>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <AttendanceComponent mode="take" />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Grid container justifyContent="center">
          <Grid item xs={12}>
            <AttendanceComponent mode="view" />
          </Grid>
        </Grid>
      </TabPanel>
    </Paper>
  );
}
