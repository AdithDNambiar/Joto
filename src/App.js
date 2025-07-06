import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import PostTask from "./PostTask";
import TakeTasks from "./TakeTasks";
import Chat from "./Chat";
import takeImg from "./pictures/take.png";
import postImg from "./pictures/post.png";
import "./App.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="header">
        <img src="/jotologo.jpg" alt="JOTO Logo" className="logo" />
        <h1 className="title">JOTO</h1>
      </div>
      <p className="tagline">Get it done. The JOTO way</p>
      <div className="button-container">
        <div className="task-box" onClick={() => navigate("/take")}>
          <img src={takeImg} alt="Take Tasks" className="task-img" />
          <button className="task-btn">TAKE TASKS</button>
        </div>
        <div className="task-box" onClick={() => navigate("/post")}>
          <img src={postImg} alt="Post Tasks" className="task-img" />
          <button className="task-btn">POST TASKS</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post" element={<PostTask />} />
        <Route path="/take" element={<TakeTasks />} />
        <Route path="/chat/:taskId/:role" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
