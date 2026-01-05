import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface PricingRow {
  [key: string]: any
}

// Map medication names to keys - use normalized names
const medicationMap: Record<string, string> = {
  't cypionate': 'medication-a',
  't cream': 'medication-b',
  'enclomiphene': 'medication-c',
  'tadalafil': 'medication-d',
  'sildenafil': 'medication-e',
  't/est cream': 'medication-f',
  'progesterone': 'medication-g',
  'semaglutide': 'medication-h',
  'tirzepatide': 'medication-i',
}

function getMedicationKey(medicationName: string): string {
  const lower = medicationName.trim().toLowerCase()
  
  // Try exact match first
  if (medicationMap[lower]) {
    return medicationMap[lower]
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(medicationMap)) {
    if (lower.includes(key) || key.includes(lower)) {
      return value
    }
  }
  
  // Create a key based on medication name hash
  const hash = lower.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const keyIndex = hash % 9
  const keys = ['medication-a', 'medication-b', 'medication-c', 'medication-d', 'medication-e', 'medication-f', 'medication-g', 'medication-h', 'medication-i']
  return keys[keyIndex]
}

// Plan duration mappings
const planDurations: Array<{ weeks: number; columnKey: string; priceKey: string }> = [
  { weeks: 4, columnKey: '4 Weeks (28d)', priceKey: '4 Weeks (28d)' },
  { weeks: 10, columnKey: '10 Weeks (70d)', priceKey: '10 Weeks (70d)' },
  { weeks: 12, columnKey: '12 Weeks (84d)', priceKey: '12 Weeks (84d)' },
  { weeks: 24, columnKey: '24 Weeks (168d)', priceKey: '24 Weeks (168d)' },
  { weeks: 48, columnKey: '48 Weeks (336d)', priceKey: '48 Weeks (336d)' },
]

async function importPricingFromFile() {
  try {
    const excelFile = path.join(process.cwd(), 'Membership Payment Breakdowns Itemized Receipts (1).xlsx')
    
    if (!fs.existsSync(excelFile)) {
      throw new Error('Excel file not found. Please ensure "Membership Payment Breakdowns Itemized Receipts (1).xlsx" exists in the root directory.')
    }

    console.log('Reading Excel file...')
    const workbook = XLSX.readFile(excelFile)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data: PricingRow[] = XLSX.utils.sheet_to_json(worksheet)
    
    console.log(`Found ${data.length} rows in the file`)
    if (data.length > 0) {
      console.log('Sample row keys:', Object.keys(data[0]))
    }

    // Clear existing pricing rules
    console.log('Clearing existing pricing rules...')
    await prisma.pricingRule.deleteMany({})

    let imported = 0
    let skipped = 0

    for (const row of data) {
      // Get medication name from first column or Medication column
      const medicationName = row['__EMPTY'] || row['Medication'] || row['Medication Name'] || ''
      if (!medicationName || typeof medicationName !== 'string') {
        skipped++
        continue
      }

      const medicationKey = getMedicationKey(medicationName)
      
      // Get base costs
      const medicationCOGS = parseFloat(String(row['Medication COGS (including shipping/dispensing)'] || row['Medication COGS'] || 0))
      const equipment = parseFloat(String(row['Equipment'] || 0))
      const shipping = parseFloat(String(row['Shipping'] || 0))
      const dispensingFee = parseFloat(String(row['Dispensing Fee'] || 0))

      // Process each plan duration
      for (const duration of planDurations) {
        const planPrice = parseFloat(String(row[duration.priceKey] || row[duration.columnKey] || 0))
        
        if (!planPrice || planPrice <= 0 || isNaN(planPrice)) {
          continue // Skip if no price for this duration
        }

        const planWeeks = duration.weeks

        // Create pricing rules for each category
        const rules = []

        // Pharmacy/Medication
        if (medicationCOGS > 0) {
          rules.push({
            planPrice,
            planWeeks,
            medicationKey,
            category: 'Pharmacy',
            itemName: `${medicationName} - ${planWeeks} Week Supply`,
            itemDescription: `Medication cost for ${planWeeks} weeks`,
            unitPrice: medicationCOGS,
            quantity: 1,
          })
        }

        // Lab (if applicable - you may need to adjust based on your data)
        // For now, we'll add a standard lab panel if the plan includes it
        if (planWeeks >= 4) {
          rules.push({
            planPrice,
            planWeeks,
            medicationKey,
            category: 'Lab',
            itemName: 'Initial Lab Panel',
            itemDescription: 'Comprehensive lab work',
            unitPrice: 75.00,
            quantity: 1,
          })
        }

        // Clinical Services
        rules.push({
          planPrice,
          planWeeks,
          medicationKey,
          category: 'Clinical',
          itemName: 'Provider Consultation',
          itemDescription: 'Initial consultation with healthcare provider',
          unitPrice: planPrice >= 500 ? 80.00 : 40.00,
          quantity: 1,
        })

        // Operational Costs
        if (equipment > 0) {
          rules.push({
            planPrice,
            planWeeks,
            medicationKey,
            category: 'Operational',
            itemName: 'Equipment Fee',
            itemDescription: 'Medical equipment and supplies',
            unitPrice: equipment,
            quantity: 1,
          })
        }

        if (shipping > 0) {
          rules.push({
            planPrice,
            planWeeks,
            medicationKey,
            category: 'Operational',
            itemName: 'Shipping Fee',
            itemDescription: 'Shipping and handling',
            unitPrice: shipping,
            quantity: 1,
          })
        }

        if (dispensingFee > 0) {
          rules.push({
            planPrice,
            planWeeks,
            medicationKey,
            category: 'Operational',
            itemName: 'Dispensing Fee',
            itemDescription: 'Pharmacy dispensing fee',
            unitPrice: dispensingFee,
            quantity: 1,
          })
        }

        // Core Membership Fee - calculate as remainder
        const totalLineItems = rules.reduce((sum, rule) => sum + rule.unitPrice, 0)
        const coreFee = Math.max(0, planPrice - totalLineItems)
        
        if (coreFee > 0) {
          rules.push({
            planPrice,
            planWeeks,
            medicationKey,
            category: 'Core',
            itemName: 'Core Membership Fee',
            itemDescription: `Membership fee for ${planWeeks} week plan`,
            unitPrice: coreFee,
            quantity: 1,
          })
        }

        // Import all rules for this plan
        for (const rule of rules) {
          try {
            await prisma.pricingRule.create({
              data: {
                ...rule,
                isActive: true,
              },
            })
            imported++
          } catch (error: any) {
            console.log('Error importing rule:', error.message, rule)
            skipped++
          }
        }
      }
    }

    console.log(`\n✅ Import completed!`)
    console.log(`   Imported: ${imported} pricing rules`)
    console.log(`   Skipped: ${skipped} rows/rules`)
  } catch (error: any) {
    console.error('Error importing pricing data:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

importPricingFromFile()
