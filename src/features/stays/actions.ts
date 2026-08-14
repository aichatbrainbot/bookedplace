'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import { Category } from '@prisma/client'

export async function createProperty(formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = Number(formData.get('price'))
    const location = formData.get('location') as string
    const category = formData.get('category') as Category
    const imagesVal = formData.get('images') as string
    const widgetCode = formData.get('widgetCode') as string

    // Simple validation
    if (!title || !price || !location) {
        throw new Error('Missing required fields')
    }

    try {
        await prisma.property.create({
            data: {
                title,
                description: description || '',
                price,
                location,
                category: category || Category.STAY,
                images: imagesVal || '[]', // storing as JSON string for now
                rating: 0,
                widgetCode: widgetCode || null,
            }
        })
    } catch (error) {
        console.error('Create property error:', error)
        throw new Error('Failed to create property')
    }

    revalidatePath('/admin/stays')
    revalidatePath('/stays')
    redirect('/admin/stays')
}

export async function updateProperty(id: string, formData: FormData) {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const price = Number(formData.get('price'))
    const location = formData.get('location') as string
    const category = formData.get('category') as Category
    const imagesVal = formData.get('images') as string
    const widgetCode = formData.get('widgetCode') as string

    try {
        await prisma.property.update({
            where: { id },
            data: {
                title,
                description,
                price,
                location,
                category,
                images: imagesVal,
                widgetCode: widgetCode || null
            }
        })
    } catch (error) {
        console.error('Update property error:', error)
        return { success: false, error: 'Failed to update property' }
    }

    revalidatePath(`/admin/stays/${id}`)
    revalidatePath('/admin/stays')
    revalidatePath('/stays')
    redirect('/admin/stays')
}

export async function deleteProperty(id: string) {
    try {
        await prisma.property.delete({
            where: { id }
        })
        revalidatePath('/admin/stays')
        revalidatePath('/stays')
        return { success: true }
    } catch (error) {
        console.error('Delete property error:', error)
        return { success: false, error: 'Failed to delete property' }
    }
}
