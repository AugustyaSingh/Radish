"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { NavBar } from "@/components/NavBar"
import { AIAssistant } from "@/components/AIAssistant"
import { getDashboardData } from "@/app/actions"

interface DailyData {
    user: {
        level: number
        xp: number
        streak: number
        totalCarbonSaved: number
        totalWaterSaved: number
        totalWasteSaved: number
    }
    recentActions: Array<{
        id: string
        type: string
        points: number
        createdAt: string
    }>
}

const POWER_UP_TIPS = [
    "Hydration Combo: Bring a reusable bottle AND mug tomorrow for a hydration bonus!",
    "Transit Champion: Bike or walk to your destination 3 days in a row for bonus XP!",
    "Zero Waste Warrior: Pack a lunch in reusable containers to avoid single-use packaging!",
    "Energy Saver: Turn off lights and unplug devices when leaving a room!",
    "Mindful Consumer: Before buying, ask yourself if you really need it!",
]

export default function DailyPage() {
    const [data, setData] = useState<DailyData | null>(null)
    const [loading, setLoading] = useState(true)
    const [tip] = useState(() => POWER_UP_TIPS[Math.floor(Math.random() * POWER_UP_TIPS.length)])

    const today = new Date()
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const result = await getDashboardData()
            setData(result as DailyData)
        } catch (error) {
            console.error('Failed to load daily data:', error)
        }
        setLoading(false)
    }

    // Filter today's actions
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todaysActions = data?.recentActions.filter(
        a => new Date(a.createdAt) >= todayStart
    ) || []
    const todaysScore = todaysActions.reduce((sum, a) => sum + a.points, 0)

    if (loading || !data) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <span className="font-pixel text-sm text-muted-foreground blink">LOADING...</span>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-28">
            {/* Header - Terracotta/Rose color */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-secondary text-secondary-foreground py-8 px-6 text-center relative"
            >
                <h1 className="font-pixel text-2xl md:text-3xl mb-2">LEVEL COMPLETE!</h1>
                <p className="font-retro text-xl opacity-80">{formattedDate}</p>

                {/* Pixel badge */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 w-20 h-20 bg-muted rounded-full flex items-center justify-center border-4 border-background">
                    <span className="font-pixel text-3xl text-secondary">🏆</span>
                </div>
            </motion.div>

            <div className="max-w-2xl mx-auto p-6 space-y-6">
                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 gap-4"
                >
                    <StatCard
                        value={`${(data.user.totalCarbonSaved * 2.2).toFixed(1)}`}
                        unit="lbs"
                        label="CO2 SAVED"
                    />
                    <StatCard
                        value={`${(data.user.totalWasteSaved * 2.2).toFixed(2)}`}
                        unit="lbs"
                        label="WASTE DIVERTED"
                    />
                    <StatCard
                        value={todaysActions.length.toString()}
                        label="ACTIONS LOGGED"
                    />
                    <StatCard
                        value={todaysScore.toString()}
                        label="SCORE"
                    />
                </motion.div>

                {/* Divider */}
                <div className="border-t-2 border-dashed border-muted-foreground/30" />

                {/* Today's Log */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center"
                >
                    <h2 className="font-pixel text-sm mb-4">TODAY'S LOG</h2>

                    {todaysActions.length === 0 ? (
                        <p className="font-retro text-xl text-muted-foreground">
                            No actions recorded today. Get active!
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {todaysActions.map((action) => (
                                <div
                                    key={action.id}
                                    className="flex items-center justify-between p-3 bg-muted rounded"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">
                                            {getActionIcon(action.type)}
                                        </span>
                                        <span className="font-retro text-lg">{action.type.replace('_', ' ')}</span>
                                    </div>
                                    <span className="font-pixel text-xs text-accent">+{action.points}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Power-Up Tip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-card text-card-foreground p-4"
                >
                    <p className="font-pixel text-xs mb-2 flex items-center gap-2">
                        <span>💡</span> POWER-UP TIP:
                    </p>
                    <p className="font-retro text-lg">{tip}</p>
                </motion.div>
            </div>

            <NavBar />
            <AIAssistant />
        </div>
    )
}

function StatCard({ value, unit, label }: { value: string; unit?: string; label: string }) {
    return (
        <div className="bg-muted p-6 text-center paper-border">
            <p className="font-pixel text-2xl md:text-3xl">
                {value}
                {unit && <span className="text-lg ml-1">{unit}</span>}
            </p>
            <p className="font-retro text-sm text-muted-foreground mt-2">{label}</p>
        </div>
    )
}

function getActionIcon(type: string): string {
    const icons: Record<string, string> = {
        'RECYCLE': '♻️',
        'COMPOST': '🍎',
        'REFILL': '💧',
        'TRANSIT': '🚲',
        'ORDERED_FOOD': '🍽️',
        'PRINTED': '📄',
        'USED_MUG': '☕',
        'REFILLED_BOTTLE': '💧',
        'DISPOSED_WASTE': '🗑️',
        'DIGITAL_CLEANUP': '🖥️',
        'RECYCLED': '♻️',
        'COMPOSTED': '🍎',
        'CARPOOLED': '🚗',
        'USED_STAIRS': '🚶',
        'TURNED_OFF_LIGHTS': '💡',
        'BROUGHT_CONTAINER': '📦',
        'BIKED_TO_CAMPUS': '🚲',
        'BROUGHT_LUNCH': '🥗',
    }
    return icons[type] || '🌱'
}
