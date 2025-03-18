import React, { useState } from "react";
import { AppBar, Toolbar, Typography, CssBaseline, Box, IconButton, Paper, List, ListItem, ListItemButton, ListItemIcon,ListItemText, Avatar, Badge } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GradeIcon from "@mui/icons-material/Grade";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import MailIcon from "@mui/icons-material/Mail";

const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Coursework", icon: <MenuBookIcon />, path: "/coursework" },
    { text: "Gradebook", icon: <GradeIcon />, path: "/gradebook" },
    { text: "Student Record", icon: <PersonIcon />, path: "/studentrecord" },
    { text: "Inbox", icon: <MailIcon />, path: "/inbox" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
    { text: "Login", icon: <LoginIcon />, path: "/login" }
];

function Layout({ children }) {
    //Default banner and profile images
    const [profileImage] = useState("/logo.png");

    return (
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <CssBaseline />

            {/* Top Bar */}
            <AppBar position="fixed" sx={{ width: "100%", bgcolor: "primary.main" }}>
                <Toolbar sx ={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    
                    {/* Logo */}
                    <IconButton component ={Link} to="/" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <img src={profileImage} alt="Logo" style={{ width: "100px" }} />
                    </IconButton>

                    {/* Banner*/}
                    <Typography variant="h4" component="div" sx={{ position: "fixed", left: "50%", transform: "translateX(-50%)"}}>
                        Elementary School Management System
                    </Typography>
                    
                    {/* Notification and Profile */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <IconButton component={Link} to="/inbox" color="inherit">
                            <Badge badgeContent={3} color="error"> {/* Replace 3 with the actual number of notifications for badgeContent*/}
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>

                        <IconButton component={Link} to="/settings">
                            <Avatar src={profileImage} alt="Profile" />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            
            {/* Left Navigation Rail */}
            <Paper
                sx={{
                    position: "fixed",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: "32px",
                    boxShadow: 5
                }}
                elevation={3}
            >
                <List>
                    {menuItems.map(({ text, icon, path }) => (
                        <ListItem key={text} disablePadding sx ={{ 
                                                                display: "block", 
                                                                flexDirection: "column", 
                                                                alignItems: "center",
                                                            }}>
                            <ListItemButton component={Link} to={path} sx={{ flexDirection: "column", 
                                                                            alignItems: "center", 
                                                                            justifyContent: "center", 
                                                                            borderRadius: "50px",
                                                                            p: 1
                                                                        }}>
                                <ListItemIcon sx={{ minWidth: 0 }}>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Paper>
            
            {/* Page Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: 5 }}>
                {children}
            </Box>
        </Box>
    );
}

export default Layout;
