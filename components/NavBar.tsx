"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Home, LayoutDashboard, Users, User, Calendar, BookOpen, Sparkles } from "lucide-react"

const navItems = [
    { href: "/", icon: Home, label: "HOME" },
    { href: "/dashboard", icon: LayoutDashboard, label: "LOG" },
    { href: "/refine", icon: Sparkles, label: "REFINE" },
    { href: "/guide", icon: BookOpen, label: "GUIDE" },
    { href: "/daily", icon: Calendar, label: "DAILY" },
    { href: "/community", icon: Users, label: "HUB" },
    { href: "/profile", icon: User, label: "ME" },
]

export function NavBar() {
    const pathname = usePathname()
    const [isVisible, setIsVisible] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            if (currentScrollY < 50) {
                setIsVisible(true)
            } else if (currentScrollY > lastScrollY) {
                setIsVisible(false)
            } else {
                setIsVisible(true)
            }
            setLastScrollY(currentScrollY)
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [lastScrollY])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
                >
                    <div className="flex items-center gap-0.5 p-1.5 bg-card paper-border">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-1 px-2 py-1.5 font-pixel text-[6px] uppercase tracking-wider
                                        transition-all duration-100
                                        ${isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-card-foreground hover:bg-primary/20"
                                        }
                                    `}
                                >
                                    <item.icon className="w-3 h-3" />
                                    <span className="hidden xl:inline">{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>
                </motion.nav>
            )}
        </AnimatePresence>
    )
}
