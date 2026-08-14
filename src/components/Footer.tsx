'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Facebook, Twitter, Instagram } from 'lucide-react';

interface FooterProps {
    title?: string;
    logoUrl?: string;
    description?: string;
    socials?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
    }
    linksVisibility?: {
        blog?: boolean;
        activities?: boolean;
        stays?: boolean;
        contact?: boolean;
        admin?: boolean;
        privacy?: boolean;
        terms?: boolean;
    }
    customLink?: {
        show?: boolean;
        name?: string;
        url?: string;
        section?: string;
    }
}

export default function Footer({
    title = 'Booked Place',
    logoUrl,
    description = 'Where Food Lovers, Travelers, Tourists, and Explorers Meet.',
    socials,
    linksVisibility,
    customLink
}: FooterProps) {
    const pathname = usePathname();

    if (pathname?.startsWith('/admin') || pathname === '/login') return null;

    return (
        <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-12">
            <div className="max-w-[1440px] mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Column 1: Booked Place */}
                    <div className="space-y-6">
                        <div>
                            {logoUrl ? (
                                <Image
                                    src={logoUrl}
                                    alt={title}
                                    width={150}
                                    height={48}
                                    className="h-12 w-auto object-contain mb-4"
                                />
                            ) : (
                                <span className="text-2xl font-bold font-heading text-[#D71616]">{title}</span>
                            )}
                        </div>
                        <p className="text-neutral-600 text-sm leading-relaxed max-w-xs">
                            {description}
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            {socials?.facebook && (
                                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#D71616] hover:text-white transition-all">
                                    <Facebook size={16} />
                                </a>
                            )}
                            {socials?.twitter && (
                                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#D71616] hover:text-white transition-all">
                                    <Twitter size={16} />
                                </a>
                            )}
                            {socials?.instagram && (
                                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#D71616] hover:text-white transition-all">
                                    <Instagram size={16} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Discover */}
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-6">Discover</h3>
                        <ul className="space-y-4">
                            {linksVisibility?.blog !== false && (
                                <li>
                                    <Link href="/blog" className="text-neutral-600 hover:text-[#D71616] hover:underline transition-colors text-sm">
                                        Blog
                                    </Link>
                                </li>
                            )}
                            {linksVisibility?.activities !== false && (
                                <li>
                                    <Link href="/activities" className="text-neutral-600 hover:text-[#D71616] hover:underline transition-colors text-sm">
                                        Activities
                                    </Link>
                                </li>
                            )}
                            {linksVisibility?.stays !== false && (
                                <li>
                                    <Link href="/stays" className="text-neutral-600 hover:text-[#D71616] hover:underline transition-colors text-sm">
                                        Stays
                                    </Link>
                                </li>
                            )}
                            {customLink?.show !== false && customLink?.name && customLink?.url && customLink?.section === 'discover' && (
                                <li>
                                    <Link href={customLink.url} className="text-neutral-600 hover:text-[#D71616] hover:underline transition-colors text-sm font-medium">
                                        {customLink.name}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Column 3: Support */}
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-6">Support</h3>
                        <ul className="space-y-4">
                            {linksVisibility?.contact !== false && (
                                <li>
                                    <Link href="/contact" className="text-neutral-600 hover:text-[#D71616] hover:underline transition-colors text-sm">
                                        Contact Us
                                    </Link>
                                </li>
                            )}
                            {linksVisibility?.admin !== false && (
                                <li>
                                    <Link href="/admin" className="text-neutral-600 hover:text-[#D71616] hover:underline transition-colors text-sm">
                                        Admin Login
                                    </Link>
                                </li>
                            )}
                            {customLink?.show !== false && customLink?.name && customLink?.url && customLink?.section === 'support' && (
                                <li>
                                    <Link href={customLink.url} className="text-neutral-600 hover:text-[#D71616] hover:underline transition-colors text-sm font-medium">
                                        {customLink.name}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Column 4: Legal */}
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-6">Legal</h3>
                        <ul className="space-y-4">
                            {linksVisibility?.privacy !== false && (
                                <li>
                                    <Link href="/privacy" className="text-neutral-600 hover:text-[#D71616] hover:underline transition-colors text-sm">
                                        Privacy Policy
                                    </Link>
                                </li>
                            )}
                            {linksVisibility?.terms !== false && (
                                <li>
                                    <Link href="/terms" className="text-neutral-600 hover:text-[#D71616] hover:underline transition-colors text-sm">
                                        Terms of Service
                                    </Link>
                                </li>
                            )}
                            {customLink?.show !== false && customLink?.name && customLink?.url && customLink?.section === 'legal' && (
                                <li>
                                    <Link href={customLink.url} className="text-neutral-600 hover:text-[#D71616] hover:underline transition-colors text-sm font-medium">
                                        {customLink.name}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 border-t border-gray-200 pt-8 text-center">
                    <p className="text-sm text-neutral-500">
                        &copy; {new Date().getFullYear()} {title}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
