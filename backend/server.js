import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { attachSocket } from './middleware/socket.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

// 👇 Pass socket.io to all routes
app.use(attachSocket(io));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/users', userRoutes);

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
});

server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on ${process.env.BACKEND_URL}`);
});


export { io };