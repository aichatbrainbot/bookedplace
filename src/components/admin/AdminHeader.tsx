'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Bell, Search, ChevronRight, User, Menu } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { logout } from '@/features/auth/actions'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from '@/components/mode-toggle'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { menuGroups } from './AdminSidebar'
import { cn } from '@/lib/utils'

export default function AdminHeader() {
    const pathname = usePathname()

    // Generate breadcrumbs from pathname
    const segments = pathname?.split('/').filter(Boolean) || []

    // Helper to format segment names
    const formatSegment = (segment: string) => {
        return segment
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase())
    }

    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 sm:px-6 shadow-sm">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex items-center gap-2 lg:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 p-0 flex flex-col bg-background">
                            <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
                            <div className="h-16 flex items-center gap-3 px-6 border-b border-border/50">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <span className="text-primary font-bold text-lg">B</span>
                                </div>
                                <span className="text-lg font-bold tracking-tight text-foreground">Booked.Place</span>
                            </div>
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
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="hidden lg:flex flex-1 flex-col justify-center">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center text-sm text-muted-foreground" aria-label="Breadcrumb">
                        <ol className="flex items-center gap-1">
                            {segments.map((segment, index) => {
                                const href = `/${segments.slice(0, index + 1).join('/')}`
                                const isLast = index === segments.length - 1

                                return (
                                    <li key={href} className="flex items-center">
                                        {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
                                        {isLast ? (
                                            <span className="font-medium text-foreground">{formatSegment(segment)}</span>
                                        ) : (
                                            <Link href={href} className="hover:text-foreground transition-colors">
                                                {formatSegment(segment)}
                                            </Link>
                                        )}
                                    </li>
                                )
                            })}
                        </ol>
                    </nav>
                </div>

                <div className="flex items-center gap-x-4">
                    {/* Search Input */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="h-9 w-64 rounded-md border border-input bg-background pl-9 focus:border-primary"
                        />
                    </div>

                    <div className="h-6 w-px bg-border" aria-hidden="true" />

                    {/* Actions */}
                    <div className="flex items-center gap-x-3">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <Bell className="h-5 w-5" />
                        </Button>

                        <ModeToggle />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-primary/10">
                                    <User className="h-4 w-4 text-primary" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive" asChild>
                                    <form action={logout} className="w-full">
                                        <button type="submit" className="w-full text-left text-destructive">Log out</button>
                                    </form>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}
