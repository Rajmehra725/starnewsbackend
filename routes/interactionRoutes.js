import express from "express";
import {
  toggleLike,
  addComment,
  deleteComment,
  getComments,
  addView,     // 🔥 ADD
  addShare,    // 🔥 ADD
} from "../controllers/interactionController.js";

const router = express.Router();

// ❤️ LIKE
router.post("/like/:newsId", toggleLike);

// 💬 COMMENTS
router.post("/comment/:newsId", addComment);
router.get("/comment/:newsId", getComments);
router.delete("/comment/:newsId/:commentId", deleteComment);

// 👁️ VIEW (ADD ONLY)
router.post("/view/:newsId", addView);

// 🔗 SHARE (ADD ONLY)
router.post("/share/:newsId", addShare);

export default router;