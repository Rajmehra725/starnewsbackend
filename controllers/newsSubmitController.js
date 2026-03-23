import NewsSubmit from "../models/NewsSubmit.js";

// 📰 Create News (User)
export const createNews = async (req, res) => {
  try {
    const news = new NewsSubmit({
      ...req.body,
      status: "pending",
    });

    await news.save();
    res.json({ message: "News submitted successfully", news });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 Get All News (Admin)
export const getAllNews = async (req, res) => {
  try {
    const news = await NewsSubmit.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⏳ Get Pending News
export const getPendingNews = async (req, res) => {
  try {
    const news = await NewsSubmit.find({ status: "pending" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🌐 Get Approved News (Frontend)
export const getApprovedNews = async (req, res) => {
  try {
    const news = await NewsSubmit.find({ status: "approved" })
      .sort({ createdAt: -1 });

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Approve News
export const approveNews = async (req, res) => {
  try {
    await NewsSubmit.findByIdAndUpdate(req.params.id, {
      status: "approved",
    });

    res.json({ message: "News approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ Reject News
export const rejectNews = async (req, res) => {
  try {
    await NewsSubmit.findByIdAndUpdate(req.params.id, {
      status: "rejected",
    });

    res.json({ message: "News rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update News
export const updateNews = async (req, res) => {
  try {
    const updated = await NewsSubmit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Delete News
export const deleteNews = async (req, res) => {
  try {
    await NewsSubmit.findByIdAndDelete(req.params.id);
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};