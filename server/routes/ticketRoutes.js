const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getStats } = require('../controllers/TicketController');

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/stats', getStats);

module.exports = router;
