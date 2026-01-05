import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ContactForm } from "@/components/contact-form"
import { SuggestionsForm } from "@/components/suggestions-form"

export default async function Home() {
  const session = await auth()

  if (!session) {
    redirect("/api/auth/signin")
  }

  return (
    <div className="container mx-auto py-10 relative overflow-hidden">
      {/* Animated background elements - More colorful */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-pink-400 to-red-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Admin Pricing Rules Button - Prominent */}
        <div className="mb-8 text-center">
          <Link href="/admin/pricing" className="group relative inline-block cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 via-red-500 via-pink-500 to-purple-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse pointer-events-none"></div>
            <div className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-1">
              <div className="relative bg-white dark:bg-gray-900 rounded-xl px-8 py-4 group-hover:scale-105 transition-transform">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔐</span>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Admin Access</div>
                    <div className="text-xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
                      Manage Pricing Rules
                    </div>
                  </div>
                  <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <h1 className="text-6xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 via-blue-600 via-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent animate-pulse-slow bg-[length:300%_auto]">
              🧾 Receipt Builder
            </h1>
            <div className="h-2 w-full bg-gradient-to-r from-purple-600 via-pink-600 via-blue-600 via-cyan-600 to-green-600 rounded-full shadow-lg"></div>
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">
            Create itemized receipts for patient plans with guided workflow
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg hover:scale-110 transition-transform">⚡ Fast</span>
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-semibold shadow-lg hover:scale-110 transition-transform">✅ Accurate</span>
            <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-semibold shadow-lg hover:scale-110 transition-transform">🔒 Secure</span>
          </div>
        </div>

        {/* Benefits Section - More colorful */}
        <div className="mb-12 bg-gradient-to-br from-blue-100 via-purple-100 via-pink-100 via-yellow-100 via-orange-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 rounded-2xl p-8 border-4 border-transparent bg-clip-padding shadow-2xl" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(45deg, #a855f7, #ec4899, #3b82f6, #06b6d4, #10b981, #f59e0b)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-pulse-slow">
              ✨ Why Use Receipt Builder?
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">⚡</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">Save Time</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Automate calculations and PDF generation. What used to take 30+ minutes now takes just 5 minutes per receipt.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-green-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-green-600 transition-colors">Ensure Accuracy</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Eliminate manual calculation errors. The system automatically calculates totals and validates that everything matches.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-purple-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">✅</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">Stay Compliant</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Automatic state-specific rule application ensures your receipts meet regulatory requirements (e.g., NY lab cost rules).
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-pink-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-pink-600 transition-colors">Professional Output</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Generate polished, professional PDF receipts with consistent formatting and complete itemization every time.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-orange-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🔄</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">Streamlined Workflow</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Guided 5-step wizard ensures you never miss information. Clear progress indicators keep you on track.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/30 dark:to-teal-900/30 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-cyan-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">💾</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-cyan-600 transition-colors">Centralized Storage</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                All receipts stored securely in one place. Easy search, download, and task management for better organization.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-yellow-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">🧮</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-yellow-600 transition-colors">Smart Calculations</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Automatic cost breakdown by category. Handles adjustments when needed and ensures totals always match.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-red-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">📋</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-red-600 transition-colors">Task Integration</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Link receipts to tasks, track completion status, and manage your workflow all in one place.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border-t-4 border-indigo-500 hover:scale-105 hover:-translate-y-1 group">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">Flexible Pricing</h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Easy pricing rule management. Import from spreadsheets or create custom rules for any plan combination.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 mb-12">
          <Link href="/receipts/new">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-[3px] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 animate-pulse-slow">
              <div className="relative h-36 rounded-2xl bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">✨</div>
                <Button size="lg" className="w-full text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg">
                  Create New Receipt
                </Button>
              </div>
            </div>
          </Link>
          <Link href="/receipts">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-[3px] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50">
              <div className="relative h-36 rounded-2xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📋</div>
                <Button size="lg" variant="outline" className="w-full text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg">
                  View All Receipts
                </Button>
              </div>
            </div>
          </Link>
          <Link href="/admin/setup">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-[3px] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-green-500/50">
              <div className="relative h-36 rounded-2xl bg-gradient-to-br from-white to-green-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
                <Button size="lg" variant="outline" className="w-full text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-lg">
                  Admin Setup
                </Button>
              </div>
            </div>
          </Link>
          <Link href="/admin/pricing">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-[3px] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50">
              <div className="relative h-36 rounded-2xl bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">💰</div>
                <Button size="lg" variant="outline" className="w-full text-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white border-0 shadow-lg">
                  Manage Pricing Rules
                </Button>
              </div>
            </div>
          </Link>
          <Link href="/tasks">
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-rose-500 p-[3px] transition-all hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50">
              <div className="relative h-36 rounded-2xl bg-gradient-to-br from-white to-orange-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">✅</div>
                <Button size="lg" variant="outline" className="w-full text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white border-0 shadow-lg">
                  View Tasks
                </Button>
              </div>
            </div>
          </Link>
        </div>

        {/* User Guide */}
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 rounded-2xl p-8 border-4 border-transparent bg-clip-padding shadow-2xl" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #a855f7, #ec4899, #3b82f6)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              📖 User Guide
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full"></div>
          </div>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 border-l-4 border-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Create a New Receipt
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Click <strong>&quot;Create New Receipt&quot;</strong> to start the 5-step wizard. You&apos;ll be guided through each step to collect all necessary information.
                  </p>
                  <div className="bg-purple-50 dark:bg-gray-700 rounded-md p-3 text-sm">
                    <p className="font-semibold mb-1">💡 Tip:</p>
                    <p>Make sure you have the patient&apos;s information, plan details, and provider information ready before starting.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-6 border-l-4 border-blue-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
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
                    <li><strong>Step 4 - Review & Adjust:</strong> Review the calculated breakdown. If totals don&apos;t match, add an adjustment with a reason</li>
                    <li><strong>Step 5 - Generate:</strong> Create the PDF receipt and save it to the database</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 border-l-4 border-green-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
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
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 rounded-xl p-6 border-l-4 border-orange-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
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
                    <li>Go to <strong>&quot;Manage Pricing Rules&quot;</strong> to view all existing rules</li>
                    <li>Create new rules for different plan prices, weeks, and medications</li>
                    <li>Rules are organized by: Plan Price → Plan Weeks → Medication → Category</li>
                    <li>Each rule includes item name, description, unit price, and quantity</li>
                  </ul>
                  <div className="bg-orange-50 dark:bg-gray-700 rounded-md p-3 mt-3 text-sm">
                    <p className="font-semibold mb-1">💡 Note:</p>
                    <p>If the breakdown doesn&apos;t load, make sure pricing rules exist for your selected plan price, weeks, and medication combination.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 rounded-xl p-6 border-l-4 border-pink-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
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
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">What if totals don&apos;t match?</p>
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
                    Currently, receipts cannot be edited after generation. You&apos;ll need to create a new receipt with corrected information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purpose & Value Section */}
        <div className="mt-16 mb-8">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 via-pink-600 via-red-600 to-orange-600 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  🎯 Our Purpose
                </h2>
                <div className="h-2 w-32 mx-auto bg-white rounded-full mb-6"></div>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="bg-white/95 dark:bg-gray-900/95 rounded-2xl p-8 shadow-xl mb-6">
                  <p className="text-xl text-gray-800 dark:text-gray-200 leading-relaxed mb-4 text-center font-medium">
                    <span className="text-3xl">📋</span> Receipt Builder transforms the complex, time-consuming process of creating itemized medical receipts into a <span className="font-bold text-purple-600 dark:text-purple-400">simple, guided workflow</span> that saves hours of manual work.
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center">
                    We eliminate calculation errors, ensure regulatory compliance, and deliver professional, accurate receipts every time—all while reducing your administrative burden by <span className="font-bold text-pink-600 dark:text-pink-400">up to 85%</span>.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl p-6 shadow-lg text-center">
                    <div className="text-4xl mb-3">⚡</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Speed</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Generate receipts in minutes, not hours. Our automated workflow cuts processing time dramatically.
                    </p>
                  </div>

                  <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl p-6 shadow-lg text-center">
                    <div className="text-4xl mb-3">🎯</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Accuracy</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Built-in validation ensures totals always match. No more manual calculation errors or discrepancies.
                    </p>
                  </div>

                  <div className="bg-white/90 dark:bg-gray-900/90 rounded-xl p-6 shadow-lg text-center">
                    <div className="text-4xl mb-3">🛡️</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Compliance</h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Automatic state-specific rule application keeps you compliant with regulations like NY lab cost rules.
                    </p>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <div className="inline-block bg-white/90 dark:bg-gray-900/90 rounded-xl px-8 py-4 shadow-lg">
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      <span className="text-2xl">💡</span> Built for healthcare administrators who value <span className="text-purple-600 dark:text-purple-400 font-bold">efficiency</span>, <span className="text-pink-600 dark:text-pink-400 font-bold">precision</span>, and <span className="text-blue-600 dark:text-blue-400 font-bold">professionalism</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Suggestions Section */}
        <div className="mt-16 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              📬 Get in Touch
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full"></div>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Have questions, feedback, or suggestions? We&apos;d love to hear from you!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ContactForm />
            <SuggestionsForm />
          </div>
        </div>
      </div>
    </div>
  )
}

