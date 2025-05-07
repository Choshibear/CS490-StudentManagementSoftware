import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/home"; 
import StudentCoursework from "./pages/studentcoursework";
import Coursework from "./pages/coursework";
import Gradebook from "./pages/gradebook";
import StudentGradebook from "./pages/studentgradebook";
import StudentRecord from "./pages/studentrecord";
import Attendance from "./pages/attendance";
import Login from "./pages/login";
import Settings from "./pages/settings";
import Inbox from "./pages/inbox";
import UserManagement from "./pages/usermanagement";
import ProtectedRoute from "./ProtectedRoute";
import UnauthorizedPage from "./pages/unauthorized";

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
  
          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<Layout />}>
              <Route path="/usermanagement" element={<UserManagement />} />
            </Route>
          </Route>
  
          <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher',  'parent', 'student']} />}>
            <Route element={<Layout />}>
              <Route path="/coursework" element={<Coursework />} />
            </Route>
          </Route>
  
          <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'parent']} />}>
            <Route element={<Layout />}>
              <Route path="/studentrecord" element={<StudentRecord />} />
              <Route path="/attendance" element={<Attendance />} />
              
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'parent', 'student']} />}>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/gradebook" element={<Gradebook />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'parent', 'student']} />}>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/studentcoursework" element={<StudentCoursework />} />
              <Route path="/studentgradebook" element={<StudentGradebook />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

        </Routes>
      </Router>
    );
}
export default App;
