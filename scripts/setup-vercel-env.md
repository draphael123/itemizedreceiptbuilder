# Setting Up DATABASE_URL in Vercel

## Quick Setup Guide

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: **itemizedreceiptbuilder**

2. **Navigate to Environment Variables**
   - Go to **Settings** → **Environment Variables**

3. **Add DATABASE_URL**
   - Click **Add New**
   - **Key:** `DATABASE_URL`
   - **Value:** Your database connection string (see below for examples)
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click the three dots (⋯) on the latest deployment
   - Select **Redeploy**

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Add environment variable
vercel env add DATABASE_URL

# When prompted, paste your database URL
# Select all environments (Production, Preview, Development)

# Redeploy
vercel --prod
```

## Database Connection Strings

### For Neon (PostgreSQL)
```
postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
```

### For Supabase (PostgreSQL)
```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### For Local SQLite (Development Only)
```
file:./dev.db
```

**Note:** SQLite won't work on Vercel. You need PostgreSQL (Neon or Supabase) for production.

## Making Yourself Admin

After setting up the database, you need to make yourself an admin to create pricing rules:

### Option 1: Via Database Directly

1. Connect to your database (Neon/Supabase dashboard)
2. Run this SQL query:
```sql
UPDATE User SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Option 2: Via Prisma Studio (Local)

```bash
# Pull environment variables
vercel env pull .env.local

# Open Prisma Studio
npx prisma studio

# Navigate to User table
# Find your user and change role from "user" to "admin"
```

### Option 3: Create a Migration Script

Create a file `scripts/make-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function makeAdmin(email: string) {
  const user = await prisma.user.update({
    where: { email },
    data: { role: 'admin' }
  })
  console.log(`✅ ${email} is now an admin`)
}

makeAdmin('your-email@example.com')
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run it:
```bash
vercel env pull .env.local
tsx scripts/make-admin.ts
```

## Verifying Setup

1. **Check Environment Variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Verify `DATABASE_URL` is set

2. **Check Database Connection**
   - Try accessing `/admin/pricing` in your app
   - If you see "Admin access required", you need to make yourself admin
   - If you see database errors, check your DATABASE_URL format

3. **Test Creating a Pricing Rule**
   - Go to `/admin/pricing`
   - Fill in the form and click "Create Rule"
   - You should see a success message

## Troubleshooting

### "Environment variable not found: DATABASE_URL"
- Ensure DATABASE_URL is added in Vercel
- Make sure it's set for the correct environment
- Redeploy after adding the variable

### "Admin access required"
- Make yourself admin using one of the methods above
- Sign out and sign back in to refresh your session

### "Database connection error"
- Verify your DATABASE_URL is correct
- Check that your database allows connections from Vercel IPs
- For Neon/Supabase, ensure SSL mode is enabled

### "Nothing happens when clicking Create Rule"
- Open browser console (F12) to see errors
- Check that you're an admin user
- Verify DATABASE_URL is set correctly
- Check network tab for failed requests

