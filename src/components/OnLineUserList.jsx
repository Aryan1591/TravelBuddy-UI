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
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";

const OnlineUserList = ({ roomId, username }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  console.log("roomId " + roomId + "  " + "username " + username);

  useEffect(() => {
    const socket = new SockJS("http://localhost:9002/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      // Subscribe to the active users topic for the room
      stompClient.subscribe(`/topic/${roomId}/active-users`, (message) => {
        setOnlineUsers(JSON.parse(message.body));
      });

      // Notify the backend that the user has joined the room
      stompClient.send(
        `/app/chat/join`,
        {},
        JSON.stringify({ roomId, username })
      );

      window.addEventListener("beforeunload", () => {
        stompClient.send(
          "/app/chat/leave",
          {},
          JSON.stringify({ roomId, username })
        );
        stompClient.disconnect();
      });
    });

    return () => {
      if (stompClient) {
        // Notify the backend that the user has left the room
        stompClient.send(
          `/app/chat/leave`,
          {},
          JSON.stringify({ roomId, username })
        );
        stompClient.disconnect();
      }
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
