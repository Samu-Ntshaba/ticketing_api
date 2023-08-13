const jwt = require('jsonwebtoken');
const knex = require('knex')(require('../knexfile'));

function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });

        // Check if user exists in database
        const dbUser = await knex('users').where({ id: user.id }).first();

        if (!dbUser) return res.status(403).json({ error: 'User not found.' });

        // Attach user details to the request for other middlewares/routes to use
        req.user = dbUser;

        next();
    });
};

module.exports = validateToken;
