import express from "express";
import { saveToken } from "../controllers/tokenController.js";

const router = express.Router();

// 📥 Save token
router.post("/save-token", saveToken);

export default router;