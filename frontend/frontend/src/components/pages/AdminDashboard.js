import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSubmission from "../AdminSubmission";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  return(
  <div className="container">
    <h2>Admin Dashboard</h2>
    <AdminSubmission />
  </div>
);
};

export default AdminSubmission;
