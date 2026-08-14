'use server'

import prisma from '@/lib/db'

export async function sendContactMessage(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    // Server-side captcha validation check
    const captchaAnswer = formData.get('captchaAnswer') as string
    const expectedCaptcha = formData.get('expectedCaptcha') as string

    if (!name || !email || !message) {
        return { success: false, error: 'All fields are required.' }
    }

    if (captchaAnswer !== expectedCaptcha) {
        return { success: false, error: 'Captcha validation failed.' }
    }

    try {
        await prisma.contactMessage.create({
            data: {
                name,
                email,
                message,
            }
        })
        return { success: true }
    } catch (error) {
        console.error('Error saving contact message:', error)
        return { success: false, error: 'Failed to save message. Please try again later.' }
    }
}
