const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	duration: {
		type: Number,
		required: true
	},
	streams: {
		type: Number,
		default: 0
	},
	artist: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Artist',
		required: true
	},
	album: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Album',
		required: true
	}
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
