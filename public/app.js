const socket = io();
const botName = 'Chat Bot';
const messageChat = document.querySelector('.message-body');
let usersCount;

const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true,
});

console.log(username, room);

socket.emit('joinRoom', { username, room });

const botAvatar = 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';
const userAvatar = 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';

socket.on('message', (message) => {
	// append message
	appendMessage(message);
	messageChat.scrollTop = messageChat.scrollHeight;
});

// get the total number of users
socket.on('connect', () => {
	socket.on('usersCount', (count) => {
		usersCount = count;
		document.querySelector('.total-user').innerText = `${count}`;

		console.log(`Total users: ${usersCount}`);
	});
	console.log('New User Joined the Chat!');
});

socket.on('userDisconnected', (count) => {
	usersCount = count;
	document.querySelector('.total-user').innerText = ` ${count}`;
	console.log(`Total users DC: ${usersCount}`);
});

socket.on('roomUsers', ({ room, users }) => {
	const roomEl = document.querySelector('#room');

	roomEl.innerText = room;
	// todo: add container for users in specific room
	console.log({ room, users });
});

const clientForm = document.querySelector('form');
clientForm.addEventListener('submit', (e) => {
	const submitFormBtn = document.querySelector('#submitFormBtn');
	e.preventDefault();
	const msgInput = document.querySelector('input');

	if (msgInput.value.trim() === '') {
		socket.emit('chat-message', '<i class="fa fa-thumbs-up" style="color:#ede9fe"></i>');
	} else {
		socket.emit('chat-message', msgInput.value);
	}
	resetInput();

	submitFormBtn.innerHTML = `<i class="fa fa-thumbs-up"></i>`;
});

function appendMessage(message) {
	let output = '';
	const { text, time, user, userType } = message;
	const type = userType === 'other' ? 'start' : 'end';
	console.log(userType);

	output = `
			
				<div class='chat chat-${type}'>
					<div class="chat-image avatar">
						<div class="w-10 rounded-full">
						<img
							alt="Tailwind CSS chat bubble component"
							src=${botAvatar} />
						</div>
					</div>
					<div class="chat-header text-white">
						<span class="text-sm font-medium ${userType === 'other' ? 'ml-2' : 'mr-2'} text-sky-600">${user}</span>
						
					</div>
					<div class="chat-bubble">${text}</div>
					<div class="text-xs chat-footer opacity-50 text-white"><time class="text-xs opacity-50">${time}</time></div>
				</div>
			
	`;
	messageChat.innerHTML += output;
	// messageChat.innerHTML += '<p>New User joined!</p>';
}

const allMessages = document.querySelectorAll('.message');
allMessages.forEach((message) => {
	message.addEventListener('click', function () {
		console.log(this.innerText);
	});
});

function resetInput() {
	const msgInput = document.querySelector('input');
	msgInput.value = '';
	msgInput.focus();
}

// get current hour and minute to display on the chat
function getCurrentTime() {
	const date = new Date();
	const hour = date.getHours() % 12 || 12;
	const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
	const isAm = date.getHours() <= 12 ? 'AM' : 'PM';
	return `${hour}:${minute}${isAm}`;
}

const formInput = document.querySelector('#formInput');

function handleFormChange() {
	const submitFormBtn = document.querySelector('#submitFormBtn');
	if (this.value.trim().length > 0) {
		submitFormBtn.innerHTML = `<i class="fa fa-paper-plane"></i>`;
	} else {
		submitFormBtn.innerHTML = `<i class="fa fa-thumbs-up"></i>`;
	}
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
	const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
	if (leaveRoom) {
		window.location = '../index.html';
	} else {
	}
});

//copy the link for invitation
document.getElementById('copy-btn').addEventListener('click', () => {
	// Check if the Clipboard API is available
	if (navigator?.clipboard) {
		const { href, hostname, port, protocol } = window.location;
		const fullUrl = `${protocol}//${hostname}:${port}`;

		console.log(`${protocol}//${hostname}:${port}`);
		// Define the text you want to copy
		const { username, room } = Qs.parse(location.search, {
			ignoreQueryPrefix: true,
		});

		// Write text to the clipboard
		navigator.clipboard
			.writeText(fullUrl)
			.then(() => {
				// Success callback
				console.log('Text copied to clipboard:', fullUrl);
			})
			.catch((error) => {
				// Error callback
				console.error('Failed to copy text to clipboard:', error);
			});
	} else {
		console.error('Clipboard API not supported.');
	}
});

formInput.addEventListener('keyup', handleFormChange);
