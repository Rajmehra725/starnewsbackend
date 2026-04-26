import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://raazzz:Rajmehra%40001@cluster0.voysa6d.mongodb.net/raaznotes?retryWrites=true&w=majority&appName=raaznote");
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;