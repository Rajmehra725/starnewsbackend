// 📰 Create News (User)
import NewsSubmit from "../models/NewsSubmit.js";
import cloudinary from "../config/cloudinary.js";

// 📰 Create News
export const createNews = async (req, res) => {
  try {
    let imageUrls = [];
    let videoUrl = "";

    // 📸 Upload Images
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
        });

        imageUrls.push(result.secure_url);
      }
    }

    // 🎥 Upload Video
    if (req.files && req.files.video && req.files.video.length > 0) {
      const file = req.files.video[0];

      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "video",
      });

      videoUrl = result.secure_url;
    }

    const news = new NewsSubmit({
      ...req.body,
      images: imageUrls,
      video: videoUrl,
      status: "pending",
    });

    await news.save();

    res.status(201).json({
      message: "News submitted successfully",
      news,
    });

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


// ⏳ Get Pending
export const getPendingNews = async (req, res) => {
  try {
    const news = await NewsSubmit.find({ status: "pending" })
      .sort({ createdAt: -1 });

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🌐 Approved News (Frontend)
export const getApprovedNews = async (req, res) => {
  try {
    const news = await NewsSubmit.find({ status: "approved" })
      .sort({ createdAt: -1 });

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Approve
export const approveNews = async (req, res) => {
  try {
    const updated = await NewsSubmit.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    res.json({
      message: "News approved",
      news: updated,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ❌ Reject
export const rejectNews = async (req, res) => {
  try {
    const updated = await NewsSubmit.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    res.json({
      message: "News rejected",
      news: updated,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✏️ Update
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


// 🗑️ Delete
export const deleteNews = async (req, res) => {
  try {
    await NewsSubmit.findByIdAndDelete(req.params.id);

    res.json({ message: "News deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};