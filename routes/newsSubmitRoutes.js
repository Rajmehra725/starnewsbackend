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

const router = express.Router();

router.post("/", createNews);
router.get("/", getAllNews);
router.get("/pending", getPendingNews);
router.get("/approved", getApprovedNews);
router.put("/approve/:id", approveNews);
router.put("/reject/:id", rejectNews);
router.put("/:id", updateNews);
router.delete("/:id", deleteNews);

export default router;