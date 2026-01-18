"use client"

import { useState } from "react"
import { RadishMascot, MascotMood } from "@/components/radish-mascot"
import confetti from "canvas-confetti"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Leaf, Droplets, Recycle, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Home() {
    const [mascotMood, setMascotMood] = useState<MascotMood>("idle")
    const [xp, setXp] = useState(1250)
    const [level, setLevel] = useState(5)
    const [streak, setStreak] = useState(12)
    const [showConfetti, setShowConfetti] = useState(false)

    const maxXp = 2000

    const handleAction = (type: string) => {
        // Interactive Fun Logic
        setMascotMood("happy")
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4ade80', '#22c55e', '#ffffff'] // Green theme
        })

        // Simulate XP gain
        setXp(prev => Math.min(prev + 150, maxXp))

        // Reset mood after 2s
        setTimeout(() => setMascotMood("idle"), 3000)
    }

    const handleBadSelect = () => {
        setMascotMood("sad")
        setTimeout(() => setMascotMood("idle"), 2000)
    }

    return (
        <main className="max-w-md mx-auto min-h-screen bg-gradient-to-b from-green-50 to-stone-100 pb-20 overflow-hidden relative">

            {/* Header / Stats Bar */}
            <div className="p-6 pt-12 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10 border-b border-green-100">
                <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                        <Trophy className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg font-space leading-tight">Level {level}</h2>
                        <p className="text-xs text-stone-500">Seedling Scout</p>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-orange-500 font-bold">
                        <Zap className="w-4 h-4 fill-orange-500" />
                        <span>{streak} Day Streak!</span>
                    </div>
                    <div className="text-xs text-stone-400">Next reward: 3 days</div>
                </div>
            </div>

            {/* XP Bar */}
            <div className="h-2 w-full bg-stone-200">
                <motion.div
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(xp / maxXp) * 100}%` }}
                    transition={{ type: "spring", stiffness: 50 }}
                />
            </div>

            {/* Mascot Area */}
            <section className="mt-8 flex flex-col items-center justify-center relative min-h-[250px]">
                {/* Helper Bubble */}
                <AnimatePresence>
                    {mascotMood === "idle" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="absolute top-0 right-10 bg-white p-3 rounded-2xl rounded-bl-none shadow-lg border border-stone-100 max-w-[150px]"
                        >
                            <p className="text-sm font-medium text-stone-700">Hey! Did you recycle that bottle?</p>
                        </motion.div>
                    )}
                    {mascotMood === "happy" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="absolute top-0 right-10 bg-green-500 text-white p-3 rounded-2xl rounded-bl-none shadow-lg max-w-[150px]"
                        >
                            <p className="text-sm font-bold">Nature loves you! +150 XP</p>
                        </motion.div>
                    )}
                    {mascotMood === "sad" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="absolute top-0 right-10 bg-red-100 text-red-800 p-3 rounded-2xl rounded-bl-none shadow-lg max-w-[150px]"
                        >
                            <p className="text-sm font-bold">Oh no! Plastic bags jam the machine!</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div onClick={() => setMascotMood("dancing")} className="cursor-pointer hover:scale-105 transition-transform">
                    <RadishMascot mood={mascotMood} />
                </div>
            </section>

            {/* Quick Actions Grid */}
            <section className="px-6 mt-4">
                <h3 className="font-space font-bold text-xl mb-4 text-stone-800">Quick Log</h3>
                <div className="grid grid-cols-2 gap-3">
                    <ActionButton
                        icon={<Recycle className="w-6 h-6" />}
                        label="Recycled Plastic"
                        color="bg-blue-100 text-blue-700 hover:bg-blue-200"
                        onClick={() => handleAction('recycle')}
                    />
                    <ActionButton
                        icon={<Leaf className="w-6 h-6" />}
                        label="Composted Food"
                        color="bg-green-100 text-green-700 hover:bg-green-200"
                        onClick={() => handleAction('compost')}
                    />
                    <ActionButton
                        icon={<Droplets className="w-6 h-6" />}
                        label="Refilled Bottle"
                        color="bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                        onClick={() => handleAction('refill')}
                    />
                    <ActionButton
                        icon={<div className="text-xl">🛍️</div>}
                        label="Used Reusable Bag"
                        color="bg-purple-100 text-purple-700 hover:bg-purple-200"
                        onClick={() => handleAction('bag')}
                    />
                </div>
            </section>

            {/* Disposal Search Button */}
            <section className="px-6 mt-8">
                <div className="bg-stone-900 rounded-2xl p-6 text-white text-center shadow-xl cursor-not-allowed opacity-80">
                    <h3 className="font-space font-bold text-lg mb-2">Not sure where it goes?</h3>
                    <p className="text-stone-400 text-sm mb-4">Search 500+ items in our database</p>
                    <div className="bg-stone-800 p-3 rounded-xl flex items-center justify-center gap-2">
                        <span>🔍</span> <span className="text-stone-500">Search "Pizza Box"...</span>
                    </div>
                </div>
            </section>

        </main>
    )
}

function ActionButton({ icon, label, color, onClick }: any) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={cn("p-4 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm border border-transparent transition-colors", color)}
        >
            {icon}
            <span className="font-bold text-sm">{label}</span>
        </motion.button>
    )
}
