import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Layout, Plane, Building, Globe, Car, Bus, BookOpen, Phone, Shield, FileText, Info } from 'lucide-react'

const pages = [
    { id: 'custom', title: 'Custom Pages', description: 'Create and manage dynamic pages with GrapesJS', icon: Layout },
    { id: 'home', title: 'Homepage', description: 'Hero section, featured content, and main widgets', icon: Layout },
    { id: 'flights', title: 'Flights Page', description: 'Hero section, features, and widgets', icon: Plane },
    { id: 'blog', title: 'Blog Page', description: 'Blog listings hero section', icon: BookOpen },
    { id: 'contact', title: 'Contact Page', description: 'Contact info and hero section', icon: Phone },
    { id: 'privacy', title: 'Privacy Policy', description: 'Hero text for Privacy page', icon: Shield },
    { id: 'terms', title: 'Terms of Service', description: 'Hero text for Terms page', icon: FileText },
    { id: 'about', title: 'About Page', description: 'Hero section, features, and text', icon: Info },
]

export default function CMSListPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
                <p className="text-muted-foreground">Select a page to edit its content and configuration.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pages.map((page) => (
                    <Link key={page.id} href={`/admin/cms/${page.id}`}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-l-4 border-l-primary/20 hover:border-l-primary">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                        <page.icon size={24} />
                                    </div>
                                    <ArrowRight size={20} className="text-gray-400" />
                                </div>
                                <CardTitle className="mt-4">{page.title}</CardTitle>
                                <CardDescription>{page.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
