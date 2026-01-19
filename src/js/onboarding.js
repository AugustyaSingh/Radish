// ========================================
// ONBOARDING SYSTEM
// Progressive disclosure scrollytelling experience
// ========================================

let onboardingComplete = false;

// Check if onboarding is needed
export function needsOnboarding() {
    const completed = localStorage.getItem('radish_onboarding_complete');
    return !completed;
}

// Mark onboarding as complete
export function completeOnboarding(userName) {
    localStorage.setItem('radish_onboarding_complete', 'true');
    localStorage.setItem('radish_user_name', userName || 'Observer');
    onboardingComplete = true;
}

// Initialize onboarding
export function initOnboarding() {
    if (!needsOnboarding()) {
        showMainApp();
        return;
    }

    showOnboardingFlow();
}

// Show onboarding flow
function showOnboardingFlow() {
    const body = document.body;

    // Create onboarding container
    const onboardingContainer = document.createElement('div');
    onboardingContainer.id = 'onboarding-container';
    onboardingContainer.className = 'onboarding-container';

    onboardingContainer.innerHTML = `
    <!-- Frontispiece -->
    <section class="onboarding-section frontispiece active" data-section="0">
      <div class="frontispiece-content">
        <div class="radish-illustration">
          <svg width="120" height="120" viewBox="0 0 120 120">
            <g id="radish-art">
              <!-- Radish illustration - linocut style -->
              <circle cx="60" cy="70" r="25" fill="#E29578" stroke="#2C2C2C" stroke-width="2"/>
              <ellipse cx="60" cy="70" rx="20" ry="25" fill="#E29578" stroke="#2C2C2C" stroke-width="2"/>
              <path d="M 60 45 Q 58 30 55 20 L 65 20 Q 62 30 60 45" fill="#86A38B" stroke="#2C2C2C" stroke-width="1.5"/>
              <path d="M 55 25 Q 45 20 40 25" fill="none" stroke="#86A38B" stroke-width="1.5"/>
              <path d="M 65 25 Q 75 20 80 25" fill="none" stroke="#86A38B" stroke-width="1.5"/>
            </g>
          </svg>
        </div>
        <h1 class="frontispiece-title">Radish</h1>
        <p class="frontispiece-subtitle">A JOURNAL OF CAMPUS ECOLOGY</p>
        <div class="scroll-prompt">
          <p>Scroll to open</p>
          <span class="scroll-arrow">↓</span>
        </div>
      </div>
    </section>
    
    <!-- Philosophy -->
    <section class="onboarding-section philosophy" data-section="1">
      <div class="onboarding-content">
        <div class="radish-corner-icon">
          <svg width="40" height="40" viewBox="0 0 120 120">
            <use href="#radish-art"/>
          </svg>
        </div>
        <div class="philosophy-text">
          <p class="philosophy-paragraph">Most of what we consume on campus is invisible. The water in your paper, the oil in your fork, the coal in your cloud storage.</p>
          <p class="philosophy-paragraph">Radish is here to make the invisible, visible.</p>
        </div>
        <div class="scroll-prompt">
          <p>Continue</p>
          <span class="scroll-arrow">↓</span>
        </div>
      </div>
    </section>
    
    <!-- Tactile Interaction -->
    <section class="onboarding-section tactile" data-section="2">
      <div class="onboarding-content">
        <h3 class="onboarding-question">What is one thing you plan to do today?</h3>
        <div class="intent-options">
          <button class="intent-option" data-action="coffee">
            <span class="intent-icon">☕</span>
            <span class="intent-label">Grab a coffee</span>
          </button>
          <button class="intent-option" data-action="print">
            <span class="intent-icon">📄</span>
            <span class="intent-label">Print a paper</span>
          </button>
          <button class="intent-option" data-action="study">
            <span class="intent-icon">📚</span>
            <span class="intent-label">Study at the library</span>
          </button>
        </div>
        <div id="first-reveal" class="first-reveal hidden"></div>
      </div>
    </section>
    
    <!-- Morning Chime -->
    <section class="onboarding-section chime hidden" data-section="3">
      <div class="onboarding-content">
        <div class="chime-icon">
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="55" r="35" fill="none" stroke="#86A38B" stroke-width="2"/>
            <path d="M 50 20 L 50 55 L 70 65" stroke="#2C2C2C" stroke-width="2" stroke-linecap="round"/>
            <circle cx="50" cy="55" r="3" fill="#2C2C2C"/>
          </svg>
        </div>
        <h3 class="onboarding-question">When should Radish prompt your morning reflection?</h3>
        <p class="helper-text">Choose a time when you are planning your day.</p>
        <div class="time-dial-container">
          <input type="time" id="onboarding-time" class="time-dial" value="08:45">
          <p class="time-caption">Most students choose 8:45 AM—the quiet moment before the first lecture.</p>
        </div>
        <button id="continue-to-journal" class="btn-primary">Continue</button>
      </div>
    </section>
    
    <!-- Journal Ownership -->
    <section class="onboarding-section ownership hidden" data-section="4">
      <div class="onboarding-content">
        <div class="journal-card">
          <h2 class="journal-title">This Journal belongs to:</h2>
          <input 
            type="text" 
            id="user-name-input"
            class="signature-input" 
            placeholder="Your Name or Alias"
          />
          <div class="journal-meta">
            <p class="campus-label">PRIMARY CAMPUS: UNIVERSITY OF TECHNOLOGY</p>
            <p class="journal-disclaimer">
              By opening this journal, you agree to observe your habits with curiosity, not judgment. 
              Data is shared anonymously to help our campus breathe better.
            </p>
          </div>
          <button id="begin-observation" class="btn-primary">Begin Observation</button>
        </div>
      </div>
    </section>
  `;

    // Insert before main content
    body.insertBefore(onboardingContainer, body.firstChild);

    // Set up scroll handling
    setupOnboardingScroll();

    // Set up interactions
    setupOnboardingInteractions();
}

