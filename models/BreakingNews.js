import mongoose from "mongoose";

const breakingSchema = new mongoose.Schema(
  {
    text: String,

    isActive: {
      type: Boolean,
      default: true,
    },

    priority: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BreakingNews", breakingSchema);