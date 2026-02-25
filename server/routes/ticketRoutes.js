const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getStats, updateTicket } = require('../controllers/TicketController');
const { protect } = require('../middleware/auth');

router.post('/', createTicket);
router.get('/', protect, getTickets);
router.get('/stats', protect, getStats);
router.put('/:id', protect, updateTicket);

module.exports = router;
