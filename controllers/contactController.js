import Contact from "../models/Contact.js";

// CREATE
export const createContact = async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    const newContact = new Contact({ name, phone, message });
    await newContact.save();

    res.status(201).json({ success: true, data: newContact });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// READ ALL
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};