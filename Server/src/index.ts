import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { Server } from "socket.io";
import ACTIONS from "./Actions";
import cors from "cors";
import path from "path";

// Initialize the express app and http server
const app = express();
app.use(cors());

const server = http.createServer(app);

// Initialize socket.io with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Serve the static build files
app.use(express.static("build"));

// Middleware to handle all other routes and send the index.html file
app.use((req: Request, res: Response, next: NextFunction) => {
  res.sendFile(path.join(path.resolve(), "build", "index.html"));
});

// Map to store the username associated with each socket ID
const userSocketMap: Record<string, string> = {};

// Helper function to get all connected clients in a room, excluding the current socket
function getAllConnectedClients(roomId: string, currentSocketId: string) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || [])
    .filter((socketId) => socketId !== currentSocketId)
    .map((socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    });
}

// Socket.io connection event
io.on("connection", (socket) => {
  console.log("socket id - ", socket.id);

  // Event when a user joins a room
  socket.on(ACTIONS.JOIN, ({ roomId, username }: { roomId: string; username: string }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId, socket.id);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  // Event when code changes
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }: { roomId: string; code: string }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Event to sync the code with a specific socket
  socket.on(ACTIONS.SYNC_CODE, ({ code, socketId }: { code: string; socketId: string }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Event when language changes
  socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, language }: { roomId: string; language: string }) => {
    socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
  });

  // Event when a user disconnects
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
  });
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening at port ${PORT}`));