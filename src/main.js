// ========================================
// RADISH - MAIN APPLICATION
// Initialize all modules and coordinate functionality
// ========================================

import { closeImpactReveal } from './js/impact-library.js';
import { initTodoTransformation } from './js/todo-transformation.js';
import { initActionLogger } from './js/action-logger.js';
import { initNotificationSystem } from './js/notification-system.js';
import { initDisposalGuide } from './js/disposal-guide.js';
import { initCampusInsights, resizeCampusInsights } from './js/campus-insights.js';
import { initOnboarding, needsOnboarding } from './js/onboarding.js';
import { checkEndOfDayReflection } from './js/ink-blossom.js';

// Initialize application
function initApp() {
    console.log('🌱 Radish initializing...');

    // Check if onboarding is needed
    if (needsOnboarding()) {
        // Hide main app sections during onboarding
        const mainSections = document.querySelectorAll('.hero-section, .section-wrapper, .footer');
        mainSections.forEach(section => {
            section.style.display = 'none';
        });

        // Start onboarding
        initOnboarding();
    } else {
        // Initialize all modules normally
        initNotificationSystem();
        initTodoTransformation();
        initActionLogger();
        initDisposalGuide();
        initCampusInsights();

        // Check for end of day reflection
        checkEndOfDayReflection();
    }

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

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    console.log('✓ Radish initialized successfully');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Export for debugging
window.Radish = {
    version: '1.0.0',
    initialized: true
};
