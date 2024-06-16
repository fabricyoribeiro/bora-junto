import express from 'express';
import { routes } from './routes/index.js';
import cors from "cors";
import { Server } from 'socket.io';
import { createServer } from 'http';

import Message from './Modules/Message/index.js'; // Importe o controller de mensagens


const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

app.use(express.json());
app.use(cors({
    origin: "*", // Permite solicitações de qualquer domínio
    methods: "GET,PUT,POST,DELETE", // Métodos permitidos
    optionsSuccessStatus: 204 // Define o status de sucesso para preflight requests para 204
}));

app.use(routes);

app.get("/", (req, res) => {
    return res.json({ hello: 'world' });
});

// Use server.listen instead of app.listen to bind the server
server.listen(3030, '0.0.0.0', () => {
    console.log('listening on port 3030');
});

// setupSocket(io);

io.on("connection", (socket) => {
    console.log('user connected to websocket');
    console.log(socket.id)
    // Example event handler
    socket.on('message', async ({ sender_id, receiver_id, content }) => {
        console.log('message received:', sender_id, receiver_id, content );

        try {
            const message = await Message.createMessage(sender_id, receiver_id, content)
            socket.emit('message', message);
        } catch (error) {
            console.error('Error fetching messages:', error);
            socket.emit('error', { message: 'Error fetching messages' });
        }
        
    });

    socket.on('get_messages', async ({ userId, receiverId }) => {
        try {
            const messages = await Message.fetchAllMessagesByUser(userId, receiverId);
            socket.emit('get_messages', messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            socket.emit('error', { message: 'Error fetching messages' });
        }
    });


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
