'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { createPost, updatePost } from '@/features/blog/actions'
import { toast } from 'sonner'
import ImageUploader from './ImageUploader'
import RichTextEditor from './RichTextEditor'

interface Category {
    id: number
    name: string
    slug: string
}

interface BlogFormPost {
    id?: string
    title?: string
    slug?: string
    category?: string
    content?: string
    excerpt?: string | null
    coverImage?: string | null
    seoTitle?: string | null
    seoDescription?: string | null
    keywords?: string | null
    isPublished?: boolean
    isFeatured?: boolean
    tags?: string | null
    schemaJson?: string | null
}

interface BlogFormProps {
    post?: BlogFormPost
    isNew?: boolean
    categories: Category[]
}

export default function BlogForm({ post, isNew = false, categories }: BlogFormProps) {
    const router = useRouter()
    const [content, setContent] = useState(post?.content || '')
    const [isPublished, setIsPublished] = useState(post?.isPublished || false)
    const [isFeatured, setIsFeatured] = useState(post?.isFeatured || false)
    const [tags, setTags] = useState(post?.tags || '')
    const [coverImage, setCoverImage] = useState(post?.coverImage || '')
    const [category, setCategory] = useState(post?.category || categories[0]?.slug || 'general')
    const [slug, setSlug] = useState(post?.slug || '')
    const [title, setTitle] = useState(post?.title || '')
    const [schemaJson, setSchemaJson] = useState(post?.schemaJson || '')
    const [loading, setLoading] = useState(false)

    // Auto-generate slug from title
    function generateSlug(value: string) {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
    }

    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value
        setTitle(val)
        if (isNew) {
            setSlug(generateSlug(val))
        }
    }

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        formData.append('content', content)
        formData.append('coverImage', coverImage)
        formData.set('isPublished', isPublished ? 'on' : 'off')
        formData.set('isFeatured', isFeatured ? 'on' : 'off')
        formData.set('tags', tags)
        formData.set('category', category)
        formData.set('slug', slug)
        formData.set('schemaJson', schemaJson)

        try {
            if (isNew) {
                await createPost(formData)
                toast.success('Post created successfully')
            } else {
                if (!post?.id) throw new Error('Post ID is missing')
                await updatePost(post.id, formData)
                toast.success('Post updated successfully')
            }
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-5xl mx-auto py-10">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">{isNew ? 'Create New Post' : 'Edit Post'}</h1>
                <div className="flex items-center gap-6">
                    <div className="flex items-center space-x-2">
                        <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                        <Label htmlFor="isFeatured">Featured</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="isPublished" checked={isPublished} onCheckedChange={setIsPublished} />
                        <Label htmlFor="isPublished">Published</Label>
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Post'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Post Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={title}
                            onChange={handleTitleChange}
                            required
                            placeholder="Enter post title"
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <Label htmlFor="slug">
                            Slug (URL)
                            <span className="ml-2 text-xs text-muted-foreground font-normal">
                                — Used in URL: /blog/{category}/{slug || 'your-slug'}
                            </span>
                        </Label>
                        <Input
                            id="slug"
                            name="slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                            placeholder="my-post-slug"
                            dir="ltr"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <Label>Content</Label>
                        <RichTextEditor value={content} onChange={setContent} />
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            name="excerpt"
                            defaultValue={post?.excerpt || ''}
                            placeholder="Short summary for cards and SEO"
                        />
                    </div>
                </div>

                {/* Sidebar / Metadata */}
                <div className="space-y-8">
                    {/* Category */}
                    <div className="border border-border p-4 rounded-md space-y-4 bg-card">
                        <h3 className="font-semibold text-lg border-b border-border pb-2">Category</h3>
                        <div className="space-y-2">
                            <Label>Blog Category</Label>
                            {categories.length === 0 ? (
                                <p className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                                    No categories yet.{' '}
                                    <Link href="/admin/cms/blog/categories" className="underline text-primary">
                                        Add categories first →
                                    </Link>
                                </p>
                            ) : (
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.slug}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Final URL: <code className="bg-muted px-1 rounded">/blog/{category}/{slug || 'slug'}</code>
                            </p>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="border border-border p-4 rounded-md space-y-4 bg-card">
                        <h3 className="font-semibold text-lg border-b border-border pb-2">Cover Image</h3>
                        <div className="space-y-2">
                            <Label>Cover Image</Label>
                            <ImageUploader value={coverImage} onChange={setCoverImage} />
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="border border-border p-4 rounded-md space-y-4 bg-card">
                        <h3 className="font-semibold text-lg border-b border-border pb-2">Tags</h3>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <Input
                                id="tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g. news, update, guide (comma separated)"
                            />
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="border border-border p-4 rounded-md space-y-4 bg-card">
                        <h3 className="font-semibold text-lg border-b border-border pb-2">SEO Settings</h3>
                        <div className="space-y-2">
                            <Label htmlFor="seoTitle">SEO Title</Label>
                            <Input id="seoTitle" name="seoTitle" defaultValue={post?.seoTitle || ''} placeholder="Title tag for search engines" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="seoDescription">Meta Description</Label>
                            <Textarea id="seoDescription" name="seoDescription" defaultValue={post?.seoDescription || ''} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="keywords">Keywords</Label>
                            <Input id="keywords" name="keywords" defaultValue={post?.keywords || ''} placeholder="Comma separated keywords" />
                        </div>
                        <div className="space-y-2 pt-4 border-t border-border">
                            <Label htmlFor="schemaJson">
                                Custom Schema Markup (JSON-LD)
                                <span className="ml-2 text-xs text-muted-foreground font-normal">
                                    — Advanced SEO testing. Leave empty to use auto-generated article schema.
                                </span>
                            </Label>
                            <Textarea
                                id="schemaJson"
                                name="schemaJson"
                                value={schemaJson}
                                onChange={(e) => setSchemaJson(e.target.value)}
                                placeholder={`{"@context": "https://schema.org", "@type": "FAQPage", ...}`}
                                className="font-mono text-sm min-h-[150px]"
                                dir="ltr"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
