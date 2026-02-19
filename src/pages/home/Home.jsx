import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import LeftBar from "../../components/leftBar/LeftBar";
import RightBar from "../../components/rightBar/RightBar";
import "./home.scss";
import { PostProvider } from "../../context/postContext";

const Home = () => {
  return (
    <PostProvider>
      <div className="home">
        <div className="leftBar">
          <LeftBar />
        </div>
        <div className="middle">
          <Stories />
          <Share />
          <Posts />
        </div>
        <div className="rightBar">
          <RightBar />
        </div>
      </div>
    </PostProvider>
  );
};

export default Home;
