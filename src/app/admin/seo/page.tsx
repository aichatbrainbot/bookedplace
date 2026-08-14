import { getSiteContent } from '@/app/actions/content'
import SEOEditor from '@/components/admin/SEOEditor'

// Since we are using dynamic routes/actions, force dynamic
export const dynamic = 'force-dynamic'

export default async function SEOPage() {
    const result = await getSiteContent()
    const content = result.success && result.data ? result.data : []

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <SEOEditor initialContent={content} />
        </div>
    )
}
