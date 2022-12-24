import mongoose from 'mongoose';
import moment from 'moment-timezone';

const messageSchema = mongoose.Schema({
	message: String,
	user: String,
	createdAt: {
		type: Date,
		default: () => moment.tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss'),
	},
});

export default mongoose.model('Message', messageSchema);
