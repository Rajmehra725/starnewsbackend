import mongoose from "mongoose";

const epaperSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    publishDate: {
      type: Date,
      required: true,
    },

    pages: [
      {
        public_id: String,
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Epaper", epaperSchema);