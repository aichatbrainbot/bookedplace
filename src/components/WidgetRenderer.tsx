'use client'

import { useEffect, useRef } from 'react'

export default function WidgetRenderer({ html }: { html: string }) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!html || !containerRef.current) return

        // 1. Clear previous content safely
        const container = containerRef.current
        container.innerHTML = ''

        // 2. Create a temporary container to parse the HTML string
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = html

        // 3. Extract scripts and non-script content
        const scripts: HTMLScriptElement[] = []
        const nodes = Array.from(tempDiv.childNodes)

        nodes.forEach((node) => {
            if (node.nodeName === 'SCRIPT') {
                // Clone the script element to make it executable
                const originalScript = node as HTMLScriptElement
                const newScript = document.createElement('script')

                // Copy all attributes
                Array.from(originalScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value)
                })

                // Copy content if inline
                if (originalScript.innerHTML) {
                    newScript.innerHTML = originalScript.innerHTML
                }

                scripts.push(newScript)
            } else {
                // Move non-script nodes to the real container
                container.appendChild(node.cloneNode(true))
            }
        })

        // 4. Append and execute scripts *after* the HTML content is in place
        // This is crucial for widgets that look for their containers immediately
        scripts.forEach((script) => {
            container.appendChild(script)
        })

        // Cleanup function
        return () => {
            if (container) {
                container.innerHTML = ''
            }
        }
    }, [html])

    if (!html) return null

    return (
        <div
            ref={containerRef}
            className="w-full relative z-20 min-h-[100px]"
        // Ensure no overflow hiding here either
        />
    )
}
