import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";

const OnlineUserList = ({ roomId }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const username = "Avishekh";

  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        const response = await axios.get(
          `http://travelbuddy-chat-service-production.up.railway.app/onlineUsers/${roomId}`
        );
        setOnlineUsers(response.data);
      } catch (error) {
        console.error("Error fetching online users:", error);
      }
    };

    const addUserToRoom = async () => {
      try {
        await axios.post(
          `http://travelbuddy-chat-service-production.up.railway.app/onlineUsers/${roomId}/addUser`,
          username
        );
        fetchOnlineUsers();
      } catch (error) {
        console.error("Error adding user to room:", error);
      }
    };

    const removeUserFromRoom = async () => {
      try {
        await axios.delete(
          `http://travelbuddy-chat-service-production.up.railway.app/onlineUsers/${roomId}/removeUser`,
          username
        );
      } catch (error) {
        console.error("Error removing user from room:", error);
      }
    };

    addUserToRoom();

    window.addEventListener("beforeunload", removeUserFromRoom);

    return () => {
      removeUserFromRoom();
      window.removeEventListener("beforeunload", removeUserFromRoom);
    };
  }, [roomId, username]);

  return (
    <Box
      sx={{
        height: "100vh",
        width: "18vw",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#2e3b55",
        color: "#fff",
      }}
    >
      {}
      <Typography
        variant="h6"
        component="h2"
        sx={{ textAlign: "center", padding: "1rem" }}
      >
        Active Users
      </Typography>
      <Box
        sx={{
          height: "calc(100% - 4rem)",
          overflowY: "scroll",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <List>
          {onlineUsers.map((user, index) => (
            <ListItem
              key={index}
              style={{ maxHeight: "100%", overflow: "auto" }}
            >
              <ListItemAvatar>
                <Avatar style={{ backgroundColor: "#3f51b5" }}>
                  {user.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={user}
                primaryTypographyProps={{
                  style: { color: "#fff", fontSize: "1.2em" },
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default OnlineUserList;
