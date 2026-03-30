import mongoose from "mongoose";
import News from "../models/News.js";
import { io } from "../index.js";


// ❤️ LIKE TOGGLE
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ msg: "visitorId required" });
    }

    const news = await findNewsByIdOrSlug(id);

    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    news.likedBy = news.likedBy || [];

    const alreadyLiked = news.likedBy.includes(visitorId);

    if (alreadyLiked) {
      news.likes = Math.max(0, news.likes - 1);
      news.likedBy.pull(visitorId);
    } else {
      news.likes += 1;
      news.likedBy.push(visitorId);
    }

    await news.save();

    io.emit("likeUpdated", {
      newsId: news._id,
      likes: news.likes,
    });

    res.json({ success: true, likes: news.likes });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};


// 💬 ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, visitorId } = req.body;

    if (!text || !visitorId) {
      return res.status(400).json({ msg: "Text & visitorId required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    const comment = {
      text,
      visitorId,
      createdAt: new Date(),
    };

    news.comments = news.comments || [];
    news.comments.push(comment);

    await news.save();

    const newComment = news.comments.at(-1);

    io.emit("newComment", {
      newsId: id,
      comment: newComment,
    });

    res.json({ success: true, comment: newComment });
  } catch (error) {
    console.error("COMMENT ERROR:", error);
    res.status(500).json({ msg: error.message });
  }
};


// ❌ DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const { newsId, commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    news.comments = news.comments.filter(
      (c) => c._id.toString() !== commentId
    );

    await news.save();

    io.emit("commentDeleted", {
      newsId,
      commentId,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


// 📥 GET COMMENTS
export const getComments = async (req, res) => {
  try {
    const { newsId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    res.json({
      success: true,
      comments: news.comments,
    });
  } catch (error) {
    console.error("FETCH ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


// 👁️ VIEW (SAFE FIX)
export const addView = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ msg: "visitorId required" });
    }

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    news.viewedBy = news.viewedBy || [];

    if (!news.viewedBy.includes(visitorId)) {
      news.views = (news.views || 0) + 1;
      news.viewedBy.push(visitorId);
    }

    await news.save();

    io.emit("viewUpdated", {
      newsId,
      views: news.views,
    });

    res.json({ success: true, views: news.views });
  } catch (error) {
    console.error("VIEW ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};


// 🔗 SHARE
export const addShare = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ msg: "visitorId required" });
    }

    if (!mongoose.Types.ObjectId.isValid(newsId)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    news.sharedBy = news.sharedBy || [];

    if (!news.sharedBy.includes(visitorId)) {
      news.shares = (news.shares || 0) + 1;
      news.sharedBy.push(visitorId);
    }

    await news.save();

    io.emit("shareUpdated", {
      newsId,
      shares: news.shares,
    });

    res.json({ success: true, shares: news.shares });
  } catch (error) {
    console.error("SHARE ERROR:", error);
    res.status(500).json({ msg: "Server error" });
  }
};