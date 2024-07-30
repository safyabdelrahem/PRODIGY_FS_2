const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
require("dotenv").config();
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const app = express();
const PORT = process.env.PORT || 3000; 
const socket = require("socket.io");

app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);

// MongoDB Connection
mongoose.connect(process.env.MONGOURL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });

const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  
  global.onlineUsers = new Map();
  
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });
  
    socket.on("send-msg", (data) => {
      console.log("Message sent data:", data); // إضافة تصحيح
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data);
      }
    });
  });
  