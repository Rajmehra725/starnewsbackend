import mongoose from "mongoose";

const epaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    publishDate: {
      type: Date,
      default: Date.now,
    },

    image: {
      public_id: String,
      url: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Epaper", epaperSchema);