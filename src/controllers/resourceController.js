const pool = require('../config/db');

// GET all resources for logged-in user
const getResources = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware

        const resources = await pool.query(
            'SELECT id, title, url, category, created_at FROM resources WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        res.json(resources.rows);
    } catch (error) {
        console.error('Get resources error:', error);
        res.status(500).json({ error: 'Server error while fetching resources' });
    }
};

const createResource = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const { title, url, category } = req.body;

        // Validate input
        if (!title || !url) {
            return res.status(400).json({ error: 'Title and URL are required' });
        }

        // FIXED: Proper parameterized query
        const newResource = await pool.query(
            'INSERT INTO resources (user_id, title, url, category) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, title, url, category || 'General']
        );

        res.status(201).json({
            message: 'Resource created successfully',
            resource: newResource.rows[0]
        });
    } catch (error) {
        console.error('Create resource error:', error);
        res.status(500).json({ error: 'Server error while creating resource' });
    }
};
// UPDATE resource
const updateResource = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const { title, url, category } = req.body;

        // Check if resource exists and belongs to user
        const resource = await pool.query(
            'SELECT * FROM resources WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (resource.rows.length === 0) {
            return res.status(404).json({ error: 'Resource not found or unauthorized' });
        }

        // Update resource
        const updatedResource = await pool.query(
            'UPDATE resources SET title = $1, url = $2, category = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
            [title, url, category, id, userId]
        );

        res.json({
            message: 'Resource updated successfully',
            resource: updatedResource.rows[0]
        });
    } catch (error) {
        console.error('Update resource error:', error);
        res.status(500).json({ error: 'Server error while updating resource' });
    }
};

// DELETE resource
const deleteResource = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        // Check if resource exists and belongs to user
        const resource = await pool.query(
            'SELECT * FROM resources WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        if (resource.rows.length === 0) {
            return res.status(404).json({ error: 'Resource not found or unauthorized' });
        }

        // Delete resource
        await pool.query(
            'DELETE FROM resources WHERE id = $1 AND user_id = $2',
            [id, userId]
        );

        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Delete resource error:', error);
        res.status(500).json({ error: 'Server error while deleting resource' });
    }
};

module.exports = {
    getResources,
    createResource,
    updateResource,
    deleteResource
};