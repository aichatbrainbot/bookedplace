'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from '@/components/ui/sheet';

const navLinks = [
    { name: 'Stays', href: '/stays' },
    { name: 'Flights', href: '/flights' },
    { name: 'Activities', href: '/activities' },
];

interface NavbarProps {
    title?: string;
    logoUrl?: string;
}

export default function Navbar({ title = 'Booked Place', logoUrl }: NavbarProps) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    // Hide Navbar on Admin pages and Login page
    if (!pathname || pathname.startsWith('/admin') || pathname === '/login') return null;

    if (isHome) {
        return (
            <nav className="absolute top-0 w-full z-50">
                <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

                    {/* Logo and Mobile Menu row */}
                    <div className="flex items-center justify-between pt-6 pb-2">
                        <Link href="/" className="flex items-center gap-2">
                            {logoUrl ? (
                                <Image
                                    src={logoUrl}
                                    alt={title}
                                    width={200}
                                    height={60}
                                    className="h-14 w-auto object-contain drop-shadow-lg"
                                    priority
                                />
                            ) : (
                                <span className="text-2xl font-bold font-heading text-white drop-shadow-lg">
                                    {title}
                                </span>
                            )}
                        </Link>

                        {/* Mobile menu trigger */}
                        <div className="flex items-center lg:hidden">
                            <div className="flex items-center px-4 py-2 rounded-full
                                bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-white hover:bg-white/20 h-8 w-8"
                                        >
                                            <Menu className="h-5 w-5" />
                                            <span className="sr-only">Open menu</span>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="right">
                                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                        <div className="flex flex-col space-y-4 mt-8">
                                            {navLinks.map((link) => (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    className="text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>

                    {/* Nav links row — glass pill below logo, left aligned (Desktop Only) */}
                    <div className="hidden lg:flex pb-4">
                        <div className="flex items-center gap-1 px-4 py-1.5 rounded-full
                            bg-white/10 backdrop-blur-md border border-white/20 shadow-lg
                            transition-all duration-300">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="px-5 py-2 rounded-full text-sm font-semibold text-white/90
                                        hover:text-white hover:bg-white/15
                                        transition-all duration-200"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                </div>
            </nav>
        );
    }

    // --- Default layout for inner pages (logo top left, links below left) ---
    return (
        <nav className="absolute top-0 w-full z-50 bg-primary shadow-sm border-b border-white/10">
            <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

                {/* Logo and Mobile Menu row */}
                <div className="flex items-center justify-between pt-6 pb-2">
                    <Link href="/" className="flex items-center gap-2">
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt={title}
                                width={180}
                                height={50}
                                className="h-12 w-auto object-contain brightness-0 invert drop-shadow-sm"
                                priority
                            />
                        ) : (
                            <span className="text-2xl font-bold font-heading text-white drop-shadow-sm">
                                {title}
                            </span>
                        )}
                    </Link>

                    {/* Mobile Menu */}
                    <div className="flex items-center lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <div className="flex flex-col space-y-4 mt-8">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className="text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Nav links row — below logo, left aligned (Desktop Only) */}
                <div className="hidden lg:flex pb-4">
                    <div className="flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-5 py-2 rounded-full text-sm font-semibold text-white/90
                                    hover:text-white hover:bg-white/15
                                    transition-all duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
