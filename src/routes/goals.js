const express = require('express');
const {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal
} = require('../controllers/goalController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// GET /api/goals - Get all user's goals
router.get('/', getGoals);

// POST /api/goals - Create new goal
router.post('/', createGoal);

// PATCH /api/goals/:id - Update goal (progress, text, due date)
router.patch('/:id', updateGoal);

// DELETE /api/goals/:id - Delete goal
router.delete('/:id', deleteGoal);

module.exports = router;