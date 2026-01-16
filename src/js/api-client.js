// ========================================
// API CLIENT
// Bridge between frontend and backend
// ========================================

const API_BASE_URL = 'http://localhost:3000/api';

// Generate or retrieve anonymous user ID
function getUserId() {
    let userId = localStorage.getItem('radish_user_id');
    if (!userId) {
        userId = 'user_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('radish_user_id', userId);
    }
    return userId;
}

export const apiClient = {
    // Log an action
    async logAction(actionType, metadata = {}) {
        const userId = getUserId();
        try {
            const response = await fetch(`${API_BASE_URL}/actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, actionType, metadata })
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('API Error (logAction):', error);
            // Return dummy success so frontend doesn't break, but mark as offline
            return { success: false, offline: true, error: error.message };
        }
    },

    // Get user actions
    async getUserActions(limit = 100) {
        const userId = getUserId();
        try {
            const response = await fetch(`${API_BASE_URL}/actions/${userId}?limit=${limit}`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('API Error (getUserActions):', error);
            throw error; // Rethrow so caller knows fetch failed
        }
    },

    // Get community stats
    async getCommunityStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/stats/community`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('API Error (getCommunityStats):', error);
            return null;
        }
    },

    // Search disposal guide
    async searchDisposal(query) {
        try {
            const url = new URL(`${API_BASE_URL}/disposal/search`);
            if (query) url.searchParams.append('q', query);

            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('API Error (searchDisposal):', error);
            return []; // Return empty on error to handle gracefully
        }
    }
};
