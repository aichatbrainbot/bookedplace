import { MetadataRoute } from 'next'
import { getSiteContent } from '@/app/actions/content'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const result = await getSiteContent()
    const content = result.success && result.data ? result.data : []

    const domain = content.find((i) => i.key === "settings_site_url")?.value || 'https://www.bookedplace.com'

    // Define core static routes
    const routes = [
        '',
        '/about',
        '/contact',
        '/terms',
        '/privacy',
        '/flights',
        '/stays',
        '/car-rental',
        '/activities',
        '/airport-transportation'
    ]

    const sitemapEntries: MetadataRoute.Sitemap = routes.map((route) => ({
        url: `${domain}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : 0.8,
    }))

    return sitemapEntries
}
