
const socket = io();

const botName = 'Chat Bot';

const messageChat = document.querySelector('.message-container');

socket.on('message', ({ msg, type }) => {
	// appendMessage(msg, type);
	// messageChat.scrollTop = messageChat.scrollHeight + 100;

	if (type === 'other') {
		appendMessage(`${msg}`, 'bot');
		messageChat.scrollTop = messageChat.scrollHeight + 100;
	} else if (type === 'me') {
		appendMessage(`${msg}`, 'me');
		messageChat.scrollTop = messageChat.scrollHeight + 100;
	}
});

const clientForm = document.querySelector('form');
clientForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const msgInput = document.querySelector('input');
	socket.emit('chat-message', { msg: msgInput.value, type: 'me' });
	resetInput();

	console.log(socket.id);
});

function appendMessage(msg, type) {
	const messageContainer = document.querySelector('.message-container');
	const messageDiv = document.createElement('div');
	messageDiv.classList.add('message', `${type}`);
	messageDiv.innerText = msg;
	messageContainer.appendChild(messageDiv);
}

function resetInput() {
	const msgInput = document.querySelector('input');
	msgInput.value = '';
	msgInput.focus();
}
