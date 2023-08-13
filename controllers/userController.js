const jwt = require('jsonwebtoken');
const knex = require('knex')(require('../knexfile'));
const bcrypt = require('bcrypt');

const saltRounds = 10;

const userController = {};

userController.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await knex('users').where({ username }).first();
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert the new user into the database
        const newUser = await knex('users').insert({ username, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
};

userController.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Retrieve the user from the database
        const user = await knex('users').where({ username }).first();

        if (user) {
            const validPassword = await bcrypt.compare(password, user.password);

            if (validPassword) {
                // Create and assign a token
                const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
                return res.header('auth-token', token).status(200).json({ token, username: user.username  });
            } else {
                return res.status(401).json({ error: 'Invalid password' });
            }
        } else {
            return res.status(401).json({ error: 'Username not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

module.exports = userController;
