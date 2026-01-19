// ========================================
// CAMPUS INSIGHTS - SCROLLYTELLING
// D3.js visualizations with scroll-triggered transitions
// ========================================

import { getActionStats } from './action-logger.js';
import { apiClient } from './api-client.js';

// Default data structure to prevent crashes
const DEFAULT_DATA = {
    totalActions: 1240,
    sustainableActions: 868,
    impactActions: 372,
    waterSaved: 4000,
    mugPercentage: 70,
    commonActions: {
        coffee: { total: 520, withMug: 364, withoutMug: 156 },
        printing: { total: 200, digital: 140, printed: 60 },
        bottles: { total: 180, refilled: 160, disposable: 20 },
        disposal: { total: 340, correct: 210, incorrect: 130 }
    },
    realStats: {
        personalActions: 0,
        waterSavedPersonal: 0,
        mugUsed: 0,
        bottlesRefilled: 0,
        recycled: 0,
        composted: 0
    }
};

let campusData = { ...DEFAULT_DATA };

// Async update of data
async function updateCampusData() {
    try {
        const community = await apiClient.getCommunityStats();
        if (!community) return;

        // Update campusData with real values from API
        // This is a simplification; in a real app we'd map fields precisely
        campusData.totalActions = community.totalActions;

        // Use simplified ratios for demo if detailed breakdown missing
        campusData.sustainableActions = Math.round(community.totalActions * 0.7);
        campusData.impactActions = community.totalActions - campusData.sustainableActions;

        if (community.impact) {
            campusData.waterSaved = community.impact.waterSaved * 10; // Scale for community
        }

        // Re-generate particles if data changed
        // (Optional: call init function again or update visualization)
    } catch (e) {
        console.warn('Failed to load campus data, using defaults', e);
    }
}

// Refresh data on each init
// (Handled by initCampusInsights)

// Generate particle data for beeswarm visualization
function generateParticleData(count, sustainable, width = 800, height = 600) {
    const particles = [];
    for (let i = 0; i < count; i++) {
        particles.push({
            id: `particle-${sustainable ? 'sus' : 'imp'}-${i}`,
            sustainable: sustainable,
            x: Math.random() * width, // Initialize with valid x coordinate
            y: Math.random() * height  // Initialize with valid y coordinate
        });
    }
    return particles;
}

// Initialize particles with default dimensions (will be repositioned on first render)
const allParticles = [
    ...generateParticleData(campusData.sustainableActions, true, 800, 600),
    ...generateParticleData(campusData.impactActions, false, 800, 600)
];

let svg, width, height;
let currentStep = -1;
let activeSimulation = null; // Only track one simulation at a time

// Helper function to stop active simulation
function stopSimulation() {
    if (activeSimulation) {
        activeSimulation.stop();
        activeSimulation = null;
    }
}

// Initialize D3 visualization
export function initCampusInsights() {
    // Refresh data from database
    updateCampusData();

    svg = d3.select('#viz-canvas');
    if (!svg.node()) return;

    // Get dimensions
    // Get dimensions from the sticky container
    const container = d3.select('.sticky-viz').node();
    width = container ? container.clientWidth : 800;
    height = 600;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Initialize scrollama
    if (typeof scrollama !== 'undefined') {
        const scroller = scrollama();

        scroller
            .setup({
                step: '.scroll-step',
                offset: 0.5,
                debug: false
            })
            .onStepEnter(response => {
                const step = parseInt(response.element.dataset.step);
                if (step !== currentStep) {
                    currentStep = step;
                    transitionToStep(step);
                }
            });

        // Initial render
        transitionToStep(0);

        // Handle resize
        window.addEventListener('resize', () => {
            scroller.resize();
        });
    } else {
        // Fallback: just show initial state
        transitionToStep(0);
    }
}

// Transition visualization based on scroll step
function transitionToStep(step) {
    stopSimulation(); // Stop any active simulation before transitioning

    switch (step) {
        case 0:
            showMorningPulse();
            break;
        case 1:
            showDivergence();
            break;
        case 2:
            showDisposalParadox();
            break;
        case 3:
            showCumulativeRipple();
            break;
    }
}

// Step 0: Morning Pulse - Chaotic cloud with pulsing animation
function showMorningPulse() {
    // Remove any existing patterns
    svg.selectAll('.balance-line, .bin-outline, .wave-path, .spiral-path, .leaf, .contamination').remove();

    activeSimulation = d3.forceSimulation(allParticles)
        .force('charge', d3.forceManyBody().strength(0.5))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(3));

    const circles = svg.selectAll('circle')
        .data(allParticles, d => d.id);

    circles.enter()
        .append('circle')
        .attr('r', 2.5)
        .attr('fill', d => d.sustainable ? '#2B9348' : '#D94632')
        .attr('opacity', 0) // Hidden - no animation
        .merge(circles)
        .transition()
        .duration(1000)
        .attr('opacity', 0); // Keep hidden

    // Remove the animation loop
    activeSimulation.on('tick', () => {
        // No visual update needed since circles are hidden
    });

    circles.exit()
        .transition()
        .duration(500)
        .attr('opacity', 0)
        .remove();

    // Remove decorative circles as well
    svg.selectAll('.concentric').remove();
}

// Step 1: Divergence - Sort into two columns
function showDivergence() {
    // Remove decorative elements from previous step
    svg.selectAll('.concentric').remove();

    const sustainableParticles = allParticles.filter(d => d.sustainable);
    const impactParticles = allParticles.filter(d => !d.sustainable);

    // Create a combined simulation with different forces for each group
    activeSimulation = d3.forceSimulation(allParticles)
        .force('x', d3.forceX(d => d.sustainable ? width * 0.3 : width * 0.7).strength(0.3))
        .force('y', d3.forceY(height / 2).strength(0.05))
        .force('collision', d3.forceCollide().radius(3));

    activeSimulation.on('tick', () => {
        svg.selectAll('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });

    // Draw balance line
    svg.selectAll('.balance-line').remove();
    svg.append('line')
        .attr('class', 'balance-line')
        .attr('x1', width / 2)
        .attr('y1', height * 0.2)
        .attr('x2', width / 2)
        .attr('y2', height * 0.8)
        .attr('stroke', '#1A1A1A')
        .attr('stroke-width', 0.5)
        .attr('stroke-dasharray', '5,5')
        .attr('opacity', 0)
        .transition()
        .duration(1000)
        .attr('opacity', 0.4);

    // Add flowing wave pattern in the center
    const wavePoints = d3.range(0, height, 10).map(y => ({
        x: width / 2 + Math.sin(y / 30) * 30,
        y: y
    }));

    const waveLine = d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveCatmullRom);

    svg.append('path')
        .attr('class', 'wave-path')
        .attr('d', waveLine(wavePoints))
        .attr('fill', 'none')
        .attr('stroke', '#92A8D1')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0)
        .attr('stroke-dasharray', '5,5')
        .transition()
        .duration(1500)
        .attr('opacity', 0.3);
}

// Step 2: Disposal Paradox - Form trash bin with dripping effect
function showDisposalParadox() {
    // Remove wave pattern
    svg.selectAll('.wave-path').remove();

    const binCenterX = width / 2;
    const binCenterY = height / 2;
    const binWidth = 200;
    const binHeight = 250;

    // Correctly disposed (stay in bin)
    const correctParticles = allParticles.slice(0, Math.floor(allParticles.length * 0.6));

    // Incorrectly disposed (leak out with dripping pattern)
    const incorrectParticles = allParticles.slice(Math.floor(allParticles.length * 0.6));

    // Create simulation with different forces for correct and incorrect particles
    activeSimulation = d3.forceSimulation(allParticles)
        .force('x', d3.forceX(d => {
            if (correctParticles.includes(d)) {
                return binCenterX;
            } else {
                return binCenterX + (Math.random() - 0.5) * binWidth * 2;
            }
        }).strength(0.2))
        .force('y', d3.forceY(d => {
            if (correctParticles.includes(d)) {
                return binCenterY;
            } else {
                return height * 0.85;
            }
        }).strength(0.3))
        .force('collision', d3.forceCollide().radius(3));

    activeSimulation.on('tick', () => {
        svg.selectAll('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('fill', d => incorrectParticles.includes(d) ? '#D94632' : '#2B9348');
    });

    // Draw bin outline
    svg.selectAll('.bin-outline').remove();
    svg.append('rect')
        .attr('class', 'bin-outline')
        .attr('x', binCenterX - binWidth / 2)
        .attr('y', binCenterY - binHeight / 2)
        .attr('width', binWidth)
        .attr('height', binHeight)
        .attr('fill', 'none')
        .attr('stroke', '#1A1A1A')
        .attr('stroke-width', 1)
        .attr('rx', 8)
        .attr('opacity', 0)
        .transition()
        .duration(1000)
        .attr('opacity', 0.3);

    // Add contamination warning pattern
    const contaminationPoints = d3.range(5).map(i => ({
        x: binCenterX + (Math.random() - 0.5) * binWidth,
        y: binCenterY + binHeight / 2 + 20 + i * 15
    }));

    svg.selectAll('.contamination')
        .data(contaminationPoints)
        .enter()
        .append('circle')
        .attr('class', 'contamination')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 0)
        .attr('fill', '#D94632')
        .attr('opacity', 0.4)
        .transition()
        .delay((d, i) => i * 200)
        .duration(800)
        .attr('r', 4);
}

// Step 3: Cumulative Ripple - Form botanical spiral (radish shape)
function showCumulativeRipple() {
    // Remove contamination markers
    svg.selectAll('.contamination').remove();

    // Create golden ratio spiral forming a radish/botanical shape
    const landmarkPoints = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < allParticles.length; i++) {
        const angle = i * 2 * Math.PI / goldenRatio;
        const radius = Math.sqrt(i) * 4;

        // Radish bulb shape (wider in middle)
        const yScale = 1 + Math.sin(angle) * 0.3;

        landmarkPoints.push({
            x: width / 2 + Math.cos(angle) * radius,
            y: height / 2 + Math.sin(angle) * radius * yScale
        });
    }

    svg.selectAll('circle')
        .data(allParticles, d => d.id)
        .transition()
        .duration(2000)
        .attr('cx', (d, i) => landmarkPoints[i].x)
        .attr('cy', (d, i) => landmarkPoints[i].y)
        .attr('fill', '#2B9348')
        .attr('opacity', 0.9)
        .attr('r', 2.5);

    // Remove helper elements
    svg.selectAll('.balance-line, .bin-outline')
        .transition()
        .duration(500)
        .attr('opacity', 0)
        .remove();

    // Add decorative spiraling path
    const spiralData = d3.range(0, allParticles.length / 4, 10).map(i => {
        const angle = i * 2 * Math.PI / goldenRatio;
        const radius = Math.sqrt(i) * 4;
        return {
            x: width / 2 + Math.cos(angle) * radius,
            y: height / 2 + Math.sin(angle) * radius * (1 + Math.sin(angle) * 0.3)
        };
    });

    const spiralLine = d3.line()
        .x(d => d.x)
        .y(d => d.y)
        .curve(d3.curveCatmullRom);

    svg.append('path')
        .attr('class', 'spiral-path')
        .attr('d', spiralLine(spiralData))
        .attr('fill', 'none')
        .attr('stroke', '#2B9348')
        .attr('stroke-width', 1)
        .attr('opacity', 0)
        .attr('stroke-dasharray', '3,3')
        .transition()
        .delay(1000)
        .duration(1500)
        .attr('opacity', 0.2);

    // Add radish "leaves" at top
    const leafPoints = [
        { x: width / 2 - 20, y: height / 2 - 120 },
        { x: width / 2, y: height / 2 - 140 },
        { x: width / 2 + 20, y: height / 2 - 120 }
    ];

    svg.selectAll('.leaf')
        .data(leafPoints)
        .enter()
        .append('ellipse')
        .attr('class', 'leaf')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('rx', 0)
        .attr('ry', 0)
        .attr('fill', '#2B9348')
        .attr('opacity', 0.5)
        .transition()
        .delay(1500)
        .duration(1000)
        .attr('rx', 8)
        .attr('ry', 20);
}

// Resize handler
export function resizeCampusInsights() {
    const container = svg?.node()?.parentElement;
    if (container) {
        width = container.clientWidth;
        svg.attr('viewBox', `0 0 ${width} ${height}`);
        transitionToStep(currentStep);
    }
}
