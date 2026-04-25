import "reflect-metadata";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import { setupSocket } from "./socket/socketHandler";
import authRoute from "./routes/auth.routes"
import messageRoutes from "./routes/message.routes"

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true
    }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Setup socket
setupSocket(io);

// Start server
const PORT = process.env.PORT || 5000;

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected");

        server.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`🔌 Socket.io ready`);
        });
    })
    .catch((error) => {
        console.error("❌ Database connection error:", error);
    });