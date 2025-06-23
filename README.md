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

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully set up (this can take a few minutes)
3. Go to Settings > API in your Supabase dashboard
4. Copy your Project URL and anon/public key

### 2. Configure Environment Variables

1. Create a `.env` file in the root directory
2. Add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Set Up Database

1. In your Supabase dashboard, go to SQL Editor
2. Copy the SQL from `supabase/migrations/20250623181540_wispy_pebble.sql`
3. Paste and run the migration to create the profiles table and security policies

### 4. Configure Authentication (Optional)

1. In Supabase dashboard, go to Authentication > Settings
2. For development, you can disable email confirmation
3. For production, configure SMTP settings for email verification

### 5. Run the App

```bash
npm install
npm run dev
```

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

## 🚨 Troubleshooting

### "No project found" Error

This usually means:
1. Supabase project isn't fully set up yet (wait a few minutes)
2. Environment variables are incorrect
3. Database migration hasn't been run

### Connection Issues

1. Check your `.env` file has the correct credentials
2. Ensure your Supabase project is active
3. Verify the database migration was successful
4. Check the browser console for detailed error messages

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