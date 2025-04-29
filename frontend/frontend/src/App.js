import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/pages/Home";
import FacultyDashboard from "./components/pages/FacultyDashboard";
import AdminDashboard from "./components/pages/AdminDashboard";
import FacultySubmission from "./components/pages/FacultySubmission";


function App() {
  return (
    <Router>
      <Routes>
      <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/faculty" element={<FacultyDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/faculty/submissions" element={<FacultySubmission />} />
        
      </Routes>
    </Router>
  );
}

export default App;
