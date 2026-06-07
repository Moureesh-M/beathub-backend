const express = require('express');
const router = express.Router();

// Import Models
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');

// Import Middleware
const authenticate = require('../middleware/authenticate');

// Import Pipelines
const topArtistsPipeline = require('../aggregations/top-artists');
const userActivityPipeline = require('../aggregations/user-activity');

/**
 * @swagger
 * /analytics/top-artists:
 *   get:
 *     summary: Get Top 5 Artists
 *     description: Returns the top 5 artists ranked by the total number of songs they have on the platform. Requires authentication.
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A sorted list of top artists with their song counts.
 *       401:
 *         description: Unauthorized - No valid token provided
 *       500:
 *         description: Server error
 */
router.get('/top-artists', authenticate, async (req, res) => {
  try {
    // Execute the pipeline on the Song model
    const results = await Song.aggregate(topArtistsPipeline);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Aggregation Error:", error);
    const message = process.env.NODE_ENV === 'production'
      ? "Failed to fetch top artists"
      : error.message;
    res.status(500).json({ success: false, message });
  }
});

/**
 * @swagger
 * /analytics/most-active-users:
 *   get:
 *     summary: Get Most Active Users
 *     description: Returns the top 5 users ranked by the total number of playlists they have created. Requires authentication.
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A sorted list of highly active users.
 *       401:
 *         description: Unauthorized - No valid token provided
 *       500:
 *         description: Server error
 */
router.get('/most-active-users', authenticate, async (req, res) => {
  try {
    // Execute the pipeline on the Playlist model
    const results = await Playlist.aggregate(userActivityPipeline);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error("Aggregation Error:", error);
    const message = process.env.NODE_ENV === 'production'
      ? "Failed to fetch active users"
      : error.message;
    res.status(500).json({ success: false, message });
  }
});

module.exports = router;