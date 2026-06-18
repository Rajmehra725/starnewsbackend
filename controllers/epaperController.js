import Epaper from "../models/Epaper.js";

const getImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};


// Create Epaper
export const createEpaper = async (req, res) => {
  try {
    const { title, publishDate } = req.body;

    const pages =
      req.files?.map((file) => ({
        public_id: file.filename,
        url: getImageUrl(req, file.filename),
      })) || [];

    const epaper = await Epaper.create({
      title,
      publishDate,
      pages,
    });

    res.status(201).json({
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

// Get All
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

// Get Single
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

// Update
export const updateEpaper = async (req, res) => {
  try {
    const epaper = await Epaper.findById(req.params.id);

    if (!epaper) {
      return res.status(404).json({
        success: false,
        message: "Epaper not found",
      });
    }

    let pages = epaper.pages;

    if (req.files?.length > 0) {
      pages = req.files.map((file) => ({
        public_id: file.filename,
        url: getImageUrl(req, file.filename),
      }));
    }

    epaper.title = req.body.title || epaper.title;
    epaper.publishDate =
      req.body.publishDate || epaper.publishDate;
    epaper.pages = pages;

    await epaper.save();

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

// Delete
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
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};