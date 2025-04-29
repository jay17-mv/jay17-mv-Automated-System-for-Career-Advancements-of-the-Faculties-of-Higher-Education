import React from "react";
import { useNavigate } from "react-router-dom";
import DisplaySubmissions from "../DisplaySubmissions";

const FacultySubmission = () => {
  const navigate = useNavigate();
  return(
  <div className="container">
    <h2>Faculty Submission</h2>
    <DisplaySubmissions />
    
  </div>
  
);
};

export default FacultySubmission;
