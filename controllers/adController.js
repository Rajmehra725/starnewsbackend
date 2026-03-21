// File: controllers/adController.js
import Ad from "../models/Ad.js";

// ➕ CREATE AD
export const createAd = async (req, res) => {
  try {
    const adData = {
      title: req.body.title,
      position: req.body.position || "top",
      isActive: req.body.isActive ?? true,
      clicks: 0,
    };

    // image handle
    if (req.file) adData.image = req.file.path;

    const ad = await Ad.create(adData);

    // AJAX behavior: emit socket for frontend
    req.app.get("io")?.emit("adsUpdated");

    res.status(201).json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📥 GET ALL ADS
export const getAds = async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 📥 GET ACTIVE ADS ONLY
export const getActiveAds = async (req, res) => {
  try {
    const ads = await Ad.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✏️ UPDATE AD
export const updateAd = async (req, res) => {
  try {
    const adData = { ...req.body };
    if (req.file) adData.image = req.file.path;

    const updated = await Ad.findByIdAndUpdate(req.params.id, adData, { new: true });

    if (!updated) return res.status(404).json({ msg: "Ad not found" });

    req.app.get("io")?.emit("adsUpdated"); // AJAX live update

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ❌ DELETE AD
export const deleteAd = async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);

    req.app.get("io")?.emit("adsUpdated"); // AJAX live update

    res.json({ success: true, msg: "Ad deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 🔄 TOGGLE ACTIVE
export const toggleAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ msg: "Ad not found" });

    ad.isActive = !ad.isActive;
    await ad.save();

    req.app.get("io")?.emit("adsUpdated"); // AJAX live update

    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// 🖱️ CLICK TRACK
export const clickAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ msg: "Ad not found" });

    ad.clicks++;
    await ad.save();

    res.json({ success: true, clicks: ad.clicks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};