"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export type MascotMood = "idle" | "happy" | "sad" | "dancing"

export function RadishMascot({ mood = "idle" }: { mood?: MascotMood }) {
    const [currentMood, setCurrentMood] = useState(mood)

    useEffect(() => {
        setCurrentMood(mood)
    }, [mood])

    const variants = {
        idle: {
            y: [0, -10, 0],
            rotate: [0, 2, -2, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        },
        happy: {
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
            transition: {
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse" as const
            }
        },
        sad: {
            y: 0,
            rotate: [0, -5, 0],
            scale: 0.95,
            transition: {
                duration: 2,
                repeat: Infinity
            }
        },
        dancing: {
            y: [0, -15, 0],
            rotate: [0, 360],
            transition: {
                duration: 1,
                repeat: Infinity,
                ease: "linear"
            }
        }
    }

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <motion.svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-2xl"
                animate={currentMood}
                variants={variants}
            >
                {/* Leaves */}
                <motion.path
                    d="M100 50 C 70 20, 50 40, 60 70 M100 50 C 130 20, 150 40, 140 70 M100 50 C 100 10, 100 10, 100 40"
                    fill="none"
                    stroke="#4ade80"
                    strokeWidth="12"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                />

                {/* Body */}
                <path
                    d="M60 70 Q 100 200, 140 70 Q 140 50, 100 50 Q 60 50, 60 70"
                    fill="#f87171" // Red-400
                    stroke="#ef4444" // Red-500
                    strokeWidth="4"
                />

                {/* Eyes */}
                <circle cx="85" cy="85" r="8" fill="white" />
                <circle cx="115" cy="85" r="8" fill="white" />
                <circle cx="87" cy="85" r="3" fill="black" />
                <circle cx="113" cy="85" r="3" fill="black" />

                {/* Mouth */}
                {currentMood === "happy" && (
                    <path d="M85 110 Q 100 130, 115 110" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                )}
                {currentMood === "sad" && (
                    <path d="M85 120 Q 100 100, 115 120" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
                )}
                {(currentMood === "idle" || currentMood === "dancing") && (
                    <circle cx="100" cy="110" r="4" fill="black" />
                )}

                {/* Cheeks */}
                <circle cx="75" cy="100" r="5" fill="#fca5a5" opacity="0.6" />
                <circle cx="125" cy="100" r="5" fill="#fca5a5" opacity="0.6" />

            </motion.svg>
        </div>
    )
}
