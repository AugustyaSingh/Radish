"use client"

import { useState, useEffect, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, ThumbsUp, Plus, X, MessageSquare, Users } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { AIAssistant } from "@/components/AIAssistant"
import { getCommunityData, createCommunityPost, upvoteCommunityPost } from "@/app/actions"

interface CommunityPost {
    id: string
    userId: string
    userName: string
    title: string
    description: string
    location: string
    upvotes: number
    upvotedBy: string[]
    status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED'
    createdAt: string
}

// Sample campus insights
const CAMPUS_INSIGHTS = [
    {
        id: 'insight-1',
        time: '8:15 AM',
        title: 'THE CAMPUS WAKES UP',
        content: 'Right now, 1,240 "Morning Intents" have been set. The most common intention? Coffee.',
        highlight: '1,240'
    },
    {
        id: 'insight-2',
        time: '12:30 PM',
        title: 'LUNCH RUSH PATTERNS',
        content: 'Peak cafeteria time! 340 students brought reusable containers today. That\'s 23% more than last week!',
        highlight: '340'
    },
    {
        id: 'insight-3',
        time: '3:45 PM',
        title: 'AFTERNOON ENERGY',
        content: 'Library lights: 78% occupied. Study rooms with natural light are preferred 3:1 over others.',
        highlight: '78%'
    },
]

