'use client'

import { useState, useTransition } from 'react'
import { addCategory, deleteCategory, seedDefaultCategories } from '@/features/blog/category-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Trash2, Plus, RefreshCw, Tag } from 'lucide-react'

interface Category {
    id: number
    name: string
    slug: string
}

interface Props {
    categories: Category[]
}

export default function CategoriesManager({ categories: initial }: Props) {
    const [categories, setCategories] = useState<Category[]>(initial)
    const [newName, setNewName] = useState('')
    const [isPending, startTransition] = useTransition()

    const previewSlug = newName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

    function handleAdd(e: React.FormEvent) {
        e.preventDefault()
        if (!newName.trim()) return

        const formData = new FormData()
        formData.set('name', newName.trim())

        startTransition(async () => {
            try {
                await addCategory(formData)
                toast.success(`Category "${newName}" added!`)
                setNewName('')
                // Refresh list
                window.location.reload()
            } catch (err: unknown) {
                toast.error(err instanceof Error ? err.message : 'Failed to add category')
            }
        })
    }

    function handleDelete(cat: Category) {
        if (!confirm(`Delete category "${cat.name}"? This cannot be undone.`)) return

        startTransition(async () => {
            try {
                await deleteCategory(cat.id)
                setCategories(prev => prev.filter(c => c.id !== cat.id))
                toast.success(`Category "${cat.name}" deleted`)
            } catch (err: unknown) {
                toast.error(err instanceof Error ? err.message : 'Failed to delete category')
            }
        })
    }

    function handleSeedDefaults() {
        if (!confirm('This will add the default categories (General, Travel, Stays, etc.). Continue?')) return

        startTransition(async () => {
            try {
                await seedDefaultCategories()
                toast.success('Default categories added!')
                window.location.reload()
            } catch {
                toast.error('Failed to seed categories')
            }
        })
    }

    return (
        <div className="space-y-6">
            {/* Add new category */}
            <div className="border border-border rounded-xl p-6 bg-card space-y-4">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add New Category
                </h2>
                <form onSubmit={handleAdd} className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="cat-name">Category Name</Label>
                        <Input
                            id="cat-name"
                            placeholder="e.g. Food & Dining"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            disabled={isPending}
                        />
                        {newName && (
                            <p className="text-xs text-muted-foreground">
                                URL slug: <code className="bg-muted px-1 rounded">/blog/{previewSlug}/...</code>
                            </p>
                        )}
                    </div>
                    <Button type="submit" disabled={isPending || !newName.trim()} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </Button>
                </form>
            </div>

            {/* Existing categories */}
            <div className="border border-border rounded-xl p-6 bg-card space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <Tag className="w-5 h-5 text-primary" />
                        Existing Categories ({categories.length})
                    </h2>
                    {categories.length === 0 && (
                        <Button variant="outline" size="sm" onClick={handleSeedDefaults} disabled={isPending}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Load Defaults
                        </Button>
                    )}
                </div>

                {categories.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p>No categories yet.</p>
                        <p className="text-sm">Add one above or click &quot;Load Defaults&quot; to start with the default categories.</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {categories.map(cat => (
                            <li
                                key={cat.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/70 transition-colors"
                            >
                                <div>
                                    <p className="font-medium text-sm">{cat.name}</p>
                                    <p className="text-xs text-muted-foreground">/blog/{cat.slug}/...</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDelete(cat)}
                                    disabled={isPending}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
