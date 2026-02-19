import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { BACKEND_URL } from "../../constant";
import moment from "moment";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/posts/comments/${postId}`);
        const sortedComments = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComments(sortedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${BACKEND_URL}/posts/comment/add`,
        { postId, desc: newComment },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setComments((prevComments) => [
          {
            id: Date.now(),
            desc: newComment,
            name: currentUser.name,
            profilePic: currentUser.profilePic,
            createdAt: new Date(), // Store as Date object
          },
          ...prevComments, // Add new comment at the top
        ]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div style={{ width: "100%", marginTop: "10px" }}>
      {/* Write Comment Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "10px" }}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            outline: "none",
          }}
        />
        <button
          onClick={handleAddComment}
          style={{
            padding: "8px 12px",
            backgroundColor: "#1877f2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>

      {/* Scrollable Comments List */}
      <div
        style={{
          maxHeight: "250px", // Enable scrolling
          overflowY: "auto",
          paddingRight: "5px",
          borderTop: "1px solid #ddd",
          paddingTop: "10px",
        }}
      >
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "8px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: "bold", fontSize: "14px" }}>{comment.name}</span>
                <p style={{ fontSize: "14px", margin: "5px 0", color: "#555" }}>{comment.desc}</p>
              </div>
              <span style={{ fontSize: "12px", color: "gray" }}>
                {moment(comment.createdAt).fromNow()} {/* Using moment.js */}
              </span>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "gray", fontSize: "14px", marginTop: "10px" }}>
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;
