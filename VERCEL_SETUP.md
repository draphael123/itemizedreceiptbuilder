# Vercel Deployment Setup Guide

## Using Vercel Postgres (Recommended - No External Services!)

Vercel Postgres is built into Vercel and requires no external accounts. See `scripts/setup-vercel-postgres.md` for detailed instructions.

### Quick Setup:

1. **Create Vercel Postgres Database**
   - Go to Vercel Dashboard → Your Project → **Storage** tab
   - Click **Create Database** → Select **Postgres**
   - Vercel automatically creates `POSTGRES_URL` environment variable

2. **Set DATABASE_URL**
   - Go to **Settings** → **Environment Variables**
   - Add: `DATABASE_URL` = `$POSTGRES_URL` (references the Postgres URL)
   - Or use `POSTGRES_URL` directly in your code

3. **Run Migrations**
   ```bash
   vercel env pull .env.local
   npm run db:push
   ```

## Alternative: External Database (If Needed)

If you prefer an external database service:

### Step 1: Set Up Database URL in Vercel

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **itemizedreceiptbuilder**
3. Go to **Settings** → **Environment Variables**
4. Add the following environment variable:

   **Name:** `DATABASE_URL`
   
   **Value:** Your PostgreSQL connection string
   
   For example:
   - **Neon**: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require`
   - **Supabase**: `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres`
   - **Local SQLite** (for testing): `file:./dev.db`
   
   **Environment:** Select all (Production, Preview, Development)

5. Click **Save**

### Step 2: Set Up Other Required Environment Variables

Add these additional environment variables:

1. **NEXTAUTH_URL**
   - Production: `https://your-domain.vercel.app`
   - Preview: `https://your-preview-url.vercel.app`
   - Development: `http://localhost:3000`

2. **NEXTAUTH_SECRET**
   - Generate a random secret: `openssl rand -base64 32`
   - Or use: https://generate-secret.vercel.app/32

3. **GOOGLE_CLIENT_ID**
   - Your Google OAuth Client ID

4. **GOOGLE_CLIENT_SECRET**
   - Your Google OAuth Client Secret

5. **BLOB_READ_WRITE_TOKEN** (Optional)
   - Your Vercel Blob storage token

### Step 3: Run Database Migrations

After setting DATABASE_URL, you need to run migrations:

1. Go to your Vercel project → **Settings** → **Build & Development Settings**
2. Add a build command override (if needed):
   ```
   prisma generate && prisma migrate deploy && next build
   ```

Or run migrations manually via Vercel CLI:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

### Step 4: Seed Pricing Rules

After the database is set up, you need to seed pricing rules:

**Option A: Via Vercel CLI**
```bash
vercel env pull .env.local
npm run db:seed
```

**Option B: Via Admin Panel (Recommended)**
1. Deploy your app
2. Sign in as an admin user
3. Go to **Admin** → **Manage Pricing Rules**
4. Create pricing rules manually or import from Excel

## Setting Up Pricing Rules

### Method 1: Using the Admin Panel (Recommended)

1. **Make yourself an admin:**
   - In your database, update your user record:
   ```sql
   UPDATE User SET role = 'admin' WHERE email = 'your-email@example.com';
   ```

2. **Access Admin Panel:**
   - Navigate to `/admin/pricing` in your deployed app
   - You'll see the Pricing Rules Manager

3. **Create Pricing Rules:**
   - Click "Create New Pricing Rule"
   - Fill in:
     - Plan Price (e.g., 199, 499)
     - Plan Weeks (e.g., 4, 8, 12)
     - Medication Key (e.g., "t-cypionate", "t-cream")
     - Category (Pharmacy, Lab, Clinical, Operational, Core)
     - Item Name and Description
     - Unit Price
     - Quantity
   - Click "Create Rule"

### Method 2: Import from Excel File

1. **Prepare your Excel file:**
   - Use the format: `Membership Payment Breakdowns Itemized Receipts (1).xlsx`
   - Place it in the project root

2. **Run the import script:**
   ```bash
   npm run import:pricing
   ```

### Method 3: Use the Seed Script

1. **Run the seed script:**
   ```bash
   npm run db:seed
   ```
   
   This will create sample pricing rules for common plans and medications.

### Understanding Pricing Rules

Pricing rules define how costs are calculated for each:
- **Plan Price**: The total plan cost (e.g., $199, $499)
- **Plan Weeks**: Duration of the plan (e.g., 4, 8, 12 weeks)
- **Medication Key**: The medication identifier (e.g., "t-cypionate", "t-cream")
- **Category**: Where the cost belongs:
  - **Pharmacy**: Medication costs
  - **Lab**: Laboratory work
  - **Clinical**: Provider consultations
  - **Operational**: Shipping, equipment, etc.
  - **Core**: Core membership fee

### Example Pricing Rule

For a $499 plan, 12 weeks, with T Cypionate:
- Pharmacy: $150 (medication cost)
- Lab: $75 (if plan >= 4 weeks)
- Clinical: $80 (provider consultation)
- Operational: $50 (shipping, equipment)
- Core: $144 (remaining amount: $499 - $150 - $75 - $80 - $50)

## Troubleshooting

### "Environment variable not found: DATABASE_URL"
- Ensure DATABASE_URL is set in Vercel environment variables
- Make sure it's available for all environments (Production, Preview, Development)
- Redeploy after adding the variable

### "No pricing rules found"
- Run `npm run db:seed` to create sample rules
- Or create rules via the Admin panel at `/admin/pricing`
- Ensure you have rules matching your plan price, weeks, and medication keys

### "Admin access required"
- Update your user role in the database:
  ```sql
  UPDATE User SET role = 'admin' WHERE email = 'your-email@example.com';
  ```

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Check that your database allows connections from Vercel IPs
- For Neon/Supabase, ensure SSL mode is enabled

