'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

// Dynamically import the GrapesJSEditor with ssr: false
// This prevents Next.js from trying to render it on the server where 'window' is undefined
const GrapesJSEditor = dynamic(() => import('@/components/admin/GrapesJSEditor'), {
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl bg-gray-50/50">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-4" />
            <p className="text-gray-500 font-medium">Loading Visual Page Builder...</p>
        </div>
    )
})

interface GrapesJSEditorWrapperProps {
    initialHtml: string
    initialCss: string
    pageId: string
    onSave?: (html: string, css: string) => Promise<boolean> | boolean
}

export default function GrapesJSEditorWrapper(props: GrapesJSEditorWrapperProps) {
    return <GrapesJSEditor {...props} />
}
