import React from "react";
import FacultyForm from "../FacultyForm";
import { useNavigate } from "react-router-dom";

const FacultyDashboard = () => {
  const navigate = useNavigate();
  return(
  <div className="container">
    <h2>Faculty Dashboard</h2>
    <button onClick={() => navigate("/faculty/submissions")}>
        View My Submissions
      </button>
    <FacultyForm />
  </div>
);
};

export default FacultyDashboard;
