// controllers/youtubeController.js
import YoutubeLink from "../models/YoutubeLink.js";

// Add new link
export const addLink = async (req, res) => {
  try {
    const { channelName, link } = req.body;
    if (!channelName || !link)
      return res.status(400).json({ message: "All fields are required" });

    const newLink = new YoutubeLink({ channelName, link });
    await newLink.save();
    res.status(201).json(newLink);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all links
export const getAllLinks = async (req, res) => {
  try {
    const links = await YoutubeLink.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a link
export const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await YoutubeLink.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Link not found" });
    res.json({ message: "Link deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};