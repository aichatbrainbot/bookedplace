import { getCustomPages } from '@/app/actions/customPages'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Globe, Trash2 } from 'lucide-react'
import CreateCustomPageDialog from './CreateCustomPageDialog'

export const dynamic = 'force-dynamic'

export default async function CustomPagesList() {
    const result = await getCustomPages()
    const pages = result.success && result.data ? result.data : []

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Custom Pages</h2>
                    <p className="text-muted-foreground">Manage your dynamically created GrapesJS pages.</p>
                </div>
                <CreateCustomPageDialog />
            </div>

            {pages.length === 0 ? (
                <Card className="text-center p-12 bg-gray-50 border-dashed">
                    <CardHeader>
                        <CardTitle className="text-gray-500">No Custom Pages Yet</CardTitle>
                        <CardDescription>Click the button above to create your first custom dynamic page.</CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pages.map((page) => (
                        <Card key={page.id} className="flex flex-col">
                            <CardHeader className="flex-grow">
                                <CardTitle className="flex justify-between items-start text-lg">
                                    <span className="truncate pr-2">{page.title}</span>
                                    {page.isFullPage ? (
                                        <span className="text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                                            Full Page
                                        </span>
                                    ) : (
                                        <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2 py-1 rounded-full whitespace-nowrap">
                                            Standard Body
                                        </span>
                                    )}
                                </CardTitle>
                                <CardDescription className="font-mono text-xs mt-1">
                                    /p/{page.slug}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0 border-t flex items-center justify-between p-4">
                                <Link href={`/p/${page.slug}`} target="_blank" prefetch={false}>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Globe className="w-4 h-4" />
                                        View
                                    </Button>
                                </Link>

                                <Link href={`/admin/cms/custom/${page.id}`}>
                                    <Button variant="default" size="sm" className="gap-2 bg-black hover:bg-gray-800 text-white">
                                        <Edit className="w-4 h-4" />
                                        Edit Design
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
