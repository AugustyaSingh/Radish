// ========================================
// RADISH DATABASE - SQLite
// ========================================

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DATABASE_PATH || './radish.db';

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeTables();
    }
});

// Initial Disposal Data (Seeding)
const initialDisposalData = [
    {
        id: 'coffee-cup',
        name: 'Coffee Cup',
        scientificName: 'Cuppa polyethylena',
        icon: '☕',
        category: 'Hybrid Material',
        bin: 'landfill',
        binColor: 'terra-cotta',
        explanation: 'Most "paper" coffee cups are reinforced with a hidden polyethylene plastic lining to prevent leaking. This makes them nearly impossible to recycle in standard campus bins.',
        contamination: null,
        keywords: ['coffee', 'cup', 'paper cup', 'disposable cup']
    },
    {
        id: 'plastic-bottle',
        name: 'Plastic Water Bottle',
        scientificName: 'Bottla plasticus',
        icon: '🥤',
        category: 'PET Plastic',
        bin: 'recycling',
        binColor: 'periwinkle',
        explanation: 'Clear plastic bottles (PET #1) are highly recyclable. Empty and rinse before placing in the blue bin. Caps can be left on.',
        contamination: null,
        keywords: ['bottle', 'plastic', 'water', 'soda', 'drink']
    },
    {
        id: 'pizza-box',
        name: 'Pizza Box',
        scientificName: 'Boxus cheesus',
        icon: '🍕',
        category: 'Contaminated Fiber',
        bin: 'compost',
        binColor: 'sage',
        explanation: 'The oils from cheese have bonded with the paper fibers, preventing them from being pulped into new paper. If heavily soiled, this belongs in compost (or landfill if compost unavailable).',
        contamination: {
            alert: 'Grease Contamination Detected',
            description: 'The oil has saturated the cardboard fibers. Clean sections can be recycled; greasy sections should be composted.'
        },
        keywords: ['pizza', 'box', 'cardboard', 'greasy']
    },
    {
        id: 'aluminum-can',
        name: 'Aluminum Can',
        scientificName: 'Canus metallicus',
        icon: '🥫',
        category: 'Metal',
        bin: 'recycling',
        binColor: 'periwinkle',
        explanation: 'Aluminum is infinitely recyclable. Rinse out any remaining liquid and place in the blue bin. No need to remove labels.',
        contamination: null,
        keywords: ['can', 'aluminum', 'soda', 'beer', 'metal']
    },
    {
        id: 'compostable-fork',
        name: 'Compostable Fork',
        scientificName: 'Forka biodegradus',
        icon: '🍴',
        category: 'PLA Bioplastic',
        bin: 'compost',
        binColor: 'sage',
        explanation: 'Made from plant-based PLA plastic, this fork requires industrial composting facilities to break down. It will NOT decompose in landfills and contaminates recycling streams.',
        contamination: {
            alert: 'Common Mis-Disposal',
            description: 'This item is often placed in recycling bins by mistake. Look for the green "compost" bin, typically found near dining areas.'
        },
        keywords: ['fork', 'spoon', 'utensil', 'compostable', 'bioplastic']
    },
    {
        id: 'paper',
        name: 'Clean Paper',
        scientificName: 'Parchmentus recyclus',
        icon: '📄',
        category: 'Fiber',
        bin: 'recycling',
        binColor: 'periwinkle',
        explanation: 'Clean, dry paper is highly recyclable. Remove any plastic windows or staples if possible, but small amounts are acceptable.',
        contamination: null,
        keywords: ['paper', 'notebook', 'assignment', 'handout', 'notes']
    },
    {
        id: 'plastic-bag',
        name: 'Plastic Bag',
        scientificName: 'Bagus thinfilmus',
        icon: '🛍️',
        category: 'Thin-Film Plastic',
        bin: 'landfill',
        binColor: 'terra-cotta',
        explanation: 'Thin plastic bags jam recycling machinery. Take these to dedicated plastic bag collection bins at grocery stores, not campus recycling.',
        contamination: null,
        keywords: ['bag', 'plastic bag', 'shopping bag', 'grocery']
    },
    {
        id: 'glass-jar',
        name: 'Glass Jar',
        scientificName: 'Glassus containus',
        icon: '🏺',
        category: 'Glass',
        bin: 'recycling',
        binColor: 'periwinkle',
        explanation: 'Glass is infinitely recyclable. Rinse out food residue and remove metal lids (which can be recycled separately).',
        contamination: null,
        keywords: ['glass', 'jar', 'bottle', 'container']
    }
];

// Create tables
function initializeTables() {
    db.serialize(() => {
        // Actions Table
        db.run(`
            CREATE TABLE IF NOT EXISTS actions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                action_type TEXT NOT NULL,
                metadata TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Index for actions
        db.run(`CREATE INDEX IF NOT EXISTS idx_user_id ON actions(user_id)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_timestamp ON actions(timestamp)`);
        db.run(`CREATE INDEX IF NOT EXISTS idx_action_type ON actions(action_type)`);

        // Disposal Items Table
        db.run(`
            CREATE TABLE IF NOT EXISTS disposal_items (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                scientific_name TEXT,
                icon TEXT,
                category TEXT,
                bin TEXT,
                bin_color TEXT,
                explanation TEXT,
                contamination TEXT, -- JSON
                keywords TEXT -- JSON
            )
        `, (err) => {
            if (!err) {
                seedDisposalTable();
            }
        });
    });
}

function seedDisposalTable() {
    db.get("SELECT count(*) as count FROM disposal_items", (err, row) => {
        if (err) return;
        if (row.count === 0) {
            console.log('🌱 Seeding disposal database...');
            const stmt = db.prepare(`
                INSERT INTO disposal_items (id, name, scientific_name, icon, category, bin, bin_color, explanation, contamination, keywords)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            initialDisposalData.forEach(item => {
                stmt.run(
                    item.id,
                    item.name,
                    item.scientificName,
                    item.icon,
                    item.category,
                    item.bin,
                    item.binColor,
                    item.explanation,
                    JSON.stringify(item.contamination),
                    JSON.stringify(item.keywords)
                );
            });
            stmt.finalize(() => console.log('✅ Disposal database seeded'));
        }
    });
}

