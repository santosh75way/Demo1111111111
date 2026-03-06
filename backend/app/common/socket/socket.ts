import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyAccessToken } from '../helpers/tokenUtils';

let io: SocketIOServer;

export const initSocket = (server: HttpServer): void => {
    io = new SocketIOServer(server, {
        cors: {
            origin: '*', // Adjust correctly in production
            methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        },
    });

    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
        if (!token) {
            return next(new Error('Authentication error'));
        }

        const actualToken = token.startsWith('Bearer ') ? token.substring(7) : token;

        try {
            const decoded = verifyAccessToken(actualToken);
            if (decoded.role !== 'ADMIN') {
                return next(new Error('Forbidden: Admins only'));
            }
            socket.data.user = decoded;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    // Connection handlers
    io.on('connection', (socket) => {
        console.log(`Admin socket connected: ${socket.id}`);

        socket.on('join-survey-stats', (payload: { surveyId: string }) => {
            if (payload && payload.surveyId) {
                const roomName = `survey-stats:${payload.surveyId}`;
                socket.join(roomName);
                console.log(`Admin ${socket.data.user?.userId} joined room: ${roomName}`);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Admin socket disconnected: ${socket.id}`);
        });
    });
};

export const getIO = (): SocketIOServer => {
    if (!io) {
        throw new Error('Socket.io is not initialized');
    }
    return io;
};
