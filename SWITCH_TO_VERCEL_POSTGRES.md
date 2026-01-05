# Switching to Vercel Postgres

This guide will help you switch from SQLite (local) to Vercel Postgres (production).

## Quick Steps

### 1. Create Vercel Postgres Database

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: **itemizedreceiptbuilder**

2. **Create Postgres Database**
   - Click on the **Storage** tab
   - Click **Create Database**
   - Select **Postgres**
   - **Name:** `receipt-builder-db` (or any name)
   - **Region:** Choose closest to you (e.g., `iad1` for US East)
   - Click **Create**

3. **Vercel automatically creates environment variables:**
   - `POSTGRES_URL` - Main connection string
   - `POSTGRES_PRISMA_URL` - Prisma-optimized connection
   - `POSTGRES_URL_NON_POOLING` - Direct connection (for migrations)

### 2. Set DATABASE_URL in Vercel

1. **Go to Environment Variables**
   - In your Vercel project → **Settings** → **Environment Variables**

2. **Add DATABASE_URL**
   - Click **Add New**
   - **Key:** `DATABASE_URL`
   - **Value:** `$POSTGRES_URL` (this references the Postgres URL Vercel created)
   - **Environment:** Select all (Production, Preview, Development)
   - Click **Save**

### 3. Update Prisma Schema for Production

**Option A: Keep SQLite for Local, Postgres for Production (Recommended)**

Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

**Option B: Use Environment-Specific Schema (Advanced)**

You can keep SQLite for local and use Postgres in production by:
- Using different schema files, OR
- Setting `DATABASE_URL` appropriately in each environment

For now, let's use **Option A** - switch to Postgres globally.

### 4. Pull Environment Variables Locally

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already)
vercel link

# Pull environment variables (includes POSTGRES_URL)
vercel env pull .env.local
```

This creates `.env.local` with your Vercel Postgres connection string.

### 5. Update Local .env File

Edit your `.env` file to use the Postgres URL:

```env
# Use the Postgres URL from Vercel
DATABASE_URL="${POSTGRES_URL}"

# Or copy the POSTGRES_URL value directly from .env.local
# DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### 6. Run Migrations

```bash
# Generate Prisma Client for Postgres
npm run db:generate

# Push schema to Vercel Postgres
npm run db:push

# Seed with sample data
npm run db:seed
```

### 7. Make Yourself Admin

```bash
# Pull environment variables first
vercel env pull .env.local

# Make yourself admin
npm run make-admin your-email@example.com
```

### 8. Deploy to Vercel

Your next deployment will automatically use Vercel Postgres!

```bash
# Push your changes
git add .
git commit -m "Switch to Vercel Postgres"
git push

# Vercel will automatically deploy with the new database
```

## Keeping SQLite for Local Development

If you want to keep SQLite for local development but use Postgres in production:

### Method 1: Use .env.local for Postgres

1. Keep `.env` with SQLite:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

2. Use `.env.local` for Postgres (when needed):
   ```env
   DATABASE_URL="postgresql://..." # From Vercel
   ```

3. Switch schema manually when needed, OR

### Method 2: Environment Detection Script

Create a script that switches the schema based on environment:

```typescript
// scripts/switch-db.ts
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const schemaPath = join(process.cwd(), 'prisma', 'schema.prisma')
const schema = readFileSync(schemaPath, 'utf-8')

const isProduction = process.env.VERCEL || process.env.DATABASE_URL?.startsWith('postgresql')

if (isProduction) {
  const updated = schema.replace('provider = "sqlite"', 'provider = "postgresql"')
  writeFileSync(schemaPath, updated)
  console.log('✅ Switched to PostgreSQL for production')
} else {
  const updated = schema.replace('provider = "postgresql"', 'provider = "sqlite"')
  writeFileSync(schemaPath, updated)
  console.log('✅ Switched to SQLite for local development')
}
```

## Verification

### Check Database Connection

1. **In Vercel Dashboard:**
   - Go to **Storage** → Your Postgres database
   - You should see connection info and usage stats

2. **Test Locally:**
   ```bash
   # Pull env vars
   vercel env pull .env.local
   
   # Test connection
   npx prisma studio
   # This should open Prisma Studio connected to your Vercel Postgres
   ```

3. **Test in Production:**
   - Deploy your app
   - Try creating a receipt
   - Check that data persists

## Troubleshooting

### "Environment variable not found: DATABASE_URL"
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Ensure it references `$POSTGRES_URL` or contains the full connection string
- Redeploy after adding the variable

### "Provider mismatch" or "Schema error"
- Make sure `prisma/schema.prisma` uses `provider = "postgresql"`
- Run `npm run db:generate` after changing the provider
- Run `npm run db:push` to sync the schema

### "Connection refused" or "Database not found"
- Verify `POSTGRES_URL` is correct in Vercel
- Check that the database was created successfully
- Ensure SSL mode is enabled (Vercel Postgres includes this automatically)

### "Migration failed"
- Make sure you're using the correct `DATABASE_URL`
- Try running `npx prisma migrate reset` (⚠️ deletes all data)
- Or use `npx prisma db push` instead of migrations

## Benefits of Vercel Postgres

✅ **No External Accounts** - Everything in Vercel  
✅ **Free Tier** - 256 MB storage, 60 hours compute/month  
✅ **Automatic Backups** - Daily backups included  
✅ **Zero Configuration** - Works out of the box  
✅ **Integrated** - No connection issues  
✅ **Scalable** - Easy to upgrade  

## Next Steps

1. ✅ Create Vercel Postgres database
2. ✅ Set `DATABASE_URL` environment variable
3. ✅ Update Prisma schema to `postgresql`
4. ✅ Run migrations and seed data
5. ✅ Deploy and test!

Your app is now using Vercel Postgres! 🎉

