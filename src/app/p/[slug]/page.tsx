import { notFound } from 'next/navigation'
import { getCustomPageBySlug } from '@/app/actions/customPages'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const result = await getCustomPageBySlug(slug)

    if (!result.success || !result.data) {
        return { title: 'Page Not Found' }
    }

    return { title: result.data.title }
}

export default async function CustomDynamicPage({ params }: Props) {
    const { slug } = await params
    const result = await getCustomPageBySlug(slug)

    if (!result.success || !result.data) {
        notFound()
        // notFound() throws, this is unreachable but needed for TypeScript
        return null
    }

    const { html, css, isFullPage } = result.data

    if (isFullPage) {
        // Full Page: fixed overlay that covers the navbar and footer completely
        return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', background: '#fff' }}>
                {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
                {html ? (
                    <div dangerouslySetInnerHTML={{ __html: html }} className="grapesjs-content-wrapper" />
                ) : (
                    <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">
                        This page is empty. Edit it in the CMS to add content.
                    </div>
                )}
            </div>
        )
    }

    // Standard Body: renders inside the global layout (with Navbar + Footer)
    return (
        <div className="w-full min-h-screen pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {css && <style dangerouslySetInnerHTML={{ __html: css }} />}

                {html ? (
                    <div dangerouslySetInnerHTML={{ __html: html }} className="grapesjs-content-wrapper" />
                ) : (
                    <div className="flex items-center justify-center min-h-[50vh] text-gray-400 border-2 border-dashed rounded-xl text-sm">
                        This page is empty. Edit it in the CMS to add content.
                    </div>
                )}
            </div>
        </div>
    )
}
