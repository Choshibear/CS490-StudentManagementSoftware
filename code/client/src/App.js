import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/home";
import Coursework from "./pages/coursework";
import Gradebook from "./pages/gradebook";
import StudentRecord from "./pages/studentrecord";
import Login from "./pages/login";

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/coursework" element={<Coursework />} />
                    <Route path="/gradebook" element={<Gradebook />} />
                    <Route path="/studentrecord" element={<StudentRecord />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
