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

const calculateDays = (fromDate, toDate) => {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const timeDiff = end - start;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
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
      updatedPost.fromDate &&
      updatedPost.toDate &&
      updatedPost.source &&
      updatedPost.budget > 0 &&
      new Date(updatedPost.fromDate) < new Date(updatedPost.toDate) &&
      new Date(updatedPost.toDate) <=
        new Date(
          new Date(updatedPost.fromDate).setDate(
            new Date(updatedPost.fromDate).getDate() + 7
          )
        );
    setIsSaveEnabled(isValid);
  }, [updatedPost]);

  const handleChange = (field, value) => {
    setUpdatedPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    // Calculate days and nights
    const days = calculateDays(updatedPost.fromDate, updatedPost.toDate);
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
  const maxDate = new Date(updatedPost.fromDate);
  maxDate.setDate(maxDate.getDate() + 7);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  const days = calculateDays(updatedPost.fromDate, updatedPost.toDate);
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
              value={updatedPost.fromDate}
              onChange={(e) => handleChange("fromDate", e.target.value)}
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
              value={updatedPost.toDate}
              onChange={(e) => handleChange("toDate", e.target.value)}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: updatedPost.fromDate,
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
          value={updatedPost.budget}
          onChange={(e) => handleChange("budget", e.target.value)}
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
