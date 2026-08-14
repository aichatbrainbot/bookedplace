import { getSiteContent } from '@/app/actions/content'
import WidgetRenderer from '@/components/WidgetRenderer'
import { Bus, Clock, MapPin, UserCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AirportTransportationPage() {
    const { data: content } = await getSiteContent()

    const getValue = (key: string, fallback: string) => {
        return content?.find(c => c.key === key)?.value || fallback
    }

    const features = [
        { icon: Bus, title: 'Reliable Transfers', desc: 'On-time pickup guaranteed.' },
        { icon: Clock, title: '24/7 Service', desc: 'Available for any flight time.' },
        { icon: MapPin, title: 'Door to Door', desc: 'Direct transport to your hotel.' },
        { icon: UserCheck, title: 'Professional Drivers', desc: 'Experienced and vetted staff.' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Hero Section */}
            <div className="relative h-[500px] w-full bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${getValue('transport_hero', '/taxi-hero.jpg')})` }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 drop-shadow-lg">
                        {getValue('transport_h1', "Seamless Airport Transfers")}
                    </h1>
                    <p className="text-xl md:text-2xl font-light text-gray-100 drop-shadow-md mb-8">
                        {getValue('transport_p', "Start your journey with comfort and peace of mind.")}
                    </p>
                </div>
            </div>

            {/* Widget Container */}
            <div className="relative z-20 -mt-24 px-4 sm:px-6 lg:px-8 pb-12">
                <div className="max-w-6xl mx-auto p-6 md:p-8 min-h-[200px]">
                    <div className="text-center mb-6">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wide drop-shadow-md">Book Transfer</h2>
                    </div>

                    <div className="w-full">
                        <WidgetRenderer html={getValue('widget_transport', '')} />

                        {!getValue('widget_transport', '') && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                                <p className="text-gray-500 font-medium">Transportation Widget Placeholder</p>
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
