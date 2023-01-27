const socket = io();

const botName = 'Chat Bot';

const messageChat = document.querySelector('.message-body');

let usersCount;

const botAvatar = 'https://cdn.icon-icons.com/icons2/1371/PNG/512/robot02_90810.png';
const userAvatar = 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png';

socket.on('message', ({ msg, type, avatar }) => {
	if (type === 'other') {
		appendMessage(`${msg}`, 'bot', botAvatar);
		messageChat.scrollTop = messageChat.scrollHeight;
	} else if (type === 'me') {
		appendMessage(`${msg}`, 'me', userAvatar);
		messageChat.scrollTop = messageChat.scrollHeight;
	}
});

// get the total number of users
socket.on('connect', () => {
	socket.on('usersCount', (count) => {
		usersCount = count;
		document.querySelector('.total-user').innerText = `${count}`;

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
	const submitFormBtn = document.querySelector('#submitFormBtn');
	e.preventDefault();
	const msgInput = document.querySelector('input');

	if (msgInput.value.trim() === '') {
		socket.emit('chat-message', { msg: '<i class="fa fa-thumbs-up" style="color:#ede9fe"></i>', type: 'me', avatar: userAvatar });
	} else {
		socket.emit('chat-message', { msg: msgInput.value, type: 'me', avatar: userAvatar });
	}
	resetInput();

	submitFormBtn.innerHTML = `<i class="fa fa-thumbs-up"></i>`;
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

const formInput = document.querySelector('#formInput');

function handleFormChange() {
	const submitFormBtn = document.querySelector('#submitFormBtn');
	if (this.value.trim().length > 0) {
		submitFormBtn.innerHTML = `<i class="fa fa-paper-plane"></i>`;
	} else {
		submitFormBtn.innerHTML = `<i class="fa fa-thumbs-up"></i>`;
	}
}

formInput.addEventListener('keyup', handleFormChange);
