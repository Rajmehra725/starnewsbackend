import mongoose from "mongoose";

const advertisementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "",
    },

    position: {
      type: String,
      enum: ["top", "middle", "bottom", "sidebar"],
      default: "middle",
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Advertisement", advertisementSchema);