# Demo Mode - Run Without Database

You can run the application in **Demo Mode** without setting up a database! This uses in-memory storage for testing and development.

## ⚠️ Important Notes

- **Demo mode is for development/testing only**
- **Data is lost when the server restarts**
- **Not suitable for production**
- **Authentication is simplified** (you may need to mock auth for full functionality)

## Quick Start

### Option 1: No DATABASE_URL (Automatic Demo Mode)

Simply don't set `DATABASE_URL` in your `.env` file, or set it to `demo`:

```env
# .env
DATABASE_URL="demo"

# Still need these for NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="demo-secret-key-change-in-production"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

Then run:
```bash
npm run dev
```

The app will automatically detect demo mode and use in-memory storage!

### Option 2: Use SQLite for Local Development

If you want persistent data locally without external services:

```env
# .env
DATABASE_URL="file:./dev.db"
```

Then:
```bash
# Update schema to use SQLite
# In prisma/schema.prisma, change:
# provider = "sqlite"

npm run db:push
npm run db:seed
npm run dev
```

## What Works in Demo Mode

✅ **Receipt Creation** - Create and view receipts  
✅ **Pricing Rules** - Sample rules are pre-loaded  
✅ **Cost Breakdown** - Calculations work  
✅ **PDF Generation** - PDFs are generated  
✅ **UI/UX** - All interface features work  

## What's Limited in Demo Mode

⚠️ **Authentication** - NextAuth may need additional setup  
⚠️ **Data Persistence** - Data resets on server restart  
⚠️ **Multi-user** - Limited user management  
⚠️ **Production** - Not suitable for production use  

## Sample Data

Demo mode automatically includes sample pricing rules:
- $199 / 4 weeks / T-Cypionate
- $499 / 12 weeks / T-Cypionate

You can add more via the admin panel (if you make yourself admin).

## Making Yourself Admin in Demo Mode

Since there's no database, you can't easily make yourself admin. However, you can:

1. **Modify the demo storage** to set your user as admin
2. **Or** use the admin script with a mock user

For testing admin features, you can temporarily modify `lib/demo-storage.ts`:

```typescript
// In getDemoStorage(), after creating sample data:
const adminUser = await demoStorage.createUser({
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
})
```

## Switching to Real Database

When you're ready to use a real database:

1. **Set up Vercel Postgres** (recommended - see `scripts/setup-vercel-postgres.md`)
2. **Or use any PostgreSQL database**
3. **Set DATABASE_URL** in your `.env` file
4. **Run migrations**: `npm run db:push`
5. **Seed data**: `npm run db:seed`

The app will automatically switch from demo mode to database mode!

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npm install
npm run db:generate
```

### "Authentication not working"
- Demo mode may have limited auth support
- Consider using SQLite for local development instead
- Or set up a real database for full auth support

### "Data keeps disappearing"
- This is expected in demo mode (in-memory storage)
- Use SQLite (`DATABASE_URL="file:./dev.db"`) for persistent local data
- Or set up a real database for production

## Recommendation

For **local development**, use **SQLite**:
- Persistent data
- No external services
- Easy setup
- Works with all features

For **production**, use **Vercel Postgres**:
- Built into Vercel
- No external accounts needed
- Automatic backups
- Scalable

See `scripts/setup-vercel-postgres.md` for production setup!

