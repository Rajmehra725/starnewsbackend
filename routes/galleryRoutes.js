import express from "express";
import upload from "../middleware/upload.js";

import {
  createAlbum,
  getAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
} from "../controllers/galleryController.js";

const router = express.Router();

router.post(
  "/",
  upload.array("images", 50),
  createAlbum
);

router.get("/", getAlbums);
router.get("/:id", getAlbumById);

router.put(
  "/:id",
  upload.array("images", 50),
  updateAlbum
);

router.delete("/:id", deleteAlbum);

export default router;