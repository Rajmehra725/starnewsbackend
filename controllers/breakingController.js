// File: controllers/breakingController.js
import BreakingNews from "../models/BreakingNews.js";

// ➕ ADD BREAKING
export const addBreaking = async (req, res) => {
  try {
    const news = await BreakingNews.create({
      text: req.body.text,
      isActive: req.body.isActive ?? true,
      priority: req.body.priority || 1,
    });

    // AJAX live update
    req.app.get("io")?.emit("breakingUpdated");

    res.status(201).json({ success: true, data: news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📥 GET ALL BREAKING
export const getBreaking = async (req, res) => {
  try {
    const data = await BreakingNews.find().sort({ priority: -1, createdAt: -1 });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✏️ UPDATE BREAKING
export const updateBreaking = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await BreakingNews.findByIdAndUpdate(
      id,
      { text: req.body.text, priority: req.body.priority },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Not found" });

    req.app.get("io")?.emit("breakingUpdated");

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ❌ DELETE BREAKING
export const deleteBreaking = async (req, res) => {
  try {
    const { id } = req.params;

    await BreakingNews.findByIdAndDelete(id);

    req.app.get("io")?.emit("breakingUpdated");

    res.json({ success: true, msg: "Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// 🔄 TOGGLE ACTIVE
export const toggleBreaking = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await BreakingNews.findById(id);
    if (!news) return res.status(404).json({ msg: "Not found" });

    news.isActive = !news.isActive;
    await news.save();

    req.app.get("io")?.emit("breakingUpdated");

    res.json({ success: true, data: news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};