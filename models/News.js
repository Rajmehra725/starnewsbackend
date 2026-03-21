import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    content: String,
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    featuredImage: String,
    images: [String],

    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },

    // ❤️ LIKE
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [String],

    // 👁️ VIEW TRACKING
    viewedBy: [String],

    // 🔗 SHARE TRACKING (NEW ADD)
    sharedBy: [String],

    // 💬 COMMENTS
    comments: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        text: String,
        visitorId: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("News", newsSchema);