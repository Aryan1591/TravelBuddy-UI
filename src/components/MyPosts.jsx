// src/MyPosts.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import TripCard from "./Post/TripCard"; // Ensure TripCard is imported
import axios from "axios";

const MyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [postIds, setPostIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = sessionStorage.getItem("username");
  const dataFake = [
    "66b73fb2ad1c5a179ae10da2",
    "66b73fc8ad1c5a179ae10da3",
    "66b7136630b72d0973e14053",
    "66b73f81ad1c5a179ae10da1",
  ];

  const postsPerPage = 2; // Number of posts per page

  useEffect(() => {
    // Initialize post IDs and total pages
    const initializePosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8092/userPosts/getPostIdsOfUser/${username}`
        );

        const ids = response.data;
        console.log("ids are "+ids);
        console.log(ids);
        setPostIds(ids);
        setTotalPages(Math.ceil(ids.length / postsPerPage));
        fetchPostsForPage(currentPage, ids);
      } catch (error) {
        console.error("Error initializing post IDs:", error);
        setError("Error initializing post IDs.");
      }
    };

    initializePosts();
  }, []);

  useEffect(() => {
    if (postIds.length > 0) {
      // Fetch posts whenever the current page changes
      fetchPostsForPage(currentPage, postIds);
    }
  }, [currentPage, postIds]);

  const fetchPostsForPage = async (page, ids) => {
    setLoading(true);
    setError(null); // Reset error state

    try {
      const indexOfLastPost = page * postsPerPage;
      const indexOfFirstPost = indexOfLastPost - postsPerPage;
      const currentPostIds = ids.slice(indexOfFirstPost, indexOfLastPost);

      // Fetch post details from the API
      const postDetails = await Promise.all(
        currentPostIds.map((id) =>
          axios.get(`http://localhost:8093/post/${id}`)
        )
      );

      setPosts(postDetails.map((res) => res.data));
    } catch (error) {
      console.error("Error fetching post details:", error);
      setError("Error fetching post details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        p: 3,
      }}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <TripCard key={post.id} data={post} />
          ))}
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="contained"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <Typography variant="body1">
              Page {currentPage} of {totalPages}
            </Typography>
            <Button
              variant="contained"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </Box>
        </>
      ) : (
        <Typography>No posts available</Typography>
      )}
    </Box>
  );
};

export default MyPosts;
