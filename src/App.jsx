import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/HomePage";
import Post from "./components/Post";
import ChatRoom from "./components/ChatRoom";
import ProtectedRoute from "./components/Security/ProtectedRoute"; // Ensure correct path

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/home" element={<ProtectedRoute element={<Home />} />} />

        <Route
          path="/post/:id"
          element={<ProtectedRoute element={<Post />} />}
        />

        <Route
          path="/chat/:postId"
          element={<ProtectedRoute element={<ChatRoom />} />}
        />

        {/* Optionally, handle 404 or catch-all routes */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
