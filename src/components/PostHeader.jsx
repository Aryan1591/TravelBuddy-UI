import React from "react";
import { Typography, Box } from "@mui/material";
import { styled } from "@mui/system";

const PostHeader = ({ post }) => {
  return (
    <HeaderContainer>
      <LeftSection>
        <Typography variant="h5">{post.title}</Typography>
        {post.days !== 0 && post.nights !== 0 && (
          <Typography variant="body1">{`${post.days} Days ${post.nights} Nights`}</Typography>
        )}
      </LeftSection>
      <MiddleSection>
        <Typography
          variant="body1"
          sx={{ marginRight: "2em" }}
        >{`MeetUp: ${post.source}`}</Typography>
        <Typography
          variant="body1"
          sx={{ marginLeft: "2em" }}
        >{`Destination: ${post.destination}`}</Typography>
      </MiddleSection>
      <RightSection>
        <Typography variant="body1">{post.startDate}</Typography>
        <Typography
          variant="body1"
          sx={{ marginLeft: "0.5em", marginRight: "0.5em" }}
        >
          to
        </Typography>
        <Typography variant="body1">{post.endDate}</Typography>
      </RightSection>
    </HeaderContainer>
  );
};

const LeftSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "1.5em",
});

const MiddleSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "1.5em",
  flexGrow: 1, // Make this section flexible
  justifyContent: "center", // Center the content within the flexible space
});

const RightSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.5em",
});

const HeaderContainer = styled(Box)({
  backgroundColor: "#254bbe",
  padding: "1em 1em", // Increased padding to increase the height
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "white",
  width: "100%",
  boxSizing: "border-box",
});

export default PostHeader;
