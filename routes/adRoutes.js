// File: routes/adRoutes.js
import express from "express";
import multer from "multer";
import {
  createAd,
  getAds,
  getActiveAds,
  updateAd,
  deleteAd,
  toggleAd,
  clickAd,
} from "../controllers/adController.js";

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

router.post("/", upload.single("image"), createAd);
router.get("/", getAds);
router.get("/active", getActiveAds);
router.put("/:id", upload.single("image"), updateAd);
router.delete("/:id", deleteAd);
router.patch("/toggle/:id", toggleAd);
router.patch("/click/:id", clickAd);

export default router;