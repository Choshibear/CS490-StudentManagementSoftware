import React, { useState, useEffect, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Drawer
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GradeIcon from "@mui/icons-material/Grade";
import PersonIcon from "@mui/icons-material/Person";
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import MailIcon from "@mui/icons-material/Mail";

import { ThemeContext } from "../ThemeContext";

const drawerWidth = 150;

const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Coursework", icon: <MenuBookIcon />, path: "/coursework" },
  { text: "Gradebook", icon: <GradeIcon />, path: "/gradebook" },
  { text: "Student Record", icon: <PersonIcon />, path: "/studentrecord" },
  { text: "Attendance", icon: <EventAvailableIcon />, path: "/attendance" },
  { text: "Inbox", icon: <MailIcon />, path: "/inbox" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" }
];

function Layout({ children }) {
  const { scheme } = useContext(ThemeContext);
  const [profileImage] = useState("/logo.png");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user info (fallback to localStorage)
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
        localStorage.removeItem("user");
        navigate("/login");
    }
};

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Themed Top Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: "100%",
          bgcolor: scheme.accent || scheme.mainBg,
          color: scheme.text,
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo */}
          <IconButton component={Link} to="/" edge="start" color="inherit" sx={{ mr: 2 }}>
            <img src={profileImage} alt="Logo" style={{ width: "100px" }} />
          </IconButton>

          {/* Center Banner */}
          <Typography
            variant="h4"
            component="div"
            sx={{ position: "fixed", left: "50%", transform: "translateX(-50%)" }}
          >
            Elementary School Management System
          </Typography>

          {/* Notifications & Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
            <IconButton component={Link} to="/inbox" color="inherit">
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton component={Link} to="/settings">
              <Avatar src={profileImage} alt="Profile" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Themed Sidebar Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: scheme.panelBg,
            color: scheme.text
          }
        }}
      >
        <Toolbar />
        <Box component="main" sx={{ overflow: "auto" }}>
          <Toolbar sx={{ display: "flex", flexDirection: "column", alignItems: "center" }} />
          <List>
            {menuItems.map(({ text, icon, path }) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  to={path}
                  sx={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50px",
                    p: 1,
                    bgcolor: scheme.panelBg,
                    "&:hover": { bgcolor: scheme.mainBg }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, color: "inherit" }}>{icon}</ListItemIcon>
                  <ListItemText
                    primary={text}
                    primaryTypographyProps={{ color: "inherit" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            {/* Login/Logout */}
            <ListItem disablePadding sx={{ display: "block" }}>
                
                <ListItemButton onClick={handleLogout} 
                  sx={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50px",
                    p: 1,
                    bgcolor: scheme.panelBg,
                    "&:hover": { bgcolor: scheme.mainBg }
                  }}>
                  <ListItemIcon sx={{ minWidth: 0, color: "inherit" }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" primaryTypographyProps={{ color: "inherit" }} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content (Themed) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: scheme.mainBg,
          color: scheme.text,
          minHeight: "100vh"
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
