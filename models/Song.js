const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number },
  genre: { type: String },
  releaseYear: { type: Number },
  plays: { type: Number, default: 0 },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  }
});

songSchema.index({ genre: 1, duration: -1 });
songSchema.index({ releaseYear: -1 });
songSchema.index({ artist: 1, plays: -1 });

module.exports = mongoose.model('Song', songSchema);