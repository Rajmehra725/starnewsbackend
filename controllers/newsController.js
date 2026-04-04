import News from "../models/News.js";

// ✅ CREATE
export const createNews = async (req, res) => {
  try {
    const { title, description, category, content, status, sections } = req.body;

    console.log("📌 STATUS:", status); // DEBUG

    // 🖼️ Images
    const featuredImage = req.files?.featuredImage?.[0]?.path || "";
    const images = req.files?.images?.map((file) => file.path) || [];

    // 🧠 Sections parse
    let parsedSections = [];
    if (sections) {
      try {
        parsedSections = JSON.parse(sections);
      } catch (e) {
        console.log("Sections parse error:", e.message);
      }
    }

    // 💾 Save news
    const news = await News.create({
      title,
      description,
      category,
      content,
      sections: parsedSections,
      status,
      featuredImage,
      images,
    });

    // 🔔 SEND NOTIFICATION
    if (status && status.toLowerCase() === "published") {
      try {
        const response = await axios.post(
          "https://onesignal.com/api/v1/notifications",
          {
            app_id: "eeee5e2f-e240-4204-b29b-32b080e46210",

            // Send to all subscribed users
            included_segments: ["Subscribed Users"],

            headings: { en: `🔥 ${category} News` },
            contents: { en: title },
            url: `https://starnewsnetworks.com/news/${news._id}`,

            // Images (fully qualified HTTPS URLs)
            big_picture: featuredImage
              ? `https://starnewsnetworks.com/${featuredImage}`
              : images[0]
              ? `https://starnewsnetworks.com/${images[0]}`
              : undefined,

            chrome_web_image: featuredImage
              ? `https://starnewsnetworks.com/${featuredImage}`
              : images[0]
              ? `https://starnewsnetworks.com/${images[0]}`
              : undefined,

            // Icons
            small_icon: "https://starnewsnetworks.com/logo.jpeg",
            large_icon: featuredImage
              ? `https://starnewsnetworks.com/${featuredImage}`
              : "https://starnewsnetworks.com/logo.jpeg",

            // Action buttons
            buttons: [
              {
                id: "read",
                text: "📖 Read Now",
                url: `https://starnewsnetworks.com/news/${news._id}`,
              },
            ],
          },
          {
            headers: {
              Authorization:
                "Basic os_v2_app_53xf4l7cibbajmu3gkyibzdccarxqfddaluuu4ffpbsazy4h262u4osufsmceky4rtn2kkjgw5zv4rjtrdpngxp3aovtpvplxbo7y3a",
              "Content-Type": "application/json",
            },
          }
        );

        console.log("✅ Notification Sent:", response.data);
      } catch (err) {
        console.log(
          "❌ Notification Error:",
          err.response?.data || err.message
        );
      }
    }

    res.json({
      success: true,
      data: news,
    });
  } catch (err) {
    console.error("❌ Error:", err);
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
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const news = await News.findById(id);
    if (!news) return res.status(404).json({ msg: "News not found" });

    const liked = news.likedBy.includes(userId);

    if (liked) {
      news.likedBy = news.likedBy.filter(u => u !== userId);

      // ✅ Prevent negative likes
      news.likes = Math.max(0, news.likes - 1);
    } else {
      news.likedBy.push(userId);
      news.likes += 1;
    }

    await news.save();

    res.json({
      likes: news.likes,
      liked: !liked
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 👁️ VIEW
export const addView = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const news = await News.findById(id);
    if (!news) return res.status(404).json({ msg: "News not found" });

    // ✅ unique view
    if (!news.viewedBy.includes(userId)) {
      news.viewedBy.push(userId);
    }

    // ✅ sync views count
    news.views = news.viewedBy.length;

    await news.save();

    // 🔥 SOCKET EMIT (MOST IMPORTANT)
    const io = req.app.get("io");
    io.emit("viewsUpdated", {
      newsId: news._id,
      views: news.views,
    });

    res.json({ views: news.views });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// 🔗 SHARE
export const addShare = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const news = await News.findById(id);
    if (!news) return res.status(404).json({ msg: "News not found" });

    if (!news.sharedBy.includes(userId)) {
      news.sharedBy.push(userId);
    }

    await news.save();
    res.json({ shares: news.sharedBy.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 💬 ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, visitorId, name } = req.body;

    const news = await News.findById(id);
    if (!news) return res.status(404).json({ msg: "News not found" });

    news.comments.push({ text, visitorId, name });
    await news.save();

    res.json(news.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📥 GET COMMENTS
export const getComments = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).select("comments");
    if (!news) return res.status(404).json({ msg: "News not found" });

    res.json(news.comments.reverse());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ❌ DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const { newsId, commentId } = req.params;
    const { visitorId } = req.body;

    const news = await News.findById(newsId);
    const comment = news.comments.id(commentId);

    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    if (comment.visitorId !== visitorId)
      return res.status(403).json({ msg: "Unauthorized" });

    comment.deleteOne();
    await news.save();

    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ UPDATE COMMENT
export const updateComment = async (req, res) => {
  try {
    const { newsId, commentId } = req.params;
    const { text, visitorId } = req.body;

    const news = await News.findById(newsId);
    const comment = news.comments.id(commentId);

    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    if (comment.visitorId !== visitorId)
      return res.status(403).json({ msg: "Unauthorized" });

    comment.text = text;
    await news.save();

    res.json(comment);
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