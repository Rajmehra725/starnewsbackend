import dotenv from "dotenv";
dotenv.config();
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";

import connectDB from "./config/db.js";
import newsRoutes from "./routes/newsRoutes.js";
import interactionRoutes from "./routes/interactionRoutes.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";
// ✅ NEW ROUTES
import adRoutes from "./routes/adRoutes.js";
import breakingRoutes from "./routes/breakingRoutes.js";
import newsSubmitRoutes from "./routes/newsSubmitRoutes.js";
import idCardRoutes from "./routes/idCardRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import satnaRoutes from "./routes/satnaRoutes.js";
import chhatarpurRoutes from "./routes/chhatarpurRoutes.js";
import contactRoutes from "./routes/contactRoutes.js"
import advertisementRoutes from "./routes/advertisementRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import epaperRoutes from "./routes/epaperRoutes.js";
const app = express();

// ================= SERVER =================
const server = createServer(app);

// ✅ SOCKET FIX (IMPORTANT)
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

// 🔥 VERY IMPORTANT (MISSING LINE - FIXED)
app.set("io", io);

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
app.use("/api/satna", satnaRoutes);
app.use("/api/chhatarpur", chhatarpurRoutes);
app.use("/api/interactions", interactionRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/breaking", breakingRoutes);
app.use("/api/newsSubmit", newsSubmitRoutes);
app.use("/api/idcards", idCardRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/youtube", youtubeRoutes);
app.use("/api/contact",contactRoutes)
app.use("/api/advertisement",advertisementRoutes)
app.use("/api/notification", notificationRoutes);
app.use("/api", tokenRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/epaper", epaperRoutes);

// ================= SOCKET =================
io.on("connection", (socket) => {
  console.log("🔥 User connected:", socket.id);

  socket.on("joinNews", (newsId) => {
    socket.join(newsId);
  });

  socket.on("joinRoom", (newsId) => {
    socket.join(newsId);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ================= DB =================
connectDB();

// ================= START =================
const PORT = process.env.PORT || 5002;

// 🔥 FIX: app.listen ❌ → server.listen ✅
server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);