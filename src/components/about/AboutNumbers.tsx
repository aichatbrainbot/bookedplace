'use client'

import Image from 'next/image'

export function AboutNumbers({ content }: { content: Record<string, string> }) {
    if (content['about_numbers_show'] === 'false') return null;

    const bgColor = content['about_numbers_bg_color'] || '#ffffff';
    const textColor = content['about_numbers_text_color'] || '#111827';

    return (
        <section className="py-16 md:py-24" style={{ backgroundColor: bgColor }}>
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="flex flex-col gap-6 text-left animate-in slide-in-from-right-5 duration-700 fade-in">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-heading leading-tight pt-8" style={{ color: textColor }}>
                            {content['about_numbers_title'] || "We've got the numbers"}
                        </h2>
                        <p className="text-lg leading-relaxed" style={{ color: textColor, opacity: 0.8 }}>
                            {content['about_numbers_desc'] || 'Every day, we scan and compare millions of travel deals across flights, accommodations, and activities. Our powerful search engine does the heavy lifting so you can quickly find the cheapest, fastest, and best options for your trip.'}
                        </p>
                    </div>

                    <div className="relative h-[350px] md:h-[480px] w-full max-w-[600px] mx-auto animate-in slide-in-from-right-5 duration-700 fade-in delay-200">
                        <Image
                            src={content['about_numbers_image'] || '/about/customer-support.webp'}
                            alt="Data"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
