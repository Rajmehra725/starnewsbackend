// controllers/idCardController.js
import IdCard from "../models/IdCard.js";

// CREATE
export const createIdCard = async (req, res) => {
  try {
    const { name, designation, organization } = req.body;
    const lastCard = await IdCard.findOne().sort({ createdAt: -1 });
    const lastIdNum = lastCard ? parseInt(lastCard.employeeId.split("-")[1]) : 1000;
    const employeeId = `SN-${lastIdNum + 1}`;

    const validTillDate = new Date();
    validTillDate.setFullYear(validTillDate.getFullYear() + 1); // 1 year validity
    const validTill = validTillDate.toISOString().split("T")[0];

    const card = new IdCard({
      name,
      designation,
      organization,
      employeeId,
      validTill,
      photoUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    await card.save();
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

// GET ALL
export const getAllIdCards = async (_req, res) => {
  const cards = await IdCard.find();
  res.json(cards);
};

// GET ONE
export const getIdCard = async (req, res) => {
  const card = await IdCard.findById(req.params.id);
  res.json(card);
};

// UPDATE
export const updateIdCard = async (req, res) => {
  try {
    const updates = req.body;
    if (req.file) updates.photoUrl = `/uploads/${req.file.filename}`;
    const card = await IdCard.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(card);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

// DELETE
export const deleteIdCard = async (req, res) => {
  await IdCard.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};