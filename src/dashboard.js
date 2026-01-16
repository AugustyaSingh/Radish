// ========================================
// RADISH - DASHBOARD CONTROLLER
// Main application logic for the dashboard page
// ========================================

import { closeImpactReveal } from './js/impact-library.js';
import { initTodoTransformation } from './js/todo-transformation.js';
import { initActionLogger } from './js/action-logger.js';
import { initNotificationSystem } from './js/notification-system.js';
import { initDisposalGuide } from './js/disposal-guide.js';
import { initCampusInsights, resizeCampusInsights } from './js/campus-insights.js';
import { checkEndOfDayReflection } from './js/ink-blossom.js';

// Initialize application
function initDashboard() {
    console.log('🚀 Radish Dashboard initializing...');

    // Initialize all modules directly
    initNotificationSystem();
    initTodoTransformation();
    initActionLogger();
    initDisposalGuide();
    initCampusInsights();

    // Check for end of day reflection
    checkEndOfDayReflection();

    // Set up impact reveal close handler
    const impactOverlay = document.getElementById('impact-overlay');
    const closeBtn = impactOverlay?.querySelector('.card-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeImpactReveal);
    }

    // Click outside to close impact reveal
    if (impactOverlay) {
        impactOverlay.addEventListener('click', (e) => {
            if (e.target === impactOverlay) {
                closeImpactReveal();
            }
        });
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCampusInsights();
    });

    console.log('✓ Radish Dashboard ready');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}
