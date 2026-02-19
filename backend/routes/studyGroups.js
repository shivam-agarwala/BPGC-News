import express from "express";
import { 
  createGroup,
  getGroups,
  getMyGroups,
  getGroupInvites,
  joinGroup,
  leaveGroup,
  handleInvite,
  searchGroups
} from "../controllers/studyGroup.js";

const router = express.Router();

// Get all discoverable groups (public + user's private groups)
router.get("/discover", getGroups);

// Get user's groups
router.get("/my-groups", getMyGroups);

// Get user's pending invites
router.get("/invites", getGroupInvites);

// Create a new group
router.post("/", createGroup);

// Join a group
router.post("/join/:groupId", joinGroup);

// Leave a group
router.delete("/leave/:groupId", leaveGroup);

// Handle group invite
router.put("/invite/:inviteId/:status", handleInvite);

// Search groups
router.get("/search", searchGroups);

export default router; 