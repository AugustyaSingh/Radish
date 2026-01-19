/* ========================================
   CUTE & INTERACTIVE ANIMATIONS
   "Better Animations" - Sparkles, trails, and floaty bits
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCuteInteractions();
});

function initCuteInteractions() {
    const container = document.createElement('div');
    container.id = 'cute-bg-layer';
    Object.assign(container.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '9999', // Top layer specifically for cursor effects
        overflow: 'hidden'
    });
    document.body.appendChild(container);

    // ========================================
    // 1. CURSOR SPARKLE TRAIL
    // ========================================
    let mouseX = 0, mouseY = 0;
    let trail = [];
    const TRAIL_LENGTH = 10;

    // Create trail elements
    for (let i = 0; i < TRAIL_LENGTH; i++) {
        const dot = document.createElement('div');
        dot.textContent = '✨';
        dot.style.position = 'absolute';
        dot.style.fontSize = (15 - i) + 'px'; // Get smaller
        dot.style.opacity = '0';
        dot.style.transform = 'translate(-50%, -50%)';
        dot.style.transition = `opacity 0.2s, transform 0.1s`;
        container.appendChild(dot);
        trail.push({ el: dot, x: 0, y: 0 });
    }

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Update first dot instantly
        trail[0].x = mouseX;
        trail[0].y = mouseY;
        trail[0].el.style.opacity = '1';
        trail[0].el.style.left = mouseX + 'px';
        trail[0].el.style.top = mouseY + 'px';
    });

    // Trail Physics Loop
    function updateTrail() {
        // Follow the leader
        for (let i = 1; i < TRAIL_LENGTH; i++) {
            const current = trail[i];
            const prev = trail[i - 1];

            // Easing
            current.x += (prev.x - current.x) * 0.3;
            current.y += (prev.y - current.y) * 0.3;

            current.el.style.left = current.x + 'px';
            current.el.style.top = current.y + 'px';

            // Fade out if moving slowly
            const dist = Math.hypot(prev.x - current.x, prev.y - current.y);
            current.el.style.opacity = Math.min(1, dist * 0.1).toString();
        }
        requestAnimationFrame(updateTrail);
    }
    updateTrail();

    // ========================================
    // 2. CLICK BURST EFFECT - REMOVED PER USER REQUEST
    // ========================================
    // document.addEventListener('click', (e) => {
    //     createBurst(e.clientX, e.clientY);
    // });


    // ========================================
    // 3. BACKGROUND FLOATERS (Improved)
    // ========================================
    const bgContainer = document.createElement('div');
    bgContainer.style.position = 'fixed';
    bgContainer.style.top = '0';
    bgContainer.style.left = '0';
    bgContainer.style.width = '100%';
    bgContainer.style.height = '100%';
    bgContainer.style.zIndex = '-1';
    bgContainer.style.pointerEvents = 'none';
    document.body.appendChild(bgContainer);

    const bgIcons = ['🍄', '🍃', '☁️', '🌸', '💫'];
    const floaters = [];

    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.textContent = bgIcons[Math.floor(Math.random() * bgIcons.length)];
        p.style.position = 'absolute';
        p.style.opacity = '0.3';
        p.style.fontSize = (10 + Math.random() * 20) + 'px';
        bgContainer.appendChild(p);

        floaters.push({
            el: p,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            rot: Math.random() * 360,
            vRot: (Math.random() - 0.5) * 2
        });
    }

    function animateBg() {
        floaters.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vRot;

            // Wrap
            if (p.x < -50) p.x = window.innerWidth + 50;
            if (p.x > window.innerWidth + 50) p.x = -50;
            if (p.y < -50) p.y = window.innerHeight + 50;
            if (p.y > window.innerHeight + 50) p.y = -50;

            // Mouse Repel
            const dx = mouseX - p.x;
            const dy = mouseY - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 150) {
                const angle = Math.atan2(dy, dx);
                p.x -= Math.cos(angle) * 2;
                p.y -= Math.sin(angle) * 2;
            }

            p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`;
        });
        requestAnimationFrame(animateBg);
    }
    animateBg();
}
