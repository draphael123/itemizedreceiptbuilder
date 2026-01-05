import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DownloadPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            💻 Download Desktop App
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300">
            Get Receipt Builder on your desktop for a better experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 border-blue-200 hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">🪟</span>
                Windows
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Windows 10/11 (64-bit)
              </p>
              <a href="/downloads/ReceiptBuilder-Setup.exe" download>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                  Download for Windows
                </Button>
              </a>
              <p className="text-xs text-gray-500 mt-2 text-center">
                .exe installer
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">🍎</span>
                macOS
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                macOS 10.15 or later
              </p>
              <a href="/downloads/ReceiptBuilder.dmg" download>
                <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white">
                  Download for Mac
                </Button>
              </a>
              <p className="text-xs text-gray-500 mt-2 text-center">
                .dmg installer
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 hover:shadow-xl transition-all">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <span className="text-3xl">🐧</span>
                Linux
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                AppImage (Universal)
              </p>
              <a href="/downloads/ReceiptBuilder.AppImage" download>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                  Download for Linux
                </Button>
              </a>
              <p className="text-xs text-gray-500 mt-2 text-center">
                .AppImage file
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-2xl">✨ Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <span>✅</span>
                <span>All web app features included</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✅</span>
                <span>Works completely offline</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✅</span>
                <span>Faster performance with local database</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✅</span>
                <span>Native file system access</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✅</span>
                <span>Automatic updates (coming soon)</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✅</span>
                <span>No internet required after installation</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

