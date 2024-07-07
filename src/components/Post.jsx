import React from "react";
import PostHeader from "./PostHeader";
import PostBody from "./PostBody";

const Post = ({post}) => {
  return (
    <>
      <PostHeader post={post} />
      <PostBody post={post} />
    </>
  );
};

export default Post;
