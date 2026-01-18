'use server';

import { getUser, updateUser, addAction, getUserActions, getLeaderboard, getCommunityPosts, addCommunityPost, User, Action, CommunityPost } from '@/lib/db';
import { generateAIInsight, refineTasksWithAI, RefinedTask } from '@/lib/ai';

// Action point values - Extended to include all action types
const ACTION_POINTS: Record<string, { points: number; carbon: number; water: number; waste: number }> = {
    // Negative impact actions
    ORDERED_FOOD: { points: -5, carbon: -0.3, water: -0.2, waste: -0.1 },
    PRINTED: { points: -3, carbon: -0.1, water: -0.1, waste: -0.05 },

    // Positive impact actions
    USED_MUG: { points: 8, carbon: 0.1, water: 0.3, waste: 0.1 },
    REFILL: { points: 8, carbon: 0.1, water: 0.5, waste: 0.1 },
    DISPOSED_WASTE: { points: 5, carbon: 0.1, water: 0, waste: 0.2 },
    DIGITAL_CLEANUP: { points: 5, carbon: 0.05, water: 0, waste: 0 },
    RECYCLE: { points: 10, carbon: 0.5, water: 0, waste: 0.2 },
    COMPOST: { points: 15, carbon: 0.3, water: 0, waste: 0.4 },
    CARPOOLED: { points: 20, carbon: 1.5, water: 0, waste: 0 },
    USED_STAIRS: { points: 5, carbon: 0.1, water: 0, waste: 0 },
    TURNED_OFF_LIGHTS: { points: 5, carbon: 0.2, water: 0, waste: 0 },
    BROUGHT_CONTAINER: { points: 10, carbon: 0.2, water: 0.1, waste: 0.15 },
    TRANSIT: { points: 25, carbon: 2.0, water: 0, waste: 0 },
    BROUGHT_LUNCH: { points: 12, carbon: 0.3, water: 0.2, waste: 0.2 },
};

export async function getDashboardData(userId: string = 'demo-user-1') {
    const user = getUser(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const actions = getUserActions(userId);
    const recentActions = actions.slice(0, 10);

    // Calculate weekly stats
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyActions = actions.filter(a => new Date(a.createdAt) > weekAgo);

    const weeklyStats = weeklyActions.reduce(
        (acc, action) => ({
            xp: acc.xp + action.points,
            carbon: acc.carbon + action.carbon,
            water: acc.water + action.water,
            waste: acc.waste + action.waste,
        }),
        { xp: 0, carbon: 0, water: 0, waste: 0 }
    );

    // Generate chart data (last 7 days)
    const chartData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));

        const dayActions = actions.filter(
            a => new Date(a.createdAt) >= dayStart && new Date(a.createdAt) <= dayEnd
        );

        return {
            day: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dayStart.getDay()],
            value: dayActions.reduce((sum, a) => sum + a.points, 0),
        };
    });

    return {
        user,
        recentActions,
        weeklyStats,
        chartData,
    };
}

export async function logAction(
    type: string,
    userId: string = 'demo-user-1'
) {
    const user = getUser(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Get action config, fallback to RECYCLE if unknown type
    const actionConfig = ACTION_POINTS[type] || ACTION_POINTS['RECYCLE'];

    // Create the action
    const action = addAction({
        type,
        points: actionConfig.points,
        carbon: actionConfig.carbon,
        water: actionConfig.water,
        waste: actionConfig.waste,
        userId,
    });

    // Update user stats
    const newXp = user.xp + actionConfig.points;
    const newLevel = Math.floor(newXp / 500) + 1;

    // Check streak
    const lastAction = user.lastActionDate ? new Date(user.lastActionDate) : null;
    const now = new Date();
    let newStreak = user.streak;

    if (lastAction) {
        const hoursSinceLastAction = (now.getTime() - lastAction.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastAction > 48) {
            newStreak = 1;
        } else if (hoursSinceLastAction > 20) {
            newStreak += 1;
        }
    } else {
        newStreak = 1;
    }

    const updatedUser = updateUser(userId, {
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastActionDate: now.toISOString(),
        totalCarbonSaved: user.totalCarbonSaved + actionConfig.carbon,
        totalWaterSaved: user.totalWaterSaved + actionConfig.water,
        totalWasteSaved: user.totalWasteSaved + actionConfig.waste,
    });

    const leveledUp = newLevel > user.level;

    return {
        action,
        user: updatedUser,
        leveledUp,
        xpGained: actionConfig.points,
    };
}

export async function getLeaderboardData() {
    return getLeaderboard();
}

export async function getAITip(userId: string = 'demo-user-1') {
    const user = getUser(userId);
    const actions = getUserActions(userId);

    const tip = await generateAIInsight(
        {
            xp: user?.xp || 0,
            streak: user?.streak || 0,
            recentActions: actions.slice(0, 5).map(a => a.type),
        },
        'TIP'
    );

    return tip;
}

export async function getAIFact() {
    const fact = await generateAIInsight(
        { xp: 0, streak: 0, recentActions: [] },
        'FACT'
    );
    return fact;
}

export async function getAIMission(userId: string = 'demo-user-1') {
    const user = getUser(userId);
    const actions = getUserActions(userId);

    const mission = await generateAIInsight(
        {
            xp: user?.xp || 0,
            streak: user?.streak || 0,
            recentActions: actions.slice(0, 5).map(a => a.type),
        },
        'MISSION'
    );

    return mission;
}

// Community actions
export async function getCommunityData() {
    return getCommunityPosts();
}

export async function createCommunityPost(data: {
    title: string;
    description: string;
    location: string;
    userId?: string;
}) {
    const user = getUser(data.userId || 'demo-user-1');
    if (!user) throw new Error('User not found');

    return addCommunityPost({
        userId: user.id,
        userName: user.name,
        title: data.title,
        description: data.description,
        location: data.location,
        imageUrl: '',
        status: 'OPEN',
    });
}

export async function upvoteCommunityPost(postId: string, userId: string = 'demo-user-1') {
    const { readDb, writeDb } = await import('@/lib/db');
    const db = readDb();
    const index = db.communityPosts.findIndex((p: CommunityPost) => p.id === postId);
    if (index === -1) return null;

    const post = db.communityPosts[index];
    if (!post.upvotedBy.includes(userId)) {
        post.upvotedBy.push(userId);
        post.upvotes = post.upvotedBy.length;
        writeDb(db);
    }

    return post;
}

// Refine user tasks with sustainable alternatives
export async function refineTasks(tasks: string[]): Promise<RefinedTask[]> {
    return refineTasksWithAI(tasks);
}
