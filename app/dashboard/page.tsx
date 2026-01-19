"use client"

import { useState, useEffect, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { NavBar } from "@/components/NavBar"
import { AIAssistant } from "@/components/AIAssistant"
import { getDashboardData, logAction } from "@/app/actions"

interface ActionRecord {
    id: string
    type: string
    points: number
    createdAt: string
}

interface DashboardData {
    user: {
        id: string
        name: string
        level: number
        xp: number
        streak: number
        totalCarbonSaved: number
        totalWaterSaved: number
        totalWasteSaved: number
    }
    recentActions: ActionRecord[]
}

// Extended action options
const ACTION_CARDS = [
    { type: 'ORDERED_FOOD', icon: '🍽️', label: 'ORDERED FOOD', color: 'bg-[#c9b99a]', points: -5, baseType: 'RECYCLE' as const },
    { type: 'PRINTED', icon: '📄', label: 'PRINTED', color: 'bg-[#c9b99a]', points: -3, baseType: 'RECYCLE' as const },
    { type: 'USED_MUG', icon: '☕', label: 'USED MY MUG', color: 'bg-[#7a9a8a]', points: 8, baseType: 'REFILL' as const },

    { type: 'REFILL', icon: '💧', label: 'REFILLED BOTTLE', color: 'bg-[#a8c4d4]', points: 8, baseType: 'REFILL' as const },
    { type: 'DISPOSED_WASTE', icon: '🗑️', label: 'DISPOSED WASTE', color: 'bg-[#c9b99a]', points: 5, baseType: 'RECYCLE' as const },
    { type: 'DIGITAL_CLEANUP', icon: '🖥️', label: 'DIGITAL CLEANUP', color: 'bg-[#b07a7a]', points: 5, baseType: 'RECYCLE' as const },

    { type: 'RECYCLE', icon: '♻️', label: 'RECYCLED', color: 'bg-[#8a9a7a]', points: 10, baseType: 'RECYCLE' as const },
    { type: 'COMPOST', icon: '🍎', label: 'COMPOSTED', color: 'bg-[#b07a7a]', points: 15, baseType: 'COMPOST' as const },
    { type: 'CARPOOLED', icon: '🚗', label: 'CARPOOLED', color: 'bg-[#d4a5a5]', points: 20, baseType: 'TRANSIT' as const },

    { type: 'USED_STAIRS', icon: '🚶', label: 'USED STAIRS', color: 'bg-[#d4b896]', points: 5, baseType: 'TRANSIT' as const },
    { type: 'TURNED_OFF_LIGHTS', icon: '💡', label: 'TURNED OFF LIGHTS', color: 'bg-[#c4c4a0]', points: 5, baseType: 'RECYCLE' as const },
    { type: 'BROUGHT_CONTAINER', icon: '📦', label: 'BROUGHT CONTAINER', color: 'bg-[#c4c4a0]', points: 10, baseType: 'REFILL' as const },

    { type: 'TRANSIT', icon: '🚲', label: 'BIKED TO CAMPUS', color: 'bg-[#a8c4d4]', points: 25, baseType: 'TRANSIT' as const },
    { type: 'BROUGHT_LUNCH', icon: '🥗', label: 'BROUGHT LUNCH', color: 'bg-[#7a9a8a]', points: 12, baseType: 'REFILL' as const },
]

export default function Dashboard() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [activityLog, setActivityLog] = useState<ActionRecord[]>([])
    const [xpAnimation, setXpAnimation] = useState<{ amount: number; isNegative: boolean; action: string } | null>(null)
    const [isPending, startTransition] = useTransition()
    const [customAction, setCustomAction] = useState('')
    const [customXpValue, setCustomXpValue] = useState(5)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const result = await getDashboardData()
            setData(result as DashboardData)
            setActivityLog(result.recentActions)
        } catch (error) {
            console.error('Failed to load dashboard:', error)
        }
    }

    const handleLogAction = async (actionCard: typeof ACTION_CARDS[0]) => {
        startTransition(async () => {
            try {
                // Pass the actual action type (not baseType) to get correct XP values
                const result = await logAction(actionCard.type)

                const isNegative = actionCard.points < 0
                setXpAnimation({
                    amount: Math.abs(actionCard.points),
                    isNegative,
                    action: actionCard.label
                })

                // Add to activity log immediately for real-time feedback
                const newAction: ActionRecord = {
                    id: `temp-${Date.now()}`,
                    type: actionCard.type,
                    points: actionCard.points,
                    createdAt: new Date().toISOString()
                }
                setActivityLog(prev => [newAction, ...prev.slice(0, 9)])

                setTimeout(() => setXpAnimation(null), 2500)

                if (!isNegative) {
                    confetti({
                        particleCount: result.leveledUp ? 150 : 60,
                        spread: 50,
                        origin: { y: 0.7 },
                        colors: ['#8B9467', '#C4A484', '#A0937D', '#B8860B'],
                    })
                }

                await loadData()
            } catch (error) {
                console.error('Failed to log action:', error)
            }
        })
    }

    const handleCustomAction = () => {
        if (!customAction.trim()) return

        const xpAmount = customXpValue
        const isNegative = xpAmount < 0

        // Create a custom action entry
        const newAction: ActionRecord = {
            id: `custom-${Date.now()}`,
            type: customAction.toUpperCase().replace(/\s+/g, '_'),
            points: xpAmount,
            createdAt: new Date().toISOString()
        }
        setActivityLog(prev => [newAction, ...prev.slice(0, 9)])

        setXpAnimation({ amount: Math.abs(xpAmount), isNegative, action: customAction.toUpperCase() })
        setTimeout(() => setXpAnimation(null), 2500)

        if (!isNegative && xpAmount > 0) {
            confetti({
                particleCount: 20 + xpAmount * 4,
                spread: 40,
                origin: { y: 0.7 },
                colors: ['#8B9467', '#C4A484'],
            })
        }

        setCustomAction('')
        setCustomXpValue(5)

        // Also log it server-side
        startTransition(async () => {
            try {
                // For custom actions, use RECYCLE for positive, ORDERED_FOOD for negative
                await logAction(xpAmount >= 0 ? 'RECYCLE' : 'ORDERED_FOOD')
                await loadData()
            } catch (error) {
                console.error('Failed to log custom action:', error)
            }
        })
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <span className="font-pixel text-sm text-muted-foreground blink">LOADING...</span>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-28 relative paper-bg">
            <div className="absolute top-0 left-0 w-8 h-full border-r-2 border-dashed border-secondary/30" />

            <div className="relative z-10 max-w-5xl mx-auto p-6 pt-24 ml-8 space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="header-box px-6 py-4"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🌱</span>
                        <div className="flex-1">
                            <h1 className="font-pixel text-sm highlight-text">TODAY'S ACTIONS</h1>
                            <p className="font-retro text-sm opacity-80">
                                Log what you do throughout the day. Each action reveals its hidden impact.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* XP Animation Overlay */}
                <AnimatePresence>
                    {xpAnimation && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1, y: -20 }}
                            exit={{ opacity: 0, scale: 0.5, y: -40 }}
                            className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 text-center"
                        >
                            <div className={`font-pixel text-3xl mb-2 ${xpAnimation.isNegative ? 'text-secondary' : 'text-accent'
                                }`}>
                                {xpAnimation.isNegative ? '-' : '+'}{xpAnimation.amount} XP
                            </div>
                            <div className="font-retro text-lg bg-card text-card-foreground px-4 py-2">
                                {xpAnimation.action}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Action Cards Grid */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-3 gap-3">
                            {ACTION_CARDS.map((action) => (
                                <motion.button
                                    key={action.type}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleLogAction(action)}
                                    disabled={isPending}
                                    className={`
                                        ${action.color} p-4 text-center transition-all disabled:opacity-50
                                        border-2 border-foreground/20 shadow-[3px_3px_0_0_rgba(0,0,0,0.2)]
                                        hover:shadow-[1px_1px_0_0_rgba(0,0,0,0.2)] hover:translate-x-[2px] hover:translate-y-[2px]
                                    `}
                                >
                                    <span className="text-2xl block mb-2">{action.icon}</span>
                                    <span className="font-pixel text-[7px] text-foreground/80 block leading-tight">{action.label}</span>
                                    <span className={`font-pixel text-[8px] block mt-1 ${action.points < 0 ? 'text-red-800' : 'text-green-800'}`}>
                                        {action.points > 0 ? '+' : ''}{action.points}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-4">
                        {/* Custom Action */}
                        <div className="header-box px-4 py-3">
                            <p className="font-pixel text-[10px] highlight-text">OR ADD YOUR OWN ACTION:</p>
                        </div>
                        <div className="bg-primary/30 p-4 space-y-3 paper-border-primary">
                            <input
                                type="text"
                                value={customAction}
                                onChange={(e) => setCustomAction(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCustomAction()}
                                placeholder="e.g., Donated old clothes"
                                className="w-full p-3 paper-input font-retro text-lg"
                            />

                            {/* XP Slider */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="font-pixel text-[8px] text-secondary">-10</span>
                                    <span className={`font-pixel text-lg ${customXpValue > 0 ? 'text-accent' : customXpValue < 0 ? 'text-secondary' : 'text-muted-foreground'
                                        }`}>
                                        {customXpValue > 0 ? '+' : ''}{customXpValue} XP {customXpValue > 0 ? '🌱' : customXpValue < 0 ? '💔' : '⚖️'}
                                    </span>
                                    <span className="font-pixel text-[8px] text-accent">+10</span>
                                </div>
                                <input
                                    type="range"
                                    min="-10"
                                    max="10"
                                    value={customXpValue}
                                    onChange={(e) => setCustomXpValue(parseInt(e.target.value))}
                                    className="w-full h-3 appearance-none cursor-pointer rounded-none"
                                    style={{
                                        background: `linear-gradient(to right, 
                                            hsl(15, 35%, 55%) 0%, 
                                            hsl(15, 35%, 55%) ${(customXpValue + 10) * 5}%, 
                                            hsl(90, 25%, 50%) ${(customXpValue + 10) * 5}%, 
                                            hsl(90, 25%, 50%) 100%)`
                                    }}
                                />
                                <div className="flex justify-center gap-4 text-xs font-retro">
                                    <span className="opacity-60">← Unsustainable</span>
                                    <span className="opacity-60">Eco-friendly →</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCustomAction}
                                disabled={!customAction.trim()}
                                className="retro-btn-filled w-full disabled:opacity-50"
                            >
                                LOG IT
                            </button>
                        </div>

                        {/* Stats Summary */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="field-card p-3 text-center">
                                <p className="font-pixel text-lg highlight-text">{(data.user.totalCarbonSaved * 2.2).toFixed(1)}kg</p>
                                <p className="font-retro text-xs opacity-70">CO2</p>
                            </div>
                            <div className="field-card p-3 text-center">
                                <p className="font-pixel text-lg highlight-text">{data.user.totalWaterSaved.toFixed(0)}L</p>
                                <p className="font-retro text-xs opacity-70">WATER</p>
                            </div>
                            <div className="field-card p-3 text-center">
                                <p className="font-pixel text-lg highlight-text">{data.user.totalWasteSaved.toFixed(1)}kg</p>
                                <p className="font-retro text-xs opacity-70">WASTE</p>
                            </div>
                            <div className="field-card p-3 text-center">
                                <p className="font-pixel text-lg highlight-text">{data.user.xp}</p>
                                <p className="font-retro text-xs opacity-70">XP</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Log */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="header-box px-6 py-3 mb-4">
                        <span className="font-pixel text-[10px] highlight-text">ACTIVITY LOG</span>
                    </div>

                    <div className="field-card p-4">
                        {activityLog.length === 0 ? (
                            <p className="font-retro text-lg text-center opacity-70 py-4">
                                No actions logged yet. Start above!
                            </p>
                        ) : (
                            <div className="space-y-2">
                                <AnimatePresence>
                                    {activityLog.slice(0, 5).map((action, i) => (
                                        <motion.div
                                            key={action.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="flex items-center justify-between p-3 bg-background/10"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">
                                                    {getActionIcon(action.type)}
                                                </span>
                                                <span className="font-retro text-lg">{action.type.replace(/_/g, ' ')}</span>
                                            </div>
                                            <span className={`font-pixel text-[10px] ${action.points < 0 ? 'text-secondary' : 'highlight-text'}`}>
                                                {action.points > 0 ? '+' : ''}{action.points} XP
                                            </span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <NavBar />
            <AIAssistant />
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
        'DISPOSED_WASTE': '🗑️',
        'DIGITAL_CLEANUP': '🖥️',
        'CARPOOLED': '🚗',
        'USED_STAIRS': '🚶',
        'TURNED_OFF_LIGHTS': '💡',
        'BROUGHT_CONTAINER': '📦',
        'BROUGHT_LUNCH': '🥗',
    }
    return icons[type] || '🌱'
}
