import prisma from '@/lib/db'
import { Category } from '@prisma/client'

export const getStays = async () => {
    try {
        const stays = await prisma.property.findMany({
            where: {
                category: Category.STAY
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return stays
    } catch (error) {
        console.error('Error fetching stays:', error)
        return []
    }
}

export const getFeaturedStays = async (limit: number = 4) => {
    try {
        const stays = await prisma.property.findMany({
            where: {
                category: Category.STAY
            },
            take: limit,
            orderBy: {
                rating: 'desc'
            }
        })
        return stays
    } catch (error) {
        console.error('Error fetching featured stays:', error)
        return []
    }
}

export const getProperty = async (id: string) => {
    try {
        const property = await prisma.property.findUnique({
            where: { id }
        })
        return property
    } catch (error) {
        console.error('Error fetching property:', error)
        return null
    }
}
