const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const { joinUser, countUsers, getAllUsers, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const { formatMessage } = require('./utils/messages');
const usernames = 'John Doe';
const avatar = 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png';

app.use(
	cors({
		origin: '*',
	}),
);

const bot = 'chatbot';

//io.on means listen to all users
io.on('connection', (socket) => {
	socket.on('joinRoom', ({ username, room }) => {
		const user = joinUser(socket.id, username, room);

		socket.join(user.room);

		console.log('new user: ', user);

		socket.emit('message', formatMessage(bot, 'Welcome to the chat!', 'other'));

		socket.broadcast.to(user.room).emit('message', formatMessage(bot, `${user.username} has joined the chat!`, 'other'));

		// update the user count when a user joins
		io.emit('usersCount', countUsers());

		// Send users and room info
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room),
		});
	});

	socket.on('disconnect', () => {
		const user = userLeave(socket.id);

		// io.emit means send to all users
		if (user) {
			io.to(user.room).emit('message', formatMessage(bot, `${user.username} left the chat.`, 'other'));
			// find the current user who just disconnected
			socket.emit('userDisconnected', countUsers());
			// user count when a user leaves
			io.emit('usersCount', countUsers());
		}
	});

	// socket.on means listen to the user who just joined
	socket.on('chat-message', (msg) => {
		const user = getCurrentUser(socket.id);
		socket.broadcast.to(user.room).emit('message', formatMessage(user.username, msg, 'other'));
		socket.emit('message', formatMessage(user.username, msg, 'me'));
	});
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
