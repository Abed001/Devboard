const axios = require('axios');

// GET GitHub repositories for a user
const getGithubRepos = async (req, res) => {
    try {
        const { username } = req.query; // Get username from query params

        if (!username) {
            return res.status(400).json({ error: 'GitHub username is required' });
        }

        // Fetch repos from GitHub API
        const response = await axios.get(
            `https://api.github.com/users/${username}/repos`,
            {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'DevBoard-App'
                },
                params: {
                    sort: 'updated',
                    per_page: 10 // Get latest 10 repos
                }
            }
        );

        // Transform GitHub data to our format
        const repos = response.data.map((repo) => ({
            id: repo.id,
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            updated: repo.updated_at,
            created: repo.created_at,
            isPrivate: repo.private
        }));

        res.json(repos);
    } catch (error) {
        console.error('GitHub API error:', error.response?.data || error.message);

        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'GitHub user not found' });
        }

        if (error.response?.status === 403) {
            return res.status(403).json({ error: 'GitHub API rate limit exceeded. Try again later.' });
        }

        res.status(500).json({ error: 'Failed to fetch GitHub repositories' });
    }
};

module.exports = {
    getGithubRepos
};