import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { attachSocket } from './middleware/socket.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());

// 👇 Pass socket.io to all routes
app.use(attachSocket(io));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
});

server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});


export { io };