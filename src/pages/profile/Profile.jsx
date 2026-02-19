import { useContext } from "react";
import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { PostProvider } from "../../context/postContext";
import { AuthContext } from "../../context/authContext";

const Profile = () => {
  const { currentUser } = useContext(AuthContext); // Get logged-in user info

  return (
    <PostProvider>
      <div className="profile">
        <div className="images">
          <img
            src={currentUser?.coverPic || "https://via.placeholder.com/1200x400"}
            alt="Cover"
            className="cover"
          />
          <img
            src={currentUser?.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="profilePic"
          />
        </div>
        <div className="profileContainer">
          <div className="uInfo">
            <div className="left">
              {currentUser?.facebook && (
                <a href={currentUser.facebook} target="_blank" rel="noopener noreferrer">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
              )}
              {currentUser?.instagram && (
                <a href={currentUser.instagram} target="_blank" rel="noopener noreferrer">
                  <InstagramIcon fontSize="large" />
                </a>
              )}
              {currentUser?.twitter && (
                <a href={currentUser.twitter} target="_blank" rel="noopener noreferrer">
                  <TwitterIcon fontSize="large" />
                </a>
              )}
              {currentUser?.linkedin && (
                <a href={currentUser.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon fontSize="large" />
                </a>
              )}
              {currentUser?.pinterest && (
                <a href={currentUser.pinterest} target="_blank" rel="noopener noreferrer">
                  <PinterestIcon fontSize="large" />
                </a>
              )}
            </div>
            <div className="center">
              <span>{currentUser?.name || "User Name"}</span>
              <div className="info">
                <div className="item">
                  <PlaceIcon />
                  <span>{currentUser?.location || "Location not set"}</span>
                </div>
                <div className="item">
                  <LanguageIcon />
                  <span>{currentUser?.website || "No website"}</span>
                </div>
              </div>
              <button>Follow</button>
            </div>
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
          <Posts />
        </div>
      </div>
    </PostProvider>
  );
};

export default Profile;
