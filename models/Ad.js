import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    title: String,
    image: String,
    link: String,

    position: {
      type: String,
      enum: ["top", "sidebar", "infeed"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ad", adSchema);