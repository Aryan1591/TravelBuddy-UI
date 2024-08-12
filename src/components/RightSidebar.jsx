import React from 'react';
import { Box, Button } from '@mui/material';

const RightSidebar = ({ logout, handleAboutMeClick, handleChangePasswordClick }) => {
  const handleAboutMe = () => {
    console.log("About Me button clicked");
    handleAboutMeClick();
  };

  return (
    <Box
      width="15%"  // Decreased width from 20% to 15%
      bgcolor="background.paper"
      p={2}
      boxShadow={3}
      display="flex"
      flexDirection="column"
    >
      <Box mb={2}>
        <Button
          variant="contained"
          sx={{
            width: '100%',  // Full width of the container
            height: '40px', // Adjusted height proportionally
          }}
          onClick={handleAboutMe} // Call the function to handle About Me click
        >
          About Me
        </Button>
      </Box>
      <Box mb={2}>
        <Button
          variant="contained"
          sx={{
            width: '100%',  // Full width of the container
            height: '40px', // Adjusted height proportionally
          }}
          onClick={handleChangePasswordClick} // Call the function to handle Change Password click
        >
          Change Password
        </Button>
      </Box>
      <Button
        variant="contained"
        sx={{
          width: '100%',  // Full width of the container
          height: '40px', // Adjusted height proportionally
        }}
        onClick={logout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default RightSidebar;
