# SparkMatch - Gaming Dating App

A React Native dating app built with Expo that connects gamers through interactive games and shared interests.

## 🚀 Features

- **Authentication System** - Secure login/register with Supabase
- **Profile Management** - Complete profile editing with photo uploads
- **Interactive Games** - Truth or Dare, Never Have I Ever, Would You Rather, Rapid Fire Q&A, Emoji Story
- **Real-time Chat** - Message matches and play games together
- **Swipe Interface** - Tinder-style profile discovery
- **Gaming Stats** - Track wins, levels, and achievements

## 🛠 Setup Instructions

### Option 1: Production Setup (Remote Supabase)

#### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. **IMPORTANT**: Wait for the project to be fully set up (this can take 2-3 minutes)
3. Go to Settings > API in your Supabase dashboard
4. Copy your Project URL and anon/public key

#### 2. Configure Environment Variables

1. Create a `.env` file in the root directory
2. Add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**⚠️ Common Issues:**
- Make sure the URL starts with `https://` and ends with `.supabase.co`
- The anon key should be a long string starting with `eyJ`
- Don't include quotes around the values
- Make sure there are no spaces around the `=` sign

#### 3. Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire SQL content from `supabase/migrations/20250623181540_wispy_pebble.sql`
3. Paste it into the SQL editor and click **Run**
4. This creates the `profiles` table and security policies

### Option 2: Local Development Setup

For local development, we've provided scripts to help you set up a local Supabase instance:

#### Prerequisites

- [Docker](https://www.docker.com/) (required for local Supabase)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Xcode](https://developer.apple.com/xcode/) (for iOS emulator)

#### Quick Setup

1. Run the initialization script:

```bash
./init-local-db.sh
```

This script will:
- Create a `.env` file with local Supabase credentials
- Initialize Supabase locally
- Start the local Supabase services
- Apply the database migrations

2. Start the development server:

```bash
npm run dev
```

3. For iOS emulator:

```bash
npx expo run:ios
```

#### Manual Setup

If you prefer to set up manually, follow the instructions in the `LOCAL_DEVELOPMENT.md` file.

#### Switching Between Local and Production

Use the provided script to easily switch between environments:

```bash
# Switch to local development
./switch-env.sh local

# Switch to production (requires setting PROD_SUPABASE_URL and PROD_SUPABASE_ANON_KEY)
./switch-env.sh prod
```

### 4. Restart Development Server

After setting up the environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 5. Test the Connection

The app will automatically test the Supabase connection on startup. If there are issues, you'll see a detailed error screen with specific instructions.

## 🔧 Troubleshooting

### "No project found" Error

This usually means one of the following:

1. **Project Still Setting Up**: Supabase projects take 2-3 minutes to fully initialize. Wait and try again.

2. **Wrong URL**: Make sure your URL is in the format: `https://your-project-id.supabase.co`

3. **Wrong Key**: Make sure you're using the `anon/public` key, not the `service_role` key.

4. **Environment Variables Not Loaded**: 
   - Restart your development server after creating the `.env` file
   - Make sure the `.env` file is in the project root (same level as `package.json`)

5. **Database Not Set Up**: Run the migration SQL in your Supabase dashboard.

### Local Development Issues

1. **Docker Not Running**: Make sure Docker is running on your machine
2. **Supabase CLI Not Installed**: Install with `npm install -g supabase`
3. **Port Conflicts**: Make sure ports 54321-54326 are available
4. **Database Reset**: If schema issues occur, run `supabase db reset`

### Connection Test Failed

The app includes a built-in connection tester that will show you exactly what's wrong:

- ✅ **Green checkmarks**: Everything is configured correctly
- ❌ **Red X marks**: Issues that need to be fixed
- **Detailed error messages**: Specific guidance for each type of error

### Environment Variables Not Working

1. Make sure your `.env` file is in the project root
2. Restart the development server completely
3. Check that variable names start with `EXPO_PUBLIC_`
4. Verify there are no typos in the variable names

## 📱 App Structure

- **Authentication Flow** - Welcome → Login/Register → Main App
- **Main Tabs** - Discover, Likes, Chat, Profile
- **Games** - Interactive mini-games for matches
- **Profile System** - Complete user profiles with photos and interests

## 🎮 Games Available

1. **Truth or Dare** - Answer personal questions or complete dares
2. **Never Have I Ever** - Share experiences and learn about each other
3. **Would You Rather** - Make difficult choices that reveal personality
4. **Rapid Fire Q&A** - Quick questions for instant chemistry check
5. **Emoji Story** - Create stories using only emojis

## 🔧 Tech Stack

- **Frontend** - React Native with Expo
- **Backend** - Supabase (PostgreSQL + Auth + Real-time)
- **Navigation** - Expo Router
- **Styling** - StyleSheet with Linear Gradients
- **Icons** - Lucide React Native
- **Fonts** - Inter (Google Fonts)

## 📄 Database Schema

The app uses a single `profiles` table with:
- User authentication data (linked to Supabase Auth)
- Profile information (name, age, bio, location)
- Gaming data (level, XP, games won)
- Media arrays (photos, interests)
- Timestamps and security policies

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Users can only read/write their own data
- Public read access for profile discovery
- Secure authentication with Supabase Auth

## 🎨 Design

The app features a modern dark theme with:
- Gradient backgrounds and glassmorphism effects
- Smooth animations and micro-interactions
- Responsive design for all screen sizes
- Gaming-inspired UI elements and colors

## 📞 Support

If you're still having issues after following this guide:

1. Check the browser console for detailed error messages
2. Verify your Supabase project is active and not paused
3. Make sure you're using the correct region for your project
4. Try creating a new Supabase project if the current one seems corrupted

The app includes comprehensive error reporting that will guide you through fixing any configuration issues.