'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'

export async function createCustomPage(title: string, slug: string, isFullPage: boolean) {
    try {
        const existingPage = await prisma.customPage.findUnique({
            where: { slug }
        })

        if (existingPage) {
            return { success: false, error: 'A page with this slug already exists.' }
        }

        const page = await prisma.customPage.create({
            data: {
                title,
                slug,
                isFullPage,
            }
        })

        revalidatePath('/admin/cms/custom')
        return { success: true, data: page }
    } catch (error) {
        console.error('Failed to create custom page:', error)
        return { success: false, error: 'Failed to create page. Please try again.' }
    }
}

export async function getCustomPages() {
    try {
        const pages = await prisma.customPage.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return { success: true, data: pages }
    } catch (error) {
        console.error('Failed to get custom pages:', error)
        return { success: false, error: 'Failed to load pages.' }
    }
}

export async function getCustomPageById(id: string) {
    try {
        const page = await prisma.customPage.findUnique({
            where: { id }
        })

        if (!page) {
            return { success: false, error: 'Page not found' }
        }

        return { success: true, data: page }
    } catch (error) {
        console.error('Failed to get custom page:', error)
        return { success: false, error: 'Failed to load page.' }
    }
}

export async function getCustomPageBySlug(slug: string) {
    try {
        const page = await prisma.customPage.findUnique({
            where: { slug }
        })

        if (!page) {
            return { success: false, error: 'Page not found' }
        }

        return { success: true, data: page }
    } catch (error) {
        console.error('Failed to get custom page by slug:', error)
        return { success: false, error: 'Failed to load page.' }
    }
}

export async function updateCustomPageContent(id: string, html: string, css: string) {
    try {
        const page = await prisma.customPage.update({
            where: { id },
            data: {
                html,
                css
            }
        })

        revalidatePath(`/admin/cms/custom/${id}`)
        revalidatePath(`/p/${page.slug}`)

        return { success: true, data: page }
    } catch (error) {
        console.error('Failed to update custom page content:', error)
        return { success: false, error: 'Failed to save page.' }
    }
}

export async function deleteCustomPage(id: string) {
    try {
        await prisma.customPage.delete({
            where: { id }
        })

        revalidatePath('/admin/cms/custom')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete custom page:', error)
        return { success: false, error: 'Failed to delete page.' }
    }
}
