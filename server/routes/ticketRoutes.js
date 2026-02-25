const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getStats } = require('../controllers/TicketController');
const { protect } = require('../middleware/auth');

router.post('/', createTicket);
router.get('/', protect, getTickets);
router.get('/stats', protect, getStats);

module.exports = router;
