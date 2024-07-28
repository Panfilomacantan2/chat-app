const moment = require('moment');

function formatMessage(user, text, userType = 'me') {
	return {
		user,
		text,
		userType,
		time: moment().format('h:mm a'),
	};
}

module.exports = { formatMessage };
