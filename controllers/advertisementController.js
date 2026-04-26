import Advertisement from "../models/Advertisement.js";
import cloudinary from "../config/cloudinary.js";

/**
 * CREATE ADS (MULTIPLE IMAGE/VIDEO)
 */
export const createAdvertisement = async (req, res) => {
  try {
    const files = [
      ...(req.files?.image || []),
      ...(req.files?.images || []),
      ...(req.files?.video || []),
    ];

    const ads = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
      });

      const ad = await Advertisement.create({
        title: req.body.title || "",
        link: req.body.link || "",
        position: req.body.position || "middle",

        mediaType: result.resource_type === "video" ? "video" : "image",
        url: result.secure_url,
        publicId: result.public_id,
      });

      ads.push(ad);
    }

    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ADS (OPTIONAL POSITION FILTER)
 */
export const getAdvertisements = async (req, res) => {
  try {
    const { position } = req.query;

    const filter = position ? { position } : {};

    const ads = await Advertisement.find(filter).sort({ createdAt: -1 });

    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE AD
 */
export const updateAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    if (req.file) {
      await cloudinary.uploader.destroy(ad.publicId);

      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto",
      });

      ad.url = result.secure_url;
      ad.publicId = result.public_id;
      ad.mediaType =
        result.resource_type === "video" ? "video" : "image";
    }

    ad.title = req.body.title || ad.title;
    ad.link = req.body.link || ad.link;
    ad.position = req.body.position || ad.position;

    await ad.save();

    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE AD
 */
export const deleteAdvertisement = async (req, res) => {
  try {
    const ad = await Advertisement.findById(req.params.id);

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    await cloudinary.uploader.destroy(ad.publicId);

    await Advertisement.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE MULTIPLE ADS
 */
export const deleteMultipleAds = async (req, res) => {
  try {
    const ids = req.body.ids;

    const ads = await Advertisement.find({ _id: { $in: ids } });

    for (const ad of ads) {
      await cloudinary.uploader.destroy(ad.publicId);
    }

    await Advertisement.deleteMany({ _id: { $in: ids } });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
};