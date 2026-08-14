'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TOCItem {
    id: string
    text: string
    level: number
}

export default function TableOfContents() {
    const [items, setItems] = useState<TOCItem[]>([])
    const [activeId, setActiveId] = useState<string>('')

    /* eslint-disable react-hooks/exhaustive-deps */
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        // Find all headings inside the article content
        const elements = Array.from(document.querySelectorAll('.article-content h2, .article-content h3'))

        const idCounts: Record<string, number> = {}

        // Add IDs if they don't exist and collect them
        const tempItems: TOCItem[] = elements.map((elem) => {
            if (!elem.id) {
                // generate an id from text
                const baseId = elem.textContent
                    ?.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '') || 'heading'

                // Ensure unique ID
                if (idCounts[baseId] !== undefined) {
                    idCounts[baseId]++
                    elem.id = `${baseId}-${idCounts[baseId]}`
                } else {
                    idCounts[baseId] = 0
                    elem.id = baseId
                }
            } else {
                idCounts[elem.id] = 0
            }

            return {
                id: elem.id,
                text: elem.textContent || '',
                level: Number(elem.tagName.charAt(1))
            }
        })

        setItems(tempItems)

        // Intersection Observer for scroll spy
        const observer = new IntersectionObserver(
            (entries) => {
                // Determine if any heading is intersecting
                const intersecting = entries.find(e => e.isIntersecting)
                if (intersecting) {
                    setActiveId(intersecting.target.id)
                }
            },
            { rootMargin: '-20% 0px -80% 0px' } // Trigger when heading is near the top
        )

        elements.forEach((elem) => observer.observe(elem))

        return () => observer.disconnect()
    }, [])

    if (items.length === 0) return null

    return (
        <div className="bg-muted/30 rounded-xl p-6 border border-border">
            <h3 className="font-heading font-bold text-lg mb-4 text-foreground">Table of Contents</h3>
            <nav className="flex flex-col gap-2.5">
                {items.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                            e.preventDefault()
                            document.querySelector(`#${item.id}`)?.scrollIntoView({
                                behavior: 'smooth'
                            })
                        }}
                        className={cn(
                            "text-sm transition-colors hover:text-primary line-clamp-2",
                            item.level === 3 ? "pl-4" : "font-medium",
                            activeId === item.id
                                ? "text-primary font-bold"
                                : "text-muted-foreground"
                        )}
                    >
                        {item.text}
                    </a>
                ))}
            </nav>
        </div>
    )
}
