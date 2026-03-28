const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const Movie = require('../models/Movie');
const { auth, adminAuth } = require('../middleware/auth');
const axios = require('axios');
const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, genre, search, featured } = req.query;
    let query = {};

    if (genre) query.genres = genre;
    if (featured === 'true') query.isFeatured = true;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Movie.countDocuments(query);

    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    
    movie.views += 1;
    await movie.save();
    
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/tmdb-import', adminAuth, async (req, res) => {
  try {
    const { tmdbId } = req.body;
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );

    const movieData = response.data;
    const newMovie = new Movie({
      title: movieData.title,
      description: movieData.overview,
      poster: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
      thumbnail: `https://image.tmdb.org/t/p/w780${movieData.backdrop_path}`,
      genres: movieData.genres.map(g => g.name),
      year: new Date(movieData.release_date).getFullYear(),
      rating: movieData.vote_average,
      duration: movieData.runtime + ' min',
      tmdbId: movieData.id.toString(),
      streamingLinks: [{
        quality: '1080p',
        url: `https://placeholder.stream/${movieData.id}/1080p`,
        server: 'Server 1'
      }]
    });

    await newMovie.save();
    res.json(newMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', [
  auth, adminAuth,
  body('title').notEmpty(),
  body('description').notEmpty()
], upload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const movie = new Movie({
      ...req.body,
      poster: req.files?.poster?.[0]?.path || req.body.poster,
      streamingLinks: JSON.parse(req.body.streamingLinks || '[]'),
      downloadLinks: JSON.parse(req.body.downloadLinks || '[]')
    });
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: 'Movie deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;