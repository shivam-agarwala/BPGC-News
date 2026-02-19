import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constant";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async ({ username, password }) => {
    try {
      const res = await axios.post(
        `${BACKEND_URL}/auth/login`,
        { username, password },
        {
          withCredentials: true, // Ensure cookies are sent and received
        }
      );

      setCurrentUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      return res.data.role; // Return user role if needed
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong!";

      alert(errorMessage); // Show alert if user not found or other errors occur
      console.error("Login failed:", errorMessage);

      return null;
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      setCurrentUser(null);
      localStorage.removeItem("user");
    } catch (err) {
      console.error(
        "Logout failed:",
        err.response?.data?.message || err.message
      );
    }
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
