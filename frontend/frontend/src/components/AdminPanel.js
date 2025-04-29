import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);  // Track loading state

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/faculty", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setData(res.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
      alert("Error fetching data");
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadPDF = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/pdf/${id}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Faculty_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      {loading ? (
        <p>Loading...</p>  // Show loading text while fetching data
      ) : (
        data.length > 0 ? (
          data.map((entry) => (
            <div key={entry.id}>
              <p><strong>{entry.name}</strong></p>
              <p>{entry.publications}</p>
              <button onClick={() => downloadPDF(entry.id)}>Download PDF</button>
            </div>
          ))
        ) : (
          <p>No faculty data available</p>  // Show if no data exists
        )
      )}
    </div>
  );
};

export default AdminPanel;
