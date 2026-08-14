import { AboutHero } from '@/components/about/AboutHero'
import { AboutGlobal } from '@/components/about/AboutGlobal'
import { AboutNumbers } from '@/components/about/AboutNumbers'
import { AboutPartner } from '@/components/about/AboutPartner'
import { AboutTrees } from '@/components/about/AboutTrees'
import { AboutJoin } from '@/components/about/AboutJoin'
import { AboutCTA } from '@/components/about/AboutCTA'
import { getSiteContent } from '@/app/actions/content'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
    const result = await getSiteContent()
    const content = result.success && result.data ? result.data : []
    const contentMap = content.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {} as Record<string, string>)

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <AboutHero content={contentMap} />
            <AboutGlobal content={contentMap} />
            <AboutNumbers content={contentMap} />
            <AboutPartner content={contentMap} />
            <AboutTrees content={contentMap} />
            <AboutJoin content={contentMap} />
            <AboutCTA content={contentMap} />
        </div>
    )
}

