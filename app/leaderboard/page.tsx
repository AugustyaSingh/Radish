"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trophy, Medal, Crown, Users, UserPlus, Zap, TrendingUp } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { AIAssistant } from "@/components/AIAssistant"
import { getLeaderboardData } from "@/app/actions"

interface LeaderboardUser {
    id: string
    name: string
    avatar: string
    level: number
    xp: number
    streak: number
    totalCarbonSaved: number
}

export default function LeaderboardPage() {
    const [users, setUsers] = useState<LeaderboardUser[]>([])
    const [tab, setTab] = useState<'global' | 'friends'>('global')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadLeaderboard()
    }, [])

    const loadLeaderboard = async () => {
        try {
            const data = await getLeaderboardData()
            setUsers(data as LeaderboardUser[])
        } catch (error) {
            console.error('Failed to load leaderboard:', error)
        }
        setLoading(false)
    }

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            case 2:
                return <Medal className="w-6 h-6 text-gray-300" />
            case 3:
                return <Medal className="w-6 h-6 text-amber-600" />
            default:
                return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
        }
    }

    const getRankBg = (rank: number) => {
        switch (rank) {
            case 1:
                return "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30"
            case 2:
                return "bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/30"
            case 3:
                return "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30"
            default:
                return "bg-card/50 border-border/50"
        }
    }

    return (
        <div className="dark min-h-screen bg-background text-foreground font-sans pb-28">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto p-6 space-y-6">
                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl mb-4 shadow-xl shadow-yellow-500/30"
                    >
                        <Trophy className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold font-display">Leaderboard</h1>
                    <p className="text-muted-foreground mt-1">Compete with the community</p>
                </motion.header>

                {/* Tab Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex gap-2 p-1.5 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl"
                >
                    {[
                        { id: 'global' as const, label: 'Global', icon: Users },
                        { id: 'friends' as const, label: 'Friends', icon: UserPlus },
                    ].map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${tab === id
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </motion.div>

                {/* Top 3 Podium */}
                {!loading && users.length >= 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-end justify-center gap-4 py-6"
                    >
                        {/* 2nd Place */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col items-center"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-slate-400 border-4 border-gray-300 flex items-center justify-center text-2xl font-bold text-white">
                                    {users[1]?.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">
                                    2
                                </div>
                            </div>
                            <p className="mt-3 font-medium text-sm">{users[1]?.name}</p>
                            <p className="text-xs text-muted-foreground">{users[1]?.xp.toLocaleString()} XP</p>
                            <div className="mt-2 w-20 h-24 bg-gradient-to-t from-gray-400/20 to-gray-300/20 rounded-t-lg" />
                        </motion.div>

                        {/* 1st Place */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col items-center"
                        >
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <Crown className="w-8 h-8 text-yellow-400 mb-2" />
                            </motion.div>
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border-4 border-yellow-400 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-yellow-500/30">
                                    {users[0]?.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-yellow-900">
                                    1
                                </div>
                            </div>
                            <p className="mt-3 font-medium">{users[0]?.name}</p>
                            <p className="text-xs text-muted-foreground">{users[0]?.xp.toLocaleString()} XP</p>
                            <div className="mt-2 w-24 h-32 bg-gradient-to-t from-yellow-500/20 to-amber-400/20 rounded-t-lg" />
                        </motion.div>

                        {/* 3rd Place */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col items-center"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-600 to-orange-600 border-4 border-amber-600 flex items-center justify-center text-2xl font-bold text-white">
                                    {users[2]?.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-xs font-bold text-amber-100">
                                    3
                                </div>
                            </div>
                            <p className="mt-3 font-medium text-sm">{users[2]?.name}</p>
                            <p className="text-xs text-muted-foreground">{users[2]?.xp.toLocaleString()} XP</p>
                            <div className="mt-2 w-20 h-16 bg-gradient-to-t from-amber-600/20 to-orange-500/20 rounded-t-lg" />
                        </motion.div>
                    </motion.div>
                )}

                {/* Full List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                >
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Trophy className="w-8 h-8 text-primary" />
                            </motion.div>
                        </div>
                    ) : tab === 'friends' ? (
                        <div className="text-center py-12">
                            <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">Friends feature coming soon!</p>
                            <p className="text-sm text-muted-foreground mt-1">Invite your friends to compete together</p>
                        </div>
                    ) : (
                        users.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.05 }}
                                whileHover={{ scale: 1.02, x: 5 }}
                                className={`flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-sm transition-all ${getRankBg(index + 1)}`}
                            >
                                <div className="w-10 flex justify-center">
                                    {getRankIcon(index + 1)}
                                </div>

                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/50 to-emerald-500/50 flex items-center justify-center text-lg font-bold">
                                    {user.name.charAt(0)}
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium">{user.name}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            Level {user.level}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Zap className="w-3 h-3 text-amber-500" />
                                            {user.streak} streak
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="font-bold text-primary">{user.xp.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">XP</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </div>

            <NavBar />
            <AIAssistant />
        </div>
    )
}
