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
import newsSubmitRoutes from "./routes/newsSubmitRoutes.js"
const app = express();

// ✅ SOCKET SERVER
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(express.json());

// ✅ 🔥 VERY IMPORTANT (IMAGE FIX)
app.use("/uploads", express.static(path.join("uploads")));

// ================= ROUTES =================
app.use("/api/news", newsRoutes);
app.use("/api/interactions", interactionRoutes);

// ✅ NEW
app.use("/api/ads", adRoutes);
app.use("/api/breaking", breakingRoutes);
app.use("/api/newsSubmit", newsSubmitRoutes);
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

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server Running on http://localhost:${PORT}`);
});