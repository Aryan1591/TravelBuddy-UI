import React, { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/system";

const TimelineContainer = styled(Box)({
  width: "40em", 
  maxWidth: "40em", 
  height: "20em", 
  maxHeight: "20em", 
  border: "1px solid #ccc",
  borderRadius: "0.5rem",
  padding: "1em",
  position: "relative", 
  margin: "0 auto", 
});

const Title = styled(Typography)({
  fontSize: "1.5rem",
  textAlign: "center",
  marginBottom: "1em",
});

const EventText = styled(Typography)({
  marginLeft: "1em",
  marginTop: "0.5em", 
  listStyleType: "circle", 
});

const PrevButton = styled(Button)({
  position: "absolute",
  bottom: "1em",
  left: "1em",
  margin: "0.5em", 
});

const NextButton = styled(Button)({
  position: "absolute",
  bottom: "1em",
  right: "1em",
  margin: "0.5em", 
});

const ScrollableContent = styled(Box)({
  overflowY: "auto",
  maxHeight: "calc(100% - 6em)", 
});

const EventsTimeline = ({ events, startDateFromPost }) => {
  console.log("Events in timeline");
  console.log({ events });
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  const [currentDay, setCurrentDay] = useState(0);

  const handleNextDay = () => {
    setCurrentDay((prevDay) =>
      prevDay < events.length - 1 ? prevDay + 1 : prevDay
    );
  };

  const handlePrevDay = () => {
    setCurrentDay((prevDay) => (prevDay > 0 ? prevDay - 1 : prevDay));
  };

  const getDayDifference = (currentDate, startDate) => {
    const [year, month, day] = currentDate.split("-");
    const [startYear, startMonth, startDay] = startDate.split("-");

    const dateObj = new Date(year, month - 1, day);
    const startDateObj = new Date(startYear, startMonth - 1, startDay);

    const timeDifference = dateObj - startDateObj;

    const dayDifference = timeDifference / (1000 * 3600 * 24);

    return Math.ceil(dayDifference) + 1;
  };

  return (
    <TimelineContainer>
      {events.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom align="center">
            Day {getDayDifference(events[currentDay].date, startDateFromPost)} |{" "}
            {events[currentDay].date} | {events[currentDay].title}
          </Typography>
          <ScrollableContent>
            {events[currentDay].events.map((event, index) => (
              <EventText key={index}>{event}</EventText>
            ))}
          </ScrollableContent>
          <Box>
            <PrevButton
              variant="contained"
              onClick={handlePrevDay}
              disabled={currentDay === 0}
            >
              Prev
            </PrevButton>
            <NextButton
              variant="contained"
              onClick={handleNextDay}
              disabled={currentDay === events.length - 1}
            >
              Next
            </NextButton>
          </Box>
        </>
      )}
    </TimelineContainer>
  );
};

export default EventsTimeline;
