import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const FetchMessages = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://travelbuddy-chat-service-production.up.railway.app/messages/${roomId}`);
        setMessages(response.data);
      } catch (error) {
        setError('Failed to fetch messages.');
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [roomId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '80vw',
        backgroundColor: '#f5f5f5',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <List>
        {messages.map((message, index) => (
          <ListItem key={index}>
            <Typography variant="body1">
              {message.username}: {message.content}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FetchMessages;