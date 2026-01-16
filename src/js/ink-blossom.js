// ========================================
// INK BLOSSOM - END OF DAY REFLECTION
// Generative art visualization of daily actions
// ========================================

import { getActionStats } from './action-logger.js';

// Generate ink blossom based on daily actions
export function generateInkBlossom(actions) {
    const canvas = document.getElementById('inkBlossomCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = 256;
    const height = canvas.height = 384;

    // Clear canvas
    ctx.fillStyle = '#F8F5F2';
    ctx.fillRect(0, 0, width, height);

    // Set drawing style
    ctx.strokeStyle = '#2C2C2C';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Count action types
    const sustainable = actions.filter(a =>
        ['used-mug', 'refilled-bottle', 'digital-cleanup'].includes(a.key)
    ).length;

    const impact = actions.filter(a =>
        ['ordered-food', 'printed'].includes(a.key)
    ).length;

    const learning = actions.filter(a =>
        a.key === 'disposed-waste'
    ).length;

    // Draw stem (timeline)
    const stemX = width / 2;
    const stemBottom = height - 60;
    const stemTop = 100;

    ctx.beginPath();
    ctx.moveTo(stemX, stemBottom);
    ctx.lineTo(stemX, stemTop);
    ctx.stroke();

    // Draw leaves (sustainable actions) - Sage green
    ctx.fillStyle = '#86A38B';
    ctx.strokeStyle = '#86A38B';

    for (let i = 0; i < sustainable; i++) {
        const y = stemBottom - (i * 40) - 40;
        const leafSize = 15 + (i % 3) * 5;
        const side = i % 2 === 0 ? -1 : 1;

        // Leaf shape
        ctx.beginPath();
        ctx.moveTo(stemX, y);
        ctx.bezierCurveTo(
            stemX + (side * leafSize), y - leafSize / 2,
            stemX + (side * leafSize * 1.5), y - leafSize,
            stemX + (side * leafSize * 0.5), y - leafSize * 1.5
        );
        ctx.bezierCurveTo(
            stemX + (side * leafSize * 0.3), y - leafSize,
            stemX, y - leafSize / 3,
            stemX, y
        );
        ctx.fill();
        ctx.stroke();
    }

    // Draw roots (high-impact actions) - Terra cotta
    ctx.fillStyle = '#E29578';
    ctx.strokeStyle = '#E29578';
    ctx.lineWidth = 1;

    for (let i = 0; i < impact; i++) {
        const startY = stemBottom + 10;
        const endY = stemBottom + 30 + (i * 15);
        const spread = (i - impact / 2) * 20;

        ctx.beginPath();
        ctx.moveTo(stemX, startY);
        ctx.quadraticCurveTo(
            stemX + spread / 2, (startY + endY) / 2,
            stemX + spread, endY
        );
        ctx.stroke();

        // Root tip
        ctx.beginPath();
        ctx.arc(stemX + spread, endY, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw bloom (learning/curiosity) - Periwinkle
    if (learning > 0) {
        ctx.fillStyle = '#92A8D1';
        ctx.strokeStyle = '#92A8D1';

        const bloomY = stemTop - 20;
        const petalCount = Math.min(learning, 8);
        const bloomRadius = 20;

        for (let i = 0; i < petalCount; i++) {
            const angle = (i / petalCount) * Math.PI * 2;
            const petalX = stemX + Math.cos(angle) * bloomRadius;
            const petalY = bloomY + Math.sin(angle) * bloomRadius;

            ctx.beginPath();
            ctx.arc(petalX, petalY, 8, 0, Math.PI * 2);
            ctx.fill();
        }

        // Center of bloom
        ctx.fillStyle = '#2C2C2C';
        ctx.beginPath();
        ctx.arc(stemX, bloomY, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    // Add subtle texture
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 50; i++) {
        ctx.fillStyle = '#2C2C2C';
        ctx.fillRect(
            Math.random() * width,
            Math.random() * height,
            1, 1
        );
    }
    ctx.globalAlpha = 1;
}

// Show end of day reflection
export function showEndOfDayReflection(actions) {
    const reflectionContainer = document.createElement('div');
    reflectionContainer.id = 'reflection-container';
    reflectionContainer.className = 'reflection-container';

    const stats = getActionStats();
    const actionCount = actions.length;

    // Generate unique ID
    const now = new Date();
    const genId = `RDSH-${now.getMonth() + 1}${now.getDate()}${now.getFullYear().toString().slice(-2)}`;

    reflectionContainer.innerHTML = `
    <div class="reflection-content">
      <div class="ink-blossom-container">
        <canvas id="inkBlossomCanvas" width="256" height="384"></canvas>
        <span class="gen-id">GEN. ID: ${genId}</span>
      </div>
      
      <div class="reflection-text">
        <h3 class="reflection-title">The day is recorded.</h3>
        
        <p class="reflection-quote">
          "The greatest threat to our planet is the belief that someone else will save it."
          <span class="quote-attribution">— Robert Swan</span>
        </p>
        
        <div class="reflection-divider"></div>
        
        <p class="reflection-note">
          You made <strong>${actionCount}</strong> observations today.
          ${stats.sustainable > 0 ? `You chose the "Refined Path" <strong>${stats.sustainable}</strong> times.` : ''}
        </p>
        
        <p class="reflection-close-note">
          Rest well. Tomorrow, the journal begins again on a fresh page.
        </p>
        
        <button id="close-reflection" class="reflection-close-btn">Close Journal</button>
      </div>
    </div>
  `;

    document.body.appendChild(reflectionContainer);

    // Generate the blossom
    setTimeout(() => {
        generateInkBlossom(actions);
    }, 100);

    // Set up close button
    const closeBtn = document.getElementById('close-reflection');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            // Haptic fade to ink black
            reflectionContainer.style.transition = 'all 1.5s ease-out';
            reflectionContainer.style.opacity = '0';
            reflectionContainer.style.backgroundColor = '#2C2C2C';

            setTimeout(() => {
                reflectionContainer.remove();
            }, 1500);
        });
    }
}

// Check if it's time for end of day reflection
export function checkEndOfDayReflection() {
    const now = new Date();
    const hour = now.getHours();

    // Show reflection between 8 PM and midnight
    if (hour >= 20) {
        const lastReflection = localStorage.getItem('radish_last_reflection');
        const today = now.toDateString();

        if (lastReflection !== today) {
            const actionLog = JSON.parse(localStorage.getItem('radish_action_log') || '[]');
            if (actionLog.length > 0) {
                // Mark as shown
                localStorage.setItem('radish_last_reflection', today);

                // Show after a brief delay
                setTimeout(() => {
                    showEndOfDayReflection(actionLog);
                }, 1000);
            }
        }
    }
}
