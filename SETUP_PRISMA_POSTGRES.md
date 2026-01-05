# Setting Up Prisma Postgres

Since Vercel Postgres isn't available, we'll use **Prisma Postgres** instead - it's actually a great choice!

## Why Prisma Postgres is Perfect

✅ **Made by Prisma** - Works seamlessly with your Prisma setup  
✅ **Serverless** - Scales automatically  
✅ **Free tier** - Great for getting started  
✅ **No external account** - Uses your Vercel account  
✅ **Instant setup** - Ready to use immediately  

## Setup Steps

### 1. Select Prisma Postgres

1. In the integrations list, click on **"Prisma Postgres"**
2. Click **"Add"** or **"Connect"**
3. Follow the prompts to create your database

### 2. Vercel Will Auto-Configure

After adding Prisma Postgres, Vercel will automatically:
- Create environment variables (`DATABASE_URL` or `PRISMA_DATABASE_URL`)
- Set up the connection
- Make it available to your deployments

### 3. Switch Your Schema to PostgreSQL

Run this command:

```bash
npm run switch:postgres
```

This updates `prisma/schema.prisma` to use PostgreSQL.

### 4. Pull Environment Variables Locally

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login and link project
vercel login
vercel link

# Pull environment variables
vercel env pull .env.local
```

### 5. Update Local .env

Edit your `.env` file to use the Prisma Postgres connection:

```env
# Use the DATABASE_URL from Prisma Postgres
DATABASE_URL="${DATABASE_URL}"
```

Or copy the `DATABASE_URL` value directly from `.env.local`.

### 6. Run Migrations

```bash
# Generate Prisma Client for Postgres
npm run db:generate

# Push schema to Prisma Postgres
npm run db:push

# Seed with sample data
npm run db:seed
```

### 7. Make Yourself Admin

```bash
npm run make-admin your-email@example.com
```

### 8. Deploy

Your next deployment will automatically use Prisma Postgres!

## That's It!

Prisma Postgres works exactly the same as Vercel Postgres - it's just hosted by Prisma instead of Vercel. Your app won't know the difference!

## Benefits of Prisma Postgres

- **Optimized for Prisma** - Built specifically for Prisma users
- **Serverless** - Pay only for what you use
- **Free tier** - Generous free tier to get started
- **Easy migrations** - Seamless Prisma integration
- **Great performance** - Optimized connection pooling

## Next Steps

1. ✅ Add Prisma Postgres from the integrations list
2. ✅ Run `npm run switch:postgres`
3. ✅ Pull env vars: `vercel env pull .env.local`
4. ✅ Run migrations: `npm run db:push && npm run db:seed`
5. ✅ Deploy and test!

You're all set! 🎉

