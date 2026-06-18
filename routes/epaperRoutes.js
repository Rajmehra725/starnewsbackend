import express from "express";
import upload from "../middleware/upload.js";

import {
  createEpaper,
  getEpapers,
  getEpaperById,
  updateEpaper,
  deleteEpaper,
  deleteMultipleEpapers,
} from "../controllers/epaperController.js";

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  createEpaper
);

router.get("/", getEpapers);

router.get("/:id", getEpaperById);

router.put(
  "/:id",
  upload.single("image"),
  updateEpaper
);

router.delete("/:id", deleteEpaper);

router.delete("/", deleteMultipleEpapers);

export default router;