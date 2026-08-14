'use client'

import { useState, useEffect } from 'react'
import { Plane, Bed, Car, Compass } from 'lucide-react'
import WidgetRenderer from '@/components/WidgetRenderer'
import Image from 'next/image'

interface ServiceTabsProps {
    widgets: {
        flights: string
        stays: string
        cars: string
        activities: string
    }
    config?: {
        color: string
        tabs?: {
            flights: { show: boolean, label: string, icon: string }
            stays: { show: boolean, label: string, icon: string }
            cars: { show: boolean, label: string, icon: string }
            activities: { show: boolean, label: string, icon: string }
        }
    }
}

type TabKey = 'flights' | 'stays' | 'cars' | 'activities'

export function ServiceTabs({ widgets, config }: ServiceTabsProps) {
    // We map out the predefined colors for Tailwind gradients
    const activeColorClasses: Record<string, string> = {
        'red': 'from-red-500 to-rose-600 shadow-red-500/30',
        'orange': 'from-orange-500 to-red-600 shadow-orange-500/30',
        'blue': 'from-blue-500 to-cyan-600 shadow-blue-500/30',
        'green': 'from-emerald-500 to-teal-600 shadow-emerald-500/30',
        'yellow': 'from-amber-400 to-orange-500 shadow-amber-500/30',
        'purple': 'from-purple-500 to-fuchsia-600 shadow-purple-500/30',
        'pink': 'from-pink-500 to-rose-500 shadow-pink-500/30',
    }

    const themeColor = config?.color || 'orange'
    const colorClass = activeColorClasses[themeColor] || activeColorClasses['orange']

    const baseTabs: { id: TabKey; label: string; icon: React.ReactNode }[] = [
        { id: 'flights', label: 'Flights', icon: <Plane className="w-6 h-6" /> },
        { id: 'stays', label: 'Stays', icon: <Bed className="w-6 h-6" /> },
        { id: 'cars', label: 'Cars', icon: <Car className="w-6 h-6" /> },
        { id: 'activities', label: 'Activities', icon: <Compass className="w-6 h-6" /> },
    ]

    // Construct the final list of tabs based on CMS overrides
    const tabs = baseTabs.map(tab => {
        const tabConfig = config?.tabs?.[tab.id]
        if (!tabConfig) return { ...tab, show: true }

        return {
            ...tab,
            label: tabConfig.label || tab.label,
            show: tabConfig.show !== false, // Default to true if undefined
            // If custom icon URL exists, render img, else keep default SVG
            icon: tabConfig.icon ? <Image src={tabConfig.icon} alt={tabConfig.label || tab.label} width={28} height={28} className="object-contain drop-shadow" /> : tab.icon
        }
    }).filter(tab => tab.show)

    const [selectedTab, setSelectedTab] = useState<TabKey | null>(null)

    // On mount, check if there's a tab in the URL
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const tabParam = params.get('tab') as TabKey | null
            if (tabParam && tabs.some(t => t.id === tabParam)) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setSelectedTab(tabParam)
            }
        }
    }, [tabs])

    const handleTabClick = (tabId: TabKey) => {
        setSelectedTab(tabId)
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href)
            url.searchParams.set('tab', tabId)
            window.history.pushState({}, '', url.toString())
        }
    }

    // Dynamically derive the active tab so if the selected one is disabled/hidden, we fallback to the first visible.
    const activeTab = (selectedTab && tabs.some(t => t.id === selectedTab))
        ? selectedTab
        : (tabs.length > 0 ? tabs[0].id : null)

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6 animate-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-backwards z-20">
            {/* Tabs Row */}
            <div className="flex items-center gap-4 px-4 overflow-x-auto pb-2 -mb-2 hide-scrollbar w-full sm:w-auto justify-start sm:justify-center">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => handleTabClick(tab.id)}
                            className="flex flex-col items-center gap-2 group transition-all duration-300 min-w-[70px]"
                        >
                            <div
                                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md
                                ${isActive
                                        ? `bg-gradient-to-br ${colorClass} text-white scale-105`
                                        : 'bg-white text-neutral-800 hover:bg-neutral-50 group-hover:scale-105'}
                                `}
                            >
                                {tab.icon}
                            </div>
                            <span className={`text-sm sm:text-base font-medium transition-colors ${isActive ? 'text-white drop-shadow-md' : 'text-white/70 group-hover:text-white'}`}>
                                {tab.label}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Widget Container */}
            <div className="w-full bg-transparent p-2 sm:p-6 min-h-[150px]">
                {/* 
                    If the current tab has a widget configured in CMS, render it. 
                    Otherwise, show a placeholder or nothing. 
                */}
                {activeTab && widgets[activeTab] ? (
                    <WidgetRenderer html={widgets[activeTab]} />
                ) : (
                    <div className="w-full max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
                        <p className="text-white/80">
                            No widget configured for {activeTab ? tabs.find(t => t.id === activeTab)?.label : 'this section'} yet.<br />
                            <span className="text-sm opacity-70">Add the widget code in the Admin Panel.</span>
                        </p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}
