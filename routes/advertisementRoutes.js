import express from "express";
import {
  createAdvertisement,
  getAdvertisements,
  updateAdvertisement,
  deleteAdvertisement,
  deleteMultipleAds,
} from "../controllers/advertisementController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * CREATE (MULTIPLE FILES)
 */
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 5 },
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 2 },
  ]),
  createAdvertisement
);

/**
 * GET ALL / FILTER BY POSITION
 * /api/ads?position=middle
 */
router.get("/", getAdvertisements);

/**
 * UPDATE
 */
router.put("/:id", upload.single("image"), updateAdvertisement);

/**
 * DELETE SINGLE
 */
router.delete("/:id", deleteAdvertisement);

/**
 * DELETE MULTIPLE
 */
router.post("/delete-multiple", deleteMultipleAds);

export default router;