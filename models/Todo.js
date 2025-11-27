const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false }
  },
  { timestamps: true } // auto createdAt + updatedAt
);

module.exports = mongoose.model("Todo", TodoSchema);
