import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Grid,
} from "@mui/material";

const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end - start;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  return daysDiff;
};

const EditPostModal = ({ open, handleClose, post, handleSave }) => {
  const [updatedPost, setUpdatedPost] = useState(post);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const initialPostRef = useRef(post);

  useEffect(() => {
    if (open) {
      // Reset the form fields to the current post values
      setUpdatedPost(post);
      initialPostRef.current = post;
    }
  }, [open, post]);

  useEffect(() => {
    // Enable Save button only if all fields are valid
    const isValid =
      updatedPost.title &&
      updatedPost.startDate &&
      updatedPost.endDate &&
      updatedPost.source &&
      updatedPost.amount > 0 &&
      new Date(updatedPost.startDate) < new Date(updatedPost.endDate) &&
      new Date(updatedPost.endDate) <=
        new Date(
          new Date(updatedPost.startDate).setDate(
            new Date(updatedPost.startDate).getDate() + 7
          )
        );
    setIsSaveEnabled(isValid);
  }, [updatedPost]);

  const handleChange = (field, value) => {
    setUpdatedPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    // Calculate days and nights
    const days = calculateDays(updatedPost.startDate, updatedPost.endDate);
    const nights = days - 1;

    // Update the post with days and nights
    const postWithDaysAndNights = {
      ...updatedPost,
      days,
      nights,
    };

    handleSave(postWithDaysAndNights);
    handleClose();
  };

  const handleCancel = () => {
    setUpdatedPost(initialPostRef.current);
    handleClose();
  };

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date(updatedPost.startDate);
  maxDate.setDate(maxDate.getDate() + 7);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const days = calculateDays(updatedPost.startDate, updatedPost.endDate);
  const nights = days - 1;

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Edit Post</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Update the details of your post below.
        </DialogContentText>
        <TextField
          label="Title"
          fullWidth
          value={updatedPost.title}
          onChange={(e) => handleChange("title", e.target.value)}
          margin="normal"
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="From"
              type="date"
              fullWidth
              value={updatedPost.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: today }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="To"
              type="date"
              fullWidth
              value={updatedPost.endDate}
              onChange={(e) => handleChange("endDate", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: updatedPost.startDate,
                max: maxDateStr,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} marginTop={1}>
          <Grid item xs={6}>
            <TextField
              label="Days"
              fullWidth
              value={days}
              margin="normal"
              disabled
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Nights"
              fullWidth
              value={nights}
              margin="normal"
              disabled
            />
          </Grid>
        </Grid>
        <TextField
          label="Source"
          fullWidth
          value={updatedPost.source}
          onChange={(e) => handleChange("source", e.target.value)}
          margin="normal"
        />
        <TextField
          label="Budget"
          type="number"
          fullWidth
          value={updatedPost.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          onClick={handleSaveChanges}
          variant="contained"
          color="primary"
          disabled={!isSaveEnabled}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPostModal;
