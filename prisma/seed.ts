import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

const initialContent = [
    // ... (Keep existing content, abbreviated for brevity in this thought, but will write full content)
    { key: 'site_title', value: 'Booked Place', category: 'GLOBAL' },

    // Homepage
    { key: 'home_h1', value: 'Booked Place, Where Food Lovers, Travelers, Tourists, and Explorers Meet', category: 'HOMEPAGE' },
    { key: 'home_h2', value: 'Enjoy Your Life, Spend Every Moment Traveling With Booked Place', category: 'HOMEPAGE' },
    { key: 'section_stays_h2', value: 'Cozy Stays', category: 'HOMEPAGE' },
    { key: 'section_stays_p', value: 'Find the perfect place to rest your head.', category: 'HOMEPAGE' },
    { key: 'home_rotating_words', value: 'Foodies, Travelers, Tourists, Explorers', category: 'HOMEPAGE' },
    { key: 'widget_home', value: '', category: 'WIDGETS' },

    // Stays Page
    { key: 'stays_title', value: 'Find Your Perfect Stay', category: 'STAYS' },
    { key: 'stays_hero_image', value: '', category: 'STAYS' },
    { key: 'widget_stays', value: '', category: 'WIDGETS' },

    // Flights Page
    { key: 'flights_title', value: 'Book Your Flights', category: 'FLIGHTS' },
    { key: 'flights_subtitle', value: 'Fly to your dream destination with the best rates.', category: 'FLIGHTS' },
    { key: 'flights_hero_image', value: '', category: 'FLIGHTS' },
    { key: 'widget_flights', value: '', category: 'WIDGETS' },

    // Car Rental Page
    { key: 'car_rental_title', value: 'Rent a Car', category: 'CAR_RENTAL' },
    { key: 'car_rental_subtitle', value: 'Explore at your own pace.', category: 'CAR_RENTAL' },
    { key: 'car_rental_hero_image', value: '', category: 'CAR_RENTAL' },
    { key: 'widget_car_rental', value: '', category: 'WIDGETS' },

    // Activities Page
    { key: 'activities_title', value: 'Discover Activities', category: 'ACTIVITIES' },
    { key: 'activities_subtitle', value: 'Unforgettable experiences tailored for you.', category: 'ACTIVITIES' },
    { key: 'activities_hero_image', value: '', category: 'ACTIVITIES' },
    { key: 'widget_activities', value: '', category: 'WIDGETS' },

    // Airport Transport
    { key: 'transport_title', value: 'Airport Transportation', category: 'transport' },
    { key: 'transport_subtitle', value: 'Seamless transfers from the airport to your stay.', category: 'transport' },
    { key: 'transport_hero_image', value: '', category: 'transport' },
    { key: 'widget_transport', value: '', category: 'WIDGETS' },

    // Blog Landing Page
    { key: 'blog_title', value: 'Our Blog', category: 'BLOG' },
    { key: 'blog_subtitle', value: 'Latest news and travel stories.', category: 'BLOG' },
    { key: 'blog_hero_image', value: '', category: 'BLOG' },

    // Contact Page
    { key: 'contact_title', value: 'Contact Us', category: 'CONTACT' },
    { key: 'contact_email', value: 'support@bookplace.com', category: 'CONTACT' },
    { key: 'contact_phone', value: '+1 234 567 890', category: 'CONTACT' },
    { key: 'contact_address', value: '123 Travel St, City, Country', category: 'CONTACT' },

    // Privacy & Terms
    { key: 'privacy_content', value: '<h1>Privacy Policy</h1><p>Your privacy is important to us...</p>', category: 'LEGAL' },
    { key: 'terms_content', value: '<h1>Terms of Service</h1><p>By using our services, you agree to...</p>', category: 'LEGAL' },
]

async function main() {
    console.log(`Start seeding ...`)

    // 1. Create Admin User with bcrypt hashed password
    const bcrypt = await import('bcrypt');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@bookplace.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345'
    const passwordHash = await bcrypt.hash(adminPassword, 10)

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            passwordHash, // Update password if admin already exists
            role: Role.ADMIN,
        },
        create: {
            email: adminEmail,
            name: 'Admin User',
            passwordHash,
            role: Role.ADMIN,
        },
    })
    console.log(`Created/Updated admin user: ${admin.email}`)

    // 2. Create Site Content
    for (const item of initialContent) {
        await prisma.siteContent.upsert({
            where: { key: item.key },
            update: {},
            create: item,
        })
    }

    // 3. Create Dummy Properties
    /*
    const properties = [
        { title: 'Luxury Villa', description: 'Amazing villa', price: 120, location: 'Bali', category: Category.STAY, images: '/stays-hero.jpg' },
        { title: 'City Apartment', description: 'Central location', price: 80, location: 'New York', category: Category.STAY, images: '/stays-hero.jpg' },
        { title: 'Cozy Cabin', description: 'In the woods', price: 150, location: 'Aspen', category: Category.STAY, images: '/stays-hero.jpg' },
        { title: 'Beach House', description: 'On the sand', price: 200, location: 'Malibu', category: Category.STAY, images: '/stays-hero.jpg' },
    ]
    */

    /*
    for (const p of properties) {
        await prisma.property.create({
            data: {
                ...p,
                images: JSON.stringify([p.images])
            }
        })
    }
    console.log('Created dummy properties')
    */

    console.log(`Seeding finished.`)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
