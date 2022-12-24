import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const PORT = process.env.PORT || 4000;
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
	socket.emit('message', { msg: 'Welcome to Chat Cord.', type: 'other' });

	console.log(socket.id);

	socket.broadcast.emit('message', { msg: 'A user joined the channel.', type: 'other' });

	socket.on('disconnect', () => {
		console.log('User disconnected.');
		io.emit('message', { msg: 'User disconnected', type: 'other' });
	});

	socket.on('chat-message', ({ msg, type }) => {
		socket.broadcast.emit('message', { msg, type: 'other' });
		socket.emit('message', { msg, type });
		console.log(msg);
	});
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

import messageRoutes from './routes/message.js';
app.use('/api/message', messageRoutes);

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
