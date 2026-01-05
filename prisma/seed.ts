import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Sample pricing rules for $199 plan, 4 weeks
  await prisma.pricingRule.createMany({
    data: [
      {
        planPrice: 199,
        planWeeks: 4,
        medicationKey: 'medication-a',
        category: 'Pharmacy',
        itemName: 'Medication A - 4 Week Supply',
        itemDescription: 'Prescription medication for 4 weeks',
        unitPrice: 50.00,
        quantity: 1,
      },
      {
        planPrice: 199,
        planWeeks: 4,
        medicationKey: 'medication-a',
        category: 'Lab',
        itemName: 'Initial Lab Panel',
        itemDescription: 'Comprehensive lab work',
        unitPrice: 75.00,
        quantity: 1,
      },
      {
        planPrice: 199,
        planWeeks: 4,
        medicationKey: 'medication-a',
        category: 'Clinical',
        itemName: 'Provider Consultation',
        itemDescription: 'Initial consultation with healthcare provider',
        unitPrice: 40.00,
        quantity: 1,
      },
      {
        planPrice: 199,
        planWeeks: 4,
        medicationKey: 'medication-a',
        category: 'Operational',
        itemName: 'Administrative Fee',
        itemDescription: 'Administrative and operational costs',
        unitPrice: 20.00,
        quantity: 1,
      },
      {
        planPrice: 199,
        planWeeks: 4,
        medicationKey: 'medication-a',
        category: 'Core',
        itemName: 'Core Membership Fee',
        itemDescription: 'Monthly membership fee',
        unitPrice: 14.00,
        quantity: 1,
      },
      // $199 plan, 8 weeks
      {
        planPrice: 199,
        planWeeks: 8,
        medicationKey: 'medication-a',
        category: 'Pharmacy',
        itemName: 'Medication A - 8 Week Supply',
        itemDescription: 'Prescription medication for 8 weeks',
        unitPrice: 100.00,
        quantity: 1,
      },
      {
        planPrice: 199,
        planWeeks: 8,
        medicationKey: 'medication-a',
        category: 'Lab',
        itemName: 'Initial Lab Panel',
        itemDescription: 'Comprehensive lab work',
        unitPrice: 75.00,
        quantity: 1,
      },
      {
        planPrice: 199,
        planWeeks: 8,
        medicationKey: 'medication-a',
        category: 'Clinical',
        itemName: 'Provider Consultation',
        itemDescription: 'Initial consultation with healthcare provider',
        unitPrice: 40.00,
        quantity: 1,
      },
      {
        planPrice: 199,
        planWeeks: 8,
        medicationKey: 'medication-a',
        category: 'Operational',
        itemName: 'Administrative Fee',
        itemDescription: 'Administrative and operational costs',
        unitPrice: 20.00,
        quantity: 1,
      },
      {
        planPrice: 199,
        planWeeks: 8,
        medicationKey: 'medication-a',
        category: 'Core',
        itemName: 'Core Membership Fee',
        itemDescription: 'Monthly membership fee',
        unitPrice: 14.00,
        quantity: 1,
      },
      // $499 plan, 4 weeks
      {
        planPrice: 499,
        planWeeks: 4,
        medicationKey: 'medication-b',
        category: 'Pharmacy',
        itemName: 'Medication B - 4 Week Supply',
        itemDescription: 'Premium prescription medication for 4 weeks',
        unitPrice: 200.00,
        quantity: 1,
      },
      {
        planPrice: 499,
        planWeeks: 4,
        medicationKey: 'medication-b',
        category: 'Lab',
        itemName: 'Advanced Lab Panel',
        itemDescription: 'Comprehensive advanced lab work',
        unitPrice: 150.00,
        quantity: 1,
      },
      {
        planPrice: 499,
        planWeeks: 4,
        medicationKey: 'medication-b',
        category: 'Clinical',
        itemName: 'Provider Consultation',
        itemDescription: 'Initial consultation with healthcare provider',
        unitPrice: 80.00,
        quantity: 1,
      },
      {
        planPrice: 499,
        planWeeks: 4,
        medicationKey: 'medication-b',
        category: 'Operational',
        itemName: 'Administrative Fee',
        itemDescription: 'Administrative and operational costs',
        unitPrice: 40.00,
        quantity: 1,
      },
      {
        planPrice: 499,
        planWeeks: 4,
        medicationKey: 'medication-b',
        category: 'Core',
        itemName: 'Core Membership Fee',
        itemDescription: 'Monthly membership fee',
        unitPrice: 29.00,
        quantity: 1,
      },
      // $499 plan, 12 weeks
      {
        planPrice: 499,
        planWeeks: 12,
        medicationKey: 'medication-a',
        category: 'Pharmacy',
        itemName: 'Semaglutide (Wegovy) - 12 Week Supply',
        itemDescription: 'Prescription medication for 12 weeks',
        unitPrice: 300.00,
        quantity: 1,
      },
      {
        planPrice: 499,
        planWeeks: 12,
        medicationKey: 'medication-a',
        category: 'Lab',
        itemName: 'Initial Lab Panel',
        itemDescription: 'Comprehensive lab work',
        unitPrice: 75.00,
        quantity: 1,
      },
      {
        planPrice: 499,
        planWeeks: 12,
        medicationKey: 'medication-a',
        category: 'Clinical',
        itemName: 'Provider Consultation',
        itemDescription: 'Initial consultation with healthcare provider',
        unitPrice: 80.00,
        quantity: 1,
      },
      {
        planPrice: 499,
        planWeeks: 12,
        medicationKey: 'medication-a',
        category: 'Operational',
        itemName: 'Administrative Fee',
        itemDescription: 'Administrative and operational costs',
        unitPrice: 40.00,
        quantity: 1,
      },
      {
        planPrice: 499,
        planWeeks: 12,
        medicationKey: 'medication-a',
        category: 'Core',
        itemName: 'Core Membership Fee',
        itemDescription: 'Monthly membership fee',
        unitPrice: 4.00,
        quantity: 1,
      },
    ],
    skipDuplicates: true,
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

