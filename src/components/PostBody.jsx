import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import EventsTimeline from "./EventsTimeline";
import ChatIcon from "@mui/icons-material/Chat";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import AddEventModal from "./AddEventModal";
const PostBody = ({ post }) => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [updatedPost, setUpdatedPost] = useState(post);
  const handleDeletePost = () => {
    console.log("Post deleted!");
  };

  const handleAddEvents = () => {
    console.log("Add Events button clicked");
    setModalOpen(true);
  };

  const handleEditPost = () => {
    console.log("Edit Post button clicked");
  };
  const handleGoToChat = () => {
    console.log("Go to chat clicked");
    navigate(`/chat/${post.id}`);
  };

  const handleLeavePost = () => {
    console.log("Leave post clicked");
  };
  const handleSaveEvents = async (newEvents) => {
    console.log("Old Events:", updatedPost.events);
    console.log("New Events:", newEvents);
    const updatedPostWithEvents = { ...updatedPost, events: newEvents };
    console.log("Updated Post:", updatedPostWithEvents);
    setUpdatedPost(updatedPostWithEvents);

   // TODO  call backend api and update the events
  };

  useEffect(() => {
    console.log("Updated Post:", updatedPost);
  }, [updatedPost]);
  return (
    <BodyContainer>
      <LeftSection>
        <Typography variant="h6">{`${updatedPost.maleCount}Male    ${updatedPost.femaleCount}Female  ${updatedPost.otherCount}Others`}</Typography>
        <Typography variant="subtitle1">{`Expected Budget: ${updatedPost.budget} * ( Per Person )`}</Typography>
        <Box
          display="flex"
          gap="1.2em"
          marginLeft="auto"
          marginRight="10em"
          marginTop="0.1em"
        >
          <ActionButton variant="contained" onClick={handleAddEvents}>
            <AddIcon />
            Add Events
          </ActionButton>
          <ActionButton
            variant="contained"
            onClick={handleEditPost}
            sx={{ marginLeft: "1em" }}
          >
            <EditIcon />
            Edit Post
          </ActionButton>
        </Box>
        
        <EventsContainer>
        
          <Typography variant="h6">Events Timeline</Typography>
         
          <EventsTimeline
            events={updatedPost.events}
            startDateFromPost={updatedPost.fromDate}
          />
        </EventsContainer>

        <Box
          display="flex"
          justifyContent="space-between"
          marginTop="2em"
          width="100%"
        >
          <ActionButton
            variant="contained"
            onClick={handleGoToChat}
            sx={{ marginLeft: "1em" }}
          >
            <ChatIcon />
            Go to Chat
          </ActionButton>
          <ActionButton
            variant="contained"
            onClick={handleLeavePost}
            sx={{ marginRight: "1em" }}
          >
            <ExitToAppIcon />
            Leave Post
          </ActionButton>
        </Box>
      </LeftSection>
      <RightSection>
        <Typography variant="h6">{`Admin: ${updatedPost.adminName}`}</Typography>
        <DeleteButtonContainer>
          <ActionButton variant="contained" onClick={handleEditPost}>
            <DeleteIcon />
            Delete Post
          </ActionButton>
        </DeleteButtonContainer>
        <ParticipantsBox>
          <Typography
            variant="h6"
            component="h2"
            sx={{ textAlign: "center", padding: "1rem", color: "white" }}
          >
            Participants
          </Typography>
          <Box
            sx={{
              height: "calc(100% - 4rem)",
              overflowY: "scroll",
              maxWidth: "10em",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              scrollbarWidth: "none", 
              "&::-webkit-scrollbar": {
                display: "none", 
              },
            }}
          >
            <List>
              {updatedPost.participants.map((user, index) => (
                <ListItem
                  key={index}
                  style={{ maxHeight: "100%", overflow: "auto" }}
                >
                  
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
        </ParticipantsBox>
      </RightSection>

      <AddEventModal
        open={isModalOpen}
        handleClose={() => setModalOpen(false)}
        post={updatedPost}
        handleSave={handleSaveEvents}
      />
    </BodyContainer>
  );
};

const BodyContainer = styled(Box)({
  backgroundColor: "black", 
  color: "white", 
  width: "100%", 
  height: "calc(100vh - 64px)", 
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "1em",
  boxSizing: "border-box", 
});

const LeftSection = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "1em", 
  marginLeft: "1em",
  flexGrow: 1, 
  justifyContent: "space-between",
});

const RightSection = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: "1em", 
});

const DeleteButtonContainer = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.5em", 
});

const ParticipantsBox = styled(Box)({
  height: "calc(100vh - 30vh)", 
  overflowY: "auto", 
  width: "100%", 
  padding: "1em", 
  border: "1px solid #ccc", 
  borderRadius: "1em", 
  marginTop: "1em", 
  boxSizing: "border-box", 
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  
});

const ActionButton = styled(Button)({
  backgroundColor: "#254bbe", 
  color: "white", 
  borderRadius: "4px", 
  padding: "0.5em 1em", 
  "&:hover": {
    backgroundColor: "#1e3a8a", 
  },
  display: "flex",
  alignItems: "center",
  gap: "0.5em",
});

const EventsContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center", 
  gap: "1em", 
  justifyContent: "center",
  margin: "auto",
});

export default PostBody;