export default function CommunityPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([])
    const [loading, setLoading] = useState(true)
    const [showNewPost, setShowNewPost] = useState(false)
    const [activeTab, setActiveTab] = useState<'VOLUNTEER' | 'INSIGHTS'>('VOLUNTEER')
    const [isPending, startTransition] = useTransition()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')

    useEffect(() => {
        loadPosts()
    }, [])

    const loadPosts = async () => {
        try {
            const data = await getCommunityData()
            setPosts(data as CommunityPost[])
        } catch (error) {
            console.error('Failed to load posts:', error)
        }
        setLoading(false)
    }

    const handleUpvote = async (postId: string) => {
        startTransition(async () => {
            try {
                await upvoteCommunityPost(postId)
                await loadPosts()
            } catch (error) {
                console.error('Failed to upvote:', error)
            }
        })
    }

    const handleCreatePost = async () => {
        if (!title || !description || !location) return

        startTransition(async () => {
            try {
                await createCommunityPost({ title, description, location })
                setTitle('')
                setDescription('')
                setLocation('')
                setShowNewPost(false)
                await loadPosts()
            } catch (error) {
                console.error('Failed to create post:', error)
            }
        })
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-28 relative paper-bg">
            <div className="absolute top-0 left-0 w-8 h-full border-r-2 border-dashed border-secondary/30" />

            <div className="relative z-10 max-w-4xl mx-auto p-6 pt-24 ml-8 space-y-6">
                {/* Tab Selector */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                >
                    <button
                        onClick={() => setActiveTab('VOLUNTEER')}
                        className={`flex-1 header-box px-6 py-4 transition-all ${activeTab === 'VOLUNTEER' ? 'ring-2 ring-accent' : 'opacity-70'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5" />
                            <div className="text-left">
                                <p className="font-pixel text-[10px] highlight-text">VOLUNTEER BOARD</p>
                                <p className="font-retro text-sm opacity-80">Join cleanup events</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab('INSIGHTS')}
                        className={`flex-1 header-box px-6 py-4 transition-all ${activeTab === 'INSIGHTS' ? 'ring-2 ring-accent' : 'opacity-70'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-5 h-5" />
                            <div className="text-left">
                                <p className="font-pixel text-[10px] highlight-text">CAMPUS INSIGHTS</p>
                                <p className="font-retro text-sm opacity-80">Anonymous patterns</p>
                            </div>
                        </div>
                    </button>
                </motion.div>

                {/* Volunteer Tab Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'VOLUNTEER' && (
                        <motion.div
                            key="volunteer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            {/* New Mission Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowNewPost(true)}
                                    className="retro-btn-filled flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    NEW MISSION
                                </button>
                            </div>

                            {/* Posts List */}
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <span className="font-pixel text-sm text-muted-foreground blink">LOADING...</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {posts.map((post, i) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="field-card p-5"
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <span className="font-pixel text-[8px] text-accent">
                                                        ○ {post.status.replace('_', ' ')}
                                                    </span>
                                                    <h3 className="font-pixel text-xs highlight-text mt-1">{post.title}</h3>
                                                    <p className="font-retro text-lg mt-2">{post.description}</p>
                                                    <div className="flex items-center gap-2 mt-3 opacity-70">
                                                        <MapPin className="w-4 h-4" />
                                                        <span className="font-retro text-sm">{post.location}</span>
                                                    </div>
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleUpvote(post.id)}
                                                    disabled={isPending}
                                                    className="action-card p-3 text-center min-w-[60px]"
                                                >
                                                    <ThumbsUp className="w-5 h-5 mx-auto mb-1" />
                                                    <span className="font-pixel text-sm">{post.upvotes}</span>
                                                </motion.button>
                                            </div>

                                            <div className="flex justify-between items-center pt-3 mt-3 border-t border-background/20">
                                                <span className="font-retro text-sm opacity-70">BY {post.userName.toUpperCase()}</span>
                                                <span className="font-retro text-sm opacity-70">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Insights Tab Content */}
                    {activeTab === 'INSIGHTS' && (
                        <motion.div
                            key="insights"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {/* Header */}
                            <div className="header-box px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">🌱</span>
                                    <div>
                                        <h2 className="font-pixel text-sm highlight-text">ANONYMOUS CAMPUS INSIGHTS</h2>
                                        <p className="font-retro text-sm opacity-80">
                                            A collective portrait of our environmental decisions. No names. No rankings. Just patterns.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Insights Cards */}
                            {CAMPUS_INSIGHTS.map((insight, i) => (
                                <motion.div
                                    key={insight.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.15 }}
                                    className="bg-background p-6 border-2 border-foreground shadow-[4px_4px_0_0_#333]"
                                >
                                    <h3 className="font-pixel text-sm mb-4">
                                        {insight.time}: {insight.title}
                                    </h3>
                                    <p className="font-retro text-lg">
                                        {insight.content.split(insight.highlight).map((part, idx, arr) => (
                                            <span key={idx}>
                                                {part}
                                                {idx < arr.length - 1 && (
                                                    <span className="bg-primary/40 px-1">{insight.highlight}</span>
                                                )}
                                            </span>
                                        ))}
                                    </p>
                                </motion.div>
                            ))}

                            {/* Share Your Insight */}
                            <div className="field-card p-4">
                                <p className="font-pixel text-[10px] mb-3 highlight-text">SHARE AN OBSERVATION</p>
                                <textarea
                                    placeholder="What patterns have you noticed on campus today?"
                                    rows={3}
                                    className="w-full p-3 paper-input font-retro text-lg resize-none mb-3"
                                />
                                <button className="retro-btn-filled">SUBMIT ANONYMOUSLY</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* New Post Modal */}
            <AnimatePresence>
                {showNewPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50"
                        onClick={() => setShowNewPost(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-background paper-border p-6"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="header-box px-4 py-2">
                                    <span className="font-pixel text-[10px] highlight-text">NEW VOLUNTEER MISSION</span>
                                </div>
                                <button onClick={() => setShowNewPost(false)} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="font-retro text-sm text-muted-foreground block mb-2">MISSION TITLE</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value.toUpperCase())}
                                        placeholder="BEACH CLEANUP..."
                                        className="w-full p-3 paper-input font-retro text-lg"
                                    />
                                </div>

                                <div>
                                    <label className="font-retro text-sm text-muted-foreground block mb-2">DESCRIPTION</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Tell others what needs to be done..."
                                        rows={3}
                                        className="w-full p-3 paper-input font-retro text-lg resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="font-retro text-sm text-muted-foreground block mb-2">LOCATION</label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Central Park, Delhi"
                                        className="w-full p-3 paper-input font-retro text-lg"
                                    />
                                </div>

                                <button
                                    onClick={handleCreatePost}
                                    disabled={isPending || !title || !description || !location}
                                    className="w-full retro-btn-filled disabled:opacity-50"
                                >
                                    {isPending ? 'CREATING...' : 'CREATE MISSION'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <NavBar />
            <AIAssistant />
        </div>
    )
}
