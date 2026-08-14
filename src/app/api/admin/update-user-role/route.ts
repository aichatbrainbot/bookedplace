import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
    try {
        // Verify admin session
        const cookieStore = await cookies()
        const adminSession = cookieStore.get('admin_session')

        if (!adminSession) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const sessionData = JSON.parse(adminSession.value)
        const currentUser = await prisma.user.findUnique({
            where: { id: sessionData.userId },
            select: { role: true }
        })

        // Only ADMIN can change roles
        if (currentUser?.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
        }

        const { userId, role } = await request.json()

        if (!userId || !role) {
            return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 })
        }

        // Update user role
        await prisma.user.update({
            where: { id: userId },
            data: { role }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating user role:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
