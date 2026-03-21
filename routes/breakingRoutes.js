import express from "express";
import {
  addBreaking,
  getBreaking,
  updateBreaking,
  deleteBreaking,
  toggleBreaking,
} from "../controllers/breakingController.js";

const router = express.Router();

// ➕ ADD
router.post("/", addBreaking);

// 📥 GET ALL
router.get("/", getBreaking);

// ✏️ UPDATE
router.put("/:id", updateBreaking);

// ❌ DELETE
router.delete("/:id", deleteBreaking);

// 🔄 TOGGLE ACTIVE
router.patch("/toggle/:id", toggleBreaking);

export default router;