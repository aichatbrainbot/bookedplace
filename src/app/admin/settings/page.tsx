import { getSiteContent } from '@/app/actions/content'
import SettingsEditor from '@/components/admin/SettingsEditor'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
    const result = await getSiteContent()
    const content = result.success && result.data ? result.data : []

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <SettingsEditor initialContent={content} />
        </div>
    )
}
