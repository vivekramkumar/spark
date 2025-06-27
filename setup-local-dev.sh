#!/bin/bash

# Create .env file for local development
echo "Creating .env file for local Supabase development..."
cat > .env << EOL
# Supabase configuration
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
EOL

echo "✅ .env file created successfully"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "⚠️ Supabase CLI is not installed"
    echo "Please install it by running:"
    echo "  brew install supabase/tap/supabase"
    echo "Or visit https://supabase.com/docs/guides/cli for other installation methods"
fi

echo ""
echo "🚀 Local Development Setup Instructions:"
echo "---------------------------------------"
echo "1. Start your local Supabase instance:"
echo "   supabase start"
echo ""
echo "2. Run the migration script to set up the database schema:"
echo "   supabase db reset"
echo ""
echo "3. Start the Expo development server:"
echo "   npm run dev"
echo ""
echo "4. For iOS emulator, run:"
echo "   npx expo run:ios"
echo ""
echo "Your app should now connect to your local Supabase instance!" 