const Ticket = require('../models/Ticket');

// In-memory store for development without MongoDB
let tickets = [
    {
        _id: "1",
        title: "Sem luz na Rua A",
        description: "Estamos sem energia há 4 horas.",
        category: "Interrupção de Energia",
        urgency: "high",
        sentiment: "negative",
        priorityScore: 5,
        status: "new",
        createdAt: new Date().toISOString()
    },
    {
        _id: "2",
        title: "Cobrança indevida na fatura",
        description: "Veio um valor de 500 reais a mais.",
        category: "Cobrança",
        urgency: "medium",
        sentiment: "negative",
        priorityScore: 3,
        status: "in_progress",
        createdAt: new Date().toISOString()
    },
    {
        _id: "3",
        title: "Elogio ao atendimento",
        description: "Muito obrigado pela rapidez.",
        category: "Atendimento",
        urgency: "low",
        sentiment: "positive",
        priorityScore: 1,
        status: "resolved",
        createdAt: new Date().toISOString()
    }
];

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

        const newTicket = {
            _id: Math.random().toString(36).substr(2, 9),
            title,
            description,
            source: source || 'form',
            contactEmail,
            status: 'new',
            ...classification,
            createdAt: new Date().toISOString()
        };

        tickets.push(newTicket);

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
        // Sort by priorityScore desc
        const sortedTickets = [...tickets].sort((a, b) => b.priorityScore - a.priorityScore);

        res.status(200).json({
            success: true,
            count: sortedTickets.length,
            data: sortedTickets
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get dashboard stats
exports.getStats = async (req, res) => {
    try {
        const total = tickets.length;
        const highUrgency = tickets.filter(t => t.urgency === 'high').length;
        const negativeSentiment = tickets.filter(t => t.sentiment === 'negative').length;

        // Group by Category
        const categoryCounts = tickets.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + 1;
            return acc;
        }, {});

        const byCategory = Object.keys(categoryCounts).map(key => ({
            _id: key,
            count: categoryCounts[key]
        }));

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
