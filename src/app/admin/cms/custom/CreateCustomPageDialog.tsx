'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { createCustomPage } from '@/app/actions/customPages'

export default function CreateCustomPageDialog() {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [isFullPage, setIsFullPage] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleCreate = async () => {
        if (!title.trim() || !slug.trim()) {
            toast.error('Title and Slug are required')
            return
        }

        // Basic slug validation
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
        if (!slugRegex.test(slug)) {
            toast.error('Slug can only contain lowercase letters, numbers, and hyphens.')
            return
        }

        setIsLoading(true)
        const result = await createCustomPage(title, slug, isFullPage)
        setIsLoading(false)

        if (result.success && result.data) {
            toast.success('Custom page created successfully')
            setOpen(false)
            // Redirect to the newly created page's editor
            router.push(`/admin/cms/custom/${result.data.id}`)
        } else {
            toast.error(result.error || 'Failed to create custom page')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 bg-[#D71616] hover:bg-[#8A0000] text-white">
                    <Plus className="w-4 h-4" />
                    Create New Page
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Custom Page</DialogTitle>
                    <DialogDescription>
                        Set up the basic details for your new dynamic page.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Page Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Terms of Service"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value)
                                // Auto-fill slug if it's empty
                                if (!slug) {
                                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
                                }
                            }}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="slug">URL Slug</Label>
                        <div className="flex items-center space-x-2">
                            <span className="text-muted-foreground text-sm">/p/</span>
                            <Input
                                id="slug"
                                placeholder="terms-of-service"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9\-]/g, ''))}
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
                        <div className="space-y-0.5">
                            <Label htmlFor="isFullPage">Full Page Mode</Label>
                            <p className="text-sm text-muted-foreground">
                                {isFullPage ? "Uses ONLY the GrapesJS design." : "Keeps the website's default Navbar and Footer."}
                            </p>
                        </div>
                        <Switch
                            id="isFullPage"
                            checked={isFullPage}
                            onCheckedChange={setIsFullPage}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={isLoading} className="bg-[#D71616] hover:bg-[#8A0000] text-white">
                        {isLoading ? 'Creating...' : 'Create & Edit'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
