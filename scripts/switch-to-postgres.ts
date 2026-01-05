#!/usr/bin/env node
/**
 * Switch Prisma Schema to PostgreSQL
 * Updates schema.prisma to use PostgreSQL instead of SQLite
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

console.log('🔄 Switching to PostgreSQL...\n')

const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma')
const schema = readFileSync(schemaPath, 'utf-8')

// Check current provider
if (schema.includes('provider = "sqlite"')) {
  // Switch to PostgreSQL
  const updated = schema.replace(
    'provider = "sqlite"',
    'provider = "postgresql"'
  )
  writeFileSync(schemaPath, updated)
  console.log('✅ Updated schema to use PostgreSQL')
  console.log('\n📋 Next steps:')
  console.log('1. Set DATABASE_URL in your .env file (or pull from Vercel)')
  console.log('2. Run: npm run db:generate')
  console.log('3. Run: npm run db:push')
  console.log('4. Run: npm run db:seed')
} else if (schema.includes('provider = "postgresql"')) {
  console.log('✅ Schema already uses PostgreSQL')
} else {
  console.log('⚠️  Could not detect database provider in schema')
}

