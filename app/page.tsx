import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Receipt Builder
          </h1>
          <p className="text-lg text-muted-foreground">
            Create itemized receipts for patient plans with guided workflow
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Link href="/receipts/new">
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-[2px] transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50">
              <div className="relative h-32 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                <Button size="lg" className="w-full h-full text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0">
                  ✨ Create New Receipt
                </Button>
              </div>
            </div>
          </Link>
          <Link href="/receipts">
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[2px] transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50">
              <div className="relative h-32 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                <Button size="lg" variant="outline" className="w-full h-full text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0">
                  📋 View All Receipts
                </Button>
              </div>
            </div>
          </Link>
          <Link href="/admin/pricing">
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-[2px] transition-all hover:scale-105 hover:shadow-lg hover:shadow-green-500/50">
              <div className="relative h-32 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                <Button size="lg" variant="outline" className="w-full h-full text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0">
                  ⚙️ Manage Pricing Rules
                </Button>
              </div>
            </div>
          </Link>
          <Link href="/tasks">
            <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500 to-red-500 p-[2px] transition-all hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50">
              <div className="relative h-32 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center">
                <Button size="lg" variant="outline" className="w-full h-full text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0">
                  ✅ View Tasks
                </Button>
              </div>
            </div>
          </Link>
        </div>

        {/* User Guide */}
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 rounded-xl p-8 border-2 border-purple-200 shadow-lg">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            📖 User Guide
          </h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-purple-500 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Create a New Receipt
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Click <strong>"Create New Receipt"</strong> to start the 5-step wizard. You'll be guided through each step to collect all necessary information.
                  </p>
                  <div className="bg-purple-50 dark:bg-gray-700 rounded-md p-3 text-sm">
                    <p className="font-semibold mb-1">💡 Tip:</p>
                    <p>Make sure you have the patient's information, plan details, and provider information ready before starting.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-blue-500 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Complete the Wizard Steps
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>Step 1 - Patient Info:</strong> Enter patient name, date of birth, charge date, coverage dates, and state</li>
                    <li><strong>Step 2 - Plan & Medications:</strong> Select plan price ($299, $399, $699, etc.), plan weeks (4, 10, 12, 24, 48), and medications</li>
                    <li><strong>Step 3 - Provider Details:</strong> Enter provider name, NPI, diagnosis code (ICD-10), and procedure code (CPT)</li>
                    <li><strong>Step 4 - Review & Adjust:</strong> Review the calculated breakdown. If totals don't match, add an adjustment with a reason</li>
                    <li><strong>Step 5 - Generate:</strong> Create the PDF receipt and save it to the database</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-green-500 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Understanding the Cost Breakdown
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    The system automatically calculates costs based on your pricing rules and applies state-specific regulations:
                  </p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-blue-50 dark:bg-gray-700 rounded p-3">
                      <p className="font-semibold text-blue-900 dark:text-blue-100">💊 Pharmacy Costs</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Medication costs</p>
                    </div>
                    <div className="bg-green-50 dark:bg-gray-700 rounded p-3">
                      <p className="font-semibold text-green-900 dark:text-green-100">🔬 Lab Costs</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Lab work (zeroed out in NY)</p>
                    </div>
                    <div className="bg-purple-50 dark:bg-gray-700 rounded p-3">
                      <p className="font-semibold text-purple-900 dark:text-purple-100">👨‍⚕️ Clinical Services</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Provider consultations</p>
                    </div>
                    <div className="bg-orange-50 dark:bg-gray-700 rounded p-3">
                      <p className="font-semibold text-orange-900 dark:text-orange-100">📊 Operational</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Equipment, shipping, fees</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-gray-700 rounded p-3 md:col-span-2">
                      <p className="font-semibold text-yellow-900 dark:text-yellow-100">⭐ Core Membership</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Membership fee (calculated to match total)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-orange-500 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-white flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Managing Pricing Rules
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Pricing rules are automatically imported from your Excel spreadsheet. You can also manage them manually:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li>Go to <strong>"Manage Pricing Rules"</strong> to view all existing rules</li>
                    <li>Create new rules for different plan prices, weeks, and medications</li>
                    <li>Rules are organized by: Plan Price → Plan Weeks → Medication → Category</li>
                    <li>Each rule includes item name, description, unit price, and quantity</li>
                  </ul>
                  <div className="bg-orange-50 dark:bg-gray-700 rounded-md p-3 mt-3 text-sm">
                    <p className="font-semibold mb-1">💡 Note:</p>
                    <p>If the breakdown doesn't load, make sure pricing rules exist for your selected plan price, weeks, and medication combination.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 border-pink-500 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white flex items-center justify-center font-bold text-lg">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Tasks and Receipt Management
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    After generating a receipt, you can:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                    <li><strong>View All Receipts:</strong> See a list of all generated receipts with key details</li>
                    <li><strong>Download PDF:</strong> Click the download button to get the PDF receipt</li>
                    <li><strong>Link Tasks:</strong> Create tasks associated with receipts to track completion</li>
                    <li><strong>Mark Tasks Complete:</strong> Update task status as you complete work</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Common Questions */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 border-2 border-purple-300">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                ❓ Common Questions
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Why is the breakdown empty?</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Make sure pricing rules exist for your selected plan price, plan weeks, and medication combination. You can create rules in the Admin section.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">What if totals don't match?</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    The system will automatically suggest an adjustment. Enter the adjustment amount and provide a reason (required) to balance the totals.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">How are state rules applied?</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    State-specific rules are automatically applied. For example, New York (NY) zeros out lab costs. Other states may have different rules.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Can I edit a receipt after generating it?</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Currently, receipts cannot be edited after generation. You'll need to create a new receipt with corrected information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

