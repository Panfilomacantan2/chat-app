
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

	if(msgInput.value.trim() === '') {
		return;
	}



	socket.emit('chat-message', { msg: msgInput.value, type: 'me' });
	resetInput();

	console.log(socket.id);
});

function appendMessage(msg, type) {
	const messageContainer = document.querySelector('.message-container');
	const messageDiv = document.createElement('div');
	const timeTextDiv = document.createElement('div');
	const time = new Date();
	let isPM = time.getHours() >= 12 ? 'pm' : 'am'
	const timeText = `${time.getHours() - 12}:${time.getMinutes()} ${isPM}`;
	timeTextDiv.classList.add('time-text');
	timeTextDiv.innerText = timeText;
	
	messageDiv.classList.add('message', `${type}`);
	messageDiv.innerText = msg;
	messageDiv.appendChild(timeTextDiv);
	messageContainer.appendChild(messageDiv);

}

const allMessages = document.querySelectorAll('.message');
allMessages.forEach((message) => {
	message.addEventListener('click', function() {
		console.log(this.innerText);
		
	});
});


function resetInput() {
	const msgInput = document.querySelector('input');
	msgInput.value = '';
	msgInput.focus();
}
