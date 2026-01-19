// ========================================
// RADISH BACKEND API SERVER
// Express + SQLite
// ========================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// ========================================
// API ROUTES
// ========================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Radish API is running' });
});

// POST /api/actions - Log a new action
app.post('/api/actions', async (req, res) => {
    try {
        const { userId, actionType, metadata } = req.body;

        if (!userId || !actionType) {
            return res.status(400).json({
                error: 'userId and actionType are required'
            });
        }

        const result = await database.logAction(userId, actionType, metadata);

        res.json({
            success: true,
            actionId: result.id,
            message: 'Action logged successfully'
        });
    } catch (error) {
        console.error('Error logging action:', error);
        res.status(500).json({ error: 'Failed to log action' });
    }
});

// GET /api/actions/:userId - Get user's actions
app.get('/api/actions/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit) || 100;

        const actions = await database.getUserActions(userId, limit);
        const stats = await database.getUserStats(userId);

        res.json({
            actions,
            stats
        });
    } catch (error) {
        console.error('Error fetching user actions:', error);
        res.status(500).json({ error: 'Failed to fetch actions' });
    }
});

// GET /api/stats/community - Get community-wide statistics
app.get('/api/stats/community', async (req, res) => {
    try {
        const stats = await database.getCommunityStats();

        // Calculate impact metrics
        const impact = calculateImpact(stats.actionCounts);

        res.json({
            ...stats,
            impact
        });
    } catch (error) {
        console.error('Error fetching community stats:', error);
        res.status(500).json({ error: 'Failed to fetch community stats' });
    }
});

// GET /api/stats/today - Get today's statistics
app.get('/api/stats/today', async (req, res) => {
    try {
        const stats = await database.getTodayStats();

        // Calculate impact metrics
        const impact = calculateImpact(stats.actionCounts);

        res.json({
            ...stats,
            impact
        });
    } catch (error) {
        console.error('Error fetching today stats:', error);
        res.status(500).json({ error: 'Failed to fetch today stats' });
    }
});

// GET /api/disposal/search - Search for disposal items
app.get('/api/disposal/search', async (req, res) => {
    try {
        const query = req.query.q || '';
        const results = await database.searchDisposalItems(query);
        res.json({ results });
    } catch (error) {
        console.error('Error searching disposal items:', error);
        res.status(500).json({ error: 'Failed to search items' });
    }
});

// ========================================
// HELPER FUNCTIONS
// ========================================

function calculateImpact(actionCounts) {
    return {
        waterSaved: (actionCounts['refilled-bottle'] || 0) * 16, // oz
        paperSaved: (actionCounts['digital-cleanup'] || 0) * 5, // sheets
        wasteRecycled: (actionCounts['recycled'] || 0) * 0.5, // lbs
        co2Reduced: (actionCounts['bike-commute'] || 0) * 2 + (actionCounts['carpooled'] || 0) * 1.5, // lbs
        energySaved: (actionCounts['lights-off'] || 0) * 0.1, // kWh
        mugsUsed: actionCounts['used-mug'] || 0,
        containersUsed: actionCounts['brought-container'] || 0
    };
}

// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
    console.log(`\n🌱 Radish API Server`);
    console.log(`📡 Running on http://localhost:${PORT}`);
    console.log(`🗄️  Database: ${process.env.DATABASE_PATH || './radish.db'}`);
    console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down gracefully...');
    process.exit(0);
});
