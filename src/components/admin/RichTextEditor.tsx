'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'

import {
    Bold, Italic, List, ListOrdered, Link as LinkIcon,
    Heading1, Heading2, Heading3, Quote, Undo, Redo,
    Strikethrough, Code, Minus, FileCode, Underline as UnderlineIcon,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Image as ImageIcon, Youtube as YoutubeIcon,
    Unlink, Check, PlusSquare
} from 'lucide-react'

import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    className?: string
}

function LinkPopover({ editor, disabled }: { editor: Editor, disabled: boolean }) {
    const [url, setUrl] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    // Update internal state when popover opens or selection changes
    useEffect(() => {
        if (isOpen) {
            const currentUrl = editor.getAttributes('link').href || ''
            if (currentUrl !== url) {
                setTimeout(() => setUrl(currentUrl), 0)
            }
        }
    }, [isOpen, editor, url])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        }
        setIsOpen(false)
    }

    const removeLink = () => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        setIsOpen(false)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    className={cn(editor.isActive('link') && "bg-accent text-accent-foreground")}
                    title="Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" align="start">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="h-8"
                        autoFocus
                    />
                    <Button type="submit" size="sm" className="h-8 w-8 p-0" title="Save">
                        <Check className="h-4 w-4" />
                    </Button>
                    {editor.isActive('link') && (
                        <Button type="button" variant="destructive" size="sm" className="h-8 w-8 p-0" onClick={removeLink} title="Unlink">
                            <Unlink className="h-4 w-4" />
                        </Button>
                    )}
                </form>
            </PopoverContent>
        </Popover>
    )
}

function MediaPopover({ editor, type, disabled }: { editor: Editor, type: 'image' | 'youtube', disabled: boolean }) {
    const [url, setUrl] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!url) return

        if (type === 'image') {
            editor.chain().focus().setImage({ src: url }).run()
        } else {
            editor.commands.setYoutubeVideo({ src: url })
        }
        setUrl('')
        setIsOpen(false)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" disabled={disabled} title={type === 'image' ? "Insert Image" : "Insert YouTube"}>
                    {type === 'image' ? <ImageIcon className="h-4 w-4" /> : <YoutubeIcon className="h-4 w-4" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" align="start">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder={type === 'image' ? "Image URL..." : "YouTube URL..."}
                        className="h-8"
                        autoFocus
                    />
                    <Button type="submit" size="sm" className="h-8 w-8 p-0">
                        <Check className="h-4 w-4" />
                    </Button>
                </form>
            </PopoverContent>
        </Popover>
    )
}

