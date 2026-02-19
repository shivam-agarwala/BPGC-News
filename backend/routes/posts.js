import express from "express";
import {
  addComment,
  addPost,
  getComments,
  getPosts,
  isLiked,
  likePosts,
  unlikePosts,
} from "../controllers/post.js";

const router = express.Router();

router.post("/addPost", addPost);

router.get("/getPosts", getPosts);

router.post("/:postId/like", likePosts);

router.post("/:postId/unlike", unlikePosts);

router.get("/:postId/isLiked", isLiked);

router.post("/comment/add", addComment);

router.get("/comments/:postId", getComments);

// Unlike a post
// Check if user liked post
export default router;
