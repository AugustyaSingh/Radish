/* ========================================
   CUTE MASCOTS MANAGER
   Injects and manages character behaviors
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initMascots();
});

function initMascots() {
    const mascots = [
        {
            id: 'mascot-worm',
            html: `
                <div class="pixel-worm">
                    <div class="worm-head">
                        <div class="worm-eyes"></div>
                    </div>
                    <div class="worm-body"></div>
                </div>`,
            pos: 'bottom-left'
        },
        {
            id: 'mascot-cloud',
            html: `
                <div class="pixel-cloud">
                    <div class="cloud-face"></div>
                    <div class="zzz">Zzz...</div>
                </div>`,
            pos: 'top-right'
        },
        {
            id: 'mascot-sprout',
            html: `
                <div class="pixel-sprout">
                    <div class="sprout-leaves"></div>
                    <div class="sprout-stem"></div>
                </div>`,
            pos: 'bottom-right'
        },
        {
            id: 'mascot-spider',
            html: `
                <div class="spider-thread" style="width:2px; height:80px; background:rgba(0,0,0,0.1); margin-left:9px;"></div>
                <div class="pixel-spider">
                    <div class="spider-eyes"></div>
                </div>`,
            pos: 'top-left'
        }
    ];

    mascots.forEach(m => {
        const el = document.createElement('div');
        el.id = m.id;
        el.className = 'mascot-container';
        el.innerHTML = m.html;
        document.body.appendChild(el);

        // Add random interactions
        if (m.id === 'mascot-spider') {
            setInterval(() => {
                // Randomly drop down
                if (Math.random() > 0.7) {
                    el.style.top = '0px';
                    setTimeout(() => {
                        el.style.top = '-50px';
                    }, 2000);
                }
            }, 5000);
        }

        // Click interaction
        el.style.pointerEvents = 'auto'; // Re-enable clicks
        el.addEventListener('click', () => {
            el.style.transform = 'scale(1.2)';
            setTimeout(() => el.style.transform = 'scale(1)', 200);

            // Create heart particle
            createHeart(el.getBoundingClientRect());
        });
    });
}

function createHeart(rect) {
    const heart = document.createElement('div');
    heart.textContent = '💖';
    heart.style.position = 'fixed';
    heart.style.left = (rect.left + rect.width / 2) + 'px';
    heart.style.top = (rect.top) + 'px';
    heart.style.fontSize = '20px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '600';
    heart.style.transition = 'all 1s ease-out';
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.style.top = (rect.top - 50) + 'px';
        heart.style.opacity = '0';
    }, 50);

    setTimeout(() => heart.remove(), 1000);
}
