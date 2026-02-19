import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthContextProvider } from "./context/authContext";
import {
  DarkModeContext,
  DarkModeContextProvider,
} from "./context/darkModeContext";
import "./style.scss";

// Function to get theme class dynamically
const RootWrapper = () => {
  const { darkMode } = useContext(DarkModeContext); // Get dark mode state
  return (
    <div className={darkMode ? "theme-dark" : "theme-light"}>
      <App />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <DarkModeContextProvider>
    <AuthContextProvider>
      <RootWrapper /> {/* Wrapped inside a theme-aware component */}
    </AuthContextProvider>
  </DarkModeContextProvider>
);