// Set up scroll-based progression
function setupOnboardingScroll() {
    const sections = document.querySelectorAll('.onboarding-section');
    let currentSection = 0;

    window.addEventListener('scroll', () => {
        const scrollProgress = window.scrollY;
        const windowHeight = window.innerHeight;

        sections.forEach((section, index) => {
            const threshold = windowHeight * (index * 0.8);
            if (scrollProgress > threshold && index > currentSection) {
                sections[currentSection].classList.remove('active');
                section.classList.add('active');
                currentSection = index;
            }
        });
    });
}

// Set up interactive elements
function setupOnboardingInteractions() {
    // Intent options
    const intentOptions = document.querySelectorAll('.intent-option');
    const firstReveal = document.getElementById('first-reveal');
    const chimeSection = document.querySelector('.chime');

    intentOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            let revealText = '';

            switch (action) {
                case 'coffee':
                    revealText = "Today's coffee will likely be served in a cup lined with plastic. Can you find a mug, or will you observe the plastic today?";
                    break;
                case 'print':
                    revealText = "That paper requires 475 liters of water to produce. Can you submit digitally, or will you observe the water today?";
                    break;
                case 'study':
                    revealText = "Every hour of cloud storage requires continuous electricity. Can you download for offline use, or will you observe the energy today?";
                    break;
            }

            if (firstReveal) {
                firstReveal.innerHTML = `<p class="reveal-text">${revealText}</p>`;
                firstReveal.classList.remove('hidden');

                // Show chime section after delay
                setTimeout(() => {
                    chimeSection.classList.remove('hidden');
                    chimeSection.scrollIntoView({ behavior: 'smooth' });
                }, 2000);
            }
        });
    });

    // Continue to journal button
    const continueBtn = document.getElementById('continue-to-journal');
    const ownershipSection = document.querySelector('.ownership');

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            const selectedTime = document.getElementById('onboarding-time').value;
            localStorage.setItem('radish_reminder_time', selectedTime);

            ownershipSection.classList.remove('hidden');
            ownershipSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Begin observation button
    const beginBtn = document.getElementById('begin-observation');
    if (beginBtn) {
        beginBtn.addEventListener('click', () => {
            const userName = document.getElementById('user-name-input').value.trim() || 'Observer';
            completeOnboarding(userName);
            hideOnboarding();
            showMainApp();
        });
    }
}

// Hide onboarding
function hideOnboarding() {
    const container = document.getElementById('onboarding-container');
    if (container) {
        container.style.opacity = '0';
        setTimeout(() => {
            container.remove();
        }, 500);
    }
}

// Show main app
function showMainApp() {
    const mainSections = document.querySelectorAll('.hero-section, .section-wrapper, .footer');
    mainSections.forEach(section => {
        section.style.display = '';
    });

    // Show welcome if first time
    const userName = localStorage.getItem('radish_user_name') || 'Observer';
    if (userName) {
        showWelcomeLetter(userName);
    }
}

// Show welcome letter (empty state)
function showWelcomeLetter(userName) {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && !localStorage.getItem('radish_welcome_read')) {
        const letter = document.createElement('div');
        letter.className = 'welcome-letter';
        letter.innerHTML = `
      <div class="letter-content">
        <p class="letter-greeting">Dear ${userName},</p>
        <p class="letter-body">
          Welcome to your field journal. This is a space for observation, not optimization. 
          There are no scores here—only awareness.
        </p>
        <p class="letter-body">
          Begin by logging a simple action as you go about your day. Each entry will reveal 
          something invisible about the world around you.
        </p>
        <p class="letter-signature">— The Editors</p>
        <div class="hand-stamp">✓</div>
      </div>
    `;

        heroContent.appendChild(letter);

        // Mark as read after a delay
        setTimeout(() => {
            letter.querySelector('.hand-stamp').style.opacity = '1';
            localStorage.setItem('radish_welcome_read', 'true');
        }, 2000);
    }
}
