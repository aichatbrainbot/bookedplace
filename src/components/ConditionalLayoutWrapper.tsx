'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ReactNode } from 'react'

interface ConditionalLayoutWrapperProps {
    children: ReactNode
    siteTitle: string
    logoUrl?: string
    footerLogoUrl?: string
    footerDesc?: string
    facebook?: string
    instagram?: string
    twitter?: string
}

export default function ConditionalLayoutWrapper({
    children, siteTitle, logoUrl, footerLogoUrl, footerDesc, facebook, instagram, twitter
}: ConditionalLayoutWrapperProps) {
    const pathname = usePathname()

    // If the path is /p/* and it acts as a "Full Page", we might still need a way to pass this info from the server. 
    // Wait, the client doesn't know what is in the DB. This means we can't reliably hide the header/footer from just the client.

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar title={siteTitle} logoUrl={logoUrl} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer
                title={siteTitle}
                logoUrl={footerLogoUrl || logoUrl}
                description={footerDesc}
                socials={{ facebook, instagram, twitter }}
            />
        </div>
    )
}
