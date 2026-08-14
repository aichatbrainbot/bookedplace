'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getContactMessages() {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return messages
    } catch (error) {
        console.error('Error fetching messages:', error)
        return []
    }
}

export async function toggleMessageReadStatus(id: string, isRead: boolean) {
    try {
        await prisma.contactMessage.update({
            where: { id },
            data: { isRead }
        })
        revalidatePath('/admin/messages')
        return { success: true }
    } catch (error) {
        console.error('Error updating message status:', error)
        return { success: false, error: 'Failed to update message status' }
    }
}
