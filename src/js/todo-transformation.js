// ========================================
// TO-DO TRANSFORMATION ENGINE
// Analyzes tasks and suggests sustainable alternatives
// ========================================

import { getImpactReveal } from './impact-library.js';

// Transformation rules database
const transformationRules = [
    {
        keywords: ['print', 'printing', 'printed', 'copy'],
        category: 'Paper/Energy',
        refinedAction: 'Submit digitally via LMS, or if printing is required, use double-sided printing at the Library Hub.',
        impactReveal: 'A standard ream of paper requires 475 liters of water to produce. Digital workflows preserve the water table used in pulping and bleaching processes.',
        impactKey: 'print-lab-report'
    },
    {
        keywords: ['lunch', 'food', 'eat', 'dinner', 'breakfast', 'meal'],
        category: 'Waste/Diet',
        refinedAction: 'Choose a "for-here" plate to bypass plastic containers, or select from plant-based options when available.',
        impactReveal: 'Single-use containers persist in landfills for 20-30 years. "For-here" dining eliminates this entire disposal pathway.',
        impactKey: 'ordered-food'
    },
    {
        keywords: ['buy', 'purchase', 'get', 'pens', 'supplies', 'materials'],
        category: 'Procurement',
        refinedAction: 'Check the "Free-Cycle" bin in the Student Union first, or consider borrowing from the campus equipment library.',
        impactReveal: 'Manufacturing new materials requires extraction, processing, and transport. Reusing existing items breaks this resource-intensive cycle.',
        impactKey: 'disposed-waste'
    },
    {
        keywords: ['research', 'library', 'study', 'read', 'papers'],
        category: 'Digital',
        refinedAction: 'Download PDFs for offline use to reduce server-pinging energy, and use dark mode to reduce screen energy consumption.',
        impactReveal: 'Data is physical. Every gigabyte stored requires constant electricity. Offline workflows reduce continuous server loads.',
        impactKey: 'digital-cleanup'
    },
    {
        keywords: ['coffee', 'tea', 'drink', 'beverage'],
        category: 'Waste',
        refinedAction: 'Use your personal mug or tumbler. Request "no lid" if using a disposable cup.',
        impactReveal: 'Paper cups contain hidden plastic linings that make them non-recyclable. Personal vessels eliminate this waste entirely.',
        impactKey: 'morning-caffeine'
    },
    {
        keywords: ['water', 'hydrate', 'bottle'],
        category: 'Waste',
        refinedAction: 'Refill your reusable bottle at campus water stations.',
        impactReveal: 'Manufacturing one plastic bottle uses 2,000x more energy than producing tap water. Refilling decouples from this supply chain.',
        impactKey: 'refilled-bottle'
    }
];

// Analyze and transform a single task
export function transformTask(taskText) {
    const lowerTask = taskText.toLowerCase();

    // Find matching transformation rule
    for (const rule of transformationRules) {
        if (rule.keywords.some(keyword => lowerTask.includes(keyword))) {
            return {
                original: taskText,
                refined: rule.refinedAction,
                category: rule.category,
                impactReveal: rule.impactReveal,
                impactKey: rule.impactKey
            };
        }
    }

    // Default transformation if no specific match
    return {
        original: taskText,
        refined: taskText + ' (Consider the environmental impact of this action)',
        category: 'General',
        impactReveal: 'Every campus action carries an environmental footprint. Mindful awareness is the first step toward sustainable choices.',
        impactKey: null
    };
}

// Parse multi-line to-do list
export function parseTodoList(text) {
    const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.replace(/^[-*•]\s*/, '')); // Remove bullet points

    return lines;
}

// Transform entire to-do list
export function transformTodoList(text) {
    const tasks = parseTodoList(text);
    return tasks.map(task => transformTask(task));
}

// Render transformation result in UI
export function renderTransformation(transformedTasks) {
    const resultContainer = document.getElementById('transformation-result');
    const tasksContainer = document.getElementById('transformed-tasks');

    if (!resultContainer || !tasksContainer) return;

    // Clear previous content
    tasksContainer.innerHTML = '';

    // Create task transformation items
    transformedTasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-transformation-item';

        taskItem.innerHTML = `
      <span class="footnote-marker">†</span>
      <div class="original-intent">
        ${task.original}
      </div>
      <div>
        <div class="refined-intent">
          ${task.refined}
        </div>
        <div class="impact-marginalia">
          ${task.impactReveal}
        </div>
      </div>
    `;

        tasksContainer.appendChild(taskItem);
    });

    // Show result with animation
    resultContainer.classList.remove('hidden');

    // Trigger scanning line animation
    const scanningLine = resultContainer.querySelector('.scanning-line');
    if (scanningLine) {
        scanningLine.style.animation = 'none';
        setTimeout(() => {
            scanningLine.style.animation = 'scanLine 2s ease-out forwards';
        }, 10);
    }
}

// Initialize transformation functionality
export function initTodoTransformation() {
    const transformBtn = document.getElementById('transform-btn');
    const todoInput = document.getElementById('todo-input');
    const acceptBtn = document.getElementById('accept-intentions-btn');

    if (transformBtn && todoInput) {
        transformBtn.addEventListener('click', () => {
            const text = todoInput.value.trim();

            if (text) {
                const transformedTasks = transformTodoList(text);
                renderTransformation(transformedTasks);
            }
        });
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            const resultContainer = document.getElementById('transformation-result');
            if (resultContainer) {
                resultContainer.classList.add('hidden');
                todoInput.value = '';

                // Show confirmation
                alert('✓ Your refined intentions have been accepted. May your day be mindful.');
            }
        });
    }

    // Set current date
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const now = new Date();
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
}
