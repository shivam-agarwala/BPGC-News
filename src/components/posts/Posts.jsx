import { useContext } from "react";
import Post from "../post/Post";
import "./posts.scss";
import { PostContext } from "../../context/postContext";

const Posts = () => {
  const { posts, isLoading } = useContext(PostContext);

  return (
    <div className="posts">
      {isLoading ? (
        <p>Loading posts...</p>
      ) : posts.length > 0 ? (
        posts.map((post) => <Post post={post} key={post.id} />)
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};

export default Posts;
