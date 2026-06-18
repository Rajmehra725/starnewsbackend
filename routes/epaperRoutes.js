import express from "express";
import upload from "../middleware/upload.js";

import {
  createEpaper,
  getEpapers,
  getEpaperById,
  updateEpaper,
  deleteEpaper,
} from "../controllers/epaperController.js";

const router = express.Router();

router.post(
  "/",
  upload.array("pages", 100),
  createEpaper
);

router.get("/", getEpapers);

router.get("/:id", getEpaperById);

router.put(
  "/:id",
  upload.array("pages", 100),
  updateEpaper
);

router.delete("/:id", deleteEpaper);

export default router;