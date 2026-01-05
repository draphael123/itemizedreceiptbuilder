# Receipt Builder

A production-ready Next.js application for generating itemized receipts for patient plans. This application provides a guided workflow to collect patient information, calculate cost breakdowns based on pricing rules, and generate PDF receipts.

## Features

- **Guided Receipt Creation Wizard**: 5-step process to collect all necessary information
- **Dynamic Pricing Calculator**: Calculates itemized costs based on plan price, weeks, medications, and state rules
- **State-Specific Rules**: Automatically applies state regulations (e.g., NY zeros out lab costs)
- **Adjustment Handling**: Automatically calculates and allows manual adjustment when totals don't match
- **PDF Generation**: Creates professional itemized receipts using @react-pdf/renderer
- **Cloud Storage**: Stores PDFs in Vercel Blob (with local fallback for development)
- **Task Management**: Link receipts to tasks and track completion
- **Admin Panel**: Manage pricing rules through a user-friendly interface
- **Authentication**: Secure access via NextAuth with Google OAuth

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL (via Prisma ORM)
- **Authentication**: NextAuth.js (Google OAuth)
- **PDF Generation**: @react-pdf/renderer
- **Storage**: Vercel Blob (with local fallback)
- **Form Validation**: Zod + React Hook Form

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database (Neon, Supabase, or local)
- Google OAuth credentials (for authentication)
- Vercel account (optional, for blob storage)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Vercel Blob (optional - for production)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env` file

### Getting Vercel Blob Token (Optional)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project settings
3. Go to "Storage" → "Blob"
4. Create a new blob store and copy the token

## Installation (Automatic Setup)

**Just run one command and you're done!**

```bash
npm run setup
```

This automatically:
- ✅ Creates `.env` file with defaults
- ✅ Configures SQLite database (no external services needed!)
- ✅ Installs dependencies
- ✅ Sets up database schema
- ✅ Loads sample pricing rules

Then start the app:
```bash
npm run dev
```

That's it! Open [http://localhost:3000](http://localhost:3000) in your browser.

### Manual Installation (if needed)

1. Clone the repository:
```bash
git clone <repository-url>
cd receipt-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:push

# Seed the database with sample pricing rules
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

## Database Setup

### Using Vercel Postgres (Recommended - No External Services!)

Vercel Postgres is built into Vercel and requires no external accounts.

1. **Create Database in Vercel**
   - Go to Vercel Dashboard → Your Project → **Storage** tab
   - Click **Create Database** → Select **Postgres**
   - Vercel automatically creates `POSTGRES_URL` environment variable

2. **Set DATABASE_URL**
   - In Vercel Dashboard → **Settings** → **Environment Variables**
   - Add: `DATABASE_URL` = `$POSTGRES_URL`
   - Or pull locally: `vercel env pull .env.local`

3. **Run Migrations**
   ```bash
   vercel env pull .env.local
   npm run db:push
   npm run db:seed
   ```

See `scripts/setup-vercel-postgres.md` for detailed instructions.

### Alternative: External Database Services

If you prefer external services:

**Neon:**
1. Sign up at [Neon](https://neon.tech/)
2. Create a new project
3. Copy the connection string to `DATABASE_URL` in your `.env` file

**Supabase:**
1. Sign up at [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string to `DATABASE_URL` in your `.env` file

**Local PostgreSQL:**
1. Install PostgreSQL locally
2. Create a new database:
```bash
createdb receipt_builder
```
3. Set `DATABASE_URL` in your `.env` file:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/receipt_builder?schema=public"
```

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── actions/           # Server actions
│   ├── admin/             # Admin pages
│   ├── api/               # API routes
│   ├── receipts/          # Receipt pages
│   └── tasks/             # Task pages
├── components/            # React components
│   ├── receipt-wizard/   # Wizard step components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions
│   ├── pricing-calculator.ts
│   ├── pdf-generator.tsx
│   └── validations.ts
├── prisma/                # Prisma schema and migrations
└── public/                # Static assets
```

## Usage

### Creating a Receipt

1. Navigate to "Create New Receipt" from the home page
2. Follow the 5-step wizard:
   - **Step 1**: Enter patient information (name, DOB, dates, state)
   - **Step 2**: Select plan price, weeks, medications, and charge amount
   - **Step 3**: Enter provider details (name, NPI, diagnosis code, procedure code)
   - **Step 4**: Review the calculated breakdown and add adjustments if needed
   - **Step 5**: Generate and save the receipt

### Managing Pricing Rules

1. Navigate to "Manage Pricing Rules" from the home page
2. Create new rules by filling in:
   - Plan price and weeks
   - Medication key
   - Category (Pharmacy, Lab, Clinical, Operational, Core)
   - Item name, description, unit price, and quantity
3. Rules are automatically used when calculating receipts

### Managing Tasks

1. View all tasks from the "View Tasks" page
2. Create tasks linked to receipts from the receipt detail page
3. Mark tasks as complete or reopen them

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com/)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Vercel Environment Variables

Make sure to add all environment variables from your `.env` file to Vercel:
- `DATABASE_URL`
- `NEXTAUTH_URL` (set to your production domain)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `BLOB_READ_WRITE_TOKEN` (optional)

## State Rules

The application includes built-in state rules:

- **New York (NY)**: Zeros out lab costs
- **New Jersey (NJ)**: No special rules
- **Maryland (MD)**: No special rules

You can extend these rules in `lib/pricing-calculator.ts`.

## PDF Storage

- **Production**: PDFs are stored in Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set
- **Development**: PDFs are stored locally in `public/receipts/` directory

## Development

### Running Migrations

```bash
npm run db:migrate
```

### Seeding Database

```bash
npm run db:seed
```

### Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Ensure your database is accessible from your network
- Check if SSL is required (add `?sslmode=require` to connection string if needed)

### Authentication Issues

- Verify Google OAuth credentials are correct
- Ensure redirect URIs match in Google Cloud Console
- Check `NEXTAUTH_SECRET` is set

### PDF Generation Issues

- Ensure all required fields are filled in the receipt form
- Check browser console for errors
- Verify Vercel Blob token is valid (if using production storage)

## License

This project is proprietary software.

## Support

For issues or questions, please contact the development team.

#   F o r c e   V e r c e l   r e b u i l d  
 