/* Radish Loader Controller */

document.addEventListener('DOMContentLoaded', () => {
    // Add loader HTML if not present
    if (!document.getElementById('radish-loader')) {
        const loader = document.createElement('div');
        loader.id = 'radish-loader';
        loader.innerHTML = `
            <div class="pixel-radish">
                <div class="radish-leaves"></div>
                <div class="radish-body"></div>
                <div class="radish-face"></div>
            </div>
            <div class="loading-text">Loading...</div>
        `;
        document.body.prepend(loader); // Add as first child
    }

    // Hide loader after a short delay (simulating load or just for cute intro)
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.getElementById('radish-loader');
            if (loader) {
                loader.classList.add('hidden');
                // Remove from DOM after fade out to clean up
                setTimeout(() => loader.remove(), 500);
            }
        }, 1500); // 1.5s of cuteness
    });
});
