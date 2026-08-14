'use client'

import Image from 'next/image'

export function AboutGlobal({ content }: { content: Record<string, string> }) {
    if (content['about_global_show'] === 'false') return null;

    const bgColor = content['about_global_bg_color'] || '#ffffff';
    const textColor = content['about_global_text_color'] || '#111827';

    return (
        <section className="py-16 md:py-24 relative overflow-hidden" style={{ backgroundColor: bgColor }}>
            {/* Very light gray diagonal background shape similar to hopper */}
            <div className="absolute top-0 right-0 left-0 h-[600px] w-full bg-black/5 -rotate-3 transform origin-top-left -z-10 rounded-br-[100px]" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="order-2 lg:order-1 relative h-[350px] md:h-[480px] w-full max-w-[600px] mx-auto animate-in slide-in-from-left-5 duration-700 fade-in">
                        <Image
                            src={content['about_global_image'] || '/about/flight-booking.webp'}
                            alt="Global"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <div className="order-1 lg:order-2 flex flex-col gap-4 text-left animate-in slide-in-from-right-5 duration-700 fade-in">
                        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: textColor, opacity: 0.8 }}>
                            {content['about_global_tag'] || 'Worldwide Search'}
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-heading" style={{ color: textColor }}>
                            {content['about_global_title'] || "We're global"}
                        </h2>
                        <p className="text-lg leading-relaxed" style={{ color: textColor, opacity: 0.8 }}>
                            {content['about_global_desc'] || 'BookedPlace searches across hundreds of travel providers to find you the best deals. Wherever your next destination is, we help you find the perfect flight, stay, and experience.'}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
