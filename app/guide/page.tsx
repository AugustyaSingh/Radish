"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search } from "lucide-react"
import { NavBar } from "@/components/NavBar"
import { AIAssistant } from "@/components/AIAssistant"

// Waste material database
const MATERIALS = [
    {
        id: 'coffee-cup',
        name: 'COFFEE CUP',
        icon: '☕',
        type: 'HYBRID MATERIAL',
        disposal: 'Most coffee cups have a plastic lining. Separate lid (recyclable) from cup (landfill unless your campus has special recycling).',
        color: 'bg-[#c9b99a]'
    },
    {
        id: 'plastic-bottle',
        name: 'PLASTIC WATER BOTTLE',
        icon: '🧴',
        type: 'PET PLASTIC',
        disposal: 'Rinse and recycle. Remove cap and recycle separately. Crush to save space.',
        color: 'bg-[#b07a7a]'
    },
    {
        id: 'pizza-box',
        name: 'PIZZA BOX',
        icon: '🍕',
        type: 'CONTAMINATED FIBER',
        disposal: 'Greasy parts go to compost/landfill. Clean cardboard parts can be recycled.',
        color: 'bg-[#d4a5a5]'
    },
    {
        id: 'aluminum-can',
        name: 'ALUMINUM CAN',
        icon: '🥫',
        type: 'METAL',
        disposal: 'Rinse and recycle. Aluminum is infinitely recyclable!',
        color: 'bg-[#a8a8a8]'
    },
    {
        id: 'banana-peel',
        name: 'BANANA PEEL',
        icon: '🍌',
        type: 'ORGANIC',
        disposal: 'Compost! Great nitrogen source for soil.',
        color: 'bg-[#d4b896]'
    },
    {
        id: 'paper-napkin',
        name: 'PAPER NAPKIN',
        icon: '🧻',
        type: 'CONTAMINATED PAPER',
        disposal: 'Compost if available, otherwise landfill. Too contaminated to recycle.',
        color: 'bg-[#c9c9c9]'
    },
    {
        id: 'glass-bottle',
        name: 'GLASS BOTTLE',
        icon: '🍾',
        type: 'GLASS',
        disposal: 'Rinse and recycle. Keep separate from other recyclables.',
        color: 'bg-[#8aa89a]'
    },
    {
        id: 'chip-bag',
        name: 'CHIP BAG',
        icon: '🥔',
        type: 'MIXED PLASTIC',
        disposal: 'Landfill. The metallic lining makes it non-recyclable.',
        color: 'bg-[#7a9a8a]'
    },
]

export default function GuidePage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedItem, setSelectedItem] = useState<typeof MATERIALS[0] | null>(null)

    const filteredMaterials = MATERIALS.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background text-foreground pb-28 relative paper-bg">
            <div className="absolute top-0 left-0 w-8 h-full border-r-2 border-dashed border-secondary/30" />

            <div className="relative z-10 max-w-4xl mx-auto p-6 pt-24 ml-8 space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="header-box px-6 py-4"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🌱</span>
                        <div>
                            <h1 className="font-pixel text-sm highlight-text">DISPOSAL FIELD GUIDE</h1>
                            <p className="font-retro text-sm opacity-80">
                                A botanical index for waste. Identify your material and find its proper destination.
                                Not sure if something is recyclable, compostable, or landfill? Use the search below.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-background p-1 paper-border"
                >
                    <div className="flex items-center gap-3 p-3">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for an item (e.g., coffee cup, plastic bottle)..."
                            className="flex-1 font-retro text-lg bg-transparent outline-none"
                        />
                    </div>
                </motion.div>

                {/* Help Me Identify Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-full max-w-xs mx-auto block field-card py-3 px-6 font-pixel text-xs text-center"
                >
                    HELP ME IDENTIFY
                </motion.button>

                {/* Materials Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 gap-4"
                >
                    {filteredMaterials.map((material, i) => (
                        <motion.button
                            key={material.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            onClick={() => setSelectedItem(material)}
                            className="field-card p-4 flex items-center gap-4 text-left hover:bg-card/80 transition-all"
                        >
                            <span className="text-3xl">{material.icon}</span>
                            <div className="flex-1">
                                <h3 className="font-pixel text-[10px] highlight-text">{material.name}</h3>
                            </div>
                            <span className="font-pixel text-[7px] bg-background/20 px-2 py-1 rounded">
                                {material.type}
                            </span>
                        </motion.button>
                    ))}
                </motion.div>

                {/* Empty State */}
                {filteredMaterials.length === 0 && (
                    <div className="text-center py-8">
                        <p className="font-retro text-lg text-muted-foreground">
                            No materials found. Try a different search term.
                        </p>
                    </div>
                )}
            </div>

            {/* Material Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-md bg-background paper-border p-6"
                        >
                            <div className="text-center mb-4">
                                <span className="text-5xl block mb-4">{selectedItem.icon}</span>
                                <h3 className="font-pixel text-sm highlight-text">{selectedItem.name}</h3>
                                <span className="font-pixel text-[8px] bg-card text-card-foreground px-3 py-1 inline-block mt-2">
                                    {selectedItem.type}
                                </span>
                            </div>

                            <div className="bg-primary/20 p-4 paper-border-primary mb-4">
                                <p className="font-retro text-lg">{selectedItem.disposal}</p>
                            </div>

                            <button
                                onClick={() => setSelectedItem(null)}
                                className="w-full retro-btn"
                            >
                                CLOSE
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <NavBar />
            <AIAssistant />
        </div>
    )
}
