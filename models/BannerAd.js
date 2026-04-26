import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
{
  text: String,
  user: String,
},
{ timestamps: true }
);

const bannerSchema = new mongoose.Schema(
{
  url: String,        // image ya video dono ka url
  publicId: String,

  type: {
    type: String,
    enum: ["image", "video"],
    default: "image"
  },

  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },

  comments: [commentSchema],

  isActive: { type: Boolean, default: true }
},
{ timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);