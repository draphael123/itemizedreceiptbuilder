import * as XLSX from 'xlsx'
import * as fs from 'fs'
import * as path from 'path'

const excelFile = path.join(process.cwd(), 'Membership Payment Breakdowns Itemized Receipts (1).xlsx')

if (!fs.existsSync(excelFile)) {
  console.error('Excel file not found')
  process.exit(1)
}

const workbook = XLSX.readFile(excelFile)
const sheetName = workbook.SheetNames[0]
const worksheet = workbook.Sheets[sheetName]
const data = XLSX.utils.sheet_to_json(worksheet)

console.log('Medications found in file:')
const medications = new Set<string>()
data.forEach((row: any) => {
  const med = row['__EMPTY'] || row['Medication'] || row['Medication Name']
  if (med && typeof med === 'string') {
    medications.add(med)
  }
})

medications.forEach(med => console.log(`  - ${med}`))

