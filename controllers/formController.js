const FormEntry = require("../models/FormModel");

// CREATE
exports.createEntry = async (req, res) => {
  try {
    const data = {
      text: req.body.text,
      email: req.body.email,
      password: req.body.password,
      number: req.body.number,

      date: req.body.date,
      time: req.body.time,
      datetime: req.body.datetime,
      month: req.body.month,
      week: req.body.week,

      gender: req.body.gender,
      hobbies: req.body.hobbies ? req.body.hobbies.split(",") : [],
      skills: req.body.skills ? req.body.skills.split(",") : [],

      country: req.body.country,
      color: req.body.color,
      range: req.body.range,
      message: req.body.message,

      photo: req.file ? req.file.filename : null,
    };

    const entry = await FormEntry.create(data);
    return res.json({ success: true, data: entry });

  } catch (error) {
    console.log("Create Error:", error);
    return res.json({ success: false, error });
  }
};

// GET ALL
// READ ALL
exports.getAll = async (req, res) => {
  try {
    const data = await FormEntry.find();
    res.json({ success: true, data });
  } catch (error) {
    res.json({ success: false, error });
  }
};


// DELETE
exports.deleteEntry = async (req, res) => {
  try {
    await FormEntry.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, error });
  }
};

// UPDATE
exports.updateEntry = async (req, res) => {
  try {
    const updated = {
      text: req.body.text,
      email: req.body.email,
      password: req.body.password,
      number: req.body.number,

      date: req.body.date,
      time: req.body.time,
      datetime: req.body.datetime,
      month: req.body.month,
      week: req.body.week,

      gender: req.body.gender,
      hobbies: req.body.hobbies ? req.body.hobbies.split(",") : [],
      skills: req.body.skills ? req.body.skills.split(",") : [],

      country: req.body.country,
      color: req.body.color,
      range: req.body.range,
      message: req.body.message,
    };

    if (req.file) {
      updated.photo = req.file.filename;
    }

    const entry = await FormEntry.findByIdAndUpdate(req.params.id, updated, {
      new: true,
    });

    return res.json({ success: true, data: entry });

  } catch (error) {
    return res.json({ success: false, error });
  }
};
