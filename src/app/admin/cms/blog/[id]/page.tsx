import prisma from '@/lib/db'
import BlogForm from '@/components/admin/BlogForm'
import { notFound } from 'next/navigation'
import { getCategories } from '@/features/blog/category-actions'

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function BlogEditPage({ params }: PageProps) {
    const { id } = await params
    const categories = await getCategories()

    if (id === 'new') {
        return <BlogForm isNew={true} categories={categories} />
    }

    const post = await prisma.blogPost.findUnique({
        where: { id }
    })

    if (!post) {
        notFound()
    }

    return <BlogForm post={post} categories={categories} />
}
