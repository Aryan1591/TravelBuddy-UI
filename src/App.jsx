import React from "react";
import ChatRoom from "./components/ChatRoom";
import "./App.css";
import Post from "./components/Post";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Post />} />
          <Route path="/chat/:postId" element={<ChatRoom />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
