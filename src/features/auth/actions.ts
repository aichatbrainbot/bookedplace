'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'

export async function login(formData: FormData) {
    const email = formData.get('username') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { success: false, error: 'Missing credentials' }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return { success: false, error: 'Invalid credentials' }
        }

        let isValid = false
        if (password === 'admin' && user.passwordHash === 'admin') {
            isValid = true
        } else {
            try {
                isValid = await bcrypt.compare(password, user.passwordHash)
            } catch (e) {
                console.warn('Bcrypt compare failed (likely invalid hash in DB):', e)
                isValid = false
            }
        }

        if (isValid) {
            const sessionData = JSON.stringify({
                userId: user.id,
                email: user.email,
                role: user.role || 'VIEWER'
            })

            const cookieStore = await cookies()
            cookieStore.set('admin_session', sessionData, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            })
            return { success: true }
        }
    } catch (error) {
        console.error('Login error:', error)
    }

    return { success: false, error: 'Invalid credentials' }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('admin_session')
    redirect('/login')
}
