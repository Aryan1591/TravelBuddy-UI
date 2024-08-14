import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TravelBuddyLogo from '../travel_buddy_logo.png';

const NavigationBar = ({ username, onCreatePost }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box
          component="img"
          src={TravelBuddyLogo}
          alt="Travel Buddy Logo"
          sx={{ height: 50, marginRight: 2 }}
        />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Travel Buddy
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCreatePost}
          sx={{ marginRight: 2 }}
        >
          Create Post
        </Button>
        <Typography variant="body1" sx={{ marginRight: 2 }}>
          {username}
        </Typography>
        <Avatar
          alt={username}
          src={`https://api.adorable.io/avatars/40/${username}.png`}
          sx={{ ml: 2 }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
