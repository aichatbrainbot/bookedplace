'use client'

import { useEffect, useRef, useState } from 'react'
import 'grapesjs/dist/css/grapes.min.css'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Save, Loader2 } from 'lucide-react'
import { updateSiteContent } from '@/app/actions/content'
import { toast } from 'sonner'
import grapesjs, { Editor } from 'grapesjs'
import gjsPresetWebpage from 'grapesjs-preset-webpage'
import gjsBlocksBasic from 'grapesjs-blocks-basic'

interface GrapesJSEditorProps {
    initialHtml: string
    initialCss: string
    pageId: string
    onSave?: (html: string, css: string) => Promise<boolean> | boolean
}

export default function GrapesJSEditor({ initialHtml, initialCss, pageId, onSave }: GrapesJSEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [editor, setEditor] = useState<Editor | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        if (!editorRef.current) return

        const e = grapesjs.init({
            container: editorRef.current,
            height: '800px',
            width: 'auto',
            plugins: [gjsPresetWebpage, gjsBlocksBasic],
            storageManager: false, // We will handle saving manually via our backend
            components: initialHtml || '<div><h2>Welcome to the Visual Page Builder</h2><p>Drag elements here to build your page.</p></div>',
            style: initialCss || '',
        })

        setEditor(e)

        return () => {
            if (e) e.destroy()
        }
    }, [initialHtml, initialCss])

    const handleSave = async () => {
        if (!editor) return
        setIsSaving(true)

        try {
            const html = editor.getHtml()
            const css = editor.getCss()

            let success = false;

            if (onSave) {
                success = await onSave(html, css || '')
            } else {
                const htmlResult = await updateSiteContent(`${pageId}_grapesjs_html`, html)
                const cssResult = await updateSiteContent(`${pageId}_grapesjs_css`, css || '')
                success = htmlResult.success && cssResult.success
            }

            if (success) {
                toast.success('Page design saved successfully!')
            } else {
                throw new Error('Failed to save content.')
            }
        } catch (error: unknown) {
            console.error('Error saving GrapesJS content:', error)
            const errorMessage = error instanceof Error ? error.message : 'Failed to save page design'
            toast.error(errorMessage)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <Card className="flex flex-col overflow-hidden border shadow-sm rounded-xl">
            <div className="flex justify-between items-center p-4 bg-card border-b border-border">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Visual Page Builder</h2>
                    <p className="text-sm text-muted-foreground">Drag and drop elements to design your page.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-[#D71616] hover:bg-[#8A0000] text-white">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Design
                </Button>
            </div>

            {/* GrapesJS Container */}
            <div ref={editorRef} className="w-full h-full min-h-[800px]"></div>

            <style jsx global>{`
                /* Some overrides to ensure GrapesJS fits nicely inside the Admin Dashboard */
                .gjs-editor {
                    background-color: #f8fafc;
                }
                .gjs-cv-canvas {
                    background-color: white;
                }
            `}</style>
        </Card>
    )
}
