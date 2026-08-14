'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function ThemeCleanup() {
    const pathname = usePathname()

    useEffect(() => {
        // If we are NOT in admin section, force remove 'dark' class to ensure frontend is light
        if (!pathname?.startsWith('/admin')) {
            document.documentElement.classList.remove('dark')
            document.documentElement.style.colorScheme = 'light'
        }
    }, [pathname])

    return null
}
