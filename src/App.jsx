import React from "react";
import ChatRoom from "./components/ChatRoom";
import "./App.css";
import Post from "./components/Post";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  const postId = 'e6542efc-88ce-4a3f-a2e5-75eebe9b4e22'
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
