const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();  

// Set the port for the server to listen on
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable cross origin resource sharing

// Enable JSON body parsing
app.use(express.json());

//default route, displays a message if the server is running
app.get("/", (req, res) => {
    res.send("Server is running!");
});

//start the server, listening on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
