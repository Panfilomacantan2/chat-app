const socket = io();

const botName = 'Chat Bot';

const messageChat = document.querySelector('.message-body');

const closeTab = document.querySelector('.closetab');

let usersCount;

closeTab.addEventListener('click', function () {
	// close tab
	window.close();
});

const botAvatar = 'https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png';
const userAvatar = 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png';

socket.on('message', ({ msg, type, avatar }) => {
	if (type === 'other') {
		appendMessage(`${msg}`, 'bot', botAvatar);
		messageChat.scrollTop = messageChat.scrollHeight + 100;
	} else if (type === 'me') {
		appendMessage(`${msg}`, 'me', userAvatar);
		messageChat.scrollTop = messageChat.scrollHeight + 100;
	}
});

// get the total number of users
socket.on('connect', () => {
	socket.on('usersCount', (count) => {
		usersCount = count;
		document.querySelector('.total-user').innerText = `${count + 1}`;

		console.log(`Total users: ${usersCount}`);
	});
});

socket.on('userDisconnected', (count) => {
	usersCount = count;
	document.querySelector('.total-user').innerText = ` ${count}`;
	console.log(`Total users DC: ${usersCount}`);
});

const clientForm = document.querySelector('form');
clientForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const msgInput = document.querySelector('input');

	if (msgInput.value.trim() === '') {
		return;
	}

	socket.emit('chat-message', { msg: msgInput.value, type: 'me', avatar: userAvatar });
	resetInput();
});

function checkType(type, avatar) {
	if (type === 'bot') {
		return `<img class="avatar" src="${avatar}" alt="" />`;
	} else if (type === 'me') {
		return ``;
	} else if (type === 'other') {
		return `<img class="avatar" src="${avatar}" alt="" />`;
	}
}

function appendMessage(msg, type, avatar) {
	let output = '';
	const isMe = checkType(type, avatar);

	output = `
				<div class="message-container ${type}">
					${isMe}
						<div class="message">
							<p class="txt-msg ${type}">${msg}</p>
							<span class="time-text">${getCurrentTime()}</span>
						</div>
				</div>
			
	`;
	messageChat.innerHTML += output;
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

console.log(getCurrentTime());

// submit username
const btnSubmit = document.querySelector('#btnSubmit');

btnSubmit.addEventListener('click', function (e) {
	e.preventDefault();
	const username = document.querySelector('#username');

	if (username.value.trim() === '') return;

	socket.emit('join', { id: socket.id, username: username.value, avatar: userAvatar });

	console.log({ id: socket.id, username: username.value, avatar: userAvatar });

	username.value = '';
});
