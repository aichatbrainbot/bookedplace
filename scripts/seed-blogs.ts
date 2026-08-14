import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.findFirst()
    if (!user) {
        console.error("No user found. Please create an admin user first.")
        return
    }

    const articles = [
        {
            title: "Top 10 Hidden Gems in Kyoto for 2026",
            slug: "hidden-gems-kyoto-2026",
            category: "destination",
            content: "<h2>Why Kyoto?</h2><p>Kyoto is the cultural heart of Japan, but the main tourist spots can get overwhelmingly crowded. Here is how to escape the masses.</p><h3>1. Otagi Nenbutsu-ji</h3><p>Unlike the crowded Arashiyama Bamboo Grove, this temple in the hills is filled with 1200 whimsical stone statues. Highly recommended for a quiet morning stroll.</p><h3>2. Kurama-dera</h3><p>Take the scenic train ride to the mountains and hike this mystical temple complex.</p><h2>Getting There</h2><p>You can use the JR Pass to reach Kyoto easily from Tokyo. Make sure to book your bullet train tickets in advance during peak season.</p>",
            excerpt: "Skip the crowds and discover the serene, off-the-beaten-path temples and gardens in Japan's cultural capital.",
            coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
            isPublished: true,
            authorId: user.id
        },
        {
            title: "How to Pack Light: The Ultimate One-Bag Travel Guide",
            slug: "pack-light-one-bag-travel",
            category: "tips",
            content: "<h2>The One Bag Rule</h2><p>Traveling across Europe by train is infinitely better when you're not dragging a heavy suitcase over cobblestones. Here are the secrets to packing light.</p><h3>Choosing the Right Backpack</h3><p>Look for a 40L travel pack that complies with carry-on limits for budget airlines like Ryanair and EasyJet. Comfort and durability are key.</p><h3>The Capsule Wardrobe</h3><p>Bring clothes that can easily mix and match. Sticking to neutral colors makes this much easier. Always roll your clothes instead of folding them to save space!</p>",
            excerpt: "Master the art of packing minimal. Find out everything you need to fit into a single carry-on for a month in Europe.",
            coverImage: "https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=2064&auto=format&fit=crop",
            isPublished: true,
            authorId: user.id
        },
        {
            title: "Review: Best Noise-Cancelling Headphones for Flights",
            slug: "best-noise-cancelling-headphones-flights",
            category: "gear",
            content: "<h2>Sony vs. Bose vs. Apple</h2><p>When you're stuck on a 14-hour flight, good headphones are not a luxury—they are a necessity.</p><h3>Sony WH-1000XM5</h3><p>The undisputed king of active noise cancellation right now. They are lightweight, comfortable, and block out the low roar of airplane engines perfectly.</p><h3>Bose QuietComfort Ultra</h3><p>Bose continues to offer incredible comfort. The spatial audio feature on the Ultras gives them a unique edge, though the battery life is slightly shorter than Sony's.</p><h2>Verdict</h2><p>If budget is not an issue, go for the Sony XM5. If you prioritize comfort above all else, Bose is still the reliable choice.</p>",
            excerpt: "We tested the top noise-cancelling headphones on long-haul flights to see which ones actually block out the engine roar.",
            coverImage: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1888&auto=format&fit=crop",
            isPublished: true,
            authorId: user.id
        },
        {
            title: "The Ultimate 3-Day Itinerary for Rome",
            slug: "ultimate-3-day-rome-itinerary",
            category: "itinerary",
            content: "<h2>Day 1: Ancient Rome</h2><p>Start your morning at the Colosseum before the tour buses arrive. A guided tour is highly recommended here to understand the history.</p><h3>The Roman Forum</h3><p>Walk in the footsteps of emperors. Don't miss Palatine Hill for an incredible view of the ruins.</p><h2>Day 2: The Vatican and Trastevere</h2><p>Beat the crowds by arriving at the Vatican Museums early. In the evening, head over the river to the Trastevere neighborhood for authentic Roman pasta.</p><h2>Day 3: City Center Highlights</h2><p>Throw a coin in the Trevi Fountain, marvel at the Pantheon, and relax on the Spanish Steps. Do not forget to eat plenty of gelato!</p>",
            excerpt: "Make the most of a weekend in the Eternal City with our carefully crafted, step-by-step 3-day itinerary.",
            coverImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop",
            isPublished: true,
            authorId: user.id
        }
    ]

    for (const article of articles) {
        // Upsert to prevent unique constraint errors on slug
        await prisma.blogPost.upsert({
            where: { slug: article.slug },
            update: article,
            create: article,
        })
    }
    console.log("Successfully created 4 sample articles!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
