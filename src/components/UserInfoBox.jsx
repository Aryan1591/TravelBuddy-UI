import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { styled } from "@mui/system";

const UserInfoBox = ({ username, onClose }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9001/getInfo/${username}`
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info", error);
      }
    };

    fetchUserInfo();
  }, [username]);

  if (!userInfo) return null;

  const { name, gender, phnumber, dob, email, phnum_visibility } = userInfo;

  return (
    <Overlay onClick={onClose}>
      <UserInfoContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            User Information
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#ff5c5c" }}>
            <CloseIcon />
          </IconButton>
        </Header>
        <Content>
          <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}>
            <strong>Name:</strong> {name}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}>
            <strong>Gender:</strong> {gender}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}>
            <strong>Date of Birth:</strong> {new Date(dob).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: "0.5rem" }}>
            <strong>Email:</strong> {email}
          </Typography>
          {phnum_visibility && (
            <Typography variant="body1">
              <strong>Phone Number:</strong> {phnumber}
            </Typography>
          )}
        </Content>
      </UserInfoContainer>
    </Overlay>
  );
};

const Overlay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
});

const UserInfoContainer = styled(Paper)({
  padding: "2rem",
  borderRadius: "12px",
  maxWidth: "500px",
  width: "100%",
  backgroundColor: "#fff",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // Centering the content
});

const Header = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginBottom: "1rem",
});

const Content = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center", // Centering the content
  textAlign: "center", // Center text alignment
});

export default UserInfoBox;
