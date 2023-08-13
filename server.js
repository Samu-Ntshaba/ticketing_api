const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(cors());  // Enable all CORS requests.
app.use(bodyParser.json()); // Parse incoming JSON requests.
app.use(bodyParser.urlencoded({ extended: true })); // Handle URL-encoded data.

// Routes
app.use('/api/tickets', ticketRoutes);
app.use('/api/users', userRoutes);

// Generic error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Handling 404 - Page Not Found
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
