
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Updating Home Page Content...')

    const updates = [
        { key: 'home_h1', value: 'Booked Place, Where' },
        { key: 'home_rotating_words', value: 'Foodies, Travelers, Tourists' },
        { key: 'home_h1_suffix', value: 'Meet' },
        { key: 'home_h2', value: 'Unlock exclusive deals on hotels, flights, and unique experiences. Your journey begins here.' },
    ]

    for (const update of updates) {
        await prisma.siteContent.upsert({
            where: { key: update.key },
            update: { value: update.value },
            create: {
                key: update.key,
                value: update.value,
                category: 'Home'
            },
        })
        console.log(`Updated ${update.key}`)
    }

    console.log('Done!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
