// routes/idCardRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  createIdCard,
  getAllIdCards,
  getIdCard,
  updateIdCard,
  deleteIdCard
} from "../controllers/idCardController.js";

const router = express.Router();

// Multer setup for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("photo"), createIdCard);
router.get("/", getAllIdCards);
router.get("/:id", getIdCard);
router.put("/:id", upload.single("photo"), updateIdCard);
router.delete("/:id", deleteIdCard);

export default router;