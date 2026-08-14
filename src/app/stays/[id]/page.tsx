import { getProperty } from '@/features/stays/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Star, User, ShieldCheck } from 'lucide-react'
import WidgetRenderer from '@/components/WidgetRenderer'

export const dynamic = 'force-dynamic'

export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const property = await getProperty(id)

    if (!property) {
        notFound()
    }

    let images: string[] = []
    try {
        images = JSON.parse(property.images)
    } catch {
        images = [property.images || '/stays-hero.jpg']
    }
    const mainImage = images[0] || '/stays-hero.jpg'

    return (
        <div className="min-h-screen bg-white">
            {/* Gallery Section */}
            <div className="relative h-[50vh] min-h-[400px] w-full bg-gray-100">
                <Image
                    src={mainImage}
                    alt={property.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-white mb-2 font-heading shadow-sm">{property.title}</h1>
                    <div className="flex items-center text-white/90 gap-4 text-sm font-medium">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {property.location}</span>
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {property.rating || 'New'}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-heading">About this place</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">{property.description}</p>
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-heading">What this place offers</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="p-2 bg-gray-100 rounded-full"><ShieldCheck className="w-5 h-5" /></div>
                                <span>Verified Listing</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="p-2 bg-gray-100 rounded-full"><User className="w-5 h-5" /></div>
                                <span>Host Greet</span>
                            </div>
                            {/* Add more amenities dynamically if available in schema */}
                        </div>
                    </div>
                </div>

                {/* Booking Card */}
                <div className="lg:col-span-1">
                    {property.widgetCode ? (
                        <div className="sticky top-24">
                            <WidgetRenderer html={property.widgetCode} />
                        </div>
                    ) : (
                        <Card className="sticky top-24 shadow-xl border-0 ring-1 ring-gray-200">
                            <CardContent className="p-6 space-y-6">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-2xl font-bold text-gray-900">${Number(property.price)} <span className="text-lg font-normal text-gray-500">/ night</span></span>
                                    <span className="text-sm text-gray-500 font-medium">★ {property.rating || 'New'}</span>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <div className="text-sm font-medium mb-2">Select Dates</div>
                                    <Calendar mode="range" className="rounded-md border mx-auto w-full" />
                                </div>

                                <Button className="w-full h-12 text-lg font-bold bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                                    Reserve now
                                </Button>

                                <p className="text-center text-xs text-gray-400 mt-4">You won&apos;t be charged yet</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
