import { getCustomPageById } from '@/app/actions/customPages'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import GrapesJSEditorWrapper from '@/components/admin/GrapesJSEditorWrapper'
import SaveCustomPageAdapter from './SaveCustomPageAdapter'

export const dynamic = 'force-dynamic'

export default async function EditCustomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // Fetch the specific custom page we want to edit
    const result = await getCustomPageById(id)

    if (!result.success || !result.data) {
        redirect('/admin/cms/custom')
    }

    const customPage = result.data

    return (
        <div className="space-y-6 w-full max-w-7xl mx-auto">
            <div className="flex items-center space-x-4 mb-4">
                <Link href="/admin/cms/custom" className="text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Editing: {customPage.title}</h2>
                    <p className="text-sm text-muted-foreground flex items-center space-x-2">
                        <span>URL: <a href={`/p/${customPage.slug}`} target="_blank" className="text-blue-600 hover:underline">/p/{customPage.slug}</a></span>
                        <span>•</span>
                        <span>Layout: {customPage.isFullPage ? 'Full Page (GrapesJS Only)' : 'Standard Body (Includes Header/Footer)'}</span>
                    </p>
                </div>
            </div>

            <div className="w-full relative z-0">
                <SaveCustomPageAdapter
                    id={customPage.id}
                    initialHtml={customPage.html || ''}
                    initialCss={customPage.css || ''}
                />
            </div>
        </div>
    )
}
