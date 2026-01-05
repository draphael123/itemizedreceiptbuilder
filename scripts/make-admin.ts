import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function makeAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`❌ User with email ${email} not found`)
      return
    }

    const updated = await prisma.user.update({
      where: { email },
      data: { role: 'admin' },
    })

    console.log(`✅ Successfully made ${email} an admin`)
    console.log(`   User ID: ${updated.id}`)
    console.log(`   Role: ${updated.role}`)
  } catch (error: any) {
    console.error('Error making user admin:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

// Get email from command line argument or prompt
const email = process.argv[2]

if (!email) {
  console.error('Usage: tsx scripts/make-admin.ts <email>')
  console.error('Example: tsx scripts/make-admin.ts user@example.com')
  process.exit(1)
}

makeAdmin(email)

