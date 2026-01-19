// ========================================
// RADISH - LANDING CONTROLLER
// Logic for the Start Screen
// ========================================

import { needsOnboarding } from './js/onboarding.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('🍄 Radish Start Screen loaded');

    const startBtn = document.getElementById('start-btn');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // Add a small delay for "button press" feel
            startBtn.classList.add('active');
            setTimeout(() => {
                // Check if user needs onboarding
                if (needsOnboarding()) {
                    // Create onboarding HTML page or embed it
                    // For now, just check localStorage and redirect
                    window.location.href = '/dashboard.html';
                } else {
                    window.location.href = '/dashboard.html';
                }
            }, 300);
        });
    }

    // Optional: Check if user has visited before and maybe change text
    const hasVisited = localStorage.getItem('radish-visited');
    if (hasVisited) {
        if (startBtn) startBtn.textContent = 'CONTINUE GAME';
    } else {
        localStorage.setItem('radish-visited', 'true');
    }
});
