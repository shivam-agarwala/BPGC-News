import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url"; // Required to get __dirname in ES modules
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import studyGroupRoutes from "./routes/studyGroups.js";
import { db } from "./db.js";

const app = express();

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define uploads path dynamically (relative to the **root directory**)
const uploadsPath = path.join(__dirname, "..", "public", "uploads");

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());

// Serve static files from the uploads folder dynamically
console.log("Serving static files from:", uploadsPath);
app.use("/uploads", express.static(uploadsPath));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use("/api/study-groups", studyGroupRoutes);

// Test DB connection
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

app.listen(8800, () => {
  console.log("Backend server running on port 8800!");
});
