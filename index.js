import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

import connectDB from "./config/db.js";
import newsRoutes from "./routes/newsRoutes.js";
import interactionRoutes from "./routes/interactionRoutes.js";

// ✅ NEW ROUTES
import adRoutes from "./routes/adRoutes.js";
import breakingRoutes from "./routes/breakingRoutes.js";
import newsSubmitRoutes from "./routes/newsSubmitRoutes.js";
import idCardRoutes from "./routes/idCardRoutes.js";
const app = express();

// ================= SERVER =================
const server = createServer(app);

// ✅ SOCKET FIX (IMPORTANT)
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"], // ⭐ IMPORTANT
});

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

// ✅ STATIC IMAGES
app.use("/uploads", express.static(path.join("uploads")));

// ================= ROUTES =================
app.use("/api/news", newsRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/breaking", breakingRoutes);
app.use("/api/newsSubmit", newsSubmitRoutes);
app.use("/api/idcards", idCardRoutes);
// ================= SOCKET =================
io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  socket.on("joinNews", (newsId) => {
    socket.join(newsId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ================= DB =================
connectDB();

// ================= START =================
const PORT = process.env.PORT || 5001; // 5001 instead of 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));