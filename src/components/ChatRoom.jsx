import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  List,
  ListItem,
  Typography,
  IconButton,
  Box,
  TextField,
} from "@mui/material";
import axios from "axios";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";
import OnlineUserList from "./OnLineUserList";
import SendIcon from "@mui/icons-material/Send";

const ChatRoom = () => {
  const { postId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const username = sessionStorage.getItem("username"); // This should ideally be dynamically set based on logged-in user

  const messageListRef = useRef(null); // Reference to the message list container

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9002/messages/${postId}`
        );
        const messages = response.data.map((item) => ({
          content: item.content,
          sender: item.username,
        }));
        setMessages(messages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      const socket = new SockJS("http://localhost:9002/ws");
      const stompClient = Stomp.over(socket);

      stompClient.connect({}, () => {
        console.log("Connected to WebSocket");

        stompClient.subscribe(`/topic/${postId}`, (message) => {
          const body = JSON.parse(message.body);
          const newMessage = {
            content: body.content,
            sender: body.username,
          };

          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
      });

      setStompClient(stompClient);

      return () => {
        if (stompClient) {
          stompClient.disconnect(() => {
            console.log("Disconnected from WebSocket");
          });
        }
      };
    };

    fetchData();
  }, [postId]);

  useEffect(() => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages, message]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (message.trim() !== "") {
      const messageData = {
        username: username,
        content: message,
      };

      if (stompClient) {
        stompClient.send(
          `/app/chat/${postId}`,
          {},
          JSON.stringify(messageData)
        );
      }

      setMessage("");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
      }}
    >
      <OnlineUserList roomId={postId} username={username} />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "80vw",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box
          sx={{
            flex: 1,
            overflowY: "scroll",
            padding: "1rem",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
          ref={messageListRef} // Attach the ref to the message list container
        >
          <List>
            {messages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent:
                    message.sender === username ? "flex-end" : "flex-start",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                {message.sender !== username && (
                  <>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#888", marginRight: "0.5rem" }}
                    >
                      {message.sender}:
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "#e0e0e0",
                        color: "#000",
                        borderRadius: "10px",
                        padding: "0.5rem 1rem",
                        maxWidth: "60%",
                      }}
                    >
                      <Typography variant="body1">{message.content}</Typography>
                    </Box>
                  </>
                )}
                {message.sender === username && (
                  <>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#888", marginRight: "0.5rem" }}
                    >
                      {message.sender}:
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: "#3f51b5",
                        color: "#fff",
                        borderRadius: "10px",
                        padding: "0.5rem 1rem",
                        maxWidth: "60%",
                      }}
                    >
                      <Typography variant="body1">{message.content}</Typography>
                    </Box>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "0.5rem",
            borderTop: "1px solid #ddd",
            backgroundColor: "#fff",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Type a message..."
            fullWidth
            value={message}
            onChange={handleMessageChange}
            sx={{ marginRight: "0.5rem" }}
          />
          <IconButton color="primary" onClick={handleSendClick}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatRoom;
