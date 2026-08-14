import { getSiteContent } from '@/app/actions/content'

export const dynamic = 'force-dynamic'

export default async function PrivacyPage() {
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
                        {getValue('privacy_h1', 'Privacy Policy')}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 font-medium max-w-2xl mx-auto">
                        {getValue('privacy_p', 'Last updated: ' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))}
                    </p>
                </div>
            </div>

            <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-card p-8 md:p-12 rounded-2xl shadow-sm border border-border prose prose-red lg:prose-lg dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{
                        __html: getValue('privacy_content', `<h3>1. Introduction</h3>
<p>
    Welcome to Booked Place. We respect your privacy and are committed to protecting your personal data.
    This privacy policy will inform you as to how we look after your personal data when you visit our website
    and tell you about your privacy rights and how the law protects you.
</p>

<h3>2. Data We Collect</h3>
<p>
    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
</p>
<ul>
    <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
    <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
    <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
</ul>

<h3>3. How We Use Your Data</h3>
<p>
    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
</p>
<ul>
    <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
    <li>Where we need to comply with a legal or regulatory obligation.</li>
</ul>

<h3>4. Contact Us</h3>
<p>
    If you have any questions about this privacy policy or our privacy practices, please contact us at support@bookplace.com.
</p>`)
                    }} />
                </div>
            </div>
        </div>
    )
}
