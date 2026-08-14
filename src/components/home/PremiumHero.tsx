'use client'

import { useState, useEffect } from 'react'
import TypingText from '@/components/TypingText'
import { ServiceTabs } from '@/components/home/ServiceTabs'
import WidgetRenderer from '@/components/WidgetRenderer'
import { Star } from 'lucide-react'
import Image from 'next/image'

interface PremiumHeroProps {
    images: string[]
    title: string
    titleSuffix?: string
    rotatingWords: string[]
    rotatingColor?: string
    rotatingBg?: boolean
    subtitle: string
    widgets?: {
        flights: string
        stays: string
        cars: string
        activities: string
    }
    widgetHtml?: string // For backward compatibility if needed
    trustedBadgeText?: string
    showTrustedBadge?: boolean
    trustedBadgeIconUrl?: string
    showServiceTabs?: boolean
    serviceTabsColor?: string
    tabsConfig?: {
        flights: { show: boolean, label: string, icon: string }
        stays: { show: boolean, label: string, icon: string }
        cars: { show: boolean, label: string, icon: string }
        activities: { show: boolean, label: string, icon: string }
    }
}

const colorMap: Record<string, string> = {
    red: 'text-red-600',
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-400',
    orange: 'text-orange-500',
    purple: 'text-purple-500',
    pink: 'text-pink-500',
    white: 'text-white',
    cyan: 'text-cyan-400'
}

export function PremiumHero({
    images,
    title,
    titleSuffix,
    rotatingWords,
    rotatingColor = 'red',
    rotatingBg = true,
    subtitle,
    widgets,
    widgetHtml,
    trustedBadgeText = "Trusted by 1 Million+ Travelers",
    showTrustedBadge = true,
    trustedBadgeIconUrl,
    showServiceTabs = true,
    serviceTabsColor = 'orange',
    tabsConfig
}: PremiumHeroProps) {
    const [currentBgIndex, setCurrentBgIndex] = useState(0)

    useEffect(() => {
        if (images.length <= 1) return
        const interval = setInterval(() => {
            setCurrentBgIndex(prev => (prev + 1) % images.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [images.length])

    const colorClass = colorMap[rotatingColor] || colorMap['red']
    const bgClasses = rotatingBg ? 'bg-white/10 backdrop-blur-sm border border-white/10' : ''

    // Fallback to widgetHtml if widgets object is missing
    const finalWidgets = widgets || {
        flights: widgetHtml || '',
        stays: '',
        cars: '',
        activities: ''
    }

    return (
        <section className="relative w-full overflow-hidden bg-neutral-900" style={{ minHeight: '100vh' }}>
            {/* Background Image Carousel */}
            <div className="absolute inset-0 z-0">
                {images.map((img, index) => (
                    <div
                        key={img}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Image
                            src={img}
                            alt={`Luxury travel destination background ${index + 1} - Flights, Hotels, and Car Rentals`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-48 pb-32 gap-8">

                {/* Trusted Badge */}
                {showTrustedBadge && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium shadow-lg">
                        {trustedBadgeIconUrl ? (
                            <Image src={trustedBadgeIconUrl} alt="Badge Icon" width={16} height={16} className="object-contain" />
                        ) : (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        )}
                        <span>{trustedBadgeText}</span>
                    </div>
                )}

                {/* Title + Subtitle */}
                <div className="text-center space-y-4 animate-in slide-in-from-bottom-5 duration-700 fade-in">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-heading text-white tracking-tighter leading-tight drop-shadow-2xl flex flex-wrap justify-center items-center gap-x-3 gap-y-2">
                        <span>{title}</span>
                        <TypingText
                            texts={rotatingWords}
                            className={`${colorClass} ${bgClasses} px-2 rounded-xl pb-1`}
                            typingSpeed={75}
                            deletingSpeed={40}
                            pauseAfterType={2000}
                            pauseAfterDelete={300}
                        />
                        {titleSuffix && <span>{titleSuffix}</span>}
                    </h1>
                    <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-md">
                        {subtitle}
                    </p>
                </div>

                <div className="w-full max-w-6xl animate-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-backwards z-20">
                    {showServiceTabs ? (
                        <ServiceTabs widgets={finalWidgets} config={{ color: serviceTabsColor, tabs: tabsConfig }} />
                    ) : (
                        <div className="bg-transparent p-2 sm:p-6">
                            <WidgetRenderer html={finalWidgets.flights} />
                        </div>
                    )}
                </div>

            </div>
        </section>
    )
}
