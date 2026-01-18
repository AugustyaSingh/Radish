"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, RefreshCw } from "lucide-react"
import { getAITip, getAIFact, getAIMission } from "@/app/actions"

type InsightType = 'TIP' | 'FACT' | 'MISSION'

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [insight, setInsight] = useState<string>("")
    const [insightType, setInsightType] = useState<InsightType>('TIP')
    const [loading, setLoading] = useState(false)

    const fetchInsight = async (type: InsightType) => {
        setLoading(true)
        setInsightType(type)
        try {
            let result: string
            switch (type) {
                case 'FACT':
                    result = await getAIFact()
                    break
                case 'MISSION':
                    result = await getAIMission()
                    break
                default:
                    result = await getAITip()
            }
            setInsight(result)
        } catch {
            setInsight("🌱 Every small action counts! Keep up the great work!")
        }
        setLoading(false)
    }

    useEffect(() => {
        if (isOpen && !insight) {
            fetchInsight('TIP')
        }
    }, [isOpen, insight])

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary paper-border-primary flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="text-2xl">📜</span>
            </motion.button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-background paper-border p-6"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🌱</span>
                                    <div>
                                        <h3 className="font-pixel text-sm text-foreground">RADISH GUIDE</h3>
                                        <p className="font-retro text-lg text-muted-foreground">Your eco companion</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Type Selector */}
                            <div className="flex gap-2 mb-4">
                                {(['TIP', 'FACT', 'MISSION'] as InsightType[]).map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => fetchInsight(type)}
                                        className={`flex-1 py-2 px-3 font-pixel text-[8px] paper-border transition-all ${insightType === type
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground hover:bg-primary/20'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Insight Content */}
                            <div className="min-h-[120px] bg-primary/20 p-4 mb-4 paper-border-primary">
                                <AnimatePresence mode="wait">
                                    {loading ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center justify-center h-full"
                                        >
                                            <span className="font-pixel text-xs text-muted-foreground blink">LOADING...</span>
                                        </motion.div>
                                    ) : (
                                        <motion.p
                                            key={insight}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="font-retro text-xl text-foreground leading-relaxed"
                                        >
                                            {insight}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={() => fetchInsight(insightType)}
                                disabled={loading}
                                className="w-full retro-btn-filled flex items-center justify-center gap-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                GET ANOTHER
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
