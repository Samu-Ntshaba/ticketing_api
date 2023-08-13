const express = require('express');
const ticketController = require('../controllers/ticketController');
const validateToken = require('../middlewares/validateToken');

const router = express.Router();

// Retrieve a list of all tickets
router.get('/', validateToken, ticketController.getTickets);

// Create a new ticket entry
router.post('/', validateToken, ticketController.postTicket);

module.exports = router;
