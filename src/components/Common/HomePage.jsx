// src/HomePage.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Modal } from "@mui/material";
import NavigationBar from "./NavigationBar";
import Sidebar from "./Sidebar";
import MyPosts from "../MyPosts";
import RightSidebar from "./RightSidebar";
import AboutMe from "../User/AboutMe";
import ChangePassword from "../User/ChangePassword";
import CreatePost from "../Post/CreatePost";
import Home from "./Home"; // Import the Home component
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = sessionStorage.getItem("username");

  const [showAboutMe, setShowAboutMe] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [showHome, setShowHome] = useState(true); // Track whether to show Home
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handleToggleHome = () => {
    setShowAboutMe(false);
    setShowChangePassword(false);
    setShowMyPosts(false);
    setShowHome(true); // Show Home
  };

  const handleToggleMyPosts = () => {
    setShowAboutMe(false);
    setShowChangePassword(false);
    setShowMyPosts(true); // Show MyPosts
    setShowHome(false); // Hide Home
  };

  const handleToggleAboutMe = () => {
    setShowAboutMe(true);
    setShowChangePassword(false);
    setShowMyPosts(false); // Hide MyPosts
    setShowHome(false); // Hide Home
  };

  const handleChangePasswordClick = () => {
    setShowAboutMe(false);
    setShowChangePassword(true);
    setShowMyPosts(false); // Hide MyPosts
    setShowHome(false); // Hide Home
  };

  const handleCreatePostOpen = () => {
    setIsCreatePostOpen(true);
  };

  const handleCreatePostClose = () => {
    setIsCreatePostOpen(false);
  };

  const handleNewPost = async (newPosts) => {
    // Optionally update the post IDs or refetch them
    // This can be handled within MyPosts instead
    console.log("new post has been received");
    console.log(newPosts);
    try {
      const response = await axios.post(
        "https://travelbuddy-posts-service-production.up.railway.app/post/createPost",
        newPosts
      );
      console.log(response.data);
      console.log(response);
    } catch (e) {
      console.log(e);
    }
  };

  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavigationBar username={username} onCreatePost={handleCreatePostOpen} />
      <Box display="flex" flex={1}>
        <Sidebar
          onToggleHome={handleToggleHome}
          onToggleMyPosts={handleToggleMyPosts} // Updated to handle MyPosts
        />
        {showHome ? (
          <Home />
        ) : showChangePassword ? (
          <ChangePassword username={username} />
        ) : showAboutMe ? (
          <AboutMe username={username} />
        ) : showMyPosts ? (
          <MyPosts username={username} /> // Updated to show MyPosts
        ) : (
          <Box>Welcome to the Home Page!</Box> // Default view for Home
        )}
        <RightSidebar
          logout={logout}
          handleAboutMeClick={handleToggleAboutMe}
          handleChangePasswordClick={handleChangePasswordClick}
        />
      </Box>
      <Modal
        open={isCreatePostOpen}
        onClose={handleCreatePostClose}
        aria-labelledby="create-post-modal"
        aria-describedby="create-a-new-post"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <CreatePost
            onClose={handleCreatePostClose}
            onNewPost={handleNewPost}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default HomePage;
