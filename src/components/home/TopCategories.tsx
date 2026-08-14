'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

interface CategoryCard {
    title: string
    description: string
    imageUrl: string
    badge?: string
}

interface TopCategoriesProps {
    title: string
    categories: CategoryCard[]
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
}

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const
        }
    }
}

export function TopCategories({ title, categories }: TopCategoriesProps) {
    if (!categories || categories.length === 0) return null

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50/50 dark:bg-neutral-900/20">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Section Title */}
                <h2 className="text-3xl md:text-4xl font-bold font-heading text-neutral-900 dark:text-white">
                    {title || "Pour les pros du voyage"}
                </h2>

                {/* Grid of Cards */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {categories.map((cat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white dark:bg-neutral-900 rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-neutral-100 dark:border-neutral-800 flex flex-col h-full min-h-[380px] group cursor-pointer"
                        >
                            {/* Card Content Top */}
                            <div className="p-8 pb-0 space-y-3 z-10">
                                <h3 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white leading-tight flex items-center gap-2 flex-wrap">
                                    {cat.title}
                                    {cat.badge && (
                                        <Badge variant="secondary" className="bg-neutral-800 text-white hover:bg-neutral-700 text-[10px] rounded-sm px-1.5 py-0 uppercase tracking-wide">
                                            {cat.badge}
                                        </Badge>
                                    )}
                                </h3>
                                <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                                    {cat.description}
                                </p>
                            </div>

                            {/* Card Image Bottom */}
                            <div className="mt-auto relative w-full h-[220px] pt-8 overflow-hidden">
                                {cat.imageUrl && cat.imageUrl.trim().length > 0 ? (
                                    <Image
                                        src={cat.imageUrl.trim()}
                                        alt={cat.title}
                                        fill
                                        className="object-contain object-bottom group-hover:scale-105 transition-transform duration-500 will-change-transform"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center m-8 rounded-xl rounded-b-none">
                                        <span className="text-neutral-400 text-sm">Image Placement</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
