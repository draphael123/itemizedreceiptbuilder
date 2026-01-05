# Setting Up Vercel Postgres (No External Services Required!)

Vercel Postgres is Vercel's built-in database service. It's free to start and requires no external accounts.

## Quick Setup (5 minutes)

### Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project: **itemizedreceiptbuilder**

2. **Navigate to Storage**
   - Go to your project → **Storage** tab
   - Click **Create Database**
   - Select **Postgres**

3. **Configure Database**
   - **Name:** `receipt-builder-db` (or any name you prefer)
   - **Region:** Choose closest to you (e.g., `iad1` for US East)
   - Click **Create**

4. **Get Connection String**
   - After creation, Vercel automatically creates environment variables
   - Go to **Settings** → **Environment Variables**
   - You'll see `POSTGRES_URL` (or `DATABASE_URL`) already set!
   - Vercel automatically uses this for your deployments

### Step 2: Run Database Migrations

After creating the database, you need to set up the schema:

**Option A: Via Vercel CLI (Recommended)**

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already)
vercel link

# Pull environment variables (includes POSTGRES_URL)
vercel env pull .env.local

# Run migrations
npm run db:push

# Or create a migration
npm run db:migrate
```

**Option B: Via Vercel Dashboard**

1. Go to your project → **Storage** → Your Postgres database
2. Click **.env.local** tab to see connection string
3. Copy the `POSTGRES_URL`
4. Add it to your local `.env` file as `DATABASE_URL`
5. Run migrations locally:
   ```bash
   npm run db:push
   ```

### Step 3: Seed the Database

```bash
# Make sure DATABASE_URL is set in .env.local
vercel env pull .env.local

# Seed with sample pricing rules
npm run db:seed
```

### Step 4: Make Yourself Admin

```bash
# Pull environment variables
vercel env pull .env.local

# Make yourself admin
npm run make-admin your-email@example.com
```

## Environment Variables

Vercel automatically creates these when you create a Postgres database:
- `POSTGRES_URL` - Main connection string
- `POSTGRES_PRISMA_URL` - Prisma-optimized connection string
- `POSTGRES_URL_NON_POOLING` - Direct connection (for migrations)

**Important:** Update your Prisma schema to use `DATABASE_URL`:

In your `.env.local` (after pulling from Vercel):
```env
DATABASE_URL="${POSTGRES_URL}"
```

Or in Vercel Dashboard → Environment Variables, add:
- **Key:** `DATABASE_URL`
- **Value:** `$POSTGRES_URL` (references the Postgres URL)
- **Environment:** All

## Vercel Postgres Benefits

✅ **No External Accounts** - Everything in Vercel  
✅ **Free Tier** - 256 MB storage, 60 hours compute/month  
✅ **Automatic Backups** - Daily backups included  
✅ **Zero Configuration** - Works out of the box  
✅ **Integrated** - No connection issues with Vercel deployments  
✅ **Scalable** - Easy to upgrade as you grow  

## Troubleshooting

### "Environment variable not found: DATABASE_URL"
- Vercel creates `POSTGRES_URL` by default
- Add `DATABASE_URL` that references `$POSTGRES_URL` in Vercel environment variables
- Or update your code to use `POSTGRES_URL` directly

### "Connection refused" or "Database not found"
- Make sure you've created the Postgres database in Vercel Storage
- Verify environment variables are set in Vercel Dashboard
- Redeploy after adding environment variables

### "Migration failed"
- Make sure `DATABASE_URL` is set correctly
- Try running `npm run db:push` locally first with `.env.local`
- Check that your Prisma schema uses `provider = "postgresql"`

### "Admin access required"
- Run `npm run make-admin your-email@example.com`
- Or update directly in database using Vercel's database UI

## Local Development

For local development, you can:

1. **Use Vercel Postgres** (same as production)
   ```bash
   vercel env pull .env.local
   npm run dev
   ```

2. **Use SQLite** (faster for local dev)
   - Keep `provider = "sqlite"` in `schema.prisma` for local
   - Use `DATABASE_URL="file:./dev.db"` in `.env`
   - Switch to Postgres for production

## Next Steps

1. ✅ Create Vercel Postgres database
2. ✅ Run migrations (`npm run db:push`)
3. ✅ Seed database (`npm run db:seed`)
4. ✅ Make yourself admin (`npm run make-admin`)
5. ✅ Deploy and test!

That's it! No external services needed. Everything runs on Vercel! 🎉

