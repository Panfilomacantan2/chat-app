const users = [];

const joinUser = (id, username, avatar) => {
	const user = { id, username, avatar };
	users.push(user);
	return user;
};

const getAllUsers = () => {
	return users;
};

const getCurrentUser = (id) => {
	return users.filter((user) => user.id === id);
};

const countUsers = () => {
	return users.length;
};

module.exports = { joinUser, countUsers, getAllUsers, getCurrentUser };
