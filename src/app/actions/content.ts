'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getSiteContent() {
    try {
        const content = await prisma.siteContent.findMany({
            orderBy: { key: 'asc' },
        })
        return { success: true, data: content }
    } catch (error) {
        console.error('Failed to fetch content:', error)
        return { success: false, error: 'Failed to fetch content' }
    }
}

export async function updateSiteContent(key: string, value: string) {
    try {
        await prisma.siteContent.upsert({
            where: { key },
            update: { value },
            create: { key, value, category: 'SEO' }, // Defaulting to SEO category for now
        })
        revalidatePath('/', 'layout')
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error(`Failed to update content for key ${key}:`, error)
        return { success: false, error: 'Failed to update content' }
    }
}

export async function updateSiteContentBatch(items: { key: string; value: string }[]) {
    try {
        await prisma.$transaction(
            items.map(item =>
                prisma.siteContent.upsert({
                    where: { key: item.key },
                    update: { value: item.value },
                    create: { key: item.key, value: item.value, category: 'SEO' },
                })
            )
        )
        revalidatePath('/', 'layout')
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        console.error('Failed to update content batch:', error)
        return { success: false, error: 'Failed to update settings' }
    }
}
