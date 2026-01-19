// lib/db.ts - JSON File-based Database
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export interface User {
    id: string;
    name: string;
    email: string;
    bio: string;
    avatar: string;
    level: number;
    xp: number;
    streak: number;
    totalCarbonSaved: number;
    totalWaterSaved: number;
    totalWasteSaved: number;
    lastActionDate: string | null;
    createdAt: string;
}

export interface Action {
    id: string;
    type: string; // Supports all action types including custom ones
    points: number;
    carbon: number;
    water: number;
    waste: number;
    userId: string;
    createdAt: string;
}

export interface AIInsight {
    id: string;
    type: 'TIP' | 'FACT' | 'MISSION';
    content: string;
    userId: string;
    createdAt: string;
}

export interface CommunityPost {
    id: string;
    userId: string;
    userName: string;
    title: string;
    description: string;
    location: string;
    imageUrl: string;
    upvotes: number;
    upvotedBy: string[];
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
    createdAt: string;
}

export interface Database {
    users: User[];
    actions: Action[];
    insights: AIInsight[];
    communityPosts: CommunityPost[];
}

const DEFAULT_DB: Database = {
    users: [
        {
            id: 'demo-user-1',
            name: 'Radish User',
            email: 'demo@radish.app',
            bio: 'Eco-warrior in training 🌱',
            avatar: '/avatars/radish-1.png',
            level: 5,
            xp: 1240,
            streak: 12,
            totalCarbonSaved: 24.5,
            totalWaterSaved: 120,
            totalWasteSaved: 8.2,
            lastActionDate: new Date().toISOString(),
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'user-2',
            name: 'Green Warrior',
            email: 'green@radish.app',
            bio: 'Saving the planet one action at a time',
            avatar: '/avatars/radish-2.png',
            level: 7,
            xp: 2100,
            streak: 21,
            totalCarbonSaved: 45.2,
            totalWaterSaved: 250,
            totalWasteSaved: 15.8,
            lastActionDate: new Date().toISOString(),
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'user-3',
            name: 'Eco Champion',
            email: 'eco@radish.app',
            bio: 'Zero waste lifestyle advocate',
            avatar: '/avatars/radish-3.png',
            level: 10,
            xp: 4500,
            streak: 45,
            totalCarbonSaved: 89.1,
            totalWaterSaved: 520,
            totalWasteSaved: 32.5,
            lastActionDate: new Date().toISOString(),
            createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],
    actions: [],
    insights: [],
    communityPosts: [
        {
            id: 'post-1',
            userId: 'user-2',
            userName: 'Green Warrior',
            title: 'BEACH CLEANUP EVENT',
            description: 'Found lots of plastic waste near the pier. Looking for volunteers this Saturday!',
            location: 'Marina Beach, Chennai',
            imageUrl: '',
            upvotes: 24,
            upvotedBy: ['demo-user-1', 'user-3'],
            status: 'OPEN',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'post-2',
            userId: 'user-3',
            userName: 'Eco Champion',
            title: 'PARK RESTORATION PROJECT',
            description: 'The community park needs some love! Bringing tools and seedlings. Join us!',
            location: 'Central Park, Delhi',
            imageUrl: '',
            upvotes: 42,
            upvotedBy: ['demo-user-1', 'user-2'],
            status: 'IN_PROGRESS',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
            id: 'post-3',
            userId: 'demo-user-1',
            userName: 'Radish User',
            title: 'STREET CLEANUP SUCCESS!',
            description: 'We cleaned up 50kg of waste from our neighborhood! Great teamwork everyone!',
            location: 'Koramangala, Bangalore',
            imageUrl: '',
            upvotes: 67,
            upvotedBy: ['user-2', 'user-3'],
            status: 'COMPLETED',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        },
    ],
};

function ensureDbExists(): void {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
    }
}

export function readDb(): Database {
    ensureDbExists();
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const db = JSON.parse(data);
    // Ensure communityPosts exists for backward compatibility
    if (!db.communityPosts) {
        db.communityPosts = DEFAULT_DB.communityPosts;
        writeDb(db);
    }
    return db;
}

export function writeDb(db: Database): void {
    ensureDbExists();
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export function getUser(userId: string = 'demo-user-1'): User | undefined {
    const db = readDb();
    return db.users.find(u => u.id === userId);
}

export function updateUser(userId: string, updates: Partial<User>): User | undefined {
    const db = readDb();
    const index = db.users.findIndex(u => u.id === userId);
    if (index === -1) return undefined;
    db.users[index] = { ...db.users[index], ...updates };
    writeDb(db);
    return db.users[index];
}

export function addAction(action: Omit<Action, 'id' | 'createdAt'>): Action {
    const db = readDb();
    const newAction: Action = {
        ...action,
        id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
    };
    db.actions.push(newAction);
    writeDb(db);
    return newAction;
}

export function getUserActions(userId: string): Action[] {
    const db = readDb();
    return db.actions
        .filter(a => a.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getLeaderboard(): User[] {
    const db = readDb();
    return [...db.users].sort((a, b) => b.xp - a.xp);
}

export function addInsight(insight: Omit<AIInsight, 'id' | 'createdAt'>): AIInsight {
    const db = readDb();
    const newInsight: AIInsight = {
        ...insight,
        id: `insight-${Date.now()}`,
        createdAt: new Date().toISOString(),
    };
    db.insights.push(newInsight);
    writeDb(db);
    return newInsight;
}

export function getLatestInsight(userId: string): AIInsight | undefined {
    const db = readDb();
    return db.insights
        .filter(i => i.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
}

// Community functions
export function getCommunityPosts(): CommunityPost[] {
    const db = readDb();
    return [...db.communityPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addCommunityPost(post: Omit<CommunityPost, 'id' | 'createdAt' | 'upvotes' | 'upvotedBy'>): CommunityPost {
    const db = readDb();
    const newPost: CommunityPost = {
        ...post,
        id: `post-${Date.now()}`,
        upvotes: 0,
        upvotedBy: [],
        createdAt: new Date().toISOString(),
    };
    db.communityPosts.push(newPost);
    writeDb(db);
    return newPost;
}

export function upvotePost(postId: string, userId: string): CommunityPost | undefined {
    const db = readDb();
    const index = db.communityPosts.findIndex(p => p.id === postId);
    if (index === -1) return undefined;

    const post = db.communityPosts[index];
    if (!post.upvotedBy.includes(userId)) {
        post.upvotedBy.push(userId);
        post.upvotes = post.upvotedBy.length;
    }

    writeDb(db);
    return post;
}

export function updatePostStatus(postId: string, status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED'): CommunityPost | undefined {
    const db = readDb();
    const index = db.communityPosts.findIndex(p => p.id === postId);
    if (index === -1) return undefined;

    db.communityPosts[index].status = status;
    writeDb(db);
    return db.communityPosts[index];
}
