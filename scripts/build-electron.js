#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Building Receipt Builder Desktop App...\n')

// Step 1: Build Next.js app
console.log('📦 Step 1: Building Next.js app...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ Next.js build complete\n')
} catch (error) {
  console.error('❌ Next.js build failed')
  process.exit(1)
}

// Step 2: Create downloads directory
console.log('📁 Step 2: Creating downloads directory...')
const downloadsDir = path.join(process.cwd(), 'public', 'downloads')
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true })
  console.log('✅ Downloads directory created\n')
} else {
  console.log('✅ Downloads directory exists\n')
}

// Step 3: Build Electron app
console.log('⚡ Step 3: Building Electron app...')
console.log('Note: Run the following commands to build for specific platforms:\n')
console.log('  Windows: npm run electron:build:win')
console.log('  Mac:     npm run electron:build:mac')
console.log('  Linux:   npm run electron:build:linux\n')
console.log('After building, copy the installer files from dist/ to public/downloads/\n')

