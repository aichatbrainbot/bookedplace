import { Metadata } from 'next'
import { getSiteContent } from '@/app/actions/content'
import WidgetRenderer from '@/components/WidgetRenderer'
import { Plane, Calendar, MapPin, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
    const { data: content } = await getSiteContent()
    const getValue = (key: string, fallback: string) => content?.find(c => c.key === key)?.value || fallback

    return {
        title: getValue('flights_seo_title', 'Search and Book Cheap Flights'),
        description: getValue('flights_seo_description', 'Find the best flight deals to your dream destinations anywhere in the world.'),
        alternates: {
            canonical: '/flights'
        }
    }
}

export default async function FlightsPage() {
    const { data: content } = await getSiteContent()

    const getValue = (key: string, fallback: string) => {
        return content?.find(c => c.key === key)?.value || fallback
    }

    const grapesHtml = getValue('flights_grapesjs_html', '')
    const grapesCss = getValue('flights_grapesjs_css', '')

    // Render GrapesJS content if it exists
    if (grapesHtml && grapesHtml.trim() !== '') {
        return (
            <div className="w-full min-h-screen">
                {grapesCss && (
                    <style dangerouslySetInnerHTML={{ __html: grapesCss }} />
                )}
                <div
                    dangerouslySetInnerHTML={{ __html: grapesHtml }}
                    className="grapesjs-content-wrapper"
                />
            </div>
        )
    }

    // Default Fallback Layout (if no GrapesJS content is saved yet)
    const features = [
        { icon: Plane, title: 'Best Airlines', desc: 'Partnering with top global carriers.' },
        { icon: Calendar, title: 'Flexible Dates', desc: 'Easy rescheduling options available.' },
        { icon: MapPin, title: 'Global Reach', desc: 'Flights to over 2,000 destinations.' },
        { icon: ShieldCheck, title: 'Secure Booking', desc: '100% secure payment processing.' },
    ]

    const heroImage = getValue('flights_hero_bg', '/flights-hero-new.png')

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Original Static Hero Section */}
            <div className="relative h-[500px] w-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url('${heroImage}')` }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 drop-shadow-lg">
                        {getValue('flights_h1', "Discover the World")}
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-gray-100 drop-shadow-md mb-8">
                        {getValue('flights_p', "Find the best flight deals to your dream destinations.")}
                    </p>
                </div>
            </div>

            {/* Widget Container - Overlapping Hero */}
            <div className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8 pb-12">
                <div className="max-w-6xl mx-auto p-6 md:p-8 min-h-[200px]">
                    <div className="text-center mb-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide drop-shadow-md">Search Flights</h2>
                    </div>

                    {/* Widget Area */}
                    <div className="w-full">
                        <WidgetRenderer html={getValue('widget_flights', '')} />

                        {!getValue('widget_flights', '') && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                                <p className="text-gray-500 font-medium">Flight Search Widget Will Appear Here</p>
                                <p className="text-sm text-gray-400 mt-2">Go to Admin Panel &gt; Content &gt; Flights Page to paste your code.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center border border-gray-100">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4">
                                <feature.icon size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-500 text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
