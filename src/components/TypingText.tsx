'use client'

import { useState, useEffect, useRef } from 'react'

interface TypingTextProps {
    texts: string[]
    className?: string
    typingSpeed?: number   // ms per character while typing
    deletingSpeed?: number // ms per character while deleting
    pauseAfterType?: number  // ms to wait after full word is typed
    pauseAfterDelete?: number // ms to wait after full word is deleted
}

export default function TypingText({
    texts,
    className = '',
    typingSpeed = 80,
    deletingSpeed = 45,
    pauseAfterType = 1800,
    pauseAfterDelete = 400,
}: TypingTextProps) {
    const [displayed, setDisplayed] = useState('')
    const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting' | 'waiting'>('typing')
    const [index, setIndex] = useState(0)
    const [showCursor, setShowCursor] = useState(true)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Cursor blink
    useEffect(() => {
        const blink = setInterval(() => setShowCursor(c => !c), 530)
        return () => clearInterval(blink)
    }, [])

    useEffect(() => {
        const current = texts[index] ?? ''

        if (phase === 'typing') {
            if (displayed.length < current.length) {
                timeoutRef.current = setTimeout(() => {
                    setDisplayed(current.slice(0, displayed.length + 1))
                }, typingSpeed)
            } else {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setPhase('pausing')
            }
        }

        if (phase === 'pausing') {
            timeoutRef.current = setTimeout(() => setPhase('deleting'), pauseAfterType)
        }

        if (phase === 'deleting') {
            if (displayed.length > 0) {
                timeoutRef.current = setTimeout(() => {
                    setDisplayed(prev => prev.slice(0, -1))
                }, deletingSpeed)
            } else {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setPhase('waiting')
            }
        }

        if (phase === 'waiting') {
            timeoutRef.current = setTimeout(() => {
                setIndex(i => (i + 1) % texts.length)
                setPhase('typing')
            }, pauseAfterDelete)
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
        }
    }, [displayed, phase, index, texts, typingSpeed, deletingSpeed, pauseAfterType, pauseAfterDelete])

    return (
        <span className={className}>
            {displayed}
            <span
                className="inline-block w-[3px] h-[1em] ml-0.5 align-middle rounded-sm"
                style={{
                    opacity: showCursor ? 1 : 0,
                    transition: 'opacity 0.1s',
                    backgroundColor: 'currentColor',
                    verticalAlign: 'middle',
                }}
            />
        </span>
    )
}
