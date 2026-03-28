const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  poster: { type: String, required: true },
  thumbnail: { type: String },
  genres: [{ type: String }],
  year: { type: Number },
  rating: { type: Number, min: 0, max: 10 },
  duration: { type: String },
  streamingLinks: [{
    quality: String,
    url: String,
    server: String
  }],
  downloadLinks: [{
    quality: String,
    url: String
  }],
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  tmdbId: String
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);