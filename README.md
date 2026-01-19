# 🌱 RADISH
### Gamified Sustainability Tracker for Campus Life

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.0%20Flash-4285F4?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Making sustainability fun.** A retro-themed, gamified platform that transforms everyday eco-actions into rewarding experiences—because saving the planet should feel like playing a game.

**[🌐 Try the Live Demo →](http://localhost:3000)**

---

## 🎯 The Problem

**Campus sustainability is an invisible crisis.** Students want to be eco-friendly, but:
- They don't know the **impact** of small actions (using a mug vs buying coffee)
- There's **no feedback loop** for good behavior
- Sustainability tools are **boring and guilt-driven**
- **No accountability** for unsustainable choices

**RADISH solves this** by gamifying sustainability. We believe that if an eco-action doesn't feel rewarding, it won't become a habit.

---

## 🚀 What RADISH Does

```
Daily Action → XP Tracker → AI Refinement → Community Impact → Visible Progress
```

**Total Loop: Action → Reward → Motivation → Habit**

### Key Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| **Action Logging** | 14+ pre-defined eco-actions with XP values | One-tap tracking, instant feedback |
| **XP Slider** | -10 to +10 custom XP for any action | **Accountability** for both good AND bad choices |
| **Daily Refinement** | Enter tasks, get AI sustainable alternatives | Transforms intentions into eco-friendly actions |
| **Disposal Guide** | Search any item for proper disposal | End confusion about recycling vs trash |
| **Campus Insights** | Anonymous community patterns | See campus-wide impact without competition |
| **Volunteer Board** | Organize and join cleanup events | Turn solo actions into community movements |
| **Level System** | XP → Levels → Achievements | Long-term motivation and visible progress |

---

## 📊 How We Make Users Accountable

### The Accountability Slider

Unlike apps that only reward good behavior, RADISH includes a **-10 to +10 XP slider** for custom actions:

```
        ← Unsustainable        Eco-friendly →
    -10 ─────────────●─────────────── +10
              Current: +5 XP 🌱
```

**Why this matters:**
- If you ordered food delivery? **Slide to -5 XP** 💔
- If you brought your own container? **Slide to +10 XP** 🌱
- **Users must consciously acknowledge** their impact

### Motivation Mechanics

| Mechanic | Implementation | Psychology |
|----------|----------------|------------|
| **Instant Feedback** | XP popup + confetti | Dopamine hit for good actions |
| **No Confetti for Negatives** | Subtle shame, not punishment | Gentle accountability |
| **Streak Counter** | Daily action tracking | Habit formation |
| **Visual Stats** | CO2, Water, Waste saved | Tangible impact visualization |
| **AI Suggestions** | Personalized daily tips | Always actionable next steps |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      RADISH ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────┘
                              │
    ┌─────────────────────────┼─────────────────────────┐
    │                         │                         │
    ▼                         ▼                         ▼
┌───────────────┐    ┌────────────────┐    ┌────────────────────┐
│   FRONTEND    │    │   AI LAYER     │    │     DATA LAYER     │
│               │    │                │    │                    │
│ • Next.js 15  │◄──►│ • Gemini 2.0   │◄──►│ • JSON DB          │
│ • Tailwind    │    │ • Task Refine  │    │ • Server Actions   │
│ • Framer      │    │ • Insights     │    │ • User Stats       │
│               │    │                │    │                    │
└───────────────┘    └────────────────┘    └────────────────────┘
```

### Data Flow

```
1. User logs "Used plastic bag, -3 XP"
   ↓
2. XP deducted from user total
   ↓
3. Activity logged with timestamp
   ↓
4. Stats updated (CO2/Water/Waste)
   ↓
5. Visual feedback (popup, no confetti)
   ↓
6. Daily summary shows net impact
```

---

## 🔧 Tech Stack

| Technology | Purpose | Why We Chose It |
|------------|---------|-----------------|
| **Next.js 15** | Framework | Server Actions, App Router, fast iteration |
| **TypeScript** | Type Safety | Catch errors early, better DX |
| **Tailwind CSS** | Styling | Rapid prototyping, consistent design |
| **Framer Motion** | Animations | Smooth, engaging micro-interactions |
| **Gemini 2.0 Flash** | AI Analysis | Fast task refinement, smart suggestions |
| **canvas-confetti** | Celebrations | Instant dopamine for good actions |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- (Optional) Gemini API Key for AI features

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/radish.git
cd radish

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your GEMINI_API_KEY (optional)

# Start development server
npm run dev
```

**Open [http://localhost:3000](http://localhost:3000)** 🎉

---

## 📁 Project Structure

```
radish/
├── app/
│   ├── page.tsx           # Animated home page
│   ├── dashboard/         # Action logging + XP slider
│   ├── refine/            # AI task refinement
│   ├── guide/             # Disposal field guide
│   ├── daily/             # Daily summary
│   ├── community/         # Volunteer + Insights
│   └── profile/           # Achievements
├── components/
│   ├── NavBar.tsx         # Hide-on-scroll navigation
│   └── AIAssistant.tsx    # Floating AI helper
├── lib/
│   ├── db.ts              # JSON database operations
│   ├── ai.ts              # Gemini AI integration
│   └── utils.ts           # Helper functions
└── data/
    └── db.json            # Local data storage
```

---

## 📈 The Workflow

### Daily User Journey

```
Morning                    Midday                     Evening
   │                          │                          │
   ▼                          ▼                          ▼
┌──────────┐            ┌──────────┐            ┌──────────┐
│ Set Daily│            │  Log     │            │  Review  │
│ Intention│───────────►│ Actions  │───────────►│  Daily   │
│          │            │          │            │  Summary │
└──────────┘            └──────────┘            └──────────┘
     │                        │                       │
     ▼                        ▼                       ▼
 AI Refines              XP +/-                  See Impact
 Your Tasks              Feedback                + Level Up
```

### AI Refinement Example

**User enters:**
```
- Print lab report
- Buy new pens
- Get coffee
```

**AI suggests:**
| Original | Sustainable Alternative | Explanation |
|----------|------------------------|-------------|
| ~~Print lab report~~ | Submit digitally via LMS | Saves 475L water per ream |
| ~~Buy new pens~~ | Check Free-Cycle bin first | Reusing breaks production cycle |
| ~~Get coffee~~ | Bring reusable mug | Saves 500+ cups per year |

---

## 🔮 Future Roadmap

### Phase 2: Campus Integration (Q2 2026)
- [ ] Connect with campus dining APIs
- [ ] QR codes at recycling bins
- [ ] Integration with student ID cards

### Phase 3: Social Features (Q3 2026)
- [ ] Follow friends and compare stats
- [ ] Team challenges and competitions
- [ ] Campus-wide leaderboards (opt-in)

### Phase 4: Mobile App (Q4 2026)
- [ ] iOS and Android apps
- [ ] Widget for quick logging
- [ ] Notifications for streak reminders

---

## 🤝 Contributing

We welcome contributions! Especially in:
- **UI/UX Design** - Make it even more fun
- **Accessibility** - Everyone should eco-track
- **New Action Types** - Campus-specific actions
- **AI Prompts** - Better refinement suggestions

---

## 📄 License

MIT License - feel free to use, modify, and distribute.

---

<div align="center">

**Built with 🌱 for a Sustainable Future**

*"Every small action counts. Let's make them visible."*

⭐ **Star this repo to support sustainable campus life!**

</div>
