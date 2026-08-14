'use client'

import { useState } from 'react'
import { Puck, Data } from '@puckeditor/core'
import '@puckeditor/core/dist/index.css'
import { puckConfig } from '@/lib/puck-config'
import { updateCustomPageContent } from '@/app/actions/customPages'
import { toast } from 'sonner'
import CodePageEditor from './CodePageEditor'
import { Button } from '@/components/ui/button'
import { Code, LayoutGrid, ExternalLink } from 'lucide-react'

interface PuckPageEditorProps {
    id: string
    title: string
    slug: string
    isFullPage: boolean
    initialHtml: string
    initialCss: string
}

export default function PuckPageEditor({
    id,
    title,
    slug,
    isFullPage,
    initialHtml,
    initialCss
}: PuckPageEditorProps) {
    const [mode, setMode] = useState<'puck' | 'code'>('puck')

    // Parse initial JSON data if present in initialHtml
    let initialPuckData: Data = { content: [], root: { props: { title: '' } } }
    try {
        if (initialHtml && initialHtml.trim().startsWith('{')) {
            initialPuckData = JSON.parse(initialHtml)
        }
    } catch {
        // Not JSON, fallback to raw HTML
    }

    const handlePublish = async (data: Data) => {
        try {
            const jsonString = JSON.stringify(data)
            const result = await updateCustomPageContent(id, jsonString, '', isFullPage)
            if (result.success) {
                toast.success('Puck Page Published successfully!')
            } else {
                toast.error(result.error || 'Failed to save page.')
            }
        } catch {
            toast.error('An error occurred while publishing.')
        }
    }

    return (
        <div className="space-y-4 w-full">
            {/* Toolbar Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500/10 text-purple-600 rounded-xl">
                        <LayoutGrid size={22} />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg leading-snug">{title}</h2>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span>URL: <code className="bg-muted px-1.5 py-0.5 rounded text-primary font-mono">/p/{slug}</code></span>
                            <span>•</span>
                            <a
                                href={`/p/${slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium"
                            >
                                Open Live Page <ExternalLink size={12} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-xl border border-border">
                    <Button
                        size="sm"
                        variant={mode === 'puck' ? 'secondary' : 'ghost'}
                        onClick={() => setMode('puck')}
                        className="gap-2 text-xs font-bold"
                    >
                        <LayoutGrid size={15} /> Puck Drag & Drop Builder
                    </Button>
                    <Button
                        size="sm"
                        variant={mode === 'code' ? 'secondary' : 'ghost'}
                        onClick={() => setMode('code')}
                        className="gap-2 text-xs font-bold"
                    >
                        <Code size={15} /> HTML/CSS Code Editor
                    </Button>
                </div>
            </div>

            {/* Mode Content */}
            {mode === 'puck' ? (
                <div className="w-full bg-white dark:bg-slate-950 rounded-2xl border border-border overflow-hidden min-h-[700px] shadow-sm">
                    <Puck
                        config={puckConfig}
                        data={initialPuckData}
                        onPublish={handlePublish}
                    />
                </div>
            ) : (
                <CodePageEditor
                    id={id}
                    title={title}
                    slug={slug}
                    isFullPage={isFullPage}
                    initialHtml={initialHtml}
                    initialCss={initialCss}
                />
            )}
        </div>
    )
}
