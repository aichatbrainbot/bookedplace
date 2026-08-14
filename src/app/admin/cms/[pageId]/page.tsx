import { getSiteContent } from '@/app/actions/content'
import CMSPageEditor from '@/components/admin/CMSPageEditor'
import GrapesJSEditorWrapper from '@/components/admin/GrapesJSEditorWrapper'

// Since we are using dynamic routes, we need to ensure this is treated as dynamic
export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ pageId: string }> }) {
    const { pageId } = await params
    const result = await getSiteContent()
    const content = result.success && result.data ? result.data : []

    // Define defaults for Home Page to ensure fields appear even if not in DB
    const defaultHomeContent = [
        { key: 'home_hero_bg_1', value: '/home-hero.jpg' },
        { key: 'home_hero_bg_2', value: '' },
        { key: 'home_hero_bg_3', value: '' },
        { key: 'home_hero_bg_4', value: '' },
        { key: 'home_hero_bg_5', value: '' },
        { key: 'home_hero_bg_6', value: '' },
        { key: 'home_h1', value: 'Booked Place, Where' },
        { key: 'home_rotating_words', value: 'Foodies, Travelers, Tourists' },
        { key: 'home_rotating_color', value: 'red' },
        { key: 'home_rotating_bg', value: 'true' },
        { key: 'home_trusted_badge_text', value: 'Trusted by 1 Million+ Travelers' },
        { key: 'home_show_trusted_badge', value: 'true' },
        { key: 'home_trusted_badge_icon_url', value: '' },
        { key: 'home_h1_suffix', value: 'Meet' },
        { key: 'home_h2', value: 'Unlock exclusive deals on hotels, flights, and unique experiences. Your journey begins here.' },

        // Service Tabs Configuration
        { key: 'home_show_service_tabs', value: 'true' },
        { key: 'home_top_categories_show', value: 'true' },
        { key: 'home_top_cat_title', value: 'Pour les pros du voyage' },
        { key: 'home_top_cat_1_title', value: 'KAYAK.ai' },
        { key: 'home_top_cat_1_desc', value: 'Trouvez des reponses a vos questions de voyage' },
        { key: 'home_top_cat_1_image', value: '' },
        { key: 'home_top_cat_2_title', value: 'Meilleur moment pour voyager' },
        { key: 'home_top_cat_2_desc', value: 'Economisez grace au bon timing' },
        { key: 'home_top_cat_2_image', value: '' },
        { key: 'home_top_cat_3_title', value: 'Explore' },
        { key: 'home_top_cat_3_desc', value: 'Decouvrez des destinations adaptées à votre budget' },
        { key: 'home_top_cat_3_image', value: '' },

        { key: 'home_service_tabs_color', value: 'orange' },

        { key: 'home_tab_flights_show', value: 'true' },
        { key: 'home_tab_flights_label', value: 'Flights' },
        { key: 'home_tab_flights_icon', value: '' },
        { key: 'widget_home', value: '' }, // Flights widget

        { key: 'home_tab_stays_show', value: 'true' },
        { key: 'home_tab_stays_label', value: 'Stays' },
        { key: 'home_tab_stays_icon', value: '' },
        { key: 'widget_stays', value: '' },

        { key: 'home_tab_cars_show', value: 'true' },
        { key: 'home_tab_cars_label', value: 'Cars' },
        { key: 'home_tab_cars_icon', value: '' },
        { key: 'widget_cars', value: '' },

        { key: 'home_tab_activities_show', value: 'true' },
        { key: 'home_tab_activities_label', value: 'Activities' },
        { key: 'home_tab_activities_icon', value: '' },
        { key: 'widget_activities', value: '' },

        { key: 'widget_tpwl_id', value: '' },

        // Top Categories
        { key: 'home_top_cat_title', value: 'Pour les pros du voyage' },
        { key: 'home_top_cat_1_title', value: 'KAYAK.ai' },
        { key: 'home_top_cat_1_desc', value: 'Trouvez des reponses a vos questions de voyage' },
        { key: 'home_top_cat_1_image', value: '' },
        { key: 'home_top_cat_2_title', value: 'Meilleur moment pour voyager' },
        { key: 'home_top_cat_2_desc', value: 'Economisez grace au bon timing' },
        { key: 'home_top_cat_2_image', value: '' },
        { key: 'home_top_cat_3_title', value: 'Explore' },
        { key: 'home_top_cat_3_desc', value: 'Decouvrez des destinations adaptées à votre budget' },
        { key: 'home_top_cat_3_image', value: '' },

        // Popular Locations
        { key: 'home_popular_locations_show', value: 'true' },
        { key: 'google_places_api_key', value: '' },
        { key: 'home_popular_locations_title', value: 'Popular Locations' },
        { key: 'home_popular_locations_subtitle', value: 'Connecting Needs with Offers for the Professional Flight Services, Book your next flight appointment with ease.' },
        { key: 'home_popular_locations_list', value: 'Denmark, Belgium, Mexico, Indonesia, Romania, India' },

        // FAQ Section Configuration
        { key: 'home_faq_show', value: 'true' },
        { key: 'home_faq_title', value: 'Frequently Asked Questions' },
        {
            key: 'home_faq_list', value: JSON.stringify([
                { question: 'How do I book a flight?', answer: 'Search for your destination and dates on our homepage, select a flight that suits you, and follow the booking process.' },
                { question: 'What payment methods are accepted?', answer: 'We accept all major credit cards, PayPal, and bank transfers.' },
                { question: 'Can I cancel my reservation?', answer: 'Cancellation policies vary depending on the service provider. Please refer to the specific terms during checkout.' }
            ])
        },
    ]

    const defaultAboutContent = [
        { key: 'about_hero_tag', value: 'A BookedPlace company' },
        { key: 'about_hero_show', value: 'true' },
        { key: 'about_hero_bg_color', value: '#ffffff' },
        { key: 'about_hero_text_color', value: '#111827' },
        { key: 'about_hero_title', value: 'Find the best\ndeals.' },
        { key: 'about_hero_desc', value: 'BookedPlace helps travelers find and compare the best prices on flights, hotels, homes, and car rentals from top providers globally.' },
        { key: 'about_hero_btn_text', value: 'Contact Us' },
        { key: 'about_hero_btn_link', value: '/contact' },
        { key: 'about_hero_image', value: '/about/tours-activities.webp' },

        { key: 'about_global_show', value: 'true' },
        { key: 'about_global_bg_color', value: '#ffffff' },
        { key: 'about_global_text_color', value: '#111827' },
        { key: 'about_global_tag', value: 'Worldwide Search' },
        { key: 'about_global_title', value: 'We\'re global' },
        { key: 'about_global_desc', value: 'BookedPlace searches across hundreds of travel providers to find you the best deals. Wherever your next destination is, we help you find the perfect flight, stay, and experience.' },
        { key: 'about_global_image', value: '/about/flight-booking.webp' },

        { key: 'about_numbers_show', value: 'true' },
        { key: 'about_numbers_bg_color', value: '#ffffff' },
        { key: 'about_numbers_text_color', value: '#111827' },
        { key: 'about_numbers_title', value: 'We\'ve got the numbers' },
        { key: 'about_numbers_desc', value: 'Every day, we scan and compare millions of travel deals across flights, accommodations, and activities. Our powerful search engine does the heavy lifting so you can quickly find the cheapest, fastest, and best options for your trip.' },
        { key: 'about_numbers_image', value: '/about/customer-support.webp' },

        { key: 'about_partner_show', value: 'true' },
        { key: 'about_partner_bg_color', value: '#ffffff' },
        { key: 'about_partner_text_color', value: '#111827' },
        { key: 'about_partner_title', value: 'Partner with us' },
        { key: 'about_partner_desc', value: 'Are you a travel provider, agency, or content creator? Join our expanding affiliate network and connect your inventory or audience with our powerful comparison engine to drive mutual growth.' },
        { key: 'about_partner_link_text', value: 'Learn more' },
        { key: 'about_partner_link_url', value: '/' },
        { key: 'about_partner_image', value: '/about/hotel-booking.webp' },

        { key: 'about_trees_show', value: 'true' },
        { key: 'about_trees_bg_color', value: '#ffffff' },
        { key: 'about_trees_text_color', value: '#111827' },
        { key: 'about_trees_tag', value: 'Our Mission' },
        { key: 'about_trees_title', value: 'Saving more than <br /> just money' },
        { key: 'about_trees_desc', value: 'While we help you find the best travel prices effortlessly, we also care about the impact on our planet. We partner with eco-friendly providers and support green initiatives to help offset the carbon footprint of global travel.' },
        { key: 'about_trees_link_text', value: 'Learn more' },
        { key: 'about_trees_link_url', value: '/' },
        { key: 'about_trees_image', value: '/about/tours-activities.webp' },

        { key: 'about_join_show', value: 'true' },
        { key: 'about_join_bg_color', value: '#ffffff' },
        { key: 'about_join_text_color', value: '#111827' },
        { key: 'about_join_title', value: 'Join our team' },
        { key: 'about_join_desc', value: 'We are a passionate team of innovators building a powerful, transparent, and easy-to-use travel comparison platform. With team members across the globe, we are always on the lookout for talent. Let\'s build the future of travel together.' },
        { key: 'about_join_link_text', value: 'View open roles' },
        { key: 'about_join_link_url', value: '/' },
        { key: 'about_join_image', value: '/about/flight-booking.webp' },

        { key: 'about_cta_show', value: 'true' },
        { key: 'about_cta_bg_color', value: '#e63946' },
        { key: 'about_cta_text_color', value: '#ffffff' },
        { key: 'about_cta_title', value: 'Get in Touch' },
        { key: 'about_cta_desc', value: 'Have questions about our travel partnerships or need assistance? Our team is here to help you get the best deal.' },
        { key: 'about_cta_btn_text', value: 'Contact Us' },
        { key: 'about_cta_btn_link', value: '/contact' },
    ]

    const defaultTermsContent = [
        { key: 'terms_h1', value: 'Terms of Service' },
        { key: 'terms_p', value: 'Last updated: ' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
        {
            key: 'terms_content', value: `<h3>1. Agreement to Terms</h3>
<p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Booked Place ("we," "us" or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").</p>
<h3>2. Intellectual Property Rights</h3>
<p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>
<h3>3. User Representations</h3>
<p>By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service.</p>
<h3>4. Contact Us</h3>
<p>In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at support@bookplace.com.</p>` }
    ]

    const defaultPrivacyContent = [
        { key: 'privacy_h1', value: 'Privacy Policy' },
        { key: 'privacy_p', value: 'Last updated: ' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
        {
            key: 'privacy_content', value: `<h3>1. Introduction</h3>
<p>Welcome to Booked Place. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
<h3>2. Data We Collect</h3>
<p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
<ul>
<li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
<li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
<li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
</ul>
<h3>3. How We Use Your Data</h3>
<p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
<ul>
<li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
<li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
<li>Where we need to comply with a legal or regulatory obligation.</li>
</ul>
<h3>4. Contact Us</h3>
<p>If you have any questions about this privacy policy or our privacy practices, please contact us at support@bookplace.com.</p>` }
    ]

    // Merge defaults: Use DB content if exists, otherwise use default
    // Only applies if pageId is 'home', 'about', 'terms', or 'privacy'
    let finalContent = content
    if (pageId === 'home') {
        const existingKeys = new Set(content.map(c => c.key))
        const missingDefaults = defaultHomeContent
            .filter(d => !existingKeys.has(d.key))
            .map(d => ({ ...d, id: -1, category: 'Home', updatedAt: new Date() })) // Temporary ID

        finalContent = [...content, ...missingDefaults]
    } else if (pageId === 'about') {
        const existingKeys = new Set(content.map(c => c.key))
        const missingDefaults = defaultAboutContent
            .filter(d => !existingKeys.has(d.key))
            .map(d => ({ ...d, id: -1, category: 'About', updatedAt: new Date() })) // Temporary ID

        finalContent = [...content, ...missingDefaults]
    } else if (pageId === 'terms') {
        const existingKeys = new Set(content.map(c => c.key))
        const missingDefaults = defaultTermsContent
            .filter(d => !existingKeys.has(d.key))
            .map(d => ({ ...d, id: -1, category: 'Terms', updatedAt: new Date() })) // Temporary ID

        finalContent = [...content, ...missingDefaults]
    } else if (pageId === 'privacy') {
        const existingKeys = new Set(content.map(c => c.key))
        const missingDefaults = defaultPrivacyContent
            .filter(d => !existingKeys.has(d.key))
            .map(d => ({ ...d, id: -1, category: 'Privacy', updatedAt: new Date() })) // Temporary ID

        finalContent = [...content, ...missingDefaults]
    }

    if (pageId === 'flights') {
        const initialHtml = finalContent.find(c => c.key === 'flights_grapesjs_html')?.value || ''
        const initialCss = finalContent.find(c => c.key === 'flights_grapesjs_css')?.value || ''

        return (
            <div className="w-full space-y-6">
                <GrapesJSEditorWrapper
                    pageId="flights"
                    initialHtml={initialHtml}
                    initialCss={initialCss}
                />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <CMSPageEditor pageId={pageId} initialContent={finalContent} />
        </div>
    )
}