function WidgetPopover({ editor, disabled }: { editor: Editor, disabled: boolean }) {
    const [isOpen, setIsOpen] = useState(false)

    const insertWidget = (type: 'notice' | 'cta' | 'table') => {
        if (type === 'notice') {
            editor.chain().focus().insertContent(`
                <div class="bg-primary/10 border-l-4 border-primary p-4 rounded-r-md my-6">
                    <p class="font-bold text-primary !mt-0 !mb-2">Notice</p>
                    <p class="!m-0 text-foreground/80">Add your notice text here...</p>
                </div>
            `).run()
        } else if (type === 'cta') {
            editor.chain().focus().insertContent(`
                <div class="bg-card border border-border p-6 rounded-xl my-8 text-center shadow-sm">
                    <h3 class="!mt-0 font-bold text-2xl">Ready to get started?</h3>
                    <p class="text-muted-foreground mb-6">Join thousands of others who have already taken the leap.</p>
                    <a href="#" class="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold no-underline hover:bg-primary/90 transition-colors">Click Here</a>
                </div>
            `).run()
        } else if (type === 'table') {
            editor.chain().focus().insertContent(`
                <div class="overflow-x-auto my-6">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="border-b border-border bg-muted/50">
                                <th class="p-3 font-bold">Feature</th>
                                <th class="p-3 font-bold">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-border">
                                <td class="p-3">Sample Feature</td>
                                <td class="p-3">Sample Detail</td>
                            </tr>
                            <tr class="border-b border-border">
                                <td class="p-3">Sample Feature 2</td>
                                <td class="p-3">Sample Detail 2</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `).run()
        }
        setIsOpen(false)
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" disabled={disabled} title="Insert Custom Widget">
                    <PlusSquare className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 border border-border shadow-lg" align="start">
                <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="sm" className="justify-start font-medium" onClick={() => insertWidget('notice')}>Notice Box</Button>
                    <Button variant="ghost" size="sm" className="justify-start font-medium" onClick={() => insertWidget('cta')}>Call to Action</Button>
                    <Button variant="ghost" size="sm" className="justify-start font-medium" onClick={() => insertWidget('table')}>Simple Table</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
    const [isSourceView, setIsSourceView] = useState(false)
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Underline,
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Youtube.configure({
                controls: false,
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 dark:prose-invert',
            },
        },
        onUpdate: ({ editor }: { editor: Editor }) => {
            onChange(editor.getHTML())
        },
    })

    // Sync editor content when value changes (e.g. from Source View) and editor is active
    useEffect(() => {
        if (editor && !isSourceView && value !== editor.getHTML()) {
            if (Math.abs(value.length - editor.getHTML().length) > 5 || value !== editor.getHTML()) {
                // editor.commands.setContent(value) // Potential cursor jump issue, but needed for sync
            }
        }
    }, [value, editor, isSourceView])

    // When switching OFF source view, update editor content
    const toggleSourceView = () => {
        if (isSourceView) {
            editor?.commands.setContent(value)
        }
        setIsSourceView(!isSourceView)
    }

    if (!editor) {
        return null
    }

    return (
        <div className={cn("border border-input rounded-md bg-background overflow-hidden", className)}>
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-input bg-muted/40">
                {/* History */}
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={isSourceView || !editor.can().chain().focus().undo().run()}>
                    <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={isSourceView || !editor.can().chain().focus().redo().run()}>
                    <Redo className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-gray-200 mx-1" />

                {/* Text Formatting */}
                <Toggle size="sm" pressed={!isSourceView && editor.isActive('bold')} onPressedChange={() => editor.chain().focus().toggleBold().run()} disabled={isSourceView}>
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle size="sm" pressed={!isSourceView && editor.isActive('italic')} onPressedChange={() => editor.chain().focus().toggleItalic().run()} disabled={isSourceView}>
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle size="sm" pressed={!isSourceView && editor.isActive('underline')} onPressedChange={() => editor.chain().focus().toggleUnderline().run()} disabled={isSourceView}>
                    <UnderlineIcon className="h-4 w-4" />
                </Toggle>
                <Toggle size="sm" pressed={!isSourceView && editor.isActive('strike')} onPressedChange={() => editor.chain().focus().toggleStrike().run()} disabled={isSourceView}>
                    <Strikethrough className="h-4 w-4" />
                </Toggle>
                <Toggle size="sm" pressed={!isSourceView && editor.isActive('code')} onPressedChange={() => editor.chain().focus().toggleCode().run()} disabled={isSourceView}>
                    <Code className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-gray-200 mx-1" />

                {/* Headings */}
                <Toggle size="sm" pressed={!isSourceView && editor.isActive('heading', { level: 1 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} disabled={isSourceView}>
                    <Heading1 className="h-4 w-4" />
                </Toggle>
                <Toggle size="sm" pressed={!isSourceView && editor.isActive('heading', { level: 2 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} disabled={isSourceView}>
                    <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle size="sm" pressed={!isSourceView && editor.isActive('heading', { level: 3 })} onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} disabled={isSourceView}>
                    <Heading3 className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-gray-200 mx-1" />

                {/* Alignment */}
                <Toggle size="sm" pressed={!isSourceView && editor.isActive({ textAlign: 'left' })} onPressedChange={() => editor.chain().focus().setTextAlign('left').run()} disabled={isSourceView}>
                    <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle size="sm" pressed={!isSourceView && editor.isActive({ textAlign: 'center' })} onPressedChange={() => editor.chain().focus().setTextAlign('center').run()} disabled={isSourceView}>
                    <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle size="sm" pressed={!isSourceView && editor.isActive({ textAlign: 'right' })} onPressedChange={() => editor.chain().focus().setTextAlign('right').run()} disabled={isSourceView}>
                    <AlignRight className="h-4 w-4" />
                </Toggle>
                <Toggle size="sm" pressed={!isSourceView && editor.isActive({ textAlign: 'justify' })} onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()} disabled={isSourceView}>
                    <AlignJustify className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-gray-200 mx-1" />

                {/* Lists & Quotes */}
                <Toggle size="sm" pressed={!isSourceView && editor.isActive('bulletList')} onPressedChange={() => editor.chain().focus().toggleBulletList().run()} disabled={isSourceView}>
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle size="sm" pressed={!isSourceView && editor.isActive('orderedList')} onPressedChange={() => editor.chain().focus().toggleOrderedList().run()} disabled={isSourceView}>
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle size="sm" pressed={!isSourceView && editor.isActive('blockquote')} onPressedChange={() => editor.chain().focus().toggleBlockquote().run()} disabled={isSourceView}>
                    <Quote className="h-4 w-4" />
                </Toggle>

                <div className="w-px h-6 bg-gray-200 mx-1" />

                {/* Media & Objects */}
                <Button variant="ghost" size="sm" disabled={isSourceView} onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                    <Minus className="h-4 w-4" />
                </Button>

                <LinkPopover editor={editor} disabled={isSourceView} />
                <MediaPopover editor={editor} type="image" disabled={isSourceView} />
                <MediaPopover editor={editor} type="youtube" disabled={isSourceView} />
                <WidgetPopover editor={editor} disabled={isSourceView} />

                <div className="flex-1" />

                {/* Source View */}
                <Toggle size="sm" pressed={isSourceView} onPressedChange={toggleSourceView} aria-label="Toggle Source View" title="Edit HTML Source">
                    <FileCode className="h-4 w-4" />
                </Toggle>
            </div>

            {isSourceView ? (
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="min-h-[200px] border-none focus-visible:ring-0 rounded-none p-4 font-mono text-sm bg-muted/30"
                    placeholder="HTML Source..."
                />
            ) : (
                <EditorContent editor={editor} />
            )}
        </div>
    )
}
