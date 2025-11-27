require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const todoRoutes = require("./routes/todoRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// DB Connect
connectDB();

// API Routes
app.use("/api/todos", todoRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Todo API Working Successfully 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