// Database helper functions
const database = {
    // Log a new action
    logAction(userId, actionType, metadata = {}) {
        return new Promise((resolve, reject) => {
            const metadataStr = JSON.stringify(metadata);
            db.run(
                `INSERT INTO actions (user_id, action_type, metadata) VALUES (?, ?, ?)`,
                [userId, actionType, metadataStr],
                function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                }
            );
        });
    },

    // Get user's actions
    getUserActions(userId, limit = 100) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM actions WHERE user_id = ? ORDER BY timestamp DESC LIMIT ?`,
                [userId, limit],
                (err, rows) => {
                    if (err) reject(err);
                    else {
                        // Parse metadata JSON
                        const actions = rows.map(row => ({
                            ...row,
                            metadata: row.metadata ? JSON.parse(row.metadata) : {}
                        }));
                        resolve(actions);
                    }
                }
            );
        });
    },

    // Get user's action statistics
    getUserStats(userId) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT action_type, COUNT(*) as count 
                 FROM actions 
                 WHERE user_id = ? 
                 GROUP BY action_type`,
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    else {
                        const actionCounts = {};
                        let totalActions = 0;
                        rows.forEach(row => {
                            actionCounts[row.action_type] = row.count;
                            totalActions += row.count;
                        });
                        resolve({ totalActions, actionCounts });
                    }
                }
            );
        });
    },

    // Get community-wide statistics
    getCommunityStats() {
        return new Promise((resolve, reject) => {
            // Total actions
            db.get(`SELECT COUNT(*) as total FROM actions`, (err, totalRow) => {
                if (err) return reject(err);

                // Total users
                db.get(`SELECT COUNT(DISTINCT user_id) as users FROM actions`, (err, userRow) => {
                    if (err) return reject(err);

                    // Action breakdown
                    db.all(
                        `SELECT action_type, COUNT(*) as count 
                         FROM actions 
                         GROUP BY action_type 
                         ORDER BY count DESC`,
                        (err, actionRows) => {
                            if (err) return reject(err);

                            const actionCounts = {};
                            actionRows.forEach(row => {
                                actionCounts[row.action_type] = row.count;
                            });

                            resolve({
                                totalActions: totalRow.total,
                                totalUsers: userRow.users,
                                actionCounts
                            });
                        }
                    );
                });
            });
        });
    },

    // Get today's statistics
    getTodayStats() {
        return new Promise((resolve, reject) => {
            const today = new Date().toISOString().split('T')[0];

            db.get(
                `SELECT COUNT(*) as total FROM actions WHERE DATE(timestamp) = ?`,
                [today],
                (err, totalRow) => {
                    if (err) return reject(err);

                    db.get(
                        `SELECT COUNT(DISTINCT user_id) as users FROM actions WHERE DATE(timestamp) = ?`,
                        [today],
                        (err, userRow) => {
                            if (err) return reject(err);

                            db.all(
                                `SELECT action_type, COUNT(*) as count 
                                 FROM actions 
                                 WHERE DATE(timestamp) = ? 
                                 GROUP BY action_type`,
                                [today],
                                (err, actionRows) => {
                                    if (err) return reject(err);

                                    const actionCounts = {};
                                    actionRows.forEach(row => {
                                        actionCounts[row.action_type] = row.count;
                                    });

                                    resolve({
                                        todayActions: totalRow.total,
                                        activeUsers: userRow.users,
                                        actionCounts
                                    });
                                }
                            );
                        }
                    );
                }
            );
        });
    },

    // Search Disposal Items
    searchDisposalItems(query) {
        return new Promise((resolve, reject) => {
            if (!query || query.trim() === '') {
                // Return all
                db.all("SELECT * FROM disposal_items", (err, rows) => {
                    if (err) reject(err);
                    else resolve(formatDisposalRows(rows));
                });
                return;
            }

            const searchTerm = `%${query.toLowerCase()}%`;
            // Search in name or keywords
            // Note: keywords is JSON array string, so LIKE works primitively but effectively for simple terms
            db.all(
                `SELECT * FROM disposal_items 
                 WHERE lower(name) LIKE ? OR lower(keywords) LIKE ?`,
                [searchTerm, searchTerm],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(formatDisposalRows(rows));
                }
            );
        });
    }
};

function formatDisposalRows(rows) {
    return rows.map(r => ({
        id: r.id,
        name: r.name,
        scientificName: r.scientific_name,
        icon: r.icon,
        category: r.category,
        bin: r.bin,
        binColor: r.bin_color,
        explanation: r.explanation,
        contamination: r.contamination ? JSON.parse(r.contamination) : null,
        keywords: r.keywords ? JSON.parse(r.keywords) : []
    }));
}

module.exports = database;
