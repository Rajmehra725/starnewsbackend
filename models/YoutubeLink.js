import mongoose from "mongoose";

const YoutubeLinkSchema = new mongoose.Schema({
  channelName: { type: String, required: true },
  link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const YoutubeLink = mongoose.model("YoutubeLink", YoutubeLinkSchema);
export default YoutubeLink;