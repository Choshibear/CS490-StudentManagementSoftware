import React from "react";
import { Typography, Paper } from "@mui/material";


//https://mui.com/material-ui/react-image-list/#title-bar-below-image-standard 
// student image splash idea
function Home() {
    return (
        <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
            <Typography variant="h4">Welcome to the Menu</Typography>
            <Typography variant="body1" style={{ marginTop: "10px" }}>
                Select a page from the navigation bar.
            </Typography>
        </Paper>
    );
}

export default Home;