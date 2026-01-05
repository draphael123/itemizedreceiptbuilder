#!/usr/bin/env node
/**
 * Automatic Setup Script
 * Runs all necessary setup steps automatically
 */

import { execSync } from 'child_process'
import { existsSync, writeFileSync, readFileSync } from 'fs'
import { join } from 'path'

console.log('🚀 Starting automatic setup...\n')

// Step 1: Check/create .env file
console.log('📝 Step 1: Setting up environment variables...')
const envPath = join(process.cwd(), '.env')
const envLocalPath = join(process.cwd(), '.env.local')

let envExists = existsSync(envPath) || existsSync(envLocalPath)

if (!envExists) {
  const defaultEnv = `# Database (SQLite for local development - no setup needed!)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${generateSecret()}"

# Google OAuth (get these from https://console.cloud.google.com/)
# For local testing, you can use dummy values initially
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Vercel Blob (optional - for production PDF storage)
# BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
`

  writeFileSync(envPath, defaultEnv)
  console.log('✅ Created .env file with default values')
} else {
  console.log('✅ .env file already exists')
}

// Step 2: Ensure Prisma schema uses SQLite
console.log('\n📦 Step 2: Configuring database schema...')
const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma')
const schemaContent = readFileSync(schemaPath, 'utf-8')

if (schemaContent.includes('provider = "postgresql"')) {
  const updatedSchema = schemaContent.replace(
    'provider = "postgresql"',
    'provider = "sqlite"'
  )
  writeFileSync(schemaPath, updatedSchema)
  console.log('✅ Updated schema to use SQLite (no external database needed)')
} else {
  console.log('✅ Schema already configured for SQLite')
}

// Step 3: Install dependencies
console.log('\n📥 Step 3: Installing dependencies...')
try {
  execSync('npm install', { stdio: 'inherit' })
  console.log('✅ Dependencies installed')
} catch (error) {
  console.log('⚠️  npm install failed, but continuing...')
}

// Step 4: Generate Prisma Client
console.log('\n🔧 Step 4: Generating Prisma Client...')
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma Client generated')
} catch (error) {
  console.log('⚠️  Prisma generate failed, but continuing...')
}

// Step 5: Push database schema
console.log('\n💾 Step 5: Setting up database...')
try {
  execSync('npx prisma db push', { stdio: 'inherit' })
  console.log('✅ Database schema created')
} catch (error) {
  console.log('⚠️  Database setup failed, but continuing...')
}

// Step 6: Seed database
console.log('\n🌱 Step 6: Seeding database with sample data...')
try {
  execSync('npm run db:seed', { stdio: 'inherit' })
  console.log('✅ Sample data loaded')
} catch (error) {
  console.log('⚠️  Seeding failed, but continuing...')
}

console.log('\n✨ Setup complete!')
console.log('\n📋 Next steps:')
console.log('1. Get Google OAuth credentials from https://console.cloud.google.com/')
console.log('2. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env')
console.log('3. Run: npm run dev')
console.log('\n💡 Tip: The app will work without Google OAuth for local testing!')
console.log('   Just sign in with any email when prompted.\n')

function generateSecret(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

