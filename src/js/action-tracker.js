/**
 * Action Tracker Database
 * Uses localStorage to track user actions and calculate statistics
 */

class ActionDatabase {
    constructor() {
        this.storageKey = 'radish_action_log';
        this.statsKey = 'radish_stats';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.statsKey)) {
            localStorage.setItem(this.statsKey, JSON.stringify({
                totalActions: 0,
                actionCounts: {},
                firstActionDate: null,
                lastActionDate: null
            }));
        }
    }

    /**
     * Log a new action
     * @param {string} actionType - Type of action (e.g., 'recycled', 'composted')
     * @param {object} metadata - Additional metadata about the action
     */
    logAction(actionType, metadata = {}) {
        const actions = this.getActions();
        const timestamp = new Date().toISOString();

        const newAction = {
            id: this.generateId(),
            type: actionType,
            timestamp,
            metadata
        };

        actions.push(newAction);
        localStorage.setItem(this.storageKey, JSON.stringify(actions));

        // Update stats
        this.updateStats(actionType, timestamp);

        return newAction;
    }

    /**
     * Get all logged actions
     */
    getActions() {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    /**
     * Get actions for today
     */
    getTodayActions() {
        const actions = this.getActions();
        const today = new Date().setHours(0, 0, 0, 0);

        return actions.filter(action => {
            const actionDate = new Date(action.timestamp).setHours(0, 0, 0, 0);
            return actionDate === today;
        });
    }

    /**
     * Update aggregate statistics
     */
    updateStats(actionType, timestamp) {
        const stats = JSON.parse(localStorage.getItem(this.statsKey));

        stats.totalActions++;
        stats.actionCounts[actionType] = (stats.actionCounts[actionType] || 0) + 1;
        stats.lastActionDate = timestamp;

        if (!stats.firstActionDate) {
            stats.firstActionDate = timestamp;
        }

        localStorage.setItem(this.statsKey, JSON.stringify(stats));
    }

    /**
     * Get aggregate statistics
     */
    getStats() {
        return JSON.parse(localStorage.getItem(this.statsKey));
    }

    /**
     * Get action counts by type
     */
    getActionCounts() {
        const stats = this.getStats();
        return stats.actionCounts;
    }

    /**
     * Get top actions
     * @param {number} limit - Number of top actions to return
     */
    getTopActions(limit = 5) {
        const counts = this.getActionCounts();
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, limit)
            .map(([action, count]) => ({ action, count }));
    }

    /**
     * Get percentage for a specific action type
     */
    getActionPercentage(actionType) {
        const stats = this.getStats();
        if (stats.totalActions === 0) return 0;

        const count = stats.actionCounts[actionType] || 0;
        return Math.round((count / stats.totalActions) * 100);
    }

    /**
     * Calculate impact metrics
     */
    calculateImpact() {
        const counts = this.getActionCounts();

        // Example impact calculations (customize based on your data)
        const impact = {
            waterSaved: (counts['refilled-bottle'] || 0) * 16, // 16 oz per refill
            paperSaved: (counts['digital-cleanup'] || 0) * 5, // 5 sheets saved
            wasteRecycled: (counts['recycled'] || 0) * 0.5, // 0.5 lbs per action
            co2Reduced: (counts['bike-commute'] || 0) * 2 + (counts['carpooled'] || 0) * 1.5, // lbs CO2
            energySaved: (counts['lights-off'] || 0) * 0.1, // kWh
            mugsUsed: counts['used-mug'] || 0,
            containersUsed: counts['brought-container'] || 0
        };

        return impact;
    }

    /**
     * Get community-wide stats (simulated for MVP)
     * In production, this would aggregate all user data
     */
    getCommunityStats() {
        const personalStats = this.getStats();

        // Simulate community data (multiply by random factor for demo)
        const multiplier = 50 + Math.floor(Math.random() * 100);

        return {
            totalUsers: multiplier,
            totalActions: personalStats.totalActions * multiplier,
            topActions: this.getTopActions(3),
            sustainabilityScore: this.calculateSustainabilityScore()
        };
    }

    /**
     * Calculate sustainability score (0-100)
     */
    calculateSustainabilityScore() {
        const stats = this.getStats();
        const sustainableActions = [
            'recycled', 'composted', 'used-mug', 'refilled-bottle',
            'bike-commute', 'used-stairs', 'lights-off', 'brought-container'
        ];

        let sustainableCount = 0;
        sustainableActions.forEach(action => {
            sustainableCount += stats.actionCounts[action] || 0;
        });

        if (stats.totalActions === 0) return 0;

        const score = Math.min(100, Math.round((sustainableCount / stats.totalActions) * 100));
        return score;
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Clear all data (for testing)
     */
    clearAll() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.statsKey);
        this.initializeStorage();
    }

    /**
     * Export data as JSON
     */
    exportData() {
        return {
            actions: this.getActions(),
            stats: this.getStats(),
            impact: this.calculateImpact()
        };
    }
}

// Export for use in other modules
export default ActionDatabase;
