"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Clock, Leaf, Droplets, Zap, Wind } from "lucide-react"

// Floating particle component
function FloatingParticle({ delay, x, y, icon }: { delay: number; x: number; y: number; icon: string }) {
    return (
        <motion.div
            className="absolute text-2xl opacity-40 pointer-events-none"
            initial={{ x: `${x}%`, y: `${y}%`, opacity: 0, scale: 0 }}
            animate={{
                x: [`${x}%`, `${x + 10}%`, `${x - 5}%`, `${x}%`],
                y: [`${y}%`, `${y - 15}%`, `${y - 5}%`, `${y}%`],
                opacity: [0, 0.6, 0.4, 0],
                scale: [0, 1, 1.2, 0],
            }}
            transition={{
                duration: 8,
                delay,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            {icon}
        </motion.div>
    )
}

// Animated counter
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const duration = 2000
        const steps = 60
        const increment = target / steps
        let current = 0

        const timer = setInterval(() => {
            current += increment
            if (current >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(current))
            }
        }, duration / steps)

        return () => clearInterval(timer)
    }, [target])

    return <span>{count.toLocaleString()}{suffix}</span>
}

export default function WelcomePage() {
    const [mounted, setMounted] = useState(false)
    const [reminderTime, setReminderTime] = useState("09:00")
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })

    useEffect(() => {
        setMounted(true)

        const handleMouseMove = (e: MouseEvent) => {
            setCursorPos({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-[#9ba3a8] text-foreground overflow-hidden relative">
            {/* Animated Background Gradient */}
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                    background: [
                        'radial-gradient(circle at 20% 20%, #8B9467 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 80%, #8B9467 0%, transparent 50%)',
                        'radial-gradient(circle at 50% 50%, #8B9467 0%, transparent 50%)',
                        'radial-gradient(circle at 20% 20%, #8B9467 0%, transparent 50%)',
                    ]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating Particles */}
            <FloatingParticle delay={0} x={10} y={20} icon="🌱" />
            <FloatingParticle delay={1} x={80} y={15} icon="🍃" />
            <FloatingParticle delay={2} x={25} y={70} icon="💧" />
            <FloatingParticle delay={3} x={70} y={60} icon="🌿" />
            <FloatingParticle delay={4} x={50} y={30} icon="♻️" />
            <FloatingParticle delay={5} x={15} y={50} icon="🌍" />
            <FloatingParticle delay={6} x={85} y={40} icon="⚡" />
            <FloatingParticle delay={7} x={40} y={80} icon="🌸" />

            {/* Mouse Follow Glow */}
            <motion.div
                className="fixed w-64 h-64 rounded-full pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(circle, rgba(139,148,103,0.15) 0%, transparent 70%)',
                    left: cursorPos.x - 128,
                    top: cursorPos.y - 128,
                }}
            />

            {/* Decorative corner leaves */}
            <motion.div
                initial={{ rotate: -20, opacity: 0 }}
                animate={{ rotate: 0, opacity: 0.6 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute top-4 right-4 text-3xl"
            >
                🌿
            </motion.div>
            <motion.div
                initial={{ rotate: 20, opacity: 0 }}
                animate={{ rotate: 0, opacity: 0.6 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="absolute bottom-4 left-4 text-3xl"
            >
                🍃
            </motion.div>

            {/* Main Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">

                {/* Animated Logo */}
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className="mb-6 cursor-pointer"
                >
                    <motion.div
                        className="bg-[#f5f0e6] px-10 py-5 border-4 border-foreground shadow-[6px_6px_0_0_#333]"
                        whileHover={{ boxShadow: "8px 8px 0 0 #333" }}
                    >
                        <motion.h1
                            className="font-pixel text-4xl md:text-5xl text-[#c65d5d]"
                            animate={{
                                textShadow: [
                                    "2px 2px 0 #8B4513",
                                    "3px 3px 0 #8B4513",
                                    "2px 2px 0 #8B4513",
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            RADISH
                        </motion.h1>
                    </motion.div>
                </motion.div>

                {/* Tagline with typing effect */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-retro text-2xl italic text-foreground/80 mb-8"
                >
                    Mindful Campus Living
                </motion.p>

                {/* Live Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex gap-6 mb-10"
                >
                    {[
                        { icon: <Leaf className="w-5 h-5" />, value: 12450, label: "Actions Today" },
                        { icon: <Droplets className="w-5 h-5" />, value: 340, label: "L Water Saved" },
                        { icon: <Wind className="w-5 h-5" />, value: 89, label: "kg CO2 Reduced" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="text-center"
                        >
                            <div className="flex items-center justify-center gap-2 text-foreground/60 mb-1">
                                {stat.icon}
                            </div>
                            <p className="font-pixel text-lg text-foreground">
                                <AnimatedCounter target={stat.value} />
                            </p>
                            <p className="font-retro text-xs text-foreground/60">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Daily Intention Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    whileHover={{ y: -5 }}
                    className="bg-[#f5f0e6] p-6 w-full max-w-md shadow-lg mb-8"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <motion.span
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-lg"
                        >
                            ✝
                        </motion.span>
                        <h2 className="font-pixel text-xs tracking-wider">DAILY INTENTION SETTING</h2>
                    </div>
                    <p className="font-retro text-sm text-muted-foreground mb-4">
                        Set a gentle reminder to reflect on today's activities.
                    </p>

                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 bg-background px-4 py-3 border border-border flex-1">
                            <input
                                type="time"
                                value={reminderTime}
                                onChange={(e) => setReminderTime(e.target.value)}
                                className="font-retro text-lg bg-transparent outline-none w-full"
                            />
                            <Clock className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-secondary text-secondary-foreground px-6 py-3 font-pixel text-[10px]"
                        >
                            SET REMINDER
                        </motion.button>
                    </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="flex gap-4 flex-wrap justify-center"
                >
                    <Link href="/dashboard">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "6px 6px 0 0 rgba(139,148,103,0.8)" }}
                            whileTap={{ scale: 0.95 }}
                            className="retro-btn-filled text-base px-10 py-4"
                        >
                            ▶ START LOGGING
                        </motion.button>
                    </Link>
                    <Link href="/guide">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="retro-btn text-base px-8 py-4"
                        >
                            📖 FIELD GUIDE
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Quick Links - Animated */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-10 flex gap-6 flex-wrap justify-center"
                >
                    {[
                        { href: "/daily", label: "Today's Summary", icon: "📊" },
                        { href: "/community", label: "Community Board", icon: "🤝" },
                        { href: "/profile", label: "My Profile", icon: "👤" },
                    ].map((link, i) => (
                        <motion.div
                            key={link.href}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.3 + i * 0.1 }}
                        >
                            <Link
                                href={link.href}
                                className="flex items-center gap-2 font-retro text-sm text-foreground/70 hover:text-foreground transition-colors"
                            >
                                <motion.span
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                >
                                    {link.icon}
                                </motion.span>
                                {link.label}
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
