const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { fileURLToPath } = require('url');
const cors = require('cors');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

const { joinUser, countUsers, getAllUsers, getCurrentUser } = require('./utils/users');

//io.on means listen to all users
io.on('connection', (socket) => {
	// count users when a user joins
	io.emit('usersCount', countUsers());

	// add new user to users array
	joinUser(socket.id, 'User', 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png');

	// socket.emit means send to the user who just joined
	socket.emit('message', { msg: 'Welcome to Chat Cord.', type: 'other', id: socket.id, avatar: 'https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png' });

	// socket.broadcast.emit means send to all users except the user who just joined
	socket.broadcast.emit('message', { msg: 'A user joined the channel.', type: 'other' });

	socket.on('disconnect', () => {
		// io.emit means send to all users
		io.emit('message', { msg: 'User disconnected', type: 'other' });

		// if there are users connected, get the user who just disconnected
		const users = getAllUsers();
		const index = users.find((user) => user.id === socket.id);
		// remove the user who just disconnected from the users array
		const isRemoved = users.splice(index, 1);

		if (isRemoved) {
			console.log('User removed', isRemoved);
			socket.broadcast.emit('userDisconnected', countUsers());
		}

		console.log(users);
	});

	// socket.on means listen to the user who just joined
	socket.on('chat-message', ({ msg, type, avatar }) => {
		socket.broadcast.emit('message', { msg, type: 'other', avatar });
		socket.emit('message', { msg, type, avatar });
	});
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
