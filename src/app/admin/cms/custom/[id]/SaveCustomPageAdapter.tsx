'use client'

import GrapesJSEditorWrapper from "@/components/admin/GrapesJSEditorWrapper"
import { updateCustomPageContent } from "@/app/actions/customPages"

export default function SaveCustomPageAdapter({ id, initialHtml, initialCss }: { id: string, initialHtml: string, initialCss: string }) {

    const handleSave = async (html: string, css: string) => {
        const result = await updateCustomPageContent(id, html, css)
        return result.success
    }

    return (
        <GrapesJSEditorWrapper
            pageId={`custom_${id}`}
            initialHtml={initialHtml}
            initialCss={initialCss}
            onSave={handleSave}
        />
    )
}
