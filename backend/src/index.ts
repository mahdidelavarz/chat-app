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

// Get your local IP address dynamically
const getLocalIp = () => {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
};

const localIp = getLocalIp();
const isDevelopment = process.env.NODE_ENV !== 'production';

// Configure CORS for Socket.IO and Express
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : (isDevelopment
        ? ['http://localhost:3000', `http://${localIp}:3000`, 'http://172.16.2.99:3000']
        : ['https://yourdomain.com']);

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
        methods: ["GET", "POST"]
    }
});

// Express CORS middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
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
const PORT = parseInt(process.env.PORT || '5000', 10); // Convert to number
const HOST = process.env.HOST || '0.0.0.0';

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected");

        server.listen(PORT, HOST, () => {
            console.log(`🚀 Server running on:`);
            console.log(`   - Local: http://localhost:${PORT}`);
            console.log(`   - Network: http://${localIp}:${PORT}`);
            console.log(`🔌 Socket.io ready`);
            console.log(`📡 Allowed origins:`, allowedOrigins);
        });
    })
    .catch((error) => {
        console.error("❌ Database connection error:", error);
    });