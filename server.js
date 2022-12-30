const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { fileURLToPath } = require('url');
const cors = require('cors');
var phil = require('phil-reg-prov-mun-brgy');

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

const { joinUser, countUsers, getAllUsers, getCurrentUser, userLeave } = require('./utils/users');
const { formatMessage } = require('./utils/messages');
const username = 'John Doe';
const avatar = 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png';

//io.on means listen to all users
io.on('connection', (socket) => {
	const joined = joinUser(socket.id, username, avatar);

	if (joined) {
		socket.emit('message', { msg: 'Welcome to the chat!', type: 'other' });
		// update the user count when a user joins
		io.emit('usersCount', countUsers());
	}

	socket.on('disconnect', () => {
		const users = userLeave(socket.id);
		console.log(users);
		// io.emit means send to all users
		if (users) {
			io.emit('message', { msg: 'Panfilo left the chat.', type: 'other' });
			// find the current user who just disconnected
			socket.emit('userDisconnected', countUsers());
			// user count when a user leaves
			io.emit('usersCount', countUsers());
		}
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
