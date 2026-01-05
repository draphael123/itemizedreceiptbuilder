#!/usr/bin/env node
/**
 * Fix Authentication Configuration
 * Adds missing authentication environment variables to .env file
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { randomBytes } from 'crypto'

console.log('🔧 Fixing authentication configuration...\n')

const envPath = join(process.cwd(), '.env')
const envLocalPath = join(process.cwd(), '.env.local')

let envPathToUse = envPath
let envContent = ''

if (existsSync(envPath)) {
  envContent = readFileSync(envPath, 'utf-8')
  envPathToUse = envPath
} else if (existsSync(envLocalPath)) {
  envContent = readFileSync(envLocalPath, 'utf-8')
  envPathToUse = envLocalPath
} else {
  // Create new .env file
  envContent = ''
  envPathToUse = envPath
}

// Generate AUTH_SECRET if missing
const hasAuthSecret = /AUTH_SECRET\s*=/i.test(envContent) || /NEXTAUTH_SECRET\s*=/i.test(envContent)
if (!hasAuthSecret) {
  const secret = randomBytes(32).toString('base64')
  envContent += `\n# NextAuth Secret (auto-generated)\nAUTH_SECRET="${secret}"\n`
  console.log('✅ Generated AUTH_SECRET')
} else {
  console.log('✅ AUTH_SECRET already exists')
}

// Add Google OAuth placeholders if missing
const hasGoogleClientId = /GOOGLE_CLIENT_ID\s*=/i.test(envContent)
const hasGoogleClientSecret = /GOOGLE_CLIENT_SECRET\s*=/i.test(envContent)

if (!hasGoogleClientId || !hasGoogleClientSecret) {
  envContent += `\n# Google OAuth (REQUIRED - get from https://console.cloud.google.com/)\n`
  if (!hasGoogleClientId) {
    envContent += `GOOGLE_CLIENT_ID="your-google-client-id-here"\n`
  }
  if (!hasGoogleClientSecret) {
    envContent += `GOOGLE_CLIENT_SECRET="your-google-client-secret-here"\n`
  }
  console.log('✅ Added Google OAuth placeholders')
} else {
  console.log('✅ Google OAuth variables already exist')
}

// Ensure NEXTAUTH_URL is set
if (!/NEXTAUTH_URL\s*=/i.test(envContent)) {
  envContent += `\n# NextAuth URL\nNEXTAUTH_URL="http://localhost:3000"\n`
  console.log('✅ Added NEXTAUTH_URL')
}

writeFileSync(envPathToUse, envContent.trim() + '\n')

console.log('\n✨ Configuration updated!')
console.log('\n📋 Next steps:')
console.log('1. Get Google OAuth credentials:')
console.log('   - Go to https://console.cloud.google.com/')
console.log('   - Create a project or select existing')
console.log('   - Enable Google+ API')
console.log('   - Create OAuth 2.0 Client ID')
console.log('   - Add redirect URI: http://localhost:3000/api/auth/callback/google')
console.log('   - Copy Client ID and Secret to .env file')
console.log('\n2. Update your .env file with the Google credentials')
console.log('\n3. Restart your development server: npm run dev')
console.log('\n💡 Tip: Run "npm run check-auth" to verify your configuration')

