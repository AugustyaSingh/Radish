/* ========================================
   DAILY REPORT LOGIC
   Generates gamified summary of daily actions
   ======================================== */

import { apiClient } from './api-client.js';

document.addEventListener('DOMContentLoaded', () => {
    initDailyReport();
});

function initDailyReport() {
    // 1. Add Trigger Button
    const btn = document.createElement('button');
    btn.id = 'btn-daily-report';
    btn.innerHTML = '📋'; // Clipboard emoji
    btn.title = "View Daily Report";
    document.body.appendChild(btn);

    // 2. Add Modal HTML
    const modal = document.createElement('div');
    modal.className = 'report-modal';
    modal.innerHTML = `
        <div class="report-card">
            <div class="report-header">
                <div class="report-title">LEVEL COMPLETE!</div>
                <div class="report-date" id="report-date"></div>
            </div>
            
            <div class="rank-stamp" id="report-rank">?</div>

            <div class="report-stats">
                <div class="stat-box">
                    <div class="stat-value" id="stat-co2">0 lbs</div>
                    <div class="stat-label">CO2 Saved</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value" id="stat-waste">0 lbs</div>
                    <div class="stat-label">Waste Diverted</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value" id="stat-actions">0</div>
                    <div class="stat-label">Actions Logged</div>
                </div>
                <div class="stat-box">
                    <div class="stat-value" id="stat-points">0</div>
                    <div class="stat-label">Score</div>
                </div>
            </div>

            <div class="report-actions" id="report-action-list">
                <h3>Today's Log</h3>
                <!-- Actions go here -->
            </div>

            <div class="report-tips">
                <div class="tip-header">💡 POWER-UP TIP:</div>
                <div id="report-tip-text">...</div>
            </div>

            <button class="btn-close-report" id="btn-close-report">CONTINUE</button>
        </div>
    `;
    document.body.appendChild(modal);

    // 3. Event Listeners
    btn.addEventListener('click', async () => {
        await generateReport();
        modal.classList.add('active');

        // Trigger stamp animation after delay
        setTimeout(() => {
            const rankEl = document.getElementById('report-rank');
            if (rankEl) rankEl.classList.add('stamped');
        }, 500);
    });

    document.getElementById('btn-close-report').addEventListener('click', () => {
        modal.classList.remove('active');
        const rankEl = document.getElementById('report-rank');
        if (rankEl) rankEl.classList.remove('stamped');
    });
}

async function generateReport() {
    // Set Date
    const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateEl = document.getElementById('report-date');
    if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-US', dateOpts);

    try {
        // Fetch Data from Backend
        // We fetch a generous limit to ensure we get all today's actions
        const data = await apiClient.getUserActions(100);
        const today = new Date().toDateString();

        // Filter for Today
        let todaysActions = [];
        if (data && data.actions) {
            todaysActions = data.actions.filter(action => {
                const actionDate = new Date(action.timestamp).toDateString();
                return actionDate === today;
            });
        }

        calculateAndDisplay(todaysActions);
    } catch (err) {
        console.error("Failed to generate report:", err);
        // Fallback or alert - for now just clear display or show empty
        calculateAndDisplay([]);
    }
}

function calculateAndDisplay(actions) {
    let co2 = 0;
    let waste = 0;
    let points = 0;
    let actionCounts = {};

    actions.forEach(a => {
        // CO2 Estimates (approximate)
        if (a.action_type === 'bike-commute') co2 += 2.0;
        if (a.action_type === 'carpooled') co2 += 1.5;
        if (a.action_type === 'lights-off') co2 += 0.5;
        if (a.action_type === 'meal-prep') co2 += 1.5; // Avoided takeout packaging/transport

        // Waste Estimates
        if (a.action_type === 'refilled-bottle') waste += 0.06; // Plastic bottle weight
        if (a.action_type === 'used-mug') waste += 0.04; // Paper cup weight
        if (a.action_type === 'brought-container') waste += 0.1;
        if (a.action_type === 'recycled') waste += 1.0;
        if (a.action_type === 'composted') waste += 0.5;

        // Points
        points += 100;

        // Custom text or type name
        const name = a.metadata?.customText || a.action_type;
        actionCounts[name] = (actionCounts[name] || 0) + 1;
    });

    // Update DOM safely
    const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
    };

    set('stat-co2', co2.toFixed(1) + ' lbs');
    set('stat-waste', waste.toFixed(2) + ' lbs');
    set('stat-actions', actions.length);
    set('stat-points', points);

    // Determine Rank
    const count = actions.length;
    let rank = 'C';
    let color = '#888';

    if (points >= 300) { rank = 'B'; color = '#3498db'; }
    if (points >= 500) { rank = 'A'; color = '#2ecc71'; }
    if (points >= 1000) { rank = 'S'; color = '#f1c40f'; }
    if (points >= 1500) { rank = 'SS'; color = '#e74c3c'; }

    const rankEl = document.getElementById('report-rank');
    if (rankEl) {
        rankEl.textContent = rank;
        rankEl.style.color = color;
        rankEl.style.borderColor = color;
    }

    // List Actions
    const listEl = document.getElementById('report-action-list');
    if (listEl) {
        listEl.innerHTML = '<h3>Today\'s Log</h3>';
        if (actions.length === 0) {
            listEl.innerHTML += '<div style="text-align:center; opacity:0.6; padding:1rem;">No actions recorded today. Get active!</div>';
        } else {
            Object.keys(actionCounts).forEach(key => {
                const count = actionCounts[key];
                const cleanKey = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Capitalize
                const div = document.createElement('div');
                div.className = 'action-item-summary';
                div.innerHTML = `<span>${cleanKey}</span> <span>x${count}</span>`;
                listEl.appendChild(div);
            });
        }
    }

    // Generate Tips (Strategy)
    const improvements = getImprovements(actions);
    set('report-tip-text', improvements);
}

function getImprovements(actions) {
    const types = actions.map(a => a.action_type);

    // Logic: Suggest actions they HAVEN'T done today
    if (!types.includes('used-mug') && !types.includes('refilled-bottle'))
        return "Hydration Combo: Bring a reusable bottle AND mug tomorrow for a hydration bonus!";

    if (!types.includes('composted'))
        return "Did you know? Food scraps in landfill generate methane. Try composting!";

    if (!types.includes('bike-commute') && !types.includes('used-stairs'))
        return "Active Transport: Biking or taking stairs adds points (and burns calories).";

    if (!types.includes('lights-off'))
        return "Energy Saver: Double check lights when you leave a room.";

    return "You're doing amazing! Challenge a friend to beat your score tomorrow!";
}
