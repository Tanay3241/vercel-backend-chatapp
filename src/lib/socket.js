// backend/lib/socket.js
import express from "express";
import http from "http";
import { Server } from "socket.io";

export const app = express();
export const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? "https://vercel-frontend-chatapp.vercel.app"  // deployed frontend
      : "http://localhost:5173",                      // local dev
    credentials: true,
  },
});

// Store mapping: userId -> socketId
const userSocketMap = {};

// Helper to get online users
const getOnlineUsers = () => Object.keys(userSocketMap);

// ✅ Helper: get socketId of a user
export function getReceiverSocketId(receiverId) {
  return userSocketMap[receiverId];
}

io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  const userId = socket.handshake.query?.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`✅ User ${userId} connected with socket ${socket.id}`);
  }

  // Broadcast updated online users list
  io.emit("getOnlineUsers", getOnlineUsers());

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", getOnlineUsers());
  });
});

// Function to send message to a specific user
export function sendMessageToUser(receiverId, message) {
  const socketId = userSocketMap[receiverId];
  if (socketId) {
    io.to(socketId).emit("newMessage", message);
  }
}

// Function to get all online users
export function getOnlineUsersList() {
  return getOnlineUsers();
}
