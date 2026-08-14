'use client'

import { useState, useEffect } from 'react'

export default function ReadingProgressBar() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const updateProgress = () => {
            const currentScrollY = window.scrollY
            const maxScroll = document.body.scrollHeight - window.innerHeight

            if (maxScroll > 0) {
                setProgress(Math.min((currentScrollY / maxScroll) * 100, 100))
            } else {
                setProgress(0)
            }
        }

        window.addEventListener('scroll', updateProgress, { passive: true })
        // Initial call
        updateProgress()

        return () => window.removeEventListener('scroll', updateProgress)
    }, [])

    return (
        <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-transparent">
            <div
                className="h-full bg-primary transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}
