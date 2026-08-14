import prisma from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building, FileText, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const userCount = await prisma.user.count()
    const propertyCount = await prisma.property.count()
    const blogCount = await prisma.blogPost.count()

    // Date formatter
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                    <p className="text-muted-foreground mt-1">
                        Good morning! Here&apos;s what&apos;s happening today, {today}.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild size="sm">
                        <Link href="/admin/stays">
                            <Building className="mr-2 h-4 w-4" />
                            Manage Stays
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/admin/cms">
                            <FileText className="mr-2 h-4 w-4" />
                            Write Post
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{userCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Registered accounts
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Properties</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{propertyCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Active listings
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-foreground">{blogCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Published articles
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row: Recent Activity & Quick Links */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* <RecentActivity /> */}

                <Card className="col-span-4 lg:col-span-4 bg-card border-border">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <Link href="/admin/seo" className="group flex flex-col gap-2 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold group-hover:text-primary transition-colors">SEO Settings</span>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-sm text-muted-foreground">Manage meta tags, titles, and social previews.</p>
                        </Link>
                        <Link href="/admin/settings" className="group flex flex-col gap-2 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold group-hover:text-primary transition-colors">Global Settings</span>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-sm text-muted-foreground">Update site title, contacts, and api keys.</p>
                        </Link>
                        <Link href="/" target="_blank" className="group flex flex-col gap-2 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <span className="font-semibold group-hover:text-primary transition-colors">View Live Site</span>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-sm text-muted-foreground">Check how your changes look on the frontend.</p>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
