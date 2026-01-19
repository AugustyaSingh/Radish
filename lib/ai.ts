// lib/ai.ts - Gemini AI Integration
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const FUN_FACTS = [
    "♻️ Recycling one aluminum can saves enough energy to run a TV for 3 hours!",
    "🌊 A single reusable water bottle can save 167 plastic bottles per year!",
    "🌳 One tree can absorb up to 48 pounds of CO2 per year!",
    "🚲 Cycling 10km instead of driving saves about 2.5kg of CO2!",
    "🍎 Composting can divert up to 30% of household waste from landfills!",
    "💡 LED bulbs use 75% less energy than incandescent bulbs!",
    "🛍️ A reusable bag can replace 700+ disposable plastic bags!",
    "☕ Bringing your own cup saves 23 lbs of waste per year!",
    "🌍 If everyone recycled, we'd save 1 billion tons of CO2 annually!",
    "🥤 Americans throw away 25 billion styrofoam cups every year!",
];

const TIPS = [
    "Try a 'Meatless Monday' - reducing meat consumption can lower your carbon footprint!",
    "Unplug devices when not in use - phantom energy accounts for 10% of home energy use!",
    "Start a small herb garden - even windowsill plants help purify air!",
    "Use cold water for laundry - 90% of washing machine energy goes to heating water!",
    "Collect rainwater for plants - it's better for them and saves tap water!",
    "Repair before replacing - extending product life reduces waste significantly!",
    "Choose products with minimal packaging when shopping!",
    "Take shorter showers - every minute saved = 2.5 gallons of water!",
];

export async function generateAIInsight(
    userStats: { xp: number; streak: number; recentActions: string[] },
    type: 'TIP' | 'FACT' | 'MISSION' = 'TIP'
): Promise<string> {
    // If no API key, return a random preset
    if (!process.env.GEMINI_API_KEY) {
        return type === 'FACT'
            ? FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]
            : TIPS[Math.floor(Math.random() * TIPS.length)];
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = type === 'FACT'
            ? `Generate a short, fun, and motivating environmental fact about recycling, sustainability, or eco-friendly living. Make it engaging and include an emoji. Keep it under 100 characters.`
            : type === 'MISSION'
                ? `Based on a user with ${userStats.xp} XP, ${userStats.streak} day streak, and recent actions: ${userStats.recentActions.join(', ') || 'none yet'}, suggest a specific daily eco-mission they can do today. Be encouraging and specific. Include an emoji. Keep it under 150 characters.`
                : `Based on a user's eco-journey (${userStats.xp} XP, ${userStats.streak} day streak), give them a personalized sustainability tip. Make it actionable, friendly, and include an emoji. Keep it under 120 characters.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('AI Error:', error);
        // Fallback to presets
        return type === 'FACT'
            ? FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]
            : TIPS[Math.floor(Math.random() * TIPS.length)];
    }
}

export function getRandomFact(): string {
    return FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)];
}

export function getRandomTip(): string {
    return TIPS[Math.floor(Math.random() * TIPS.length)];
}

// Sustainable alternatives database for fallback
const SUSTAINABLE_ALTERNATIVES: Record<string, { alternative: string; explanation: string }> = {
    'print': {
        alternative: 'Submit digitally via LMS, or if printing is required, use double-sided printing at the Library Hub.',
        explanation: 'A standard ream of paper requires 475 liters of water to produce. Digital workflows preserve the water table used in pulping and bleaching processes.'
    },
    'buy': {
        alternative: 'Check the "Free-Cycle" bin in the Student Union first, or consider borrowing from the campus equipment library.',
        explanation: 'Manufacturing new materials requires extraction, processing, and transport. Reusing existing items breaks this resource-intensive cycle.'
    },
    'drive': {
        alternative: 'Use campus shuttle, carpool with classmates, or bike if the distance is under 5km.',
        explanation: 'A single car trip of 10km produces about 2.5kg of CO2. Shared transport or active commuting reduces your carbon footprint significantly.'
    },
    'order': {
        alternative: 'Bring lunch from home in reusable containers, or choose the campus cafeteria with tray-free service.',
        explanation: 'Food delivery generates packaging waste and delivery vehicle emissions. Campus dining reduces both while supporting local food systems.'
    },
    'coffee': {
        alternative: 'Bring your own reusable mug to get the 25¢ discount at campus cafes.',
        explanation: 'Disposable cups often have plastic linings that prevent recycling. A reusable mug eliminates 500+ cups per year.'
    },
    'shop': {
        alternative: 'Check if the item is available second-hand on campus marketplace or thrift stores first.',
        explanation: 'Second-hand items have already paid their environmental cost. Buying used extends product lifespan and reduces demand for new production.'
    },
    'eat': {
        alternative: 'Choose plant-based options when available, or look for locally-sourced menu items.',
        explanation: 'Plant-based meals have 50% lower carbon footprint than meat-based meals. Local sourcing reduces transport emissions.'
    },
    'study': {
        alternative: 'Use natural light when possible, and utilize the library\'s energy-efficient study spaces.',
        explanation: 'Campus libraries are designed for energy efficiency. Shared lighting serves multiple students, reducing individual energy consumption.'
    },
};

export interface RefinedTask {
    originalTask: string;
    alternative: string;
    explanation: string;
}

export async function refineTasksWithAI(tasks: string[]): Promise<RefinedTask[]> {
    // If no API key, use fallback alternatives
    if (!process.env.GEMINI_API_KEY) {
        return tasks.map(task => {
            const lowerTask = task.toLowerCase();
            // Find matching keyword
            for (const [keyword, suggestion] of Object.entries(SUSTAINABLE_ALTERNATIVES)) {
                if (lowerTask.includes(keyword)) {
                    return {
                        originalTask: task,
                        alternative: suggestion.alternative,
                        explanation: suggestion.explanation,
                    };
                }
            }
            // Default suggestion
            return {
                originalTask: task,
                alternative: 'Consider if this task can be combined with others to reduce trips, or if there\'s a more eco-friendly approach.',
                explanation: 'Every action has an environmental impact. Mindful planning helps reduce waste and energy consumption.',
            };
        });
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `You are a sustainability advisor for a college campus. A student has listed their tasks for today:

${tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}

For EACH task, provide a more sustainable alternative way to accomplish it. Consider:
- Environmental impact (carbon, water, waste)
- Practical alternatives available on a college campus
- Specific locations or resources on campus

Respond in JSON format:
[
  {
    "originalTask": "the original task",
    "alternative": "the sustainable alternative (1-2 sentences)",
    "explanation": "brief explanation of why this is better (1 sentence)"
  }
]

Be specific, actionable, and encouraging. Focus on realistic campus-life alternatives.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        // Extract JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        throw new Error('Invalid response format');
    } catch (error) {
        console.error('AI Refinement Error:', error);
        // Fallback to preset alternatives
        return tasks.map(task => {
            const lowerTask = task.toLowerCase();
            for (const [keyword, suggestion] of Object.entries(SUSTAINABLE_ALTERNATIVES)) {
                if (lowerTask.includes(keyword)) {
                    return {
                        originalTask: task,
                        alternative: suggestion.alternative,
                        explanation: suggestion.explanation,
                    };
                }
            }
            return {
                originalTask: task,
                alternative: 'Consider if this task can be combined with others to reduce trips, or if there\'s a more eco-friendly approach.',
                explanation: 'Every action has an environmental impact. Mindful planning helps reduce waste and energy consumption.',
            };
        });
    }
}
