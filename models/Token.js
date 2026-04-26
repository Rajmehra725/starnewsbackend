import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true, // duplicate avoid karega
    },

    userId: {
      type: String,
      default: null,
    },

    device: {
      type: String,
      default: "android",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Token", tokenSchema);