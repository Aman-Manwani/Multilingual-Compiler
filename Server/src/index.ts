import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';

const app = express();

// Enable CORS for all routes (important if your client and server run on different domains or ports)
app.use(cors());

// Create the HTTP server
const server = http.createServer(app);

// Initialize Socket.IO server with CORS configuration
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Adjust this to allow specific origins (e.g., "http://localhost:3000")
    methods: ["GET", "POST"],
  }
});

// Handle new socket connections
io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', (data) => {
    
  })

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });

  // Example event handler for custom events
  socket.on('customEvent', (data) => {
    console.log('Custom event received with data:', data);
  });
});

// Define a basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// Start the server
server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
