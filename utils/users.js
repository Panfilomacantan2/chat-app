let users = [];

function joinUser(id, username, room) {
	const user = { id, username, room };
	users.push(user);

	return user;
}

function getAllUsers() {
	return users;
}

function getCurrentUser(id) {
	return users.find((user) => user.id === id);
}

function countUsers() {
	return users.length;
}

// User leaves chat
function userLeave(id) {
	const index = users.find((user) => user.id === id);

	if (index !== -1) {
		return users.splice(index, 1)[0];
	}
}

// Get room users
function getRoomUsers(room) {
	return users.filter((user) => user.room === room);
}

module.exports = { joinUser, countUsers, getAllUsers, getCurrentUser, userLeave, getRoomUsers };
