import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ParticipantsList from "./ParticipantsList";
import EventsTimeline from "./EventsTimeline";
import { useNavigate } from "react-router-dom";
import AddEventModal from "./AddEventModal";
import EditPostModal from "./EditPostModal";
import PostHeader from "./PostHeader";

const PostBody = ({ post }) => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isUnauthorizedOpen, setUnauthorizedOpen] = useState(false);
  const [isLeaveConfirmOpen, setLeaveConfirmOpen] = useState(false);
  const [isAdminLeaveOpen, setAdminLeaveOpen] = useState(false);
  const [updatedPost, setUpdatedPost] = useState(post);
  const [isEditUnauthorizedOpen, setEditUnauthorizedOpen] = useState(false);
  const [isEditPostModalOpen, setEditPostModalOpen] = useState(false);
  const currentUser = "Avishekh";

  const handleDeletePost = async () => {
    if (currentUser !== post.adminName) {
      setUnauthorizedOpen(true);
      return;
    }

    setConfirmOpen(true);
  };
  const handleOpenPostModal = () => {
    setPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setPostModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    // Call backend API to delete the post
    try {
      await fetch(`http://localhost:9001/posts/${post.id}`, {
        method: "DELETE",
      });
      navigate("/"); // Redirect to the home page after deletion
    } catch (error) {
      console.error("Error deleting the post", error);
    }
  };

  const handleAddEvents = () => {
    setModalOpen(true);
  };

  const handleEditPost = () => {
    // handleOpenPostModal();
    // Implement edit post functionality
    if (currentUser !== post.adminName) {
      setEditUnauthorizedOpen(true);
      return;
    }

    setEditPostModalOpen(true);
  };
  const handleSavePost = (newPostDetails) => {
    setUpdatedPost(newPostDetails);
    console.log("We have received newPostDetails object");
    console.log(newPostDetails);
    // TODO: Call backend API to save changes to the post
  };

  const handleGoToChat = () => {
    navigate(`/chat/${post.id}`);
  };

  const handleLeavePost = () => {
    if (currentUser === post.adminName) {
      setAdminLeaveOpen(true);
    } else {
      setLeaveConfirmOpen(true);
    }
  };

  const handleConfirmLeave = async () => {
    // Call backend API to remove the user from the post
    try {
      await fetch(`http://localhost:9001/posts/${post.id}/leave`, {
        method: "POST",
        body: JSON.stringify({ username: currentUser }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      navigate("/"); // Redirect to the home page after leaving
    } catch (error) {
      console.error("Error leaving the post", error);
    }
  };

  const handleSaveEvents = (newEvents) => {
    const updatedPostWithEvents = { ...updatedPost, events: newEvents };
    setUpdatedPost(updatedPostWithEvents);

    // TODO: Call backend API to update the events
  };

  useEffect(() => {
    console.log("Updated Post:", updatedPost);
  }, [updatedPost]);
  return (
    <>
      <PostHeader post={updatedPost} />
      <BodyContainer>
        <LeftSection>
          <Typography variant="h6">{`${updatedPost.maleCount} Male    ${updatedPost.femaleCount} Female  ${updatedPost.otherCount} Others`}</Typography>
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
            <ActionButton variant="contained" onClick={handleDeletePost}>
              <DeleteIcon />
              Delete Post
            </ActionButton>
          </DeleteButtonContainer>
          <ParticipantsList participants={updatedPost.participants} />
        </RightSection>

        <AddEventModal
          open={isModalOpen}
          handleClose={() => setModalOpen(false)}
          post={updatedPost}
          handleSave={handleSaveEvents}
        />

        <Dialog open={isConfirmOpen} onClose={() => setConfirmOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this post?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmOpen(false)}>No</Button>
            <Button
              onClick={() => {
                handleConfirmDelete();
                setConfirmOpen(false);
              }}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isUnauthorizedOpen}
          onClose={() => setUnauthorizedOpen(false)}
        >
          <DialogTitle>Alert</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You are not authorized to delete this post.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setUnauthorizedOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isAdminLeaveOpen}
          onClose={() => setAdminLeaveOpen(false)}
        >
          <DialogTitle>Alert</DialogTitle>
          <DialogContent>
            <DialogContentText>
              As an admin, you are not allowed to leave the post.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAdminLeaveOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isLeaveConfirmOpen}
          onClose={() => setLeaveConfirmOpen(false)}
        >
          <DialogTitle>Confirm Leave</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to leave this post?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLeaveConfirmOpen(false)}>No</Button>
            <Button
              onClick={() => {
                handleConfirmLeave();
                setLeaveConfirmOpen(false);
              }}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isEditUnauthorizedOpen}
          onClose={() => setEditUnauthorizedOpen(false)}
        >
          <DialogTitle>Alert</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You are not authorized to edit this post.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditUnauthorizedOpen(false)} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <EditPostModal
          open={isEditPostModalOpen}
          handleClose={() => setEditPostModalOpen(false)}
          post={updatedPost}
          handleSave={handleSavePost}
        />
      </BodyContainer>
    </>
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
