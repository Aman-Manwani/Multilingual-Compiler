import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

const app = express();

const server = http.createServer(app);

const io = new SocketIOServer(server);

interface CustomSocket extends Socket {

}

io.on('connection', (socket: CustomSocket) => {
  console.log('a user connected');
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
