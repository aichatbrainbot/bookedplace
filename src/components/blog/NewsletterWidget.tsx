'use client'

import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function NewsletterWidget() {
    return (
        <div className="bg-primary/5 rounded-xl p-6 border border-primary/20 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl mb-2 text-foreground">Join our Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-6">
                Get the latest travel tips, guides, and exclusive deals delivered straight to your inbox.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <Input type="email" placeholder="Your email address" required className="bg-background border-border" />
                <Button type="submit" className="w-full font-bold">Subscribe</Button>
            </form>
            <p className="text-xs text-muted-foreground mt-4 opacity-75">No spam. Unsubscribe anytime.</p>
        </div>
    )
}
