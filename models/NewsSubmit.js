import mongoose from "mongoose";

const newsSubmitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: String,

  images: [String],
  video: String,

  location: String,
  district: String,
  date: Date,

  // User info
  name: String,
  mobile: String,
  email: String,

  tags: [String],
  isBreaking: { type: Boolean, default: false },
  urgency: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const NewsSubmit = mongoose.model("NewsSubmit", newsSubmitSchema);
export default NewsSubmit;