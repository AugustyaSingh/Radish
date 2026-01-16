// ========================================
// ACTION LOGGER
// Logs daily campus actions and triggers impact reveals
// ========================================

import { showImpactReveal } from './impact-library.js';

// Action log storage
let actionLog = [];

// Action display names
const actionNames = {
    'ordered-food': 'Ordered food',
    'printed': 'Printed materials',
    'used-mug': 'Used personal mug',
    'refilled-bottle': 'Refilled water bottle',
    'disposed-waste': 'Disposed of waste',
    'digital-cleanup': 'Performed digital cleanup'
};

// Log an action
export function logAction(actionKey) {
    const timestamp = new Date();
    const action = {
        key: actionKey,
        name: actionNames[actionKey] || actionKey,
        timestamp: timestamp
    };

    actionLog.push(action);
    renderActionLog();
    showImpactReveal(actionKey);

    // Save to localStorage
    saveActionLog();
}

// Render action log in UI
function renderActionLog() {
    const entriesContainer = document.getElementById('action-entries');
    if (!entriesContainer) return;

    // Clear container
    entriesContainer.innerHTML = '';

    if (actionLog.length === 0) {
        entriesContainer.innerHTML = '<p class="text-muted" style="font-size: 0.875rem; font-style: italic;">No actions logged yet today.</p>';
        return;
    }

    // Render each action (most recent first)
    const reversedLog = [...actionLog].reverse();
    reversedLog.forEach(action => {
        const entry = document.createElement('div');
        entry.className = 'action-entry';

        const timeStr = action.timestamp.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });

        entry.innerHTML = `
      <div class="action-entry-time">${timeStr}</div>
      <div class="action-entry-text">${action.name}</div>
    `;

        entriesContainer.appendChild(entry);
    });
}

// Save action log to localStorage
function saveActionLog() {
    localStorage.setItem('radish_action_log', JSON.stringify(actionLog));
}

// Load action log from localStorage
function loadActionLog() {
    const saved = localStorage.getItem('radish_action_log');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Only load today's actions
            const today = new Date().toDateString();
            actionLog = parsed.filter(action => {
                const actionDate = new Date(action.timestamp);
                return actionDate.toDateString() === today;
            }).map(action => ({
                ...action,
                timestamp: new Date(action.timestamp)
            }));
        } catch (e) {
            actionLog = [];
        }
    }
}

// Initialize action logger
export function initActionLogger() {
    // Load existing log
    loadActionLog();
    renderActionLog();

    // Set up action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const actionKey = btn.getAttribute('data-action');
            if (actionKey) {
                logAction(actionKey);

                // Visual feedback
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            }
        });
    });
}

// Get action statistics
export function getActionStats() {
    const total = actionLog.length;
    const sustainable = actionLog.filter(action =>
        ['used-mug', 'refilled-bottle', 'digital-cleanup'].includes(action.key)
    ).length;

    return {
        total,
        sustainable,
        percentage: total > 0 ? Math.round((sustainable / total) * 100) : 0
    };
}
