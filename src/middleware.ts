import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export async function middleware(request: NextRequest) {
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
    const isCmsPath = request.nextUrl.pathname.startsWith('/cms')

    if (isAdminPath || isCmsPath) {
        const adminSession = request.cookies.get('admin_session')

        if (!adminSession) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        try {
            // Stateless check using the cookie data
            // NOTE: For production, this should be a verified JWT to prevent tampering
            const sessionData = JSON.parse(adminSession.value)

            if (!sessionData || !sessionData.userId) {
                return NextResponse.redirect(new URL('/login', request.url))
            }

            const path = request.nextUrl.pathname
            const role = sessionData.role || 'VIEWER'

            // VIEWER: Can only access dashboard
            if (role === 'VIEWER' && path !== '/admin') {
                // Allow simple GET requests or specific safe paths if needed, 
                // but for now strictly redirect to dashboard if trying to access other areas
                if (path !== '/admin') {
                    return NextResponse.redirect(new URL('/admin', request.url))
                }
            }

            // EDITOR: Cannot access settings or SEO
            if (role === 'EDITOR') {
                if (path.startsWith('/admin/settings') ||
                    path.startsWith('/admin/seo')) {
                    return NextResponse.redirect(new URL('/admin', request.url))
                }
            }

            // USER role should not access admin at all
            if (role === 'USER') {
                return NextResponse.redirect(new URL('/', request.url))
            }

        } catch {
            // Invalid session cookie format
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/cms/:path*'],
}
