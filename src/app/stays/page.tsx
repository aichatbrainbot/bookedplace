import { Metadata } from 'next'
import Link from 'next/link'
import { getSiteContent } from '@/app/actions/content'
import { getStays } from '@/features/stays/db'
import WidgetRenderer from '@/components/WidgetRenderer'
import { Home, Star, Shield, Award } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
    const { data: content } = await getSiteContent()
    const getValue = (key: string, fallback: string) => content?.find(c => c.key === key)?.value || fallback

    return {
        title: getValue('stays_seo_title', 'Find Your Perfect Stay - Hotels & Vacation Rentals'),
        description: getValue('stays_seo_description', 'Discover top-rated hotels, villas, and apartments for your next adventure.'),
        alternates: {
            canonical: '/stays'
        }
    }
}

export default async function StaysPage() {
    const { data: content } = await getSiteContent()
    const stays = await getStays()

    const getValue = (key: string, fallback: string) => {
        return content?.find(c => c.key === key)?.value || fallback
    }

    const features = [
        { icon: Home, title: 'Handpicked Homes', desc: 'Verified quality and comfort.' },
        { icon: Star, title: 'Top Rated', desc: 'Stay in the best-reviewed properties.' },
        { icon: Shield, title: 'Secure Booking', desc: 'Your payment and privacy are safe.' },
        { icon: Award, title: 'Best Prices', desc: 'Price match guarantee on all stays.' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[500px] w-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url('/stays-hero.jpg')` }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 drop-shadow-lg">
                        {getValue('stays_h1', "Find Your Perfect Stay")}
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-gray-100 drop-shadow-md mb-8">
                        {getValue('stays_p', "Discover top-rated hotels, villas, and apartments.")}
                    </p>
                </div>
            </div>

            {/* Widget Container - Overlapping Hero */}
            <div className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8 pb-12">
                <div className="max-w-6xl mx-auto p-6 md:p-8 min-h-[200px]">
                    <div className="text-center mb-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide drop-shadow-md">Search Stays</h2>
                    </div>

                    {/* Widget Area */}
                    <div className="w-full">
                        <WidgetRenderer html={getValue('widget_stays', '')} />

                        {!getValue('widget_stays', '') && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                                <p className="text-gray-500 font-medium">Hotel Search Widget Will Appear Here</p>
                                <p className="text-sm text-gray-400 mt-2">Go to Admin Panel &gt; Content &gt; Widgets to paste your code.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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

                {/* Stays Grid */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 font-heading">Featured Properties</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stays.map((stay) => {
                            let images = []
                            try {
                                images = JSON.parse(stay.images)
                            } catch { images = [stay.images] }
                            const image = images[0] || '/stays-hero.jpg'

                            return (
                                <Link href={`/stays/${stay.id}`} key={stay.id} className="block group">
                                    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 h-full flex flex-col">
                                        <div className="h-64 bg-gray-200 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${image})` }} />
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                                {stay.rating || 'New'} ★
                                            </div>
                                        </div>
                                        <div className="p-6 text-left flex-1 flex flex-col">
                                            <h3 className="font-heading font-bold text-xl mb-2 text-gray-900 group-hover:text-primary transition-colors">{stay.title}</h3>
                                            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{stay.description}</p>
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-auto">
                                                <span className="font-bold text-lg">${Number(stay.price)}<span className="text-sm font-normal text-gray-500">/night</span></span>
                                                <span className="text-primary text-sm font-medium">Book Now →</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
