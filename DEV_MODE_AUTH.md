# Development Mode Authentication

You can run the app **without setting up Google OAuth** by enabling development mode!

## Quick Start (No Google OAuth Required)

1. **Enable Dev Mode**
   - Open your `.env` file
   - Find the line: `ENABLE_DEV_AUTH="false"`
   - Change it to: `ENABLE_DEV_AUTH="true"`

2. **Restart Your Server**
   ```bash
   npm run dev
   ```

3. **That's it!** 
   - You'll be automatically signed in as a dev user
   - No Google OAuth setup needed
   - Full admin access included

## What Dev Mode Does

- ✅ Automatically creates a dev user in your database
- ✅ Bypasses Google OAuth authentication
- ✅ Gives you admin access automatically
- ✅ Works completely offline
- ✅ Perfect for local development and testing

## Dev User Details

- **Email**: `dev@example.com`
- **Name**: Dev User
- **Role**: Admin (full access)

## When to Use Dev Mode

- ✅ Local development
- ✅ Testing features
- ✅ Demo purposes
- ✅ When you don't want to set up Google OAuth

## When NOT to Use Dev Mode

- ❌ Production deployment
- ❌ When you need real user authentication
- ❌ When testing OAuth flows

## Switching Back to Google OAuth

1. Set `ENABLE_DEV_AUTH="false"` in your `.env`
2. Add your Google OAuth credentials:
   ```
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```
3. Restart your server

## Notes

- Dev mode only works in development
- The dev user is created automatically in your database
- You can use all features normally
- No security restrictions (for development only!)

