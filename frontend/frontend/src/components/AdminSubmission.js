import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminSubmission = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubmissions(res.data);
        setFilteredSubmissions(res.data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        alert("Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const handleSearch = () => {
    const filtered = submissions.filter((sub) =>
      sub.name.toLowerCase().includes(searchName.toLowerCase())
    );
    setFilteredSubmissions(filtered);
  };

  const downloadPDF = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/pdf/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const blob = response.data;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `Faculty_${id}.pdf`;
      document.body.appendChild(link); // Fix for Firefox
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to generate PDF.");
    }
  };

  return (
    <div className="container">
      <h2>Submissions</h2>

      <input
        type="text"
        placeholder="Enter name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {loading ? (
        <p>Loading...</p>
      ) : filteredSubmissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Publications</th>
              <th>Events</th>
              <th>Seminars</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.map((submission) => (
              <tr key={submission.id}>
                <td>{submission.id}</td>
                <td>{submission.name}</td>
                <td>{submission.publications}</td>
                <td>{submission.events}</td>
                <td>{submission.seminars}</td>
                <td>
                  <button onClick={() => downloadPDF(submission.id)}>
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminSubmission;

