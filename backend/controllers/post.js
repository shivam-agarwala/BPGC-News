import { db } from "../db.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the root directory (main project directory)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..", ".."); // Adjust based on your project structure

// Ensure the 'uploads' directory exists at the root level
const uploadDir = path.join(rootDir, "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage }).single("image");

const generateUniqueId = async () => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    uniqueId = Math.floor(100 + Math.random() * 900);

    // Check if the ID already exists in the database
    const [existing] = await db
      .promise()
      .query("SELECT id FROM posts WHERE id = ?", [uniqueId]);

    if (existing.length === 0) {
      isUnique = true; // ID is unique, break the loop
    }
  }

  return uniqueId;
};

export const addPost = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ message: "File upload failed" });
    }

    // Check if user is authenticated via JWT cookie
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, "secretkey", async (err, userInfo) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      const { desc } = req.body;
      const img = req.file ? `/uploads/${req.file.filename}` : null;

      // Generate a unique 3-digit ID
      const uniqueId = await generateUniqueId(); // Example: 428

      // Insert post into the database
      const q =
        "INSERT INTO posts (`id`, `desc`, `img`, `createdAt`, `userId`) VALUES (?)";
      const values = [uniqueId, desc, img, new Date(), userInfo.id];

      db.query(q, [values], (err, result) => {
        if (err) {
          console.error("Error adding post:", err);
          return res.status(500).json({ message: "Database error" });
        }

        return res.status(200).json({
          message: "Post created successfully!",
          postId: uniqueId, // Return the generated ID
        });
      });
    });
  });
};

export const getPosts = (req, res) => {
  // Fetch posts from the database
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const q = "SELECT * FROM posts ORDER BY createdAt DESC";

    db.query(q, (err, data) => {
      if (err) {
        console.error("Error fetching posts:", err);
        return res.status(500).json({ message: "Database error" });
      }

      return res.status(200).json(data);
    });
  });
};

export const likePosts = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const postId = req.params.postId;
    try {
      // Check if already liked
      const [existing] = await db
        .promise()
        .query("SELECT * FROM likes WHERE userId = ? AND postId = ?", [
          userInfo.id,
          postId,
        ]);

      if (existing.length === 0) {
        // Insert new like
        await db
          .promise()
          .query("INSERT INTO likes (userId, postId) VALUES (?, ?)", [
            userInfo.id,
            postId,
          ]);
        await db
          .promise()
          .query("UPDATE posts SET likes = likes + 1 WHERE id = ?", [postId]);

        return res.status(200).json({ message: "Liked" });
      }

      return res.status(400).json({ message: "Already liked" });
    } catch (error) {
      console.error("Error liking post:", error);
      res.status(500).json({ message: "Database error" });
    }
  });
};

export const unlikePosts = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const postId = req.params.postId;
    try {
      // Remove like
      await db
        .promise()
        .query("DELETE FROM likes WHERE userId = ? AND postId = ?", [
          userInfo.id,
          postId,
        ]);
      await db
        .promise()
        .query("UPDATE posts SET likes = likes - 1 WHERE id = ?", [postId]);

      return res.status(200).json({ message: "Unliked" });
    } catch (error) {
      console.error("Error unliking post:", error);
      res.status(500).json({ message: "Database error" });
    }
  });
};

export const isLiked = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ liked: false });

  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json({ liked: false });

    const postId = req.params.postId;
    try {
      const [existing] = await db
        .promise()
        .query("SELECT * FROM likes WHERE userId = ? AND postId = ?", [
          userInfo.id,
          postId,
        ]);

      return res.status(200).json({ liked: existing.length > 0 });
    } catch (error) {
      console.error("Error checking like status:", error);
      res.status(500).json({ liked: false });
    }
  });
};

export const addComment = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const { postId, desc } = req.body;
    const q =
      "INSERT INTO comments (`userId`, `postId`, `desc`, `createdAt`) VALUES (?)";
    const values = [userInfo.id, postId, desc, new Date()];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json({ message: "Comment added successfully" });
    });
  });
};

export const getComments = async (req, res) => {
  const q = `
  SELECT c.id, c.desc, c.createdAt, u.id AS userId, u.name, u.profilePic 
  FROM comments c
  JOIN users u ON c.userId = u.id
  WHERE c.postId = ?
  ORDER BY c.createdAt DESC
`;

  db.query(q, [req.params.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
