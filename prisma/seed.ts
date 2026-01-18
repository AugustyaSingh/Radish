
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Create or Update Default User
    const user = await prisma.user.upsert({
        where: { email: 'demo@radish.app' },
        update: {},
        create: {
            email: 'demo@radish.app',
            name: 'Radish User',
            bio: 'Eco-warrior in training 🌱',
            xp: 1240,
            level: 5,
            streak: 12,
            totalCarbonSaved: 24.5,
            totalWaterSaved: 120,
            totalWasteSaved: 8.2,
            actions: {
                create: [
                    { type: 'RECYCLE', points: 10, carbon: 0.5, waste: 0.2 },
                    { type: 'TRANSIT', points: 50, carbon: 2.1, waste: 0 },
                    { type: 'REFILL', points: 5, carbon: 0.1, waste: 0.05, water: 0.5 },
                ]
            }
        },
    })

    console.log({ user })
    console.log('Seeding finished.')
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
