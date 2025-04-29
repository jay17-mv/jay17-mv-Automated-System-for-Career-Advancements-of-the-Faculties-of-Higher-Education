import React from "react";
import { Link } from "react-router-dom";
import "../../index.css";

const Home = () => {
  return(
  <div className="container home">
    <h1>Welcome to Faculty Appraisal System</h1>
    <p>This platform helps manage faculty performance submissions and administrative reviews efficiently.</p>
    <div className="home-buttons">
      <Link to="/login"><button>Login</button></Link>
    </div>
  </div>
  );
};

export default Home;
