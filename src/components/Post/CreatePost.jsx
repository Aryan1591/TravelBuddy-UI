import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const CreatePost = ({ onClose, onNewPost }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    source: "",
    destination: "",
    amount: "",
    days: "",
    nights: "",
    adminName: sessionStorage.getItem("username"),
    events: {
      date: "",
      title: "",
      events: [""],
    },
  });
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  useEffect(() => {
    calculateDaysAndNights();
  }, [form.startDate, form.endDate]);

  useEffect(() => {
    checkIfNextEnabled();
  }, [
    form.title,
    form.startDate,
    form.endDate,
    form.source,
    form.destination,
    form.amount,
  ]);

  useEffect(() => {
    checkIfSubmitEnabled();
  }, [form.events]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleEventChange = (field, value) => {
    if (field === "date") {
      const fromDate = new Date(form.startDate);
      const toDate = new Date(form.endDate);
      const eventDate = new Date(value);

      // Ensure eventDate is within the startDate and endDate range
      if (eventDate < fromDate || eventDate > toDate) {
        return;
      }
    }
    setForm({
      ...form,
      events: {
        ...form.events,
        [field]: value,
      },
    });
  };

  const handleEventTextChange = (textIndex, value) => {
    const updatedEvents = form.events.events.map((text, i) =>
      i === textIndex ? value : text
    );
    setForm({
      ...form,
      events: {
        ...form.events,
        events: updatedEvents,
      },
    });
  };

  const addEventText = () => {
    if (form.events.events.length < 4) {
      // Check if the previous description is filled before adding a new one
      const lastIndex = form.events.events.length - 1;
      const isPreviousFilled = form.events.events[lastIndex].trim() !== "";

      if (isPreviousFilled) {
        setForm({
          ...form,
          events: {
            ...form.events,
            events: [...form.events.events, ""],
          },
        });
      }
    }
  };

  const removeEventText = (textIndex) => {
    const updatedEvents = form.events.events.filter((_, i) => i !== textIndex);
    setForm({
      ...form,
      events: {
        ...form.events,
        events: updatedEvents,
      },
    });
  };

  const calculateDaysAndNights = () => {
    const { startDate, endDate } = form;
    if (startDate && endDate) {
      const fromDate = new Date(startDate);
      const toDate = new Date(endDate);
      const timeDiff = toDate - fromDate;
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      const nights = days - 1;
      setForm((prevForm) => ({
        ...prevForm,
        days: days > 0 ? days : "",
        nights: nights > 0 ? nights : "",
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        days: "",
        nights: "",
      }));
    }
  };

  const checkIfNextEnabled = () => {
    const { title, startDate, endDate, source, destination, amount } = form;
    setIsNextEnabled(
      title && startDate && endDate && source && destination && amount
    );
  };

  const checkIfSubmitEnabled = () => {
    const { events } = form;
    const hasAtLeastOneEvent = events.events.every((text, index) =>
      index === 0 || form.events.events[index - 1].trim() !== "" ? true : false
    );
    setIsSubmitEnabled(events.date && events.title && hasAtLeastOneEvent);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare events as an array of TimelineEntry objects
    const eventEntries = [
      {
        title: form.events.title,
        date: form.events.date,
        events: form.events.events.filter((event) => event.trim() !== ""),
      },
    ];

    // Prepare the final form object
    const finalForm = {
      ...form,
      events: eventEntries,
    };

    onNewPost(finalForm); // Notify Home component of the new post with the entire form data
    onClose(); // Close the modal

    // Reset form and step
    setForm({
      title: "",
      startDate: "",
      endDate: "",
      source: "",
      destination: "",
      amount: "",
      days: "",
      nights: "",
      events: {
        date: "",
        title: "",
        events: [""],
      },
    });
    setStep(1);
  };

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {step === 1 && (
          <>
            <Typography variant="h6" gutterBottom>
              Step 1: Create a New Post
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Start Date"
                  name="startDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.startDate}
                  onChange={handleChange}
                  InputProps={{
                    inputProps: { min: new Date().toISOString().split("T")[0] },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="End Date"
                  name="endDate"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.endDate}
                  onChange={handleChange}
                  InputProps={{
                    inputProps: {
                      min: form.startDate,
                      max: form.startDate
                        ? new Date(
                            new Date(form.startDate).setDate(
                              new Date(form.startDate).getDate() + 7
                            )
                          )
                            .toISOString()
                            .split("T")[0]
                        : "",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled
                  fullWidth
                  label="Days"
                  name="days"
                  value={form.days}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  disabled
                  fullWidth
                  label="Nights"
                  name="nights"
                  value={form.nights}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Source"
                  name="source"
                  value={form.source}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Destination"
                  name="destination"
                  value={form.destination}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => setStep(2)}
                  disabled={!isNextEnabled}
                >
                  Next
                </Button>
              </Grid>
            </Grid>
          </>
        )}
        {step === 2 && (
          <>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Step 2: Add Event Details
            </Typography>
            <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Event Date"
                  name="date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={form.events.date}
                  onChange={(e) => handleEventChange('date', e.target.value)}
                  InputProps={{
                    inputProps: {
                      min: form.startDate,
                      max: form.endDate,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Event Title"
                  name="eventTitle"
                  value={form.events.title}
                  onChange={(e) => handleEventChange('title', e.target.value)}
                />
              </Grid>
              {form.events.events.map((text, index) => (
                <Grid item xs={12} key={index}>
                  <TextField
                    fullWidth
                    label={`Event Description ${index + 1}`}
                    value={text}
                    onChange={(e) => handleEventTextChange(index, e.target.value)}
                    InputProps={{
                      endAdornment: index > 0 && (
                        <IconButton
                          onClick={() => removeEventText(index)}
                          sx={{ ml: 1 }}
                        >
                          <Delete />
                        </IconButton>
                      ),
                    }}
                  />
                </Grid>
              ))}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  onClick={addEventText}
                  disabled={form.events.events.length >= 4}
                >
                  <Add /> Add Event Description
                </Button>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={!isSubmitEnabled}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CreatePost;

