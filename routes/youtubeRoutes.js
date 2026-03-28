// routes/youtubeRoutes.js
import express from "express";
import { addLink, getAllLinks, deleteLink } from "../controllers/youtubeController.js";

const router = express.Router();

// Add new channel
router.post("/add", addLink);

// Get all channels
router.get("/all", getAllLinks);

// Delete a channel
router.delete("/delete/:id", deleteLink);

export default router;