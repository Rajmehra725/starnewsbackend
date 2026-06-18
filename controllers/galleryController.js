import NewsAlbum from "../models/Gallery.js";
import path from "path";

// =========================
// Helper: Build Image URL
// =========================
const getImageUrl = (req, filename) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/${filename}`;
};

// =========================
// Create Album
// =========================
export const createAlbum = async (req, res) => {
  try {
    const { title, description } = req.body;

    const images =
      req.files?.map((file) => ({
        public_id: file.filename,
        url: getImageUrl(req, file.filename),
      })) || [];

    const album = await NewsAlbum.create({
      title,
      description,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Album created successfully",
      album,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Albums
// =========================
export const getAlbums = async (req, res) => {
  try {
    const albums = await NewsAlbum.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: albums.length,
      albums,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Single Album
// =========================
export const getAlbumById = async (req, res) => {
  try {
    const album = await NewsAlbum.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    res.status(200).json({
      success: true,
      album,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update Album
// =========================
export const updateAlbum = async (req, res) => {
  try {
    const { title, description } = req.body;

    const album = await NewsAlbum.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    let images = album.images;

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        public_id: file.filename,
        url: getImageUrl(req, file.filename),
      }));
    }

    album.title = title || album.title;
    album.description = description || album.description;
    album.images = images;

    await album.save();

    res.status(200).json({
      success: true,
      message: "Album updated successfully",
      album,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Album
// =========================
export const deleteAlbum = async (req, res) => {
  try {
    const album = await NewsAlbum.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    await album.deleteOne();

    res.status(200).json({
      success: true,
      message: "Album deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Multiple Albums
// =========================
export const deleteMultipleAlbums = async (req, res) => {
  try {
    const { ids } = req.body;

    await NewsAlbum.deleteMany({
      _id: { $in: ids },
    });

    res.status(200).json({
      success: true,
      message: "Albums deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};