import mongoose from "mongoose";

// Section schema for multiple headings, content, and images
const SectionSchema = new mongoose.Schema({
  heading: { type: String, required: false },
  content: { type: String, required: true },
  image: { type: String, required: false },

  // heading styles
  headingBgColor: { type: String, default: "#ffffff" },
  headingTextColor: { type: String, default: "#000000" },

  // content styles
  contentBgColor: { type: String, default: "#ffffff" },
  contentTextColor: { type: String, default: "#000000" },
});
const newsSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    content: String,               // Old content field remains
    sections: [SectionSchema],     // ✅ New rich content sections

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    featuredImage: String,
    images: [String],

    // ❤️ LIKE
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [String],

    // 👁️ VIEW TRACKING
   views: {
  type: Number,
  default: 0
},
viewedBy: {
  type: [String],
  default: []
},
    // 🔗 SHARE TRACKING
    shares: {
  type: Number,
  default: 0
},
sharedBy: {
  type: [String],
  default: []
},

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