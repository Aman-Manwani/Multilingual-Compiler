import { io, SocketOptions } from 'socket.io-client';

export const initSocket = async() => {
    const options: Partial<SocketOptions> = {
        forceNew : true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ["websocket"]
    };

    return io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', options);
};
