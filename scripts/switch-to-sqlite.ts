#!/usr/bin/env node
/**
 * Switch Prisma Schema to SQLite
 * Updates schema.prisma to use SQLite instead of PostgreSQL
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

console.log('🔄 Switching to SQLite...\n')

const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma')
const schema = readFileSync(schemaPath, 'utf-8')

// Check current provider
if (schema.includes('provider = "postgresql"')) {
  // Switch to SQLite
  const updated = schema.replace(
    'provider = "postgresql"',
    'provider = "sqlite"'
  )
  writeFileSync(schemaPath, updated)
  console.log('✅ Updated schema to use SQLite')
  console.log('\n📋 Next steps:')
  console.log('1. Set DATABASE_URL="file:./dev.db" in your .env file')
  console.log('2. Run: npm run db:generate')
  console.log('3. Run: npm run db:push')
  console.log('4. Run: npm run db:seed')
} else if (schema.includes('provider = "sqlite"')) {
  console.log('✅ Schema already uses SQLite')
} else {
  console.log('⚠️  Could not detect database provider in schema')
}

