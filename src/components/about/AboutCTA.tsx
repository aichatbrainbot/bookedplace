'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function AboutCTA({ content }: { content: Record<string, string> }) {
    if (content['about_cta_show'] === 'false') return null;

    const bgColor = content['about_cta_bg_color'] || '#e63946';
    const textColor = content['about_cta_text_color'] || '#ffffff';

    return (
        <section className="relative pt-32 pb-24 mt-16 overflow-hidden" style={{ backgroundColor: bgColor }}>
            {/* Wavy Top SVG */}
            <div className="absolute top-[-1px] left-0 w-full overflow-hidden leading-none z-10">
                <svg className="relative block w-[calc(100%+1.3px)] h-[80px] md:h-[120px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
                </svg>
            </div>

            <div className="container px-4 md:px-6 mx-auto relative z-20">
                <div className="max-w-2xl text-left space-y-6">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-heading" style={{ color: textColor }}>
                        {content['about_cta_title'] || 'Get in Touch'}
                    </h2>
                    <p className="text-lg" style={{ color: textColor, opacity: 0.9 }}>
                        {content['about_cta_desc'] || 'Have questions about our travel partnerships or need assistance? Our team is here to help you get the best deal.'}
                    </p>
                    <div className="pt-4">
                        <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent text-white border-white hover:bg-white hover:text-primary font-bold rounded-full transition-colors" asChild>
                            <Link href={content['about_cta_btn_link'] || '/contact'}>
                                {content['about_cta_btn_text'] || 'Contact Us'}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

