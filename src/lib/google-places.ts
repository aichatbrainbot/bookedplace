// src/lib/google-places.ts

export interface PlaceData {
    id: string
    name: string
    formattedAddress: string
    lat: number
    lng: number
    photoUrl: string | null
}

export async function fetchPlaceData(query: string, apiKey: string): Promise<PlaceData> {
    const fallbackPlace: PlaceData = {
        id: `fallback-${encodeURIComponent(query)}`,
        name: query, // Fallback to the search query itself
        formattedAddress: query,
        lat: 0,
        lng: 0,
        photoUrl: null
    }

    if (!apiKey) {
        console.warn('Google Places API key is missing. Using fallback for:', query)
        return fallbackPlace
    }

    try {
        // 1. Text Search to get place details and photo reference
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`

        const searchRes = await fetch(searchUrl, {
            // Cache heavily to avoid hitting API limits. Revalidate once a week (604800) or day (86400).
            next: { revalidate: 86400 }
        })

        if (!searchRes.ok) {
            console.error(`Failed to fetch place data for ${query}: ${searchRes.statusText}`)
            return fallbackPlace
        }

        const searchData = await searchRes.json()

        if (searchData.status !== 'OK' || !searchData.results || searchData.results.length === 0) {
            console.warn(`Google Places Error for query "${query}": Status ${searchData.status}. Error Message: ${searchData.error_message || 'No results'}`)
            return fallbackPlace
        }

        const place = searchData.results[0]
        const photoReference = place.photos && place.photos.length > 0 ? place.photos[0].photo_reference : null

        // 2. Construct Photo URL
        let photoUrl = null
        if (photoReference) {
            // We can construct the URL directly for img src or next/image bypassing heavy fetches,
            // but Google Places Photo API returns a redirect that Next.js Image component handles well
            // IF the domains are allowlisted in next.config.ts.
            photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${apiKey}`
        }

        return {
            id: place.place_id,
            name: place.name || query,
            formattedAddress: place.formatted_address,
            lat: place.geometry?.location?.lat || 0,
            lng: place.geometry?.location?.lng || 0,
            photoUrl: photoUrl
        }

    } catch (error) {
        console.error('Error fetching data from Google Places:', error)
        return fallbackPlace
    }
}
