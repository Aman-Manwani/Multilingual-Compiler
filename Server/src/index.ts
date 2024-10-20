import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import cors from 'cors';

const app = express();

app.use(cors());

const server = http.createServer(app);

interface UserSocketMap {
  [socketId: string]: string;
}

interface ClientInterface {
  socketId: string;
  username: string;
}

const userSocketMap : UserSocketMap = {};

const getAllConnectedClients = (roomId : string) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(socketId => {
    return {
      socketId,
      username: userSocketMap[socketId]
    }
  });
}

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});


io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join', ({roomId, username}) => {
    userSocketMap[socket.id] = username
    socket.join(roomId);
    const clients:ClientInterface[] = getAllConnectedClients(roomId);
    clients.forEach(({socketId}) => {
      console.log(username, socketId);
      io.to(socketId).emit('joined', {
        clients,
        username_ser: username,
        socketId: socket.id,
      });
    })
  })

  socket.on('disconnecting', () => {
    const rooms = [...socket.rooms];
    rooms.forEach(roomId => {
      socket.in(roomId).emit('disconnected', {
        socketId: socket.id,
        username: userSocketMap[socket.id]
      });
    });
    delete userSocketMap[socket.id];
    socket.disconnect();
  });

  socket.on('customEvent', (data) => {
    console.log('Custom event received with data:', data);
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
