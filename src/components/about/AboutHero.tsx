'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AboutHero({ content }: { content: Record<string, string> }) {
    if (content['about_hero_show'] === 'false') return null;

    const bgColor = content['about_hero_bg_color'] || '#ffffff';
    const textColor = content['about_hero_text_color'] || '#111827';

    return (
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden" style={{ backgroundColor: bgColor }}>
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="flex flex-col gap-6 text-left animate-in slide-in-from-bottom-5 duration-700 fade-in">
                        <div className="text-sm font-semibold tracking-wider uppercase" style={{ color: textColor, opacity: 0.8 }}>
                            {content['about_hero_tag'] || 'A BookedPlace company'}
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight font-heading leading-tight" style={{ color: textColor }} dangerouslySetInnerHTML={{ __html: content['about_hero_title']?.replace(/\n/g, '<br />') || 'Find the best<br />deals.' }}>
                        </h1>
                        <p className="text-lg md:text-xl max-w-[600px] leading-relaxed" style={{ color: textColor, opacity: 0.8 }}>
                            {content['about_hero_desc'] || 'BookedPlace helps travelers find and compare the best prices on flights, hotels, homes, and car rentals from top providers globally.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 mt-2">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold text-base h-12 px-8 rounded-full shadow-lg transition-all hover:-translate-y-1" asChild>
                                <Link href={content['about_hero_btn_link'] || '/contact'}>
                                    {content['about_hero_btn_text'] || 'Contact Us'}
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="relative animate-in slide-in-from-right-5 duration-1000 fade-in delay-200">
                        <div className="relative aspect-square md:aspect-[4/3] w-full max-w-[700px] mx-auto">
                            {/* Main Image Container */}
                            <div className="relative w-full h-full">
                                <Image
                                    src={content['about_hero_image'] || '/about/tours-activities.webp'}
                                    alt="Traveling"
                                    fill
                                    className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

