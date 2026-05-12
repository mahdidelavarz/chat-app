import 'reflect-metadata';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { setupSocket } from './socket/socketHandler';
import authRoute from './routes/auth.routes';
import messageRoutes from './routes/message.routes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket setup
setupSocket(io);

// Database connection with retry logic
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

const connectWithRetry = async (retryCount = 0): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected successfully');
    
    // Start server only after successful database connection
    const PORT = parseInt(process.env.PORT || '5000', 10);
    const HOST = process.env.HOST || '0.0.0.0';
    
    server.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on http://${HOST}:${PORT}`);
      console.log('📡 Allowed origins:', allowedOrigins);
      console.log('🔌 Socket.io ready');
    });
  } catch (error) {
    console.error(`❌ Database connection attempt ${retryCount + 1}/${MAX_RETRIES} failed:`, error);
    
    if (retryCount < MAX_RETRIES - 1) {
      console.log(`⏳ Retrying in ${RETRY_DELAY / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(retryCount + 1);
    } else {
      console.error('❌ Max retries reached. Could not connect to database.');
      process.exit(1);
    }
  }
};

// Start the connection process
console.log('🔄 Attempting to connect to database...');
connectWithRetry();