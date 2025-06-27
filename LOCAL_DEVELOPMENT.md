# Local Development Setup for SparkMatch

This guide will help you set up the SparkMatch app for local development, including configuring Supabase locally and running the app on an iOS emulator.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Docker](https://www.docker.com/) (required for Supabase local development)
- [Xcode](https://developer.apple.com/xcode/) (for iOS emulator)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Create a Local .env File

Create a `.env` file in the project root with the following content:

```
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

This configures the app to connect to your local Supabase instance.

### 3. Start Local Supabase

Initialize Supabase for the project (if not already done):

```bash
supabase init
```

Start the local Supabase services:

```bash
supabase start
```

This will start PostgreSQL, PostgREST, GoTrue (auth), and other Supabase services locally.

### 4. Apply Database Migrations

Apply the database schema migrations:

```bash
supabase db reset
```

This will apply all migrations in the `supabase/migrations` directory to your local database.

### 5. Start the Development Server

```bash
npm run dev
```

### 6. Run on iOS Emulator

```bash
npx expo run:ios
```

This will build the iOS app and launch it in the simulator.

## Accessing Local Supabase Studio

You can access the Supabase Studio UI at:

- Supabase Studio: http://localhost:54323
- API Docs: http://localhost:54321/rest/v1/
- Database: http://localhost:54322

## Testing Auth

When testing authentication locally:

1. Create a user through the app's registration flow
2. You can view created users in Supabase Studio (Authentication > Users)
3. For email verification, check the "Inbucket" email testing interface at http://localhost:54324

## Switching Between Local and Production

To switch between local and production environments:

1. For local development, use the `.env` file with localhost URLs
2. For production, update the `.env` file with your actual Supabase project credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Ensure Docker is running
2. Check if Supabase services are running with `supabase status`
3. Restart Supabase with `supabase stop` followed by `supabase start`

### Database Schema Issues

If you encounter database schema issues:

1. Check the migration files in `supabase/migrations/`
2. Reset the database with `supabase db reset`

### iOS Emulator Issues

If you encounter iOS emulator issues:

1. Make sure Xcode is up to date
2. Try cleaning the build folder with `npx expo prebuild --clean`
3. Rebuild with `npx expo run:ios` 