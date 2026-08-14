'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import { cookies } from 'next/headers'




// Helper to generate slug
function generateSlug(title: string) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)+/g, '')
}

// Auth helper
async function getAdminSession() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')?.value
    if (!sessionCookie) return null
    try {
        const session = JSON.parse(sessionCookie)
        if (!session?.userId) return null
        return session
    } catch {
        return null
    }
}

export async function createPost(formData: FormData) {
    const session = await getAdminSession()
    if (!session) throw new Error('Unauthorized')

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const coverImage = formData.get('coverImage') as string
    const categoryRaw = formData.get('category') as string
    const category = categoryRaw || 'general'

    // SEO
    const seoTitle = formData.get('seoTitle') as string
    const seoDescription = formData.get('seoDescription') as string
    const keywords = formData.get('keywords') as string
    const schemaJson = formData.get('schemaJson') as string

    const isPublished = formData.get('isPublished') === 'on'
    const isFeatured = formData.get('isFeatured') === 'on'
    const tags = formData.get('tags') as string

    if (!title) throw new Error('Title is required')

    let slug = formData.get('slug') as string
    if (!slug) slug = generateSlug(title)

    // Ensure slug is unique
    let uniqueSlug = slug
    let counter = 1
    while (await prisma.blogPost.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`
        counter++
    }

    // Use session userId if available, otherwise fall back to first admin
    let authorId = session.userId
    const userExists = await prisma.user.findUnique({ where: { id: authorId } })
    if (!userExists) {
        const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
        if (!adminUser) throw new Error('No admin user found')
        authorId = adminUser.id
    }

    await prisma.blogPost.create({
        data: {
            title,
            slug: uniqueSlug,
            category,
            content: content || '',
            excerpt: excerpt || '',
            coverImage: coverImage || '',
            seoTitle: seoTitle || title,
            seoDescription: seoDescription || excerpt,
            keywords: keywords || '',
            schemaJson: schemaJson || null,
            isPublished,
            isFeatured,
            tags: tags || '',
            publishedAt: isPublished ? new Date() : null,
            authorId
        }
    })

    revalidatePath('/admin/cms/blog')
    revalidatePath('/blog')
    redirect('/admin/cms/blog')
}

export async function updatePost(id: string, formData: FormData) {
    const session = await getAdminSession()
    if (!session) throw new Error('Unauthorized')

    const title = formData.get('title') as string
    const slug = formData.get('slug') as string
    const content = formData.get('content') as string
    const excerpt = formData.get('excerpt') as string
    const coverImage = formData.get('coverImage') as string
    const categoryRaw = formData.get('category') as string
    const category = categoryRaw || 'general'

    // SEO
    const seoTitle = formData.get('seoTitle') as string
    const seoDescription = formData.get('seoDescription') as string
    const keywords = formData.get('keywords') as string
    const schemaJson = formData.get('schemaJson') as string

    const isPublished = formData.get('isPublished') === 'on'
    const isFeatured = formData.get('isFeatured') === 'on'
    const tags = formData.get('tags') as string

    // Get old post to revalidate old URL
    const oldPost = await prisma.blogPost.findUnique({ where: { id } })

    await prisma.blogPost.update({
        where: { id },
        data: {
            title,
            slug,
            category,
            content,
            excerpt,
            coverImage,
            seoTitle,
            seoDescription,
            keywords,
            schemaJson: schemaJson || null,
            isPublished,
            isFeatured,
            tags,
            publishedAt: isPublished ? new Date() : null
        }
    })

    revalidatePath('/admin/cms/blog')
    revalidatePath('/blog')
    if (oldPost) {
        revalidatePath(`/blog/${(oldPost as { category: string }).category.toLowerCase()}/${oldPost.slug}`)
    }
    revalidatePath(`/blog/${category.toLowerCase()}/${slug}`)
    redirect('/admin/cms/blog')
}

export async function deletePost(id: string) {
    const session = await getAdminSession()
    if (!session) throw new Error('Unauthorized')

    const post = await prisma.blogPost.findUnique({ where: { id } })
    await prisma.blogPost.delete({ where: { id } })

    revalidatePath('/admin/cms/blog')
    revalidatePath('/blog')
    if (post) {
        revalidatePath(`/blog/${(post as { category: string }).category.toLowerCase()}/${post.slug}`)
    }
}

export async function getPosts(publishedOnly = true) {
    return await prisma.blogPost.findMany({
        where: publishedOnly ? { isPublished: true } : {},
        orderBy: { createdAt: 'desc' }
    })
}

export async function getPost(slug: string) {
    return await prisma.blogPost.findUnique({
        where: { slug },
        include: { author: { select: { name: true } } }
    })
}

export async function getPostBySlugAndCategory(category: string, slug: string) {
    return await prisma.blogPost.findFirst({
        where: {
            slug,
            category: category.toLowerCase(),
            isPublished: true
        },
        include: { author: { select: { name: true } } }
    })
}

export async function getPostsByCategory(category: string) {
    return await prisma.blogPost.findMany({
        where: {
            category: category.toLowerCase(),
            isPublished: true
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function getPostById(id: string) {
    return await prisma.blogPost.findUnique({
        where: { id }
    })
}
