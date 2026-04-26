import News from "../models/Chhatarpur.js";

// ✅ CREATE
export const createNews = async (req, res) => {
  try {
    const { title, description, category, content, status, sections } = req.body;

    // 🔥 Cloudinary URL
    const featuredImage =
      req.files?.featuredImage?.[0]?.path || "";

    const images =
      req.files?.images?.map((file) => file.path) || [];

    const news = await News.create({
      title,
      description,
      category,
      content,
      sections: sections ? JSON.parse(sections) : [], // ✅ parse sections JSON
      status,
      featuredImage,
      images,
    });

    res.json(news);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET
export const getNews = async (req, res) => {
  try {
    const data = await News.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE
export const updateNews = async (req, res) => {
  try {
    const id = req.params.id;

    const existing = await News.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "News not found" });
    }

    const featuredImage =
      req.files?.featuredImage?.[0]?.path || existing.featuredImage;

    const images =
      req.files?.images?.length > 0
        ? req.files.images.map((file) => file.path)
        : existing.images;

    const updated = await News.findByIdAndUpdate(
      id,
      {
        ...req.body,
        sections: req.body.sections
          ? JSON.parse(req.body.sections) // ✅ parse sections JSON
          : existing.sections,
        featuredImage,
        images,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE
export const deleteNews = async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ VIEW
export const incrementViews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ SHARE
export const incrementShares = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { $inc: { shares: 1 } },
      { new: true }
    );

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};