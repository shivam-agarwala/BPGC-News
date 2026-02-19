import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "./context/authContext";
import Navbar from "./components/navbar/Navbar"; // ✅ Import Navbar here
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StudyGroups from "./pages/studyGroups/StudyGroups";
import "./style.scss";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

function App() {
  const { currentUser } = useContext(AuthContext);

  // Protected Route Wrapper
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!currentUser) return <Navigate to="/login" replace />;
    if (adminOnly && currentUser.role !== "admin")
      return <Navigate to="/home" replace />;
    return children;
  };

  const Layout = ({ children }) => (
    <>
      {currentUser && <Navbar />} {/* ✅ Navbar only visible after login */}
      {children}
    </>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={currentUser ? <Navigate to="/home" replace /> : <Login />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/study-groups"
            element={
              <ProtectedRoute>
                <Layout>
                  <StudyGroups />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
