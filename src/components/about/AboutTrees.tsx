'use client'

import Image from 'next/image'
import Link from 'next/link'

export function AboutTrees({ content }: { content: Record<string, string> }) {
    if (content['about_trees_show'] === 'false') return null;

    const bgColor = content['about_trees_bg_color'] || '#ffffff';
    const textColor = content['about_trees_text_color'] || '#111827';

    return (
        <section className="py-16 md:py-24" style={{ backgroundColor: bgColor }}>
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
                    <div className="relative h-[350px] md:h-[480px] w-full max-w-[600px] mx-auto animate-in slide-in-from-left-5 duration-700 fade-in">
                        <Image
                            src={content['about_trees_image'] || '/about/tours-activities.webp'}
                            alt="Trees"
                            fill
                            className="object-contain"
                        />
                    </div>

                    <div className="flex flex-col gap-4 text-left animate-in slide-in-from-left-5 duration-700 fade-in">
                        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: textColor, opacity: 0.8 }}>
                            {content['about_trees_tag'] || 'Our Mission'}
                        </p>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-heading" style={{ color: textColor }} dangerouslySetInnerHTML={{ __html: content['about_trees_title'] || 'Saving more than <br /> just money' }}>
                        </h2>
                        <p className="text-lg leading-relaxed" style={{ color: textColor, opacity: 0.8 }}>
                            {content['about_trees_desc'] || 'While we help you find the best travel prices effortlessly, we also care about the impact on our planet. We partner with eco-friendly providers and support green initiatives to help offset the carbon footprint of global travel.'}
                        </p>
                        <div className="mt-2 text-primary font-bold hover:underline">
                            <Link href={content['about_trees_link_url'] || '/'}>{content['about_trees_link_text'] || 'Learn more'} {'>'}</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
