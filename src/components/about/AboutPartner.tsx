'use client'

import Image from 'next/image'
import Link from 'next/link'

export function AboutPartner({ content }: { content: Record<string, string> }) {
    if (content['about_partner_show'] === 'false') return null;

    const bgColor = content['about_partner_bg_color'] || '#ffffff';
    const textColor = content['about_partner_text_color'] || '#111827';

    return (
        <section className="py-16 md:py-24 border-t border-gray-100" style={{ backgroundColor: bgColor }}>
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="order-2 lg:order-1 relative h-[350px] md:h-[480px] w-full max-w-[600px] mx-auto animate-in slide-in-from-bottom-5 duration-700 fade-in delay-200">
                        <Image
                            src={content['about_partner_image'] || '/about/hotel-booking.webp'}
                            alt="Partner"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <div className="order-1 lg:order-2 space-y-6">
                        <h2 className="text-3xl md:text-5xl lg:text-5xl font-extrabold tracking-tight font-heading" style={{ color: textColor }}>
                            {content['about_partner_title'] || 'Partner with us'}
                        </h2>

                        <p className="text-lg leading-relaxed max-w-xl" style={{ color: textColor, opacity: 0.8 }}>
                            {content['about_partner_desc'] || 'Are you a travel provider, agency, or content creator? Join our expanding affiliate network and connect your inventory or audience with our powerful comparison engine to drive mutual growth.'}
                        </p>

                        <div className="pt-4">
                            <Link href={content['about_partner_link_url'] || '/'} className="inline-flex h-12 items-center justify-center rounded-full bg-[#D71616] px-8 text-sm font-semibold text-white shadow-lg shadow-[#D71616]/20 transition-all hover:bg-[#A30000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D71616]">
                                {content['about_partner_link_text'] || 'Learn more'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
