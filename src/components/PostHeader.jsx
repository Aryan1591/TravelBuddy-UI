import React from "react";
import { Typography, Box } from "@mui/material";
import { styled } from "@mui/system";

const PostHeader = ({ post }) => {
  return (
    <HeaderContainer>
      <HeaderContainer>
        <LeftSection>
          <Typography variant="h5">{post.title}</Typography>
          {post.days !== 0 && post.nights !== 0 && (
            <Typography variant="body1">{`${post.days}Days ${post.nights}Nights`}</Typography>
          )}
        </LeftSection>
        <RightSection>
          <Typography variant="body1">{post.fromDate}</Typography>
          <Typography variant="body1">to</Typography>
          <Typography variant="body1">{post.toDate}</Typography>
        </RightSection>
      </HeaderContainer>
    </HeaderContainer>
  );
};
const LeftSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "1.5em",
});

const RightSection = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "0.5em",
});

const HeaderContainer = styled(Box)({
  backgroundColor: "#254bbe",
  padding: "0.5em 1em",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "white",
  width: "100%",
  boxSizing: "border-box",
});

export default PostHeader;
