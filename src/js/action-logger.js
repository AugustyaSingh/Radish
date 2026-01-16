// ========================================
// ACTION LOGGER w/ API INTEGRATION
// Logs daily campus actions to backend database
// ========================================

import { showImpactReveal } from './impact-library.js';
import { apiClient } from './api-client.js';

// Action display names
const actionNames = {
    'ordered-food': 'Ordered food',
    'printed': 'Printed materials',
    'used-mug': 'Used personal mug',
    'refilled-bottle': 'Refilled water bottle',
    'disposed-waste': 'Disposed of waste',
    'digital-cleanup': 'Performed digital cleanup',
    'recycled': 'Recycled materials',
    'composted': 'Composted organic waste',
    'carpooled': 'Carpooled to campus',
    'used-stairs': 'Used stairs instead of elevator',
    'lights-off': 'Turned off lights',
    'brought-container': 'Brought reusable container',
    'bike-commute': 'Biked to campus',
    'meal-prep': 'Brought lunch from home'
};

// Initialize action log state (in-memory cache)
let actionLog = [];

export async function logAction(actionKey, customText = '') {
    const timestamp = new Date();

    // 1. Optimistic UI update (Immediate Feedback)
    const action = {
        key: actionKey,
        name: customText || actionNames[actionKey] || actionKey,
        timestamp: timestamp
    };
    actionLog.push(action);
    renderActionLog();
    showImpactReveal(actionKey);
    triggerCelebration(actionKey);

    // 2. Send to Backend (Async)
    try {
        const metadata = customText ? { customText } : {};
        const result = await apiClient.logAction(actionKey, metadata);

        if (result.success) {
            console.log('✅ Logged to DB ID:', result.actionId);
        } else {
            console.warn('⚠️ Server unavailable - Logged locally only');
        }
    } catch (err) {
        console.error('❌ Logging failed:', err);
    }
}

// Render action log in UI
function renderActionLog() {
    const entriesContainer = document.getElementById('action-entries');
    if (!entriesContainer) return;

    entriesContainer.innerHTML = '';

    // Filter for today's logs only for display
    const today = new Date().toDateString();
    const todaysLog = actionLog.filter(a => new Date(a.timestamp).toDateString() === today);

    if (todaysLog.length === 0) {
        entriesContainer.innerHTML = `<div style="text-align:center; padding:1rem; opacity:0.6; font-size:0.8rem; font-style:italic;">No actions logged yet today</div>`;
        return;
    }

    // Render (most recent first)
    [...todaysLog].reverse().forEach(action => {
        const entry = document.createElement('div');
        entry.className = 'action-entry';

        const timeStr = new Date(action.timestamp).toLocaleTimeString('en-US', {
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

// Load history from Backend
export async function loadActionLog() {
    const entriesContainer = document.getElementById('action-entries');

    // Show non-intrusive loading state
    if (entriesContainer && entriesContainer.children.length === 0) {
        entriesContainer.innerHTML = '<div style="padding:1rem; opacity:0.5; font-size:0.8rem; text-align:center;">Syncing...</div>';
    }

    try {
        const data = await apiClient.getUserActions(50);

        if (data && data.actions) {
            const serverActions = data.actions.map(a => ({
                key: a.action_type,
                name: a.metadata?.customText || actionNames[a.action_type] || a.action_type,
                timestamp: new Date(a.timestamp)
            }));

            // Merge: Keep local actions that might have been added while loading
            // We assume local actions (recent) are NOT in serverActions yet if sync was slow
            // Simple de-dupe strategy: exact timestamp match (unlikely for different events)
            const serverTimestamps = new Set(serverActions.map(a => a.timestamp.getTime()));
            const localUnique = actionLog.filter(a => !serverTimestamps.has(a.timestamp.getTime()));

            actionLog = [...serverActions, ...localUnique];

            renderActionLog();
            console.log(`📥 Synced ${serverActions.length} actions from DB`);
        }
    } catch (err) {
        console.warn('Could not sync history (Offline?):', err);
        // If fail, we just show empty or local state. 
        // We DON'T show a scary red error message, just a subtle indicator if really needed.
        if (entriesContainer) {
            entriesContainer.innerHTML = '<div style="padding:1rem; font-size:0.8rem; opacity:0.5; text-align:center;">Using Local Mode (Server Offline)</div>';
        }
    }
}

function triggerCelebration(actionKey) {
    const btn = document.querySelector(`[data-action="${actionKey}"]`);
    if (btn) {
        btn.classList.add('celebrate');
        setTimeout(() => btn.classList.remove('celebrate'), 600);
    }
}

// Initialize
export function initActionLogger() {
    loadActionLog();

    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const actionKey = btn.getAttribute('data-action');
            if (actionKey) logAction(actionKey);
        });
    });

    const addBtn = document.getElementById('add-custom-action');
    const input = document.getElementById('custom-action-input');

    if (addBtn && input) {
        const handleCustomAction = () => {
            const text = input.value.trim();
            if (text) {
                logAction('custom-action', text);
                input.value = '';
            }
        };

        addBtn.addEventListener('click', handleCustomAction);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCustomAction();
        });
    }
}

// Get stats for ink blossom
export function getActionStats() {
    // Calculate simple stats from local log
    const sustainable = actionLog.filter(a =>
        ['used-mug', 'refilled-bottle', 'digital-cleanup', 'bike-commute', 'composted', 'used-stairs', 'brought-container'].includes(a.key)
    ).length;

    return { sustainable };
}

export { actionLog };
