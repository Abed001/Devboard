const pool = require('../config/db');

// GET all goals for logged-in user
const getGoals = async (req, res) => {
    try {
        const userId = req.userId;

        const goals = await pool.query(
            'SELECT id, text, progress, due_date, created_at FROM goals WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        res.json(goals.rows);
    } catch (error) {
        console.error('Get goals error:', error);
        res.status(500).json({ error: 'Server error while fetching goals' });
    }
};

// CREATE new goal
const createGoal = async (req, res) => {
    try {
        const userId = req.userId;
        const { text, progress, due_date } = req.body;

        // Validate input
        if (!text) {
            return res.status(400).json({ error: 'Goal text is required' });
        }

        const newGoal = await pool.query(
            'INSERT INTO goals (user_id, text, progress, due_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, text, progress || 0, due_date || null]
        );

        res.status(201).json({
            message: 'Goal created successfully',
            goal: newGoal.rows[0]
        });
    } catch (error) {
        console.error('Create goal error:', error);
        res.status(500).json({ error: 'Server error while creating goal' });
    }
};

// UPDATE goal (mainly for progress updates)
const updateGoal = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { text, progress, due_date } = req.body;

        // Check if goal exists and belongs to user
        const goal = await pool.query(
            'SELECT * FROM goals WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (goal.rows.length === 0) {
            return res.status(404).json({ error: 'Goal not found or unauthorized' });
        }

        // Update goal
        const updatedGoal = await pool.query(
            'UPDATE goals SET text = $1, progress = $2, due_date = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [text, progress, due_date, id, userId]
        );

        res.json({
            message: 'Goal updated successfully',
            goal: updatedGoal.rows[0]
        });
    } catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({ error: 'Server error while updating goal' });
    }
};

// DELETE goal
const deleteGoal = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        // Check if goal exists and belongs to user
        const goal = await pool.query(
            'SELECT * FROM goals WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (goal.rows.length === 0) {
            return res.status(404).json({ error: 'Goal not found or unauthorized' });
        }

        // Delete goal
        await pool.query(
            'DELETE FROM goals WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
        console.error('Delete goal error:', error);
        res.status(500).json({ error: 'Server error while deleting goal' });
    }
};

module.exports = {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal
};