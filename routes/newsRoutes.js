import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";

import {
  createNews,
  getNews,
  updateNews,
  deleteNews,
  incrementViews,
  incrementShares,
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

router.get("/", getNews);
router.delete("/:id", deleteNews);
router.put("/view/:id", incrementViews);
router.put("/share/:id", incrementShares);

export default router;