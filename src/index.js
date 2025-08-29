import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js"; // IMPORTANT: app comes from socket.js

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173",                       // Local dev (Vite frontend)
      "https://vercel-frontend-chatapp.vercel.app",  // Deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Root route (for testing)
app.get("/", (req, res) => {
  res.send("🚀 Backend is working fine!");
});

// Start server
server.listen(PORT, () => {
  connectDB();
  console.log(`✅ Server running on PORT: ${PORT}`);
});
