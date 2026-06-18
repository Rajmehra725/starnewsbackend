import Epaper from "../models/Epaper.js";

// =========================
// Helper: Build Image URL
// =========================
const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

// =========================
// Create Epaper
// =========================
export const createEpaper = async (req, res) => {
  try {
    const { title, publishDate } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image required",
      });
    }

    const epaper = await Epaper.create({
      title,
      publishDate,
      image: {
        public_id: req.file.filename,
        url: getImageUrl(req, req.file.filename),
      },
    });

    res.status(201).json({
      success: true,
      message: "Epaper created successfully",
      epaper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get All Epapers
// =========================
export const getEpapers = async (req, res) => {
  try {
    const epapers = await Epaper.find().sort({
      publishDate: -1,
    });

    res.status(200).json({
      success: true,
      count: epapers.length,
      epapers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Get Single Epaper
// =========================
export const getEpaperById = async (req, res) => {
  try {
    const epaper = await Epaper.findById(req.params.id);

    if (!epaper) {
      return res.status(404).json({
        success: false,
        message: "Epaper not found",
      });
    }

    res.status(200).json({
      success: true,
      epaper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Update Epaper
// =========================
export const updateEpaper = async (req, res) => {
  try {
    const { title, publishDate } = req.body;

    const epaper = await Epaper.findById(req.params.id);

    if (!epaper) {
      return res.status(404).json({
        success: false,
        message: "Epaper not found",
      });
    }

    // If new image uploaded
    if (req.file) {
      epaper.image = {
        public_id: req.file.filename,
        url: getImageUrl(req, req.file.filename),
      };
    }

    epaper.title = title || epaper.title;
    epaper.publishDate = publishDate || epaper.publishDate;

    await epaper.save();

    res.status(200).json({
      success: true,
      message: "Epaper updated successfully",
      epaper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Epaper
// =========================
export const deleteEpaper = async (req, res) => {
  try {
    const epaper = await Epaper.findById(req.params.id);

    if (!epaper) {
      return res.status(404).json({
        success: false,
        message: "Epaper not found",
      });
    }

    await epaper.deleteOne();

    res.status(200).json({
      success: true,
      message: "Epaper deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Delete Multiple Epapers
// =========================
export const deleteMultipleEpapers = async (req, res) => {
  try {
    const { ids } = req.body;

    await Epaper.deleteMany({
      _id: { $in: ids },
    });

    res.status(200).json({
      success: true,
      message: "Epapers deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};