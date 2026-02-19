import "./leftBar.scss";
import PeopleIcon from "@mui/icons-material/People";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EventIcon from "@mui/icons-material/Event";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import WorkIcon from "@mui/icons-material/Work";
import SchoolIcon from "@mui/icons-material/School";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import FeedIcon from "@mui/icons-material/Feed";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import { AuthContext } from "../../context/authContext";
import { useContext } from "react";
import { Link } from "react-router-dom";

const LeftBar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <Link to={`/profile/${currentUser.id}`} className="user">
            <img src={currentUser.profilePic} alt="" />
            <span>{currentUser.name}</span>
          </Link>
          <Link to="/peers" className="item">
            <PeopleIcon />
            <span>College Peers</span>
          </Link>
          <Link to="/study-groups" className="item">
            <GroupsIcon />
            <span>Study Groups</span>
          </Link>
          <Link to="/courses" className="item">
            <MenuBookIcon />
            <span>Courses</span>
          </Link>
          <Link to="/events" className="item">
            <EventIcon />
            <span>Campus Events</span>
          </Link>
          <Link to="/news" className="item">
            <NewspaperIcon />
            <span>College News</span>
          </Link>
        </div>
        <hr />
        <div className="menu">
          <span>Academic & Career</span>
          <Link to="/internships" className="item">
            <WorkIcon />
            <span>Internships</span>
          </Link>
          <Link to="/academics" className="item">
            <SchoolIcon />
            <span>Academic Resources</span>
          </Link>
          <Link to="/library" className="item">
            <LocalLibraryIcon />
            <span>Library</span>
          </Link>
        </div>
        <hr />
        <div className="menu">
          <span>Campus Life</span>
          <Link to="/clubs" className="item">
            <SportsEsportsIcon />
            <span>Clubs & Societies</span>
          </Link>
          <Link to="/blogs" className="item">
            <FeedIcon />
            <span>Student Blogs</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
