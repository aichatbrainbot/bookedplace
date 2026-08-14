import { getCustomPageById } from '@/app/actions/customPages'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CodePageEditor from '@/components/admin/CodePageEditor'

export const dynamic = 'force-dynamic'

export default async function EditCustomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const result = await getCustomPageById(id)

    if (!result.success || !result.data) {
        redirect('/admin/cms/custom')
    }

    const customPage = result.data

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 mb-2">
                <Link href="/admin/cms/custom" className="text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <span className="text-sm font-medium text-muted-foreground">Back to Custom Pages</span>
            </div>

            <CodePageEditor
                id={customPage.id}
                title={customPage.title}
                slug={customPage.slug}
                isFullPage={customPage.isFullPage}
                initialHtml={customPage.html || ''}
                initialCss={customPage.css || ''}
            />
        </div>
    )
}
