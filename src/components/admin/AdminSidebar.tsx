'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Settings, Search, Home, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

export const menuGroups = [
    {
        title: "Overview",
        items: [
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
        ]
    },
    {
        title: "Management",
        items: [
            { id: 'messages', label: 'Messages', icon: Mail, href: '/admin/messages' },
            { id: 'stays', label: 'Stays', icon: Home, href: '/admin/stays' },
            { id: 'blogs', label: 'Blog Posts', icon: FileText, href: '/admin/cms/blog' },
            { id: 'pages', label: 'Pages', icon: LayoutDashboard, href: '/admin/cms' },
            // Future additions
            // { id: 'activities', label: 'Activities', icon: Calendar, href: '/admin/activities' },
            // { id: 'flights', label: 'Flights', icon: Plane, href: '/admin/flights' },
        ]
    },
    {
        title: "System",
        items: [
            { id: 'seo', label: 'SEO Center', icon: Search, href: '/admin/seo', adminOnly: true },
            { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings', adminOnly: true },
        ]
    }
]

export default function AdminSidebar({ className }: { className?: string }) {
    const pathname = usePathname()

    return (
        <aside className={cn("hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 bg-background border-r border-border z-40 transition-all duration-300", className)}>
            {/* Brand Section */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-border/50">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">B</span>
                </div>
                <span className="text-lg font-bold tracking-tight text-foreground">Booked.Place</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
                {menuGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-2">
                        <h4 className="px-3 text-xs font-semibold text-muted-foreground/60 uppercase tracking-widest">
                            {group.title}
                        </h4>
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = item.href === '/admin'
                                    ? pathname === '/admin'
                                    : pathname.startsWith(item.href)

                                return (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group relative",
                                            isActive
                                                ? "bg-primary/5 text-primary font-semibold"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <item.icon size={18} className={cn("transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                        {item.label}
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-border/50 bg-muted/5">
                <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold shadow-sm text-xs">
                        AD
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium text-foreground truncate">Admin Profile</span>
                        <span className="text-xs text-muted-foreground truncate">admin@booked.place</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
