# Authentication Setup Guide

## Quick Fix

If you're seeing a "Server error" when trying to log in, run:

```bash
npm run fix-auth
```

This will automatically:
- ✅ Generate an `AUTH_SECRET` for you
- ✅ Add placeholder Google OAuth variables
- ✅ Set up `NEXTAUTH_URL`

## Complete Setup

### Step 1: Generate AUTH_SECRET (Already Done!)

The `fix-auth` script has already generated this for you. It's in your `.env` file.

### Step 2: Get Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click "Select a project" → "New Project"
   - Give it a name (e.g., "Receipt Builder")
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - If prompted, configure the OAuth consent screen first:
     - User Type: External
     - App name: Receipt Builder
     - Support email: your email
     - Click "Save and Continue"
     - Scopes: Just click "Save and Continue" (default is fine)
     - Test users: Add your email, then "Save and Continue"
   - Application type: Web application
   - Name: Receipt Builder (or any name)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
   - Click "Create"
   - **Copy the Client ID and Client Secret**

5. **Update Your .env File**
   - Open `.env` in your project root
   - Replace the placeholder values:
     ```
     GOOGLE_CLIENT_ID="your-actual-client-id-here"
     GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
     ```

### Step 3: Restart Your Server

After updating the `.env` file:

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Verify Configuration

Check that everything is set up correctly:

```bash
npm run check-auth
```

You should see: ✅ All required authentication variables are set!

## Troubleshooting

### Still seeing "Server error"?

1. **Check your .env file exists**
   ```bash
   npm run check-auth
   ```

2. **Make sure you restarted the server** after updating `.env`

3. **Verify Google OAuth credentials are correct**
   - No extra spaces or quotes
   - Client ID and Secret match what's in Google Cloud Console

4. **Check the redirect URI matches**
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Must match exactly in Google Cloud Console

### "Access Denied" error?

- Make sure your email is added as a test user in the OAuth consent screen
- Or publish your app (for production use)

## Need Help?

- Check server logs for detailed error messages
- Run `npm run check-auth` to verify configuration
- Make sure all environment variables are set correctly

