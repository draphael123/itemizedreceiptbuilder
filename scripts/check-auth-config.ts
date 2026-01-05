#!/usr/bin/env node
/**
 * Check Authentication Configuration
 * Verifies that all required environment variables are set
 */

import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

console.log('🔍 Checking authentication configuration...\n')

const envPath = join(process.cwd(), '.env')
const envLocalPath = join(process.cwd(), '.env.local')

let envContent = ''
if (existsSync(envPath)) {
  envContent = readFileSync(envPath, 'utf-8')
} else if (existsSync(envLocalPath)) {
  envContent = readFileSync(envLocalPath, 'utf-8')
} else {
  console.log('❌ No .env or .env.local file found!')
  console.log('   Run: npm run setup')
  process.exit(1)
}

// Check for required variables
const requiredVars = {
  'AUTH_SECRET': /AUTH_SECRET\s*=\s*["']?[^"'\s]+/i.test(envContent) || /NEXTAUTH_SECRET\s*=\s*["']?[^"'\s]+/i.test(envContent),
  'GOOGLE_CLIENT_ID': /GOOGLE_CLIENT_ID\s*=\s*["']?[^"'\s]+/i.test(envContent),
  'GOOGLE_CLIENT_SECRET': /GOOGLE_CLIENT_SECRET\s*=\s*["']?[^"'\s]+/i.test(envContent),
}

const missing = Object.entries(requiredVars)
  .filter(([_, exists]) => !exists)
  .map(([name]) => name)

if (missing.length === 0) {
  console.log('✅ All required authentication variables are set!')
  process.exit(0)
} else {
  console.log('❌ Missing required environment variables:\n')
  missing.forEach(name => console.log(`   - ${name}`))
  console.log('\n📝 How to fix:')
  console.log('1. Open your .env file')
  console.log('2. Add the missing variables:')
  if (missing.includes('AUTH_SECRET')) {
    console.log('   AUTH_SECRET="your-secret-here"')
    console.log('   (Generate with: openssl rand -base64 32)')
  }
  if (missing.includes('GOOGLE_CLIENT_ID') || missing.includes('GOOGLE_CLIENT_SECRET')) {
    console.log('   GOOGLE_CLIENT_ID="your-client-id"')
    console.log('   GOOGLE_CLIENT_SECRET="your-client-secret"')
    console.log('   (Get from: https://console.cloud.google.com/)')
  }
  console.log('\n3. Restart your development server')
  process.exit(1)
}

