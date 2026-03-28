import News from "../models/News.js";
import slugify from "slugify";

// ✅ CREATE
export const createNews = async (req, res) => {
  try {
    const { title, description, category, content, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title & Content required" });
    }

    const slug = slugify(title, { lower: true });

    const featuredImage =
      req.files?.featuredImage?.[0]?.path || "";

    const images =
      req.files?.images?.map((file) => file.path) || [];

    // ✅ CONTENT BLOCKS PARSE + IMAGE MAP
    let contentBlocks = [];
    if (req.body.contentBlocks) {
      contentBlocks = JSON.parse(req.body.contentBlocks);

      contentBlocks = contentBlocks.map((block) => {
        if (block.type === "image" && block.imageIndex !== undefined) {
          return {
            ...block,
            url: req.files?.images?.[block.imageIndex]?.path || "",
          };
        }
        return block;
      });
    }

    const news = await News.create({
      title,
      slug,
      description,
      category,
      content,
      status,
      featuredImage,
      images,
      contentBlocks, // ✅ ADD
    });

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET (only published)
export const getNews = async (req, res) => {
  try {
    const data = await News.find({ isDeleted: false })
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET SINGLE (by slug)
export const getSingleNews = async (req, res) => {
  try {
    const news = await News.findOne({
      slug: req.params.slug,
      isDeleted: false,
    });

    if (!news) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(news);
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

    const slug = req.body.title
      ? slugify(req.body.title, { lower: true })
      : existing.slug;

    const featuredImage =
      req.files?.featuredImage?.[0]?.path || existing.featuredImage;

    const images =
      req.files?.images?.length > 0
        ? req.files.images.map((file) => file.path)
        : existing.images;

    // ✅ CONTENT BLOCKS PARSE + IMAGE MAP
    let contentBlocks = existing.contentBlocks || [];

    if (req.body.contentBlocks) {
      contentBlocks = JSON.parse(req.body.contentBlocks);

      contentBlocks = contentBlocks.map((block) => {
        if (block.type === "image" && block.imageIndex !== undefined) {
          return {
            ...block,
            url: req.files?.images?.[block.imageIndex]?.path || block.url,
          };
        }
        return block;
      });
    }

    const updated = await News.findByIdAndUpdate(
      id,
      {
        ...req.body,
        slug,
        featuredImage,
        images,
        contentBlocks, // ✅ ADD
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// ✅ DELETE (Soft Delete)
export const deleteNews = async (req, res) => {
  try {
    await News.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ VIEW (Unique View)
export const incrementViews = async (req, res) => {
  try {
    const { visitorId } = req.body;

    const news = await News.findById(req.params.id);

    if (!news.viewedBy.includes(visitorId)) {
      news.viewedBy.push(visitorId);
      news.views += 1;
      await news.save();
    }

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ SHARE
export const incrementShares = async (req, res) => {
  try {
    const { visitorId } = req.body;

    const news = await News.findById(req.params.id);

    if (!news.sharedBy.includes(visitorId)) {
      news.sharedBy.push(visitorId);
      news.shares += 1;
      await news.save();
    }

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ LIKE SYSTEM (🔥 IMPORTANT)
export const toggleLike = async (req, res) => {
  try {
    const { visitorId } = req.body;

    const news = await News.findById(req.params.id);

    const alreadyLiked = news.likedBy.includes(visitorId);

    if (alreadyLiked) {
      news.likedBy = news.likedBy.filter(id => id !== visitorId);
      news.likes -= 1;
    } else {
      news.likedBy.push(visitorId);
      news.likes += 1;
    }

    await news.save();

    res.json(news);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};