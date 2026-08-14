'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

export interface FAQItem {
    question: string
    answer: string
}

interface FAQSectionProps {
    title: string
    faqs: FAQItem[]
}

export function FAQSection({ title, faqs }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    if (!faqs || faqs.length === 0) return null

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-[#0a0a0a]">
            <div className="max-w-3xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-neutral-900 dark:text-white">
                        {title || 'Frequently Asked Questions'}
                    </h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index

                        return (
                            <motion.div
                                key={index}
                                initial={false}
                                className={`border ${isOpen ? 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm' : 'border-neutral-200 dark:border-neutral-800 bg-transparent hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50'} rounded-2xl overflow-hidden transition-colors duration-300`}
                            >
                                <button
                                    onClick={() => toggleQuestion(index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <span className="text-lg font-semibold text-neutral-900 dark:text-white pr-8">
                                        {faq.question}
                                    </span>
                                    <div className={`p-2 rounded-full flex items-center justify-center transition-colors duration-300 ${isOpen ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'}`}>
                                        {isOpen ? (
                                            <Minus className="w-5 h-5" />
                                        ) : (
                                            <Plus className="w-5 h-5" />
                                        )}
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="p-6 pt-0 text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
