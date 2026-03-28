const express = require('express');
const Movie = require('../models/Movie');
const User = require('../models/User');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');

router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const stats = {
      totalMovies: await Movie.countDocuments(),
      totalUsers: await User.countDocuments(),
      recentMovies: await Movie.find().sort({ createdAt: -1 }).limit(5)
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;