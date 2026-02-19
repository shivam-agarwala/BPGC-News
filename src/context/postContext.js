import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constant";

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleUnauthorized = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("user"); // Remove user from storage
      window.location.href = "/"; // Redirect to login/home page
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/posts/getPosts`, {
        withCredentials: true, // Ensure cookies/tokens are sent
      });
      setPosts(res.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      handleUnauthorized(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPost = async (newPost) => {
    try {
      setPosts((prev) => [newPost, ...prev]); // Optimistically update UI
      await fetchPosts(); // Fetch latest posts from backend
    } catch (error) {
      console.error("Error adding post:", error);
      handleUnauthorized(error);
    }
  };

  return (
    <PostContext.Provider value={{ posts, isLoading, addPost }}>
      {children}
    </PostContext.Provider>
  );
};
