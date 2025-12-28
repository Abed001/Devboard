const express = require('express');
const {
    getResources,
    createResource,
    updateResource,
    deleteResource
} = require('../controllers/resourceController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/resources - Get all user's resources
router.get('/', getResources);

// POST /api/resources - Create new resource
router.post('/', createResource);

// PATCH /api/resources/:id - Update resource
router.patch('/:id', updateResource);

// DELETE /api/resources/:id - Delete resource
router.delete('/:id', deleteResource);

module.exports = router;