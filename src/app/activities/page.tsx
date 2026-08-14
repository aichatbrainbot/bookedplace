import { Metadata } from 'next'
import { getSiteContent } from '@/app/actions/content'
import WidgetRenderer from '@/components/WidgetRenderer'
import { Camera, Users, Sun, Music } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
    const { data: content } = await getSiteContent()
    const getValue = (key: string, fallback: string) => content?.find(c => c.key === key)?.value || fallback

    return {
        title: getValue('activities_seo_title', 'Unforgettable Experiences & Activities'),
        description: getValue('activities_seo_description', 'Create amazing memories with curated tours, sightseeing, and fun activities.'),
        alternates: {
            canonical: '/activities'
        }
    }
}

export default async function ActivitiesPage() {
    const { data: content } = await getSiteContent()

    const getValue = (key: string, fallback: string) => {
        return content?.find(c => c.key === key)?.value || fallback
    }

    const features = [
        { icon: Camera, title: 'Sightseeing', desc: 'Discover iconic landmarks.' },
        { icon: Users, title: 'Group Tours', desc: 'Join others and make friends.' },
        { icon: Sun, title: 'Outdoor Fun', desc: 'Hiking, biking, and more.' },
        { icon: Music, title: 'Nightlife', desc: 'Experience the city after dark.' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[500px] w-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${getValue('activities_hero', '/activities-hero.jpg')})` }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 drop-shadow-lg">
                        {getValue('activities_h1', "Unforgettable Experiences")}
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-gray-100 drop-shadow-md mb-8">
                        {getValue('activities_p', "Create amazing memories with curated tours and activities.")}
                    </p>
                </div>
            </div>

            {/* Widget Container */}
            <div className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8 pb-12">
                <div className="max-w-6xl mx-auto p-6 md:p-8 min-h-[200px]">
                    <div className="text-center mb-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide drop-shadow-md">Find Activities</h2>
                    </div>

                    <div className="w-full">
                        <WidgetRenderer html={getValue('widget_activities', '')} />

                        {!getValue('widget_activities', '') && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                                <p className="text-gray-500 font-medium">Activities Widget Placeholder</p>
                                <p className="text-sm text-gray-400 mt-2">Go to Admin Panel &gt; Content &gt; Widgets to paste your code.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center border border-gray-100">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
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
