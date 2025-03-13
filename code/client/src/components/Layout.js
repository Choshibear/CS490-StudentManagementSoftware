import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, CssBaseline, Box } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GradeIcon from "@mui/icons-material/Grade";
import PersonIcon from "@mui/icons-material/Person";
import LoginIcon from "@mui/icons-material/Login";

const drawerWidth = 240;

const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Coursework", icon: <MenuBookIcon />, path: "/coursework" },
    { text: "Gradebook", icon: <GradeIcon />, path: "/gradebook" },
    { text: "Student Record", icon: <PersonIcon />, path: "/studentrecord" },
    { text: "Login", icon: <LoginIcon />, path: "/login" }
];

function Layout({ children }) {
    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            {/* Top Bar */}
            <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Student Portal
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
                }}
            >
                <Toolbar />
                <List>
                    {menuItems.map(({ text, icon, path }) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton component={Link} to={path}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Page Content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                {children}
            </Box>
        </Box>
    );
}

export default Layout;
