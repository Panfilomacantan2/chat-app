const socket = io();

const botName = 'Chat Bot';

const messageChat = document.querySelector('.message-body');

const closeTab = document.querySelector('.closetab');

let usersCount

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
		document.querySelector('.total-user').innerText = `${usersCount}`;

		console.log(`Total users: ${usersCount}`);
	});
});

socket.on('userDisconnected', (count) => {
	usersCount = count;
	document.querySelector('.total-user').innerText = ` ${usersCount}`;
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

function checkType (type, avatar){
	if(type === 'bot'){
		return `<img class="avatar" src="${avatar}" alt="" />`;
	}else if(type === 'me'){
		return ``;
	}else if(type === 'other'){
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
							<p class="txt-msg">${msg}</p>
							<span class="time-text">3:46pm</span>
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
