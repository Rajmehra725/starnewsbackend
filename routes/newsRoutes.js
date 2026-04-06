import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";

import {
  createNews,
  getNews,
  updateNews,
  deleteNews,
  incrementShares,
  toggleLike,
  addView,
  addShare,
  addComment,
  getComments,
  deleteComment,
  updateComment,
} from "../controllers/newsController.js";

const router = express.Router();
const upload = multer({ storage });

// ✅ CREATE
router.post(
  "/",
  upload.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createNews
);

// ✅ UPDATE (IMPORTANT FIX)
router.put(
  "/:id",
  upload.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateNews
);
router.post("/:id/like", toggleLike);
router.post("/:id/view", addView);
router.post("/:id/share", addShare);
router.post("/news/:id/view", addView);
router.post("/:id/comment", addComment);
router.get("/:id/comments", getComments);
router.delete("/:newsId/comment/:commentId", deleteComment);
router.put("/:newsId/comment/:commentId", updateComment);
router.get("/", getNews);
router.delete("/:id", deleteNews);
router.put("/share/:id", incrementShares);

export default router;