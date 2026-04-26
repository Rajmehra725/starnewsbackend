import mongoose from "mongoose";

// Section schema for multiple headings, content, and images
const SectionSchema = new mongoose.Schema({
  heading: { type: String, required: false },        // Optional heading
  content: { type: String, required: true },        // Main paragraph
  image: { type: String, required: false },         // Optional image
  bgColor: { type: String, default: "#ffffff" },    // Heading background color
  textColor: { type: String, default: "#000000" },  // Heading text color
});

const satnaSchema = new mongoose.Schema(
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
    viewedBy: [String],

    // 🔗 SHARE TRACKING
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

export default mongoose.model("Satna", satnaSchema);