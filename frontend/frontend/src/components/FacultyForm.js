import React, { useState } from "react";
import axios from "axios";

const FacultyForm = () => {
  const [form, setForm] = useState({ name: "", publications: "", events: "", seminars: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await axios.post("http://localhost:5000/api/faculty", form, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    alert("Submitted");
  };

  return (
    <div className="container">
      <h2>Faculty Appraisal Form</h2>
      <input name="name" placeholder="Name" onChange={handleChange} /><br />
      <textarea name="publications" placeholder="Publications" onChange={handleChange} /><br />
      <textarea name="events" placeholder="Events" onChange={handleChange} /><br />
      <textarea name="seminars" placeholder="Seminars" onChange={handleChange} /><br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default FacultyForm;