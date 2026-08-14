import Image from 'next/image'
import { fetchPlaceData } from '@/lib/google-places'
import { ArrowRight } from 'lucide-react'

interface PopularLocationsProps {
    title: string
    subtitle: string
    locationsRaw: string
    apiKey: string
}

export async function PopularLocations({ subtitle, locationsRaw, apiKey }: PopularLocationsProps) {
    if (!locationsRaw || locationsRaw.trim() === '') return null

    // Parse the locations from the comma separated string
    const locationsList = locationsRaw.split(',').map(l => l.trim()).filter(l => l.length > 0)

    // Fetch data for all locations
    const placesDataPromises = locationsList.map(loc => fetchPlaceData(loc, apiKey))
    const validPlaces = await Promise.all(placesDataPromises)

    if (validPlaces.length === 0) return null

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-heading text-neutral-900 dark:text-white">
                        <span className="relative inline-block">
                            Popular
                            <span className="absolute left-0 bottom-0.5 w-full h-[3px] bg-red-600 rounded-full" />
                        </span>{' '}
                        Locations
                    </h2>
                    {subtitle && (
                        <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-medium">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Grid Layout taking inspiration from the image masonry */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {validPlaces.map((place, index) => {
                        // Create a repeating masonry pattern: Large horizontal (span 2), Small square (span 1)
                        // This logic adapts depending on how many items exist

                        // Default span logic for a varied layout
                        const spanClass = "md:col-span-1 lg:col-span-1 h-[250px] md:h-[300px]"

                        // Example dynamic sizing: make every 4th and 5th element span differently if we have a lot
                        if (index === 0 || index === 3) {
                            // Make some items wider on large screens for alternating look
                            // We won't strictly enforce if there's less than 3
                        }

                        // Determine the name to display (fallback to original query if needed)
                        const displayName = locationsList[index] || place.name || 'Location'

                        // Fallback local images if API doesn't return a photo
                        const fallbackImages = ['/loc-1.jpg', '/loc-2.jpg', '/loc-3.jpg', '/loc-4.jpg', '/loc-5.jpg', '/home-hero.jpg']
                        const finalPhotoUrl = place.photoUrl || fallbackImages[index % fallbackImages.length]

                        return (
                            <div
                                key={place.id}
                                className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 w-full flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 ${spanClass}`}
                            >
                                {/* Background Image */}
                                {finalPhotoUrl ? (
                                    <Image
                                        src={finalPhotoUrl}
                                        alt={displayName}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out will-change-transform"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                                        <span className="text-neutral-400 text-sm">No Image</span>
                                    </div>
                                )}

                                {/* Vignette / Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                                {/* Content: Pill centered */}
                                <div className="absolute inset-0 flex items-center justify-center p-6">
                                    <span className="bg-white text-neutral-900 font-bold text-sm tracking-wide px-5 py-2.5 rounded-full shadow-lg transform group-hover:scale-105 transition-transform duration-300 flex items-center gap-2">
                                        {displayName}
                                        {/* Show arrow on hover just for an interactive touch */}
                                        <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}
