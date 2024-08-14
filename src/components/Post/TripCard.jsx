// src/TripCard.jsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StyledCard = styled(Card)(({ theme }) => ({
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  width: "80%",
  maxWidth: "800px",
  height: "auto",
  margin: "20px auto",
  backgroundColor: "white",
  color: "#333",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
  },
}));

const CardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  marginBottom: "16px",
  [theme.breakpoints.up("sm")]: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const Title = styled(Typography)(({ theme }) => ({
  margin: "0 0 10px 0",
  fontSize: "1.8em",
  color: "#333",
}));

const Duration = styled(Typography)(({ theme }) => ({
  fontSize: "1em",
  color: "#777",
  marginTop: "0",
  [theme.breakpoints.up("sm")]: {
    textAlign: "right",
  },
}));

const Participants = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "16px",
  fontSize: "0.9em",
}));

const ParticipantBadge = styled("span")(({ theme }) => ({
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "12px",
  backgroundColor: "#f0f0f0",
  textAlign: "right",
}));

const Events = styled(Box)(({ theme }) => ({
  textAlign: "left",
  marginBottom: "16px",
  overflowY: "auto",
  maxHeight: "200px",
}));

const EventItem = styled(Typography)(({ theme }) => ({
  fontSize: "1em",
  color: "#555",
  marginBottom: "8px",
  paddingLeft: "10px",
  borderLeft: "4px solid #61dafb",
}));

const JoinButton = styled(Button)(({ theme }) => ({
  display: "block",
  width: "100%",
  textAlign: "center",
  padding: "12px 0",
  borderRadius: "25px",
  backgroundColor: "#61dafb",
  color: "white",
  cursor: "pointer",
  fontSize: "1em",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#21a1f1",
  },
}));

const TripCard = ({ data }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const username = sessionStorage.getItem("username");
  const isUserInPost = data.users.some((user) => user === username);
  console.log(data.id + "  id");
  console.log(data.users);
  console.log(isUserInPost);
  const handleJoinClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmJoin = async () => {
    try {
      await axios.post(
        `http://localhost:8093/post/addUser/${username}/${data.id}`
      );
      setOpenDialog(false);
      navigate(`/post/${data.id}`);
    } catch (error) {
      console.error("Error joining post", error);
    }
  };

  const handleGoToPostClick = () => {
    navigate(`/post/${data.id}`);
  };

  const limitedEvents = data.events
    ? data.events.slice(0, 4).map((event, index) => (
        <EventItem key={index} variant="body2">
          {event.title}
        </EventItem>
      ))
    : null;

  return (
    <StyledCard>
      <CardContent>
        <CardHeader>
          <Title variant="h5" component="div">
            {data.destination}
          </Title>
          <Duration variant="body2">
            {`${data.startDate} to ${data.endDate}`}
          </Duration>
        </CardHeader>
        <Participants>
          <ParticipantBadge>{data.count.femaleCount} F</ParticipantBadge>
          <ParticipantBadge>{data.count.maleCount} M</ParticipantBadge>
          <ParticipantBadge>{data.count.otherCount} O</ParticipantBadge>
        </Participants>
        <Events>
          <Typography variant="h6">Events</Typography>
          {limitedEvents && limitedEvents.length > 0 ? (
            limitedEvents
          ) : (
            <Typography variant="body2">No events available</Typography>
          )}
        </Events>
      </CardContent>
      <JoinButton
        variant="contained"
        onClick={isUserInPost ? handleGoToPostClick : handleJoinClick}
        disabled={ !isUserInPost && data.status === "LOCKED"}
      >
        {isUserInPost ? "Go To Post" : "Join Post"}
      </JoinButton>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Registration"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to register for this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmJoin} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </StyledCard>
  );
};

export default TripCard;
