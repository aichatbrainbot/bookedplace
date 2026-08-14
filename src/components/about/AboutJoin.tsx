'use client'

import Image from 'next/image'
import Link from 'next/link'

export function AboutJoin({ content }: { content: Record<string, string> }) {
    if (content['about_join_show'] === 'false') return null;

    const bgColor = content['about_join_bg_color'] || '#ffffff';
    const textColor = content['about_join_text_color'] || '#111827';

    return (
        <section className="py-16 md:py-24 relative overflow-hidden" style={{ backgroundColor: bgColor }}>
            {/* Circular light gray background behind image placeholder for join */}
            <div className="absolute top-1/2 right-10 md:right-32 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-black/5 rounded-full -z-10" />

            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="order-2 lg:order-1 flex flex-col gap-4 text-left animate-in slide-in-from-left-5 duration-700 fade-in">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-heading" style={{ color: textColor }}>
                            {content['about_join_title'] || 'Join our team'}
                        </h2>
                        <p className="text-lg leading-relaxed" style={{ color: textColor, opacity: 0.8 }}>
                            {content['about_join_desc'] || "We are a passionate team of innovators building a powerful, transparent, and easy-to-use travel comparison platform. With team members across the globe, we are always on the lookout for talent. Let's build the future of travel together."}
                        </p>
                        <div className="mt-2 text-primary font-bold hover:underline">
                            <Link href={content['about_join_link_url'] || '/'}>{content['about_join_link_text'] || 'View open roles'} {'>'}</Link>
                        </div>
                    </div>

                    <div className="order-1 lg:order-2 relative h-[350px] md:h-[480px] w-full max-w-[600px] mx-auto animate-in slide-in-from-right-5 duration-700 fade-in">
                        <Image
                            src={content['about_join_image'] || '/about/flight-booking.webp'}
                            alt="Join Team"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
