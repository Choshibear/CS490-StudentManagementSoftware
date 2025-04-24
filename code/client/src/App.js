import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/home";
import Coursework from "./pages/coursework";
import Gradebook from "./pages/gradebook";
import StudentRecord from "./pages/studentrecord";
import Attendance from "./pages/attendance";
import Login from "./pages/login";
import Settings from "./pages/settings";
import Inbox from "./pages/inbox";

function App() {
    return (
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/coursework" element={<Coursework />} />
                        <Route path="/gradebook" element={<Gradebook />} />
                        <Route path="/studentrecord" element={<StudentRecord />} />
                        <Route path="/attendance" element={<Attendance />} />
                        <Route path="/inbox" element={<Inbox />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </Layout>
            </Router>
    );
}

export default App;