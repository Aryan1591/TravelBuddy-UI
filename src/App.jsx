import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Common/Login";
import Signup from "./components/Common/Signup";
import Home from "./components/Common/HomePage";
import Post from "./components/Post/Post";
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
