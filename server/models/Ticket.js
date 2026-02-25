const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    source: {
        type: String,
        enum: ['email', 'form', 'csv', 'api'],
        default: 'form'
    },
    status: {
        type: String,
        enum: ['new', 'in_progress', 'resolved', 'closed'],
        default: 'new'
    },
    contactEmail: {
        type: String
    },
    // AI Classification Fields
    category: {
        type: String,
        default: 'Unclassified'
    },
    sentiment: {
        type: String, // negative, neutral, positive
        default: 'neutral'
    },
    urgency: {
        type: String, // high, medium, low
        default: 'low'
    },
    priorityScore: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);
