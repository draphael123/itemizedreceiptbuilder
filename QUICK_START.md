# Quick Start Guide

## 🚀 Get Started in 2 Commands

```bash
npm run setup
npm run dev
```

That's it! The setup script automatically:
- ✅ Creates `.env` file with SQLite (no external database needed!)
- ✅ Installs all dependencies
- ✅ Sets up the database
- ✅ Loads sample pricing rules
- ✅ Configures everything for local development

Then open [http://localhost:3000](http://localhost:3000) 🎉

## What You Get

- **SQLite Database** - No external services, just a local file (`dev.db`)
- **Sample Data** - Pre-loaded pricing rules so you can test immediately
- **Full Features** - Everything works out of the box

## Optional: Google OAuth

For authentication, you can optionally set up Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth credentials
3. Update `.env` with your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

**But you don't need this to start!** The app will work for local testing without it.

## Next Steps

1. **Test the app** - Create a receipt, view pricing rules, etc.
2. **Make yourself admin** (optional):
   ```bash
   npm run make-admin your-email@example.com
   ```
3. **Deploy to Vercel** (when ready):
   - See `scripts/setup-vercel-postgres.md` for production setup
   - Or use Vercel Postgres (built into Vercel, no external accounts!)

## Troubleshooting

### "Command not found: npm run setup"
Make sure you're in the project directory and have Node.js installed.

### "Database error"
Run `npm run db:push` to recreate the database.

### "No pricing rules"
Run `npm run db:seed` to load sample data.

That's it! Enjoy your receipt builder! 🎊

