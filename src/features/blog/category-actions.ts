'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

async function getAdminSession() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')?.value
    if (!sessionCookie) return null
    try {
        const session = JSON.parse(sessionCookie)
        return session?.role === 'ADMIN' || session?.role === 'EDITOR' ? session : null
    } catch {
        return null
    }
}

export async function getCategories() {
    return await prisma.blogCategory.findMany({
        orderBy: { name: 'asc' }
    })
}

export async function addCategory(formData: FormData) {
    const session = await getAdminSession()
    if (!session) throw new Error('Unauthorized')

    const name = (formData.get('name') as string)?.trim()
    if (!name) throw new Error('Category name is required')

    // Generate slug from name
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

    await prisma.blogCategory.create({
        data: { name, slug }
    })

    revalidatePath('/admin/cms/blog/categories')
}

export async function deleteCategory(id: number) {
    const session = await getAdminSession()
    if (!session) throw new Error('Unauthorized')

    // Check if any posts use this category
    const category = await prisma.blogCategory.findUnique({ where: { id } })
    if (!category) throw new Error('Category not found')

    const postsCount = await prisma.blogPost.count({
        where: { category: category.slug }
    })

    if (postsCount > 0) {
        throw new Error(`Cannot delete: ${postsCount} post(s) use this category`)
    }

    await prisma.blogCategory.delete({ where: { id } })
    revalidatePath('/admin/cms/blog/categories')
}

export async function seedDefaultCategories() {
    const session = await getAdminSession()
    if (!session) throw new Error('Unauthorized')

    const defaults = [
        { name: 'General', slug: 'general' },
        { name: 'Travel', slug: 'travel' },
        { name: 'Stays', slug: 'stays' },
        { name: 'Food & Dining', slug: 'food' },
        { name: 'Restaurants', slug: 'restaurants' },
        { name: 'Activities', slug: 'activities' },
        { name: 'Tips & Tricks', slug: 'tips' },
        { name: 'Guides', slug: 'guides' },
        { name: 'News', slug: 'news' },
    ]

    for (const cat of defaults) {
        await prisma.blogCategory.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat
        })
    }

    revalidatePath('/admin/cms/blog/categories')
}
