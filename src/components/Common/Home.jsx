import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import axios from "axios";
import TripCard from "../Post/TripCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const postsPerPage = 3;

  // Fetch total count of posts and the posts for the current page
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch total count of posts
        const countResponse = await axios.get("http://localhost:8093/post/getPostsCount");
        const totalCount = countResponse.data;
        setTotalPages(Math.ceil(totalCount / postsPerPage));

        // Fetch posts for the current page
        const postsResponse = await axios.get("http://localhost:8093/post/allPosts", {
          params: {
            page: currentPage - 1, // Page parameter is 0-based
            size: postsPerPage
          }
        });
        setPosts(postsResponse.data.content); // Adjust according to actual data structure
      } catch (error) {
        setError("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : posts.length ? (
        <>
          {posts.map((post) => (
            <TripCard key={post.id} data={post} />
          ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 3,
              width: "100%",
              maxWidth: 600,
            }}
          >
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

export default Home;
