import mongoose from "mongoose";

const IdCardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  organization: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  validTill: { type: String, required: true },
  photoUrl: { type: String },
}, { timestamps: true });

export default mongoose.models.IdCard || mongoose.model("IdCard", IdCardSchema);