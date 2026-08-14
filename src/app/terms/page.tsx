import { getSiteContent } from '@/app/actions/content'

export const dynamic = 'force-dynamic'

export default async function TermsPage() {
    const { data: content } = await getSiteContent()

    const getValue = (key: string, fallback: string) => {
        return content?.find(c => c.key === key)?.value || fallback
    }

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col">
            {/* Page Header */}
            <div className="bg-primary pt-32 md:pt-40 pb-16 px-4">
                <div className="container mx-auto max-w-6xl text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight mb-4">
                        {getValue('terms_h1', 'Terms of Service')}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto">
                        {getValue('terms_p', 'Last updated: ' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))}
                    </p>
                </div>
            </div>

            <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-card p-8 md:p-12 rounded-2xl shadow-sm border border-border prose prose-red lg:prose-lg dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{
                        __html: getValue('terms_content', `<h3>1. Agreement to Terms</h3>
<p>
    These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Booked Place ("we," "us" or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
</p>

<h3>2. Intellectual Property Rights</h3>
<p>
    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
</p>

<h3>3. User Representations</h3>
<p>
    By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service.
</p>

<h3>4. Contact Us</h3>
<p>
    In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at support@bookplace.com.
</p>`)
                    }} />
                </div>
            </div>
        </div>
    )
}
