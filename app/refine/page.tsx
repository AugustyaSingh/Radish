"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Check, Leaf } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { AIAssistant } from "@/components/AIAssistant"
import { refineTasks } from "@/app/actions"

interface RefinedTask {
    originalTask: string
    alternative: string
    explanation: string
}

export default function RefinementPage() {
    const [inputText, setInputText] = useState('')
    const [refinedTasks, setRefinedTasks] = useState<RefinedTask[]>([])
    const [loading, setLoading] = useState(false)
    const [accepted, setAccepted] = useState(false)

    const today = new Date()
    const formattedDate = today.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).toUpperCase()

    const handleRefine = async () => {
        if (!inputText.trim()) return

        setLoading(true)
        setAccepted(false)

        try {
            // Split input into tasks
            const tasks = inputText
                .split('\n')
                .map(t => t.replace(/^[-•*]\s*/, '').trim())
                .filter(t => t.length > 0)

            const refined = await refineTasks(tasks)
            setRefinedTasks(refined)
        } catch (error) {
            console.error('Failed to refine tasks:', error)
        }

        setLoading(false)
    }

    const handleAccept = () => {
        setAccepted(true)
        // Could save to local storage or database here
    }

    return (
        <div className="min-h-screen bg-background text-foreground pb-28 relative paper-bg">
            <div className="absolute top-0 left-0 w-8 h-full border-r-2 border-dashed border-secondary/30" />

            <div className="relative z-10 max-w-3xl mx-auto p-6 pt-24 ml-8 space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="header-box px-6 py-4"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🌱</span>
                        <div>
                            <h1 className="font-pixel text-sm highlight-text">DAILY REFINEMENT</h1>
                            <p className="font-retro text-lg opacity-80">{formattedDate}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Input Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    <p className="font-retro text-lg">
                        What do you intend to accomplish today?
                    </p>

                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={`Example:\n- Print lab report\n- Get lunch\n- Buy new pens\n- Research in library`}
                        rows={6}
                        className="w-full p-4 paper-input font-retro text-lg resize-none"
                    />

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRefine}
                        disabled={loading || !inputText.trim()}
                        className="retro-btn-filled flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin">⚙️</span>
                                ANALYZING...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                REFINE MY INTENTIONS
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Refined Tasks Section */}
                <AnimatePresence>
                    {refinedTasks.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="bg-background p-6 border-2 border-foreground shadow-[4px_4px_0_0_#333]">
                                {refinedTasks.map((task, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`py-4 ${i > 0 ? 'border-t border-muted-foreground/30' : ''}`}
                                    >
                                        <div className="flex gap-4">
                                            {/* Original Task */}
                                            <div className="flex items-start gap-2 min-w-[150px]">
                                                <span className="text-muted-foreground">✝</span>
                                                <span className={`font-retro text-lg ${accepted ? 'line-through text-muted-foreground' : 'text-secondary'}`}>
                                                    {task.originalTask}
                                                </span>
                                            </div>

                                            {/* Alternative */}
                                            <div className="flex-1">
                                                <p className="font-retro text-lg mb-2">
                                                    {task.alternative}
                                                </p>
                                                <p className="font-retro text-sm italic text-muted-foreground border-l-2 border-primary pl-3">
                                                    {task.explanation}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Accept Button */}
                            {!accepted ? (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleAccept}
                                    className="field-card py-3 px-6 font-pixel text-xs text-center w-full flex items-center justify-center gap-2"
                                >
                                    <Leaf className="w-4 h-4" />
                                    ACCEPT THESE INTENTIONS
                                </motion.button>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-accent/20 p-4 text-center paper-border-primary"
                                >
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Check className="w-5 h-5 text-accent" />
                                        <span className="font-pixel text-sm text-accent">INTENTIONS ACCEPTED!</span>
                                    </div>
                                    <p className="font-retro text-lg">
                                        Great choices! You're ready for a sustainable day. 🌿
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <NavBar />
            <AIAssistant />
        </div>
    )
}
