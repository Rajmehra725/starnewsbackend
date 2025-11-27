const mongoose = require("mongoose");

const FormSchema = new mongoose.Schema({
  text: String,
  email: String,
  password: String,
  number: Number,

  date: String,
  time: String,
  datetime: String,
  month: String,
  week: String,

  gender: String,
  hobbies: [String],

  country: String,
  skills: [String],

  color: String,
  range: Number,
  message: String,

  photo: String,
});

module.exports = mongoose.model("FormEntry", FormSchema);
