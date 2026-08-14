import type { Metadata } from "next";
import { Poppins, Open_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import { ThemeCleanup } from "@/components/theme-cleanup";
import "./globals.css";

import Script from "next/script";
import { getSiteContent } from "@/app/actions/content";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const result = await getSiteContent();
  const content = result.success && result.data ? result.data : [];

  const getValue = (key: string) => content.find((i) => i.key === key)?.value || "";

  // Branding
  const siteTitle = getValue("settings_site_title") || getValue("seo_site_title") || "Booked Place";

  // Favicon with cache busting to force update
  const faviconUrl = getValue("settings_favicon_url");
  const faviconWithCache = faviconUrl ? `${faviconUrl}?v=${new Date().getTime()}` : '/favicon.png';

  const description = getValue("seo_description") || "Where Food Lovers, Travelers, Tourists, and Explorers Meet";
  const keywords = getValue("seo_keywords") || "";
  const ogImage = getValue("seo_og_image");

  const siteUrl = getValue("settings_site_url") || "https://www.bookedplace.com";

  return {
    metadataBase: new URL(siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`),
    title: {
      template: `%s | ${siteTitle}`,
      default: siteTitle,
    },
    description,
    keywords: keywords.split(",").map((k) => k.trim()),
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: siteTitle,
      description,
      url: siteUrl,
      type: 'website',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: siteTitle }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description,
      images: ogImage ? [ogImage] : [],
    },
    verification: {
      google: getValue("seo_google_verification"),
      yandex: getValue("seo_yandex_verification"),
      other: {
        "msvalidate.01": getValue("seo_bing_verification"),
      },
    },
    icons: {
      icon: faviconWithCache,
      shortcut: faviconWithCache,
      apple: faviconWithCache,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const result = await getSiteContent();
  const content = result.success && result.data ? result.data : [];
  const gaId = content.find((i) => i.key === "seo_google_analytics_id")?.value;

  // Branding & Footer Settings
  const siteTitle = content.find((i) => i.key === "settings_site_title")?.value || "Booked Place";
  const logoUrl = content.find((i) => i.key === "settings_logo_url")?.value;
  const footerLogoUrl = content.find((i) => i.key === "settings_footer_logo_url")?.value;
  const footerDesc = content.find((i) => i.key === "settings_footer_description")?.value;
  const facebook = content.find((i) => i.key === "settings_facebook")?.value;
  const instagram = content.find((i) => i.key === "settings_instagram")?.value;
  const twitter = content.find((i) => i.key === "settings_twitter")?.value;

  // Footer Links Visibility
  const linksVisibility = {
    blog: content.find((i) => i.key === "settings_footer_show_blog")?.value !== "false",
    activities: content.find((i) => i.key === "settings_footer_show_activities")?.value !== "false",
    stays: content.find((i) => i.key === "settings_footer_show_stays")?.value !== "false",
    contact: content.find((i) => i.key === "settings_footer_show_contact")?.value !== "false",
    admin: content.find((i) => i.key === "settings_footer_show_admin")?.value !== "false",
    privacy: content.find((i) => i.key === "settings_footer_show_privacy")?.value !== "false",
    terms: content.find((i) => i.key === "settings_footer_show_terms")?.value !== "false",
  };

  // Custom Footer Link
  const customLink = {
    show: content.find((i) => i.key === "settings_footer_custom_link_show")?.value === "true",
    name: content.find((i) => i.key === "settings_footer_custom_link_name")?.value || "",
    url: content.find((i) => i.key === "settings_footer_custom_link_url")?.value || "",
    section: content.find((i) => i.key === "settings_footer_custom_link_section")?.value || "discover",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${openSans.variable} antialiased font-sans flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <ThemeCleanup />
        <Navbar
          title={siteTitle}
          logoUrl={logoUrl}
        />
        <main className="flex-grow">
          {children}
        </main>
        <Footer
          title={siteTitle}
          logoUrl={footerLogoUrl || logoUrl}
          description={footerDesc}
          socials={{ facebook, instagram, twitter }}
          linksVisibility={linksVisibility}
          customLink={customLink}
        />
        <Toaster />

        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
