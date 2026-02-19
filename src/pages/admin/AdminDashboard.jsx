import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {currentUser.name} (Admin)</h1>
      <p>Manage the community guidelines and ban users here.</p>

      {/* Sample Buttons to Manage Users */}
      <button onClick={() => alert("Ban User Functionality Coming Soon!")}>
        Ban User
      </button>

      <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;
