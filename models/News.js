import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      index: true,
    },

    tags: {
      type: [String],
      index: true,
    },

    // SEO
    metaTitle: String,
    metaDescription: String,
    keywords: [String],

    // Author Info
    author: {
      name: {
        type: String,
        default: "Admin",
      },
      avatar: String,
    },

    // Location Based News
    location: {
      state: {
        type: String,
        index: true,
      },
      city: String,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },

    // Highlight Flags
    isBreaking: {
      type: Boolean,
      default: false,
      index: true,
    },

    isTrending: {
      type: Boolean,
      default: false,
      index: true,
    },

    readTime: String,

    // Media
    featuredImage: {
      type: String,
      required: true,
    },

    images: [String],

    // Analytics
    views: {
      type: Number,
      default: 0,
      index: true,
    },

    shares: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    // Unique user tracking
    likedBy: [
      {
        visitorId: String,
      },
    ],

    viewedBy: [
      {
        visitorId: String,
      },
    ],

    sharedBy: [
      {
        visitorId: String,
      },
    ],

    // Comments System
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        visitorId: String,

        replies: [
          {
            text: {
              type: String,
              required: true,
            },
            visitorId: String,
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],

        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// 🔥 Important Indexes (Performance Boost)
newsSchema.index({ title: "text", description: "text", content: "text" });
newsSchema.index({ createdAt: -1 });
newsSchema.index({ views: -1 });
newsSchema.index({ isBreaking: 1, isTrending: 1 });

export default mongoose.model("News", newsSchema);