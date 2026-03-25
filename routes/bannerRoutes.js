import express from "express";
import upload from "../middleware/upload.js";

import {
createBanner,
getBanners,
updateBanner,
deleteBanner,
deleteMultipleBanners,
likeBanner,
shareBanner,
viewBanner,

addComment,
updateComment,
deleteComment

} from "../controllers/bannerController.js";

const router = express.Router();

// banner CRUD
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  createBanner
);
router.get("/", getBanners);

router.put("/:id", upload.single("image"), updateBanner);

router.delete("/:id", deleteBanner);

router.delete("/", deleteMultipleBanners);

// actions
router.post("/like/:id",likeBanner);
router.post("/share/:id",shareBanner);
router.post("/view/:id",viewBanner);

// comment CRUD
router.post("/comment/:id",addComment);
router.put("/comment/:bannerId/:commentId",updateComment);
router.delete("/comment/:bannerId/:commentId",deleteComment);

export default router;