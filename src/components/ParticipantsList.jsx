import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { styled } from "@mui/system";
import UserInfoBox from "./UserInfoBox";

const ParticipantsList = ({ participants }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (username) => {
    setSelectedUser(username);
  };

  const handleCloseUserInfo = () => {
    setSelectedUser(null);
  };

  return (
    <ParticipantsBox>
      <Typography
        variant="h6"
        component="h2"
        sx={{ textAlign: "center", padding: "1rem", color: "white" }}
      >
        Participants
      </Typography>
      <ScrollableBox>
        <List>
          {participants.map((user, index) => (
            <ListItem
              key={index}
              sx={{ display: "flex", alignItems: "center", padding: "0.5rem" }}
              button
              onClick={() => handleUserClick(user)}
            >
              <ListItemIcon sx={{ minWidth: "auto", marginRight: "0.7rem" }}>
                <PersonIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary={user}
                primaryTypographyProps={{
                  style: { color: "#fff", fontSize: "1.2em" },
                }}
              />
            </ListItem>
          ))}
        </List>
      </ScrollableBox>
      {selectedUser && (
        <UserInfoBox username={selectedUser} onClose={handleCloseUserInfo} />
      )}
    </ParticipantsBox>
  );
};

const ParticipantsBox = styled(Box)({
  height: "calc(100vh - 30vh)", // Height adjusted to fit within the available space
  maxWidth: "100%", // Ensure it does not exceed page width
  padding: "1em",
  border: "1px solid #ccc",
  borderRadius: "1em",
  marginTop: "1em",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "transparent", // Ensure no background color
});

const ScrollableBox = styled(Box)({
  flex: 1, // Ensure it grows to fill the available space
  overflowY: "auto",
  width: "100%", // Ensure it fits within the container width
  maxWidth: "100%", // Ensure it does not exceed the container width
  "&::-webkit-scrollbar": {
    display: "none",
  },
});

export default ParticipantsList;
