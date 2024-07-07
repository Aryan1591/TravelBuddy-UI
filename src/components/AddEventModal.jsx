import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const AddEventModal = ({ open, handleClose, post, handleSave }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [eventDetails, setEventDetails] = useState([{ event: "" }]);
  const [existingEvents, setExistingEvents] = useState([]);

  useEffect(() => {
    if (post && post.events) {
      setExistingEvents(post.events);
    }
  }, [post]);

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    const existingEvent = existingEvents.find(
      (event) => event.date === selectedDate
    );
    if (existingEvent) {
      setTitle(existingEvent.title);
      setEventDetails(existingEvent.events.map((event) => ({ event })));
    } else {
      setTitle("");
      setEventDetails([{ event: "" }]);
    }
  };

  const handleAddEvent = () => {
    const newEvent = {
      date,
      title,
      events: eventDetails
        .map((detail) => detail.event)
        .filter((event) => event.trim() !== ""),
    };
    const updatedEvents = existingEvents.filter((event) => event.date !== date);
    updatedEvents.push(newEvent);
    handleSave(updatedEvents);
    handleClose();
    // Clear input fields after saving
    setTitle("");
    setDate("");
    setEventDetails([{ event: "" }]);
  };

  const handleAddEventDetail = () => {
    if (eventDetails.length < 4) {
      // Restrict to 4 events per day
      console.log("Event added " + event);
      setEventDetails([...eventDetails, { event: "" }]);
    }
  };

  const handleDeleteEventDetail = (index) => {
    const updatedDetails = [...eventDetails];
    updatedDetails.splice(index, 1);
    setEventDetails(updatedDetails);
  };

  const handleEventDetailChange = (index, value) => {
    const updatedDetails = [...eventDetails];
    updatedDetails[index].event = value;
    setEventDetails(updatedDetails);
  };

  const generateDateOptions = () => {
    const options = [];
    const fromDate = new Date(post.fromDate);
    const toDate = new Date(post.toDate);
    let currentDate = fromDate;
    while (currentDate <= toDate) {
      options.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return options;
  };
  const isSaveDisabled = eventDetails[0].event.trim() === "";

  return (
    <Modal open={open} onClose={handleClose}>
      <StyledModalBox>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Add Event</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          select
          label="Date"
          fullWidth
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          sx={{ marginTop: "1em" }}
          required
        >
          {generateDateOptions().map((date, index) => (
            <MenuItem key={index} value={date}>
              {date}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Event Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ marginTop: "1em" }}
          required
        />
        {eventDetails.map((detail, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            sx={{ marginTop: "1em" }}
          >
            <TextField
              label={`Event ${index + 1}`}
              fullWidth
              value={detail.event}
              onChange={(e) => handleEventDetailChange(index, e.target.value)}
            />
            {index > 0 && (
              <IconButton onClick={() => handleDeleteEventDetail(index)}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Box display="flex" justifyContent="flex-end" sx={{ marginTop: "1em" }}>
          <IconButton
            onClick={handleAddEventDetail}
            disabled={eventDetails.length >= 4}
          >
            <AddIcon />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="flex-end" gap="1em" marginTop="1em">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddEvent}
            disabled={isSaveDisabled}
          >
            Save
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </StyledModalBox>
    </Modal>
  );
};

const StyledModalBox = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "30em",
  backgroundColor: "white",
  padding: "2em",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});

export default AddEventModal;
