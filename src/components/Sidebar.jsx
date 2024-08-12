// src/Sidebar.jsx
import React from "react";
import { Box, Button } from "@mui/material";

const Sidebar = ({ onToggleHome, onToggleMyPosts }) => {
  return (
    <Box
      width="20%"
      bgcolor="background.paper"
      p={2}
      boxShadow={3}
      display="flex"
      flexDirection="column"
    >
      <Button onClick={onToggleHome} sx={{ mb: 2 }} variant="contained">
        Home
      </Button>
      <Button onClick={onToggleMyPosts} sx={{ mb: 2 }} variant="contained">
        My Posts
      </Button>
    </Box>
  );
};

export default Sidebar;
