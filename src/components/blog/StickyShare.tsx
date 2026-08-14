'use client'

import { useEffect, useState } from 'react'
import { Facebook, Twitter, Linkedin, Link2 } from 'lucide-react'
import { toast } from 'sonner'

export default function StickyShare({ title, url }: { title: string, url: string }) {

    const [mounted, setMounted] = useState(false)
    const [fullUrl, setFullUrl] = useState(url)

    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/rules-of-hooks, @typescript-eslint/no-unused-expressions
    // eslint-disable-next-line padding-line-between-statements
    /* eslint-disable react-hooks/exhaustive-deps */
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        setMounted(true)
        if (!url.startsWith('http')) {
            setFullUrl(`${window.location.origin}${url}`)
        }
    }, [url])

    const handleCopy = () => {
        navigator.clipboard.writeText(fullUrl)
        toast.success("Link copied to clipboard!")
    }

    return (
        <div className="sticky top-32 flex flex-col gap-3 z-20">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 hidden lg:block">Share</p>

            <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-black hover:text-white transition-all shadow-sm border border-border"
                aria-label="Share on X (Twitter)"
            >
                <Twitter className="w-4 h-4" />
            </a>

            <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-[#1877F2] hover:text-white transition-all shadow-sm border border-border"
                aria-label="Share on Facebook"
            >
                <Facebook className="w-4 h-4" />
            </a>

            <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-[#0A66C2] hover:text-white transition-all shadow-sm border border-border"
                aria-label="Share on LinkedIn"
            >
                <Linkedin className="w-4 h-4" />
            </a>

            <button
                onClick={handleCopy}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-white transition-all shadow-sm border border-border"
                aria-label="Copy Link"
            >
                <Link2 className="w-4 h-4" />
            </button>
        </div>
    )
}
