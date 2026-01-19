"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Zap, Award } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { AIAssistant } from "@/components/AIAssistant"
import { getDashboardData } from "@/app/actions"

interface ProfileData {
    user: {
        id: string
        name: string
        email: string
        bio: string
        level: number
        xp: number
        streak: number
        totalCarbonSaved: number
        totalWaterSaved: number
        totalWasteSaved: number
        createdAt: string
    }
    recentActions: Array<{
        id: string
        type: string
        points: number
        createdAt: string
    }>
}

const BADGES = [
    { id: 'first_action', name: 'FIRST STEP', icon: '🌱', unlocked: true },
    { id: 'streak_7', name: 'WEEK WARRIOR', icon: '🔥', unlocked: true },
    { id: 'streak_30', name: 'MONTH MASTER', icon: '💪', unlocked: false },
    { id: 'recycler', name: 'RECYCLE PRO', icon: '♻️', unlocked: true },
    { id: 'water_saver', name: 'WATER GUARD', icon: '💧', unlocked: true },
    { id: 'carbon_hero', name: 'CARBON HERO', icon: '🌍', unlocked: false },
]

export default function ProfilePage() {
    const [data, setData] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            const result = await getDashboardData()
            setData(result as ProfileData)
        } catch (error) {
            console.error('Failed to load profile:', error)
        }
        setLoading(false)
    }

    if (loading || !data) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <span className="font-pixel text-sm text-muted-foreground blink">LOADING...</span>
            </div>
        )
    }

    const xpProgress = (data.user.xp % 500) / 5

    return (
        <div className="min-h-screen bg-background text-foreground pb-28 relative paper-bg">
            <div className="absolute top-0 left-0 w-8 h-full border-r-2 border-dashed border-secondary/30" />

            <div className="relative z-10 max-w-4xl mx-auto p-6 pt-24 ml-8 space-y-6">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="field-card p-8 text-center"
                >
                    {/* Avatar */}
                    <div className="w-20 h-20 mx-auto mb-4 bg-primary paper-border-primary flex items-center justify-center">
                        <span className="font-pixel text-3xl text-primary-foreground">
                            {data.user.name.charAt(0)}
                        </span>
                    </div>

                    <h1 className="font-pixel text-lg highlight-text mb-2">
                        {data.user.name.toUpperCase()}
                    </h1>
                    <p className="font-retro text-lg opacity-80 mb-4">
                        {data.user.bio || 'Eco-warrior in training'}
                    </p>

                    <div className="flex justify-center gap-6 font-retro text-lg">
                        <span className="flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            {data.user.streak} STREAK
                        </span>
                        <span>LEVEL {data.user.level}</span>
                    </div>
                </motion.div>

                {/* XP Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="field-card p-4"
                >
                    <div className="flex justify-between font-retro text-lg mb-2">
                        <span>LEVEL {data.user.level}</span>
                        <span className="highlight-text">{data.user.xp} XP</span>
                    </div>
                    <div className="retro-progress">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${xpProgress}%` }}
                            transition={{ duration: 1 }}
                            className="retro-progress-fill"
                        />
                    </div>
                    <p className="font-retro text-sm opacity-70 text-right mt-2">
                        {500 - (data.user.xp % 500)} XP to next level
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <StatBox label="TOTAL XP" value={data.user.xp.toString()} icon="⚡" />
                    <StatBox label="CO2 SAVED" value={`${data.user.totalCarbonSaved.toFixed(1)}kg`} icon="💨" />
                    <StatBox label="WATER" value={`${data.user.totalWaterSaved.toFixed(0)}L`} icon="💧" />
                    <StatBox label="WASTE" value={`${data.user.totalWasteSaved.toFixed(1)}kg`} icon="♻️" />
                </motion.div>

                {/* Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="header-box px-6 py-3 mb-4 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span className="font-pixel text-[10px] highlight-text">ACHIEVEMENTS</span>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {BADGES.map((badge) => (
                            <motion.div
                                key={badge.id}
                                whileHover={{ scale: 1.05 }}
                                className={`action-card text-center p-4 ${!badge.unlocked && 'opacity-40 grayscale'
                                    }`}
                            >
                                <span className="text-3xl block mb-2">{badge.icon}</span>
                                <span className="font-pixel text-[6px]">{badge.name}</span>
                            </motion.div>
                        ))}
                    </div>

                    <p className="font-retro text-sm text-muted-foreground text-center mt-4">
                        {BADGES.filter(b => b.unlocked).length}/{BADGES.length} Unlocked
                    </p>
                </motion.div>

                {/* Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="header-box px-6 py-3 mb-4">
                        <span className="font-pixel text-[10px] highlight-text">ACTION COUNT</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { type: 'RECYCLE', icon: '♻️' },
                            { type: 'COMPOST', icon: '🍎' },
                            { type: 'REFILL', icon: '💧' },
                            { type: 'TRANSIT', icon: '🚲' },
                        ].map((item) => {
                            const count = data.recentActions.filter(a => a.type === item.type).length
                            return (
                                <div
                                    key={item.type}
                                    className="action-card text-center p-4"
                                >
                                    <span className="text-3xl block">{item.icon}</span>
                                    <span className="font-pixel text-2xl highlight-text block mt-2">{count}</span>
                                    <span className="font-retro text-xs text-muted-foreground">{item.type}</span>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>
            </div>

            <NavBar />
            <AIAssistant />
        </div>
    )
}

function StatBox({ label, value, icon }: {
    label: string
    value: string
    icon: string
}) {
    return (
        <div className="field-card p-4 text-center">
            <span className="text-2xl block mb-2">{icon}</span>
            <p className="font-pixel text-sm highlight-text">{value}</p>
            <p className="font-retro text-sm opacity-70">{label}</p>
        </div>
    )
}
