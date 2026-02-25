const Ticket = require('../models/Ticket');

// Mock Classification Logic
const classifyTicket = (text) => {
    const lowerText = text.toLowerCase();

    let urgency = 'low';
    let urgencyScore = 1;

    if (lowerText.match(/(urgente|perigo|fogo|risco|socorro|imediato|vazamento grave)/)) {
        urgency = 'high';
        urgencyScore = 3;
    } else if (lowerText.match(/(agora|hoje|rápido|esperando|meses)/)) {
        urgency = 'medium';
        urgencyScore = 2;
    }

    let category = 'Geral';
    if (lowerText.match(/(fatura|conta|pagamento|boleto|valor|cobrança|dinheiro|caro)/)) {
        category = 'Cobrança';
    } else if (lowerText.match(/(sem luz|sem energia|apagão|queda|escuro)/)) {
        category = 'Interrupção de Energia';
    } else if (lowerText.match(/(sem água|vazamento|torneira|cano|pingo|suja)/)) {
        category = 'Abastecimento de Água';
    } else if (lowerText.match(/(internet|sinal|wifi|lento|caiu|roteador)/)) {
        category = 'Telecomunicações';
    } else if (lowerText.match(/(atendimento|atendente|educação|fila|telefone|ligação)/)) {
        category = 'Atendimento';
    }

    let sentiment = 'neutral';
    let sentimentScore = 1;
    const negativeWords = ['horrível', 'péssimo', 'ruim', 'bosta', 'lixo', 'incompetente', 'vergonha', 'absurdo', 'odeio', 'processo'];
    const positiveWords = ['excelente', 'ótimo', 'parabéns', 'obrigado', 'rápido', 'bom'];

    const negCount = negativeWords.reduce((acc, word) => lowerText.includes(word) ? acc + 1 : acc, 0);
    const posCount = positiveWords.reduce((acc, word) => lowerText.includes(word) ? acc + 1 : acc, 0);

    if (negCount > 0) {
        sentiment = 'negative';
        sentimentScore = 3;
    } else if (posCount > 0) {
        sentiment = 'positive';
        sentimentScore = 0;
    }

    let priorityScore = urgencyScore + sentimentScore;
    if (priorityScore > 5) priorityScore = 5;

    return { category, sentiment, urgency, priorityScore };
};

// @desc    Create a new ticket
exports.createTicket = async (req, res) => {
    try {
        const { title, description, source, contactEmail } = req.body;

        const classification = classifyTicket(`${title} ${description}`);

        const newTicket = await Ticket.create({
            title,
            description,
            source: source || 'form',
            contactEmail,
            status: 'new',
            ...classification
        });

        res.status(201).json({
            success: true,
            data: newTicket
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get all tickets
exports.getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ priorityScore: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get dashboard stats
exports.getStats = async (req, res) => {
    try {
        const total = await Ticket.countDocuments();
        const highUrgency = await Ticket.countDocuments({ urgency: 'high' });
        const negativeSentiment = await Ticket.countDocuments({ sentiment: 'negative' });

        // Group by Category
        const byCategory = await Ticket.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                total,
                highUrgency,
                negativeSentiment,
                byCategory
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
