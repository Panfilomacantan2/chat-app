
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const messageSchema = mongoose.Schema({
	message: String,
	user: String,
	createdAt: {
		type: Date,
		default: () => moment.tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss'),
	},
});

module.exports = mongoose.model('Message', messageSchema);
