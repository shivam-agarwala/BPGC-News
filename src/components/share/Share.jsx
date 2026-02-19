import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { BACKEND_URL } from "../../constant";
import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { PostContext } from "../../context/postContext";

const Share = () => {
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { addPost } = useContext(PostContext); // Get addPost function

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!desc.trim()) {
      setError("Please add a description");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("desc", desc);
      if (file) {
        formData.append("image", file);
      }

      const response = await axios.post(`${BACKEND_URL}/posts/addPost`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setDesc("");
      setFile(null);
      document.getElementById("fileInput").value = "";

      // Add new post to context
      addPost(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img src={currentUser.profilePic} alt="" />
          <input
            type="text"
            placeholder={`What's on your mind, ${currentUser.name}?`}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <div className="item">
              <img src={Image} alt="" />
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
              />
            </div>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            {error && <span className="error">{error}</span>}
            <button onClick={handleShare} disabled={loading}>
              {loading ? "Sharing..." : "Share"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
