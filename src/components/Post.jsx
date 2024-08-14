import React from "react";
import { useParams } from "react-router-dom";
import PostBody2 from "./PostBody2";

const Post = () => {
  // Use useParams to get the id from the URL
  const { id } = useParams();

  return (
    <>
      {/* Pass the id from the URL to PostBody2 */}
      <PostBody2 postId={id} />
    </>
  );
};

export default Post;
