import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import "./navbar.scss";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/home" className="logo">
          BPGC News
        </Link>
        <Link to="/home">
          <HomeOutlinedIcon className="icon" />
        </Link>
        <Link to="/study-groups">
          <GroupsIcon className="icon" />
        </Link>
        {darkMode ? (
          <WbSunnyOutlinedIcon className="icon" onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon className="icon" onClick={toggle} />
        )}
        <GridViewOutlinedIcon className="icon" />
        <div className="search">
          <SearchOutlinedIcon className="icon" />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon className="icon" />
        <EmailOutlinedIcon className="icon" />
        <NotificationsOutlinedIcon className="icon" />
        
        {currentUser?.role === "admin" && (
          <Link to="/admin" className="admin-link">
            Admin
          </Link>
        )}

        {currentUser && (
          <Link to={`/profile/${currentUser.id}`} className="profile-link">
            <div className="user">
              <img src={currentUser.profilePic} alt="Profile" />
              <span>{currentUser.name}</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
