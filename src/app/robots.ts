import { MetadataRoute } from 'next'
import { getSiteContent } from '@/app/actions/content'

export default async function robots(): Promise<MetadataRoute.Robots> {
    const result = await getSiteContent()
    const content = result.success && result.data ? result.data : []

    // Try to get a custom domain if set, otherwise fallback to a generic placeholder or relative paths
    const domain = content.find((i) => i.key === "settings_site_url")?.value || 'https://www.bookedplace.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/'],
        },
        sitemap: `${domain}/sitemap.xml`,
    }
}
