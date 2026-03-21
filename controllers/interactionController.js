import News from "../models/News.js";
import { io } from "../index.js"; // 🔥 IMPORT SOCKET.IO INSTANCE

// ❤️ LIKE TOGGLE (REAL-TIME)
export const toggleLike = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ msg: "visitorId required" });
    }

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    const alreadyLiked = news.likedBy.includes(visitorId);

    if (alreadyLiked) {
      news.likes -= 1;
      news.likedBy = news.likedBy.filter((id) => id !== visitorId);
    } else {
      news.likes += 1;
      news.likedBy.push(visitorId);
    }

    await news.save();

    // 🔥 REAL-TIME UPDATE
    io.to(newsId).emit("likeUpdated", {
      newsId,
      likes: news.likes,
    });

    res.json({
      success: true,
      likes: news.likes,
      liked: !alreadyLiked,
    });
  } catch (error) {
    console.error("Like Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// 💬 ADD COMMENT (REAL-TIME)
export const addComment = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { text, visitorId } = req.body;

    if (!text || !visitorId) {
      return res.status(400).json({ msg: "Text and visitorId required" });
    }

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    const comment = {
      text,
      visitorId,
    };

    news.comments.push(comment);
    await news.save();

    const newComment = news.comments[news.comments.length - 1];

    // 🔥 REAL-TIME COMMENT
    io.to(newsId).emit("newComment", {
      newsId,
      comment: newComment,
    });

    res.json({
      success: true,
      comment: newComment,
    });
  } catch (error) {
    console.error("Comment Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// ❌ DELETE COMMENT (REAL-TIME)
export const deleteComment = async (req, res) => {
  try {
    const { newsId, commentId } = req.params;

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    news.comments = news.comments.filter(
      (c) => c._id.toString() !== commentId
    );

    await news.save();

    // 🔥 REAL-TIME DELETE
    io.to(newsId).emit("commentDeleted", {
      newsId,
      commentId,
    });

    res.json({
      success: true,
      msg: "Comment deleted",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📥 GET COMMENTS
export const getComments = async (req, res) => {
  try {
    const { newsId } = req.params;

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    res.json({
      success: true,
      comments: news.comments,
    });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
export const addView = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ msg: "visitorId required" });
    }

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    // ✅ UNIQUE VIEW
    if (!news.viewedBy.includes(visitorId)) {
      news.views += 1;
      news.viewedBy.push(visitorId);
    }

    await news.save();

    io.to(newsId).emit("viewUpdated", {
      newsId,
      views: news.views,
    });

    res.json({
      success: true,
      views: news.views,
    });
  } catch (error) {
    console.error("View Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
export const addShare = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ msg: "visitorId required" });
    }

    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ msg: "News not found" });
    }

    // ✅ UNIQUE SHARE
    if (!news.sharedBy.includes(visitorId)) {
      news.shares += 1;
      news.sharedBy.push(visitorId);
    }

    await news.save();

    io.to(newsId).emit("shareUpdated", {
      newsId,
      shares: news.shares,
    });

    res.json({
      success: true,
      shares: news.shares,
    });
  } catch (error) {
    console.error("Share Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};