// ========================================
// DISPOSAL FIELD GUIDE
// Interactive waste identification and disposal guidance
// ========================================

// Disposal database with botanical-style naming
const disposalDatabase = [
    {
        id: 'coffee-cup',
        name: 'Coffee Cup',
        scientificName: 'Cuppa polyethylena',
        icon: '☕',
        category: 'Hybrid Material',
        bin: 'landfill',
        binColor: 'terra-cotta',
        explanation: 'Most "paper" coffee cups are reinforced with a hidden polyethylene plastic lining to prevent leaking. This makes them nearly impossible to recycle in standard campus bins.',
        contamination: null,
        keywords: ['coffee', 'cup', 'paper cup', 'disposable cup']
    },
    {
        id: 'plastic-bottle',
        name: 'Plastic Water Bottle',
        scientificName: 'Bottla plasticus',
        icon: '🥤',
        category: 'PET Plastic',
        bin: 'recycling',
        binColor: 'periwinkle',
        explanation: 'Clear plastic bottles (PET #1) are highly recyclable. Empty and rinse before placing in the blue bin. Caps can be left on.',
        contamination: null,
        keywords: ['bottle', 'plastic', 'water', 'soda', 'drink']
    },
    {
        id: 'pizza-box',
        name: 'Pizza Box',
        scientificName: 'Boxus cheesus',
        icon: '🍕',
        category: 'Contaminated Fiber',
        bin: 'compost',
        binColor: 'sage',
        explanation: 'The oils from cheese have bonded with the paper fibers, preventing them from being pulped into new paper. If heavily soiled, this belongs in compost (or landfill if compost unavailable).',
        contamination: {
            alert: 'Grease Contamination Detected',
            description: 'The oil has saturated the cardboard fibers. Clean sections can be recycled; greasy sections should be composted.'
        },
        keywords: ['pizza', 'box', 'cardboard', 'greasy']
    },
    {
        id: 'aluminum-can',
        name: 'Aluminum Can',
        scientificName: 'Canus metallicus',
        icon: '🥫',
        category: 'Metal',
        bin: 'recycling',
        binColor: 'periwinkle',
        explanation: 'Aluminum is infinitely recyclable. Rinse out any remaining liquid and place in the blue bin. No need to remove labels.',
        contamination: null,
        keywords: ['can', 'aluminum', 'soda', 'beer', 'metal']
    },
    {
        id: 'compostable-fork',
        name: 'Compostable Fork',
        scientificName: 'Forka biodegradus',
        icon: '🍴',
        category: 'PLA Bioplastic',
        bin: 'compost',
        binColor: 'sage',
        explanation: 'Made from plant-based PLA plastic, this fork requires industrial composting facilities to break down. It will NOT decompose in landfills and contaminates recycling streams.',
        contamination: {
            alert: 'Common Mis-Disposal',
            description: 'This item is often placed in recycling bins by mistake. Look for the green "compost" bin, typically found near dining areas.'
        },
        keywords: ['fork', 'spoon', 'utensil', 'compostable', 'bioplastic']
    },
    {
        id: 'paper',
        name: 'Clean Paper',
        scientificName: 'Parchmentus recyclus',
        icon: '📄',
        category: 'Fiber',
        bin: 'recycling',
        binColor: 'periwinkle',
        explanation: 'Clean, dry paper is highly recyclable. Remove any plastic windows or staples if possible, but small amounts are acceptable.',
        contamination: null,
        keywords: ['paper', 'notebook', 'assignment', 'handout', 'notes']
    },
    {
        id: 'plastic-bag',
        name: 'Plastic Bag',
        scientificName: 'Bagus thinfilmus',
        icon: '🛍️',
        category: 'Thin-Film Plastic',
        bin: 'landfill',
        binColor: 'terra-cotta',
        explanation: 'Thin plastic bags jam recycling machinery. Take these to dedicated plastic bag collection bins at grocery stores, not campus recycling.',
        contamination: null,
        keywords: ['bag', 'plastic bag', 'shopping bag', 'grocery']
    },
    {
        id: 'glass-jar',
        name: 'Glass Jar',
        scientificName: 'Glassus containus',
        icon: '🏺',
        category: 'Glass',
        bin: 'recycling',
        binColor: 'periwinkle',
        explanation: 'Glass is infinitely recyclable. Rinse out food residue and remove metal lids (which can be recycled separately).',
        contamination: null,
        keywords: ['glass', 'jar', 'bottle', 'container']
    }
];

// Dichotomous key questions for identification
const dichotomousKey = [
    {
        id: 'q1',
        question: 'Is the material primarily fiber-based (paper/cardboard) or synthetic (plastic/metal)?',
        options: [
            { label: 'Fiber-based (paper, cardboard)', nextId: 'q2' },
            { label: 'Synthetic (plastic, metal, glass)', nextId: 'q4' }
        ]
    },
    {
        id: 'q2',
        question: 'Does it have visible food residue or grease stains?',
        options: [
            { label: 'Yes, it has grease or food residue', result: 'pizza-box' },
            { label: 'No, it is clean and dry', nextId: 'q3' }
        ]
    },
    {
        id: 'q3',
        question: 'Does it feel waxy or have a coating (like a disposable cup)?',
        options: [
            { label: 'Yes, it feels coated or waxy', result: 'coffee-cup' },
            { label: 'No, it is plain paper or cardboard', result: 'paper' }
        ]
    },
    {
        id: 'q4',
        question: 'Can you easily tear or bend it, or is it rigid?',
        options: [
            { label: 'Flexible and thin (tears easily)', result: 'plastic-bag' },
            { label: 'Rigid and firm', nextId: 'q5' }
        ]
    },
    {
        id: 'q5',
        question: 'What material is it made of?',
        options: [
            { label: 'Clear or colored plastic', result: 'plastic-bottle' },
            { label: 'Metal (aluminum or steel)', result: 'aluminum-can' },
            { label: 'Glass', result: 'glass-jar' },
            { label: 'Plant-based plastic (labeled compostable)', result: 'compostable-fork' }
        ]
    }
];

// Search disposal database
export function searchDisposalItems(query) {
    if (!query || query.trim() === '') return disposalDatabase;

    const lowerQuery = query.toLowerCase();
    return disposalDatabase.filter(item =>
        item.keywords.some(keyword => keyword.includes(lowerQuery)) ||
        item.name.toLowerCase().includes(lowerQuery)
    );
}

// Get disposal item by ID
export function getDisposalItem(id) {
    return disposalDatabase.find(item => item.id === id);
}

// Render disposal results
function renderDisposalResults(items) {
    const resultsContainer = document.getElementById('disposal-results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';

    if (items.length === 0) {
        resultsContainer.innerHTML = '<p class="text-muted">No items found. Try the "Help Me Identify" tool.</p>';
        return;
    }

    items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'disposal-item';
        itemEl.innerHTML = `
      <span class="disposal-icon">${item.icon}</span>
      <h4 class="disposal-name">${item.name}</h4>
      <p class="disposal-scientific">${item.scientificName}</p>
      <span class="disposal-category">${item.category}</span>
    `;

        itemEl.addEventListener('click', () => showVerdictCard(item));
        resultsContainer.appendChild(itemEl);
    });
}

// Show verdict card
function showVerdictCard(item) {
    const resultsContainer = document.getElementById('disposal-results');
    if (!resultsContainer) return;

    // Remove existing verdict card
    const existingCard = document.querySelector('.verdict-card');
    if (existingCard) existingCard.remove();

    const verdictCard = document.createElement('div');
    verdictCard.className = 'verdict-card';

    let contaminationHtml = '';
    if (item.contamination) {
        contaminationHtml = `
      <div class="contamination-alert">
        <div class="contamination-alert-title">${item.contamination.alert}</div>
        <p>${item.contamination.description}</p>
      </div>
    `;
    }

    verdictCard.innerHTML = `
    <h3>${item.name}</h3>
    <div class="verdict-stamp ${item.binColor}">
      ${item.bin.toUpperCase()} BIN
    </div>
    <p class="verdict-explanation">${item.explanation}</p>
    ${contaminationHtml}
  `;

    resultsContainer.insertBefore(verdictCard, resultsContainer.firstChild);
    verdictCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Dichotomous key UI
let currentKeyQuestion = 'q1';

function showDichotomousKey() {
    const modal = document.getElementById('dichotomous-modal');
    if (!modal) return;

    currentKeyQuestion = 'q1';
    renderKeyQuestion();
    modal.classList.remove('hidden');
}

function renderKeyQuestion() {
    const questionEl = document.getElementById('key-question');
    const optionsEl = document.getElementById('key-options');
    const verdictEl = document.getElementById('key-verdict');

    if (!questionEl || !optionsEl || !verdictEl) return;

    const question = dichotomousKey.find(q => q.id === currentKeyQuestion);
    if (!question) return;

    questionEl.textContent = question.question;
    optionsEl.innerHTML = '';
    verdictEl.classList.add('hidden');
    verdictEl.innerHTML = '';

    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'key-option-btn';
        btn.textContent = option.label;

        btn.addEventListener('click', () => {
            if (option.result) {
                // Show final verdict
                const item = getDisposalItem(option.result);
                if (item) {
                    showKeyVerdict(item);
                }
            } else if (option.nextId) {
                currentKeyQuestion = option.nextId;
                renderKeyQuestion();
            }
        });

        optionsEl.appendChild(btn);
    });
}

function showKeyVerdict(item) {
    const questionEl = document.getElementById('key-question');
    const optionsEl = document.getElementById('key-options');
    const verdictEl = document.getElementById('key-verdict');

    if (!questionEl || !optionsEl || !verdictEl) return;

    questionEl.textContent = 'Identification Complete';
    optionsEl.innerHTML = '';

    verdictEl.innerHTML = `
    <h3>${item.name}</h3>
    <p class="disposal-scientific">${item.scientificName}</p>
    <div class="verdict-stamp ${item.binColor}">
      ${item.bin.toUpperCase()} BIN
    </div>
    <p class="verdict-explanation">${item.explanation}</p>
    <button class="btn-secondary" onclick="document.getElementById('dichotomous-modal').classList.add('hidden')">Close</button>
  `;

    verdictEl.classList.remove('hidden');
}

// Initialize disposal guide
export function initDisposalGuide() {
    // Initial render
    renderDisposalResults(disposalDatabase);

    // Search functionality
    const searchInput = document.getElementById('disposal-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            const results = searchDisposalItems(query);
            renderDisposalResults(results);
        });
    }

    // Dichotomous key button
    const keyBtn = document.getElementById('dichotomous-key-btn');
    if (keyBtn) {
        keyBtn.addEventListener('click', showDichotomousKey);
    }

    // Modal close button
    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const modal = document.getElementById('dichotomous-modal');
            if (modal) modal.classList.add('hidden');
        });
    }
}
