import "./rightBar.scss";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import { Link } from "react-router-dom";

const RightBar = () => {
  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Upcoming Events</span>
          <div className="events">
            <div className="event">
              <div className="eventInfo">
                <EventIcon className="eventIcon" />
                <div className="details">
                  <span className="title">Tech Fest 2024</span>
                  <span className="date">March 15, 2024</span>
                </div>
              </div>
              <Link to="/event/1" className="eventLink">View</Link>
            </div>
            <div className="event">
              <div className="eventInfo">
                <EventIcon className="eventIcon" />
                <div className="details">
                  <span className="title">Cultural Night</span>
                  <span className="date">March 20, 2024</span>
                </div>
              </div>
              <Link to="/event/2" className="eventLink">View</Link>
            </div>
          </div>
        </div>
        
        <div className="item">
          <span>Academic Updates</span>
          <div className="updates">
            <div className="update">
              <SchoolIcon className="updateIcon" />
              <div className="updateInfo">
                <span className="title">Mid-Semester Exams</span>
                <span className="desc">Schedule Released</span>
              </div>
            </div>
            <div className="update">
              <SchoolIcon className="updateIcon" />
              <div className="updateInfo">
                <span className="title">Course Registration</span>
                <span className="desc">Opens next week</span>
              </div>
            </div>
          </div>
        </div>

        <div className="item">
          <span>Active Study Groups</span>
          <div className="studyGroups">
            <Link to="/study-group/1" className="group">
              <div className="groupInfo">
                <img src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg" alt="" />
                <div className="details">
                  <span className="name">Data Structures</span>
                  <span className="members">12 members</span>
                </div>
              </div>
              <div className="status">Active</div>
            </Link>
            <Link to="/study-group/2" className="group">
              <div className="groupInfo">
                <img src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg" alt="" />
                <div className="details">
                  <span className="name">Machine Learning</span>
                  <span className="members">8 members</span>
                </div>
              </div>
              <div className="status">Active</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightBar;
