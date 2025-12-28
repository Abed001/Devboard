const express = require('express');
const { getGithubRepos } = require('../controllers/githubController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Require authentication for GitHub endpoints
router.use(authenticateToken);

// GET /api/github/repos?username=YOUR_GITHUB_USERNAME
router.get('/repos', getGithubRepos);

module.exports = router;