const express = require("express");
const router = express.Router();

const {
  createEntry,
  getAll,
  deleteEntry,
  updateEntry,
} = require("../controllers/formController");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/create", upload.single("photo"), createEntry);
router.get("/all", getAll);
router.delete("/delete/:id", deleteEntry);
router.put("/update/:id", upload.single("photo"), updateEntry);

module.exports = router;
