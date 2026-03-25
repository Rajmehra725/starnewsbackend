import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "news_uploads",
      public_id: Date.now() + "-" + file.originalname,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [{ width: 800, height: 500, crop: "limit" }],
    };
  },
});
export default cloudinary;
