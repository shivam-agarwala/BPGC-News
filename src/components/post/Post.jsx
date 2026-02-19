import "./post.scss";
import moment from "moment";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL, MEDIA_URL } from "../../constant";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    // Update time dynamically
    const updateTimeAgo = () => {
      setTimeAgo(moment(post.createdAt).fromNow());
    };

    updateTimeAgo(); // Initial call

    // Refresh time every 1 minute
    const interval = setInterval(updateTimeAgo, 60000);

    return () => clearInterval(interval);
  }, [post.createdAt]);

  useEffect(() => {
    // Fetch if the post is liked by the user
    const fetchLikeStatus = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/posts/${post.id}/isLiked`, {
          withCredentials: true,
        });
        setLiked(res.data.liked);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [post.id]);

  const handleLike = async () => {
    try {
      if (liked) {
        // Unlike the post
        await axios.post(
          `${BACKEND_URL}/posts/${post.id}/unlike`,
          {},
          { withCredentials: true }
        );
        setLikes((prev) => prev - 1);
      } else {
        // Like the post
        await axios.post(
          `${BACKEND_URL}/posts/${post.id}/like`,
          {},
          { withCredentials: true }
        );
        setLikes((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={`${MEDIA_URL}${post.profilePic}`} alt="Profile" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{timeAgo}</span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          {post.img && <img src={`${MEDIA_URL}${post.img}`} alt="Post" />}
        </div>
        <div className="info">
          <div className="item" onClick={handleLike} style={{ cursor: "pointer" }}>
            {liked ? <FavoriteOutlinedIcon style={{ color: "red" }} /> : <FavoriteBorderOutlinedIcon />}
            {likes} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            Show Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
