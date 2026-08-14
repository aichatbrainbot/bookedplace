'use client'

import { useState, useEffect } from 'react'
import { updateCustomPageContent } from '@/app/actions/customPages'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Code, Eye, Save, ExternalLink, Monitor, Smartphone, Tablet, Copy, Check, Layout, Maximize2 } from 'lucide-react'

interface CodePageEditorProps {
    id: string
    title: string
    slug: string
    isFullPage: boolean
    initialHtml: string
    initialCss: string
}

export default function CodePageEditor({
    id,
    title,
    slug,
    isFullPage: initialIsFullPage,
    initialHtml,
    initialCss
}: CodePageEditorProps) {
    const [html, setHtml] = useState(initialHtml || '')
    const [css, setCss] = useState(initialCss || '')
    const [isFullPage, setIsFullPage] = useState(initialIsFullPage || false)
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor')
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
    const [isSaving, setIsSaving] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const result = await updateCustomPageContent(id, html, css, isFullPage)
            if (result.success) {
                toast.success('Full Page Code saved successfully!')
            } else {
                toast.error(result.error || 'Failed to save page code.')
            }
        } catch {
            toast.error('An error occurred while saving.')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCopyAll = () => {
        const fullCode = `<!-- HTML -->\n${html}\n\n/* CSS */\n<style>\n${css}\n</style>`
        navigator.clipboard.writeText(fullCode)
        setCopied(true)
        toast.success('Code copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
    }

    const getDeviceWidth = () => {
        switch (previewDevice) {
            case 'mobile': return 'max-w-[375px]'
            case 'tablet': return 'max-w-[768px]'
            default: return 'w-full'
        }
    }

    return (
        <div className="space-y-4 w-full">
            {/* Header Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                        <Code size={22} />
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

                <div className="flex flex-wrap items-center gap-4">
                    {/* Full Page Layout Mode Toggle */}
                    <div className="flex items-center space-x-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/60">
                        <Maximize2 size={15} className={isFullPage ? "text-primary" : "text-muted-foreground"} />
                        <div className="flex flex-col">
                            <Label htmlFor="fullpage-mode" className="text-xs font-bold cursor-pointer">
                                {isFullPage ? 'Full Page Mode (No Header/Footer)' : 'Standard Mode (With Header/Footer)'}
                            </Label>
                            <span className="text-[10px] text-muted-foreground">
                                {isFullPage ? 'Takes over entire screen (100% full custom page)' : 'Embedded inside site header & footer'}
                            </span>
                        </div>
                        <Switch
                            id="fullpage-mode"
                            checked={isFullPage}
                            onCheckedChange={setIsFullPage}
                        />
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyAll}
                        className="gap-1.5 text-xs"
                    >
                        {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                        {copied ? 'Copied' : 'Copy Code'}
                    </Button>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                    >
                        <Save size={16} />
                        {isSaving ? 'Saving Code...' : 'Save Full Page Code'}
                    </Button>
                </div>
            </div>

            {/* Main Editor / Preview Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'editor' | 'preview')} className="w-full">
                <div className="flex items-center justify-between border-b border-border pb-2">
                    <TabsList className="bg-muted/50 p-1 rounded-lg">
                        <TabsTrigger value="editor" className="gap-2 text-xs font-semibold">
                            <Code size={14} /> Full Code Editor (HTML & CSS & JS)
                        </TabsTrigger>
                        <TabsTrigger value="preview" className="gap-2 text-xs font-semibold">
                            <Eye size={14} /> Live Preview
                        </TabsTrigger>
                    </TabsList>

                    {activeTab === 'preview' && (
                        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-lg border border-border/50">
                            <Button
                                size="icon"
                                variant={previewDevice === 'desktop' ? 'secondary' : 'ghost'}
                                className="h-7 w-7"
                                onClick={() => setPreviewDevice('desktop')}
                                title="Desktop View"
                            >
                                <Monitor size={14} />
                            </Button>
                            <Button
                                size="icon"
                                variant={previewDevice === 'tablet' ? 'secondary' : 'ghost'}
                                className="h-7 w-7"
                                onClick={() => setPreviewDevice('tablet')}
                                title="Tablet View"
                            >
                                <Tablet size={14} />
                            </Button>
                            <Button
                                size="icon"
                                variant={previewDevice === 'mobile' ? 'secondary' : 'ghost'}
                                className="h-7 w-7"
                                onClick={() => setPreviewDevice('mobile')}
                                title="Mobile View"
                            >
                                <Smartphone size={14} />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Editor Content */}
                <TabsContent value="editor" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* HTML Box */}
                        <Card className="border border-border shadow-sm flex flex-col h-[620px]">
                            <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-orange-600">
                                        <span className="bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded text-xs font-mono">HTML</span>
                                        HTML Markup & Structure
                                    </CardTitle>
                                    <CardDescription className="text-xs">HTML elements, sections, text, images, and &lt;script&gt; tags</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 relative bg-[#1e1e1e] rounded-b-xl overflow-hidden">
                                <textarea
                                    value={html}
                                    onChange={(e) => setHtml(e.target.value)}
                                    placeholder="<!-- Write full HTML markup here -->&#10;<div class='hero-section'>&#10;  <h1>My Full Custom Page</h1>&#10;  <p>Full control over layout and elements.</p>&#10;</div>"
                                    className="w-full h-full p-4 font-mono text-xs text-gray-100 bg-transparent resize-none focus:outline-none leading-relaxed"
                                    spellCheck={false}
                                />
                            </CardContent>
                        </Card>

                        {/* CSS Box */}
                        <Card className="border border-border shadow-sm flex flex-col h-[620px]">
                            <CardHeader className="py-3 px-4 bg-muted/30 border-b border-border flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-blue-600">
                                        <span className="bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded text-xs font-mono">CSS</span>
                                        Full Page Styles & Design
                                    </CardTitle>
                                    <CardDescription className="text-xs">Custom CSS styles, colors, responsiveness, animations</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 flex-1 relative bg-[#1e1e1e] rounded-b-xl overflow-hidden">
                                <textarea
                                    value={css}
                                    onChange={(e) => setCss(e.target.value)}
                                    placeholder="/* Write custom CSS styles here */&#10;body {&#10;  background-color: #0f172a;&#10;  color: #ffffff;&#10;}&#10;.hero-section {&#10;  padding: 80px 20px;&#10;  text-align: center;&#10;}"
                                    className="w-full h-full p-4 font-mono text-xs text-blue-300 bg-transparent resize-none focus:outline-none leading-relaxed"
                                    spellCheck={false}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Preview Content */}
                <TabsContent value="preview" className="mt-4">
                    <div className="flex justify-center w-full min-h-[650px] bg-muted/30 p-6 rounded-xl border border-border overflow-auto">
                        <div className={`bg-white text-gray-900 rounded-lg shadow-xl border border-border overflow-hidden transition-all duration-300 ${getDeviceWidth()}`}>
                            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between text-xs text-gray-500 font-mono">
                                <span>Previewing: /p/{slug} ({isFullPage ? 'Full Screen Overlay' : 'Standard Body'})</span>
                                <span>{previewDevice.toUpperCase()}</span>
                            </div>
                            <div className="p-6">
                                {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
                                {html ? (
                                    <div dangerouslySetInnerHTML={{ __html: html }} />
                                ) : (
                                    <div className="flex items-center justify-center py-24 text-gray-400 text-sm border-2 border-dashed rounded-lg">
                                        No HTML code written yet. Switch to Code Editor to build your full page.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
