const knex = require('knex')(require('../knexfile'));

const ticketController = {};

ticketController.getTickets = async (req, res) => {
    try {
        // Get page, limit, and filter options from the query params or default them
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const filterType = req.query.type;
        const filterTerm = req.query.term;

        // Calculate the offset for pagination
        const offset = (page - 1) * limit;

        // Start the query builder
        let queryBuilder = knex('tickets').select('*');

        // Apply filters 
        if (filterTerm) {
            switch(filterType) {
                case 'title':
                    queryBuilder = queryBuilder.where('ticket_title', 'like', `%${filterTerm}%`);
                    break;
                case 'number':
                    queryBuilder = queryBuilder.where('ticket_number', 'like', `%${filterTerm}%`);
                    break;
                default:
                    break;
            }
        }

        // Fetch the tickets using limit and offset
        const tickets = await queryBuilder.limit(limit).offset(offset);

        // Get the total count of tickets for pagination info on client side, considering filters
        const totalTicketsQuery = knex('tickets');
        if (filterTerm) {
            switch(filterType) {
                case 'title':
                    totalTicketsQuery.where('ticket_title', 'like', `%${filterTerm}%`);
                    break;
                case 'number':
                    totalTicketsQuery.where('ticket_number', 'like', `%${filterTerm}%`);
                    break;
                default:
                    break;
            }
        }
        const totalTickets = await totalTicketsQuery.count('id as count');
        const totalPages = Math.ceil(totalTickets[0].count / limit);

        res.status(200).json({
            tickets,
            pagination: {
                page,
                limit,
                totalPages,
                totalTickets: totalTickets[0].count
            }
        });

    } catch (error) {
        console.error(error); // For debugging
        res.status(500).json({ error: 'Error retrieving tickets' });
    }
};


ticketController.postTicket = async (req, res) => {
    try {
        const { ticket_title, ticket_description } = req.body;

        // Check for title and description
        if (!ticket_title || !ticket_description) {
            return res.status(400).json({ error: 'Ticket title and description are required' });
        }

        // Insert the ticket data into the database
        const [newTicketId] = await knex('tickets').insert({
            ticket_title,
            ticket_description,
            ticket_number: 'TEMP'  // Temporary placeholder
        });

        // Generate a unique ticket number using the ID
        const ticketNumber = `TICK-${newTicketId}`;

        // Update the ticket with the generated ticket number
        await knex('tickets').where('id', newTicketId).update({ ticket_number: ticketNumber });

        // Return the created ticket's details
        res.status(201).json({ message: 'Ticket created successfully', ticketId: newTicketId, ticketNumber });

    } catch (error) {
        res.status(500).json({ error: 'Error creating ticket' });
    }
};

module.exports = ticketController;
