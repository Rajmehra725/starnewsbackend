import express from "express";
import {
  createNews,
  getAllNews,
  getPendingNews,
  getApprovedNews,
  approveNews,
  rejectNews,
  updateNews,
  deleteNews,
} from "../controllers/newsSubmitController.js";

import upload from "../middleware/upload.js"; // ✅ ADD THIS

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 }
  ]),
  createNews
);

router.get("/", getAllNews);
router.get("/pending", getPendingNews);
router.get("/approved", getApprovedNews);
router.put("/approve/:id", approveNews);
router.put("/reject/:id", rejectNews);
router.put("/:id", updateNews);
router.delete("/:id", deleteNews);

export default router;