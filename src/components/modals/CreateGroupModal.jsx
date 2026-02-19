import "./createGroupModal.scss";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import LockIcon from "@mui/icons-material/Lock";
import PublicIcon from "@mui/icons-material/Public";
import axios from "axios";

const CreateGroupModal = ({ onClose, onSubmit }) => {
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    course: "",
    type: "public",
    image: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGroupData({ ...groupData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    console.log("Attempting to create group with data:", groupData);

    try {
      const response = await axios.post(
        "http://localhost:8800/api/study-groups",
        groupData,
        {
          withCredentials: true,
        }
      );
      console.log("Group created successfully:", response.data);
      onSubmit(response.data);
      onClose();
    } catch (err) {
      console.error("Error creating group:", err);
      setError(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="createGroupModal">
        <div className="header">
          <h2>Create Study Group</h2>
          <button className="closeBtn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="imageUpload">
            {groupData.image ? (
              <img src={groupData.image} alt="Group cover" />
            ) : (
              <div className="placeholder">
                <ImageIcon />
                <span>Add Cover Image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="imageInput"
              hidden
            />
            <label htmlFor="imageInput" className="uploadBtn">
              Choose Image
            </label>
          </div>

          <div className="inputGroup">
            <label>Group Name</label>
            <input
              type="text"
              placeholder="Enter group name"
              value={groupData.name}
              onChange={(e) =>
                setGroupData({ ...groupData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="inputGroup">
            <label>Description</label>
            <textarea
              placeholder="Describe your study group"
              value={groupData.description}
              onChange={(e) =>
                setGroupData({ ...groupData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="inputGroup">
            <label>Course Code</label>
            <input
              type="text"
              placeholder="e.g. CS201"
              value={groupData.course}
              onChange={(e) =>
                setGroupData({ ...groupData, course: e.target.value })
              }
              required
            />
          </div>

          <div className="inputGroup">
            <label>Group Type</label>
            <div className="typeOptions">
              <button
                type="button"
                className={groupData.type === "public" ? "active" : ""}
                onClick={() => setGroupData({ ...groupData, type: "public" })}
              >
                <PublicIcon /> Public
              </button>
              <button
                type="button"
                className={groupData.type === "private" ? "active" : ""}
                onClick={() => setGroupData({ ...groupData, type: "private" })}
              >
                <LockIcon /> Private
              </button>
            </div>
          </div>

          {error && <div className="error">{error}</div>}

          <div className="actions">
            <button type="button" className="cancelBtn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="createBtn" disabled={loading}>
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal; 