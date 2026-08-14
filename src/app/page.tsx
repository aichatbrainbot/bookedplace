import { Metadata } from 'next'
import { getSiteContent } from '@/app/actions/content'
import { PremiumHero } from '@/components/home/PremiumHero'
import { TopCategories } from '@/components/home/TopCategories'
import { PopularLocations } from '@/components/home/PopularLocations'
import { FAQSection, FAQItem } from '@/components/home/FAQSection'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const { data: content } = await getSiteContent()
  const getValue = (key: string, fallback: string) => content?.find(c => c.key === key)?.value || fallback

  return {
    title: getValue('home_seo_title', 'Booked Place - Your Travel Journey Begins Here'),
    description: getValue('home_seo_description', 'Unlock exclusive deals on hotels, flights, and unique experiences.'),
  }
}

export default async function Home() {
  const { data: content } = await getSiteContent()

  const getValue = (key: string, fallback: string) => {
    return content?.find(c => c.key === key)?.value || fallback
  }

  const rotatingWordsStr = getValue('home_rotating_words', 'Extraordinary, Adventure, Paradise, Moments')
  const rotatingWords = rotatingWordsStr.split(',').map(s => s.trim())

  const heroImages = [
    getValue('home_hero_bg_1', ''),
    getValue('home_hero_bg_2', ''),
    getValue('home_hero_bg_3', ''),
    getValue('home_hero_bg_4', ''),
    getValue('home_hero_bg_5', ''),
    getValue('home_hero_bg_6', ''),
  ].filter(url => url && url.trim().length > 0)

  if (heroImages.length === 0) heroImages.push('/home-hero.jpg')

  // Backwards compatibility if user hasn't updated CMS yet but has old key
  const oldBg = getValue('home_hero_bg', '')
  if (oldBg && heroImages.length === 1 && heroImages[0] === '/home-hero.jpg' && oldBg !== '/home-hero.jpg') {
    heroImages[0] = oldBg
  }

  // Top Categories Logic
  const topCategories = [
    {
      title: getValue('home_top_cat_1_title', 'KAYAK.ai'),
      description: getValue('home_top_cat_1_desc', 'Trouvez des reponses a vos questions de voyage'),
      imageUrl: getValue('home_top_cat_1_image', '')
    },
    {
      title: getValue('home_top_cat_2_title', 'Meilleur moment pour voyager'),
      description: getValue('home_top_cat_2_desc', 'Economisez grace au bon timing'),
      imageUrl: getValue('home_top_cat_2_image', '')
    },
    {
      title: getValue('home_top_cat_3_title', 'Explore'),
      description: getValue('home_top_cat_3_desc', 'Decouvrez des destinations adaptées à votre budget'),
      imageUrl: getValue('home_top_cat_3_image', '')
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white fill-mode-forwards relative">
      {/* Premium Hero Section */}
      <PremiumHero
        images={heroImages}
        title={getValue('home_h1', 'Booked Place, Where')}
        titleSuffix={getValue('home_h1_suffix', 'Meet')}
        rotatingWords={rotatingWords}
        rotatingColor={getValue('home_rotating_color', 'red')}
        rotatingBg={getValue('home_rotating_bg', 'true') === 'true'}
        subtitle={getValue('home_h2', 'Unlock exclusive deals on hotels, flights, and unique experiences. Your journey begins here.')}
        showTrustedBadge={getValue('home_show_trusted_badge', 'true') === 'true'}
        trustedBadgeText={getValue('home_trusted_badge_text', 'Trusted by 1 Million+ Travelers')}
        trustedBadgeIconUrl={getValue('home_trusted_badge_icon_url', '')}
        showServiceTabs={getValue('home_show_service_tabs', 'true') === 'true'}
        serviceTabsColor={getValue('home_service_tabs_color', 'orange')}
        tabsConfig={{
          flights: {
            show: getValue('home_tab_flights_show', 'true') === 'true',
            label: getValue('home_tab_flights_label', 'Flights'),
            icon: getValue('home_tab_flights_icon', '')
          },
          stays: {
            show: getValue('home_tab_stays_show', 'true') === 'true',
            label: getValue('home_tab_stays_label', 'Stays'),
            icon: getValue('home_tab_stays_icon', '')
          },
          cars: {
            show: getValue('home_tab_cars_show', 'true') === 'true',
            label: getValue('home_tab_cars_label', 'Cars'),
            icon: getValue('home_tab_cars_icon', '')
          },
          activities: {
            show: getValue('home_tab_activities_show', 'true') === 'true',
            label: getValue('home_tab_activities_label', 'Activities'),
            icon: getValue('home_tab_activities_icon', '')
          }
        }}
        widgets={{
          flights: getValue('widget_home', ''), // Assuming the default is flights
          stays: getValue('widget_stays', ''),
          cars: getValue('widget_cars', ''),
          activities: getValue('widget_activities', '')
        }}
      />

      {/* Top Categories Section */}
      <TopCategories
        title={getValue('home_top_cat_title', 'Pour les pros du voyage')}
        categories={topCategories}
      />

      {/* Popular Locations Section */}
      {getValue('home_popular_locations_show', 'true') === 'true' && (
        <PopularLocations
          title={getValue('home_popular_locations_title', 'Popular Locations')}
          subtitle={getValue('home_popular_locations_subtitle', 'Connecting Needs with Offers for the Professional Flight Services, Book your next flight appointment with ease.')}
          locationsRaw={getValue('home_popular_locations_list', 'Denmark, Belgium, Mexico, Indonesia, Romania, India')}
          apiKey={getValue('google_places_api_key', '') || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || ''}
        />
      )}

      {/* FAQ Section */}
      {getValue('home_faq_show', 'true') === 'true' && (
        <FAQSection
          title={getValue('home_faq_title', 'Frequently Asked Questions')}
          faqs={((): FAQItem[] => {
            try {
              return JSON.parse(getValue('home_faq_list', '[]'));
            } catch (e) {
              return [];
            }
          })()}
        />
      )}
    </div>
  );
}
