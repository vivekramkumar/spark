#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}SparkMatch Local Database Initialization${NC}"
echo "=======================================\n"

# Check if Docker is running
echo "Checking if Docker is running..."
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Error: Docker is not running. Please start Docker and try again.${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}\n"

# Check if Supabase CLI is installed
echo "Checking if Supabase CLI is installed..."
if ! command -v supabase &> /dev/null; then
  echo -e "${RED}Error: Supabase CLI is not installed.${NC}"
  echo "Please install it by running:"
  echo "  npm install -g supabase"
  echo "Or visit https://supabase.com/docs/guides/cli for other installation methods"
  exit 1
fi
echo -e "${GREEN}✓ Supabase CLI is installed${NC}\n"

# Create .env file if it doesn't exist
echo "Creating .env file..."
if [ ! -f .env ]; then
  cat > .env << EOL
# Supabase configuration
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
EOL
  echo -e "${GREEN}✓ .env file created${NC}"
else
  echo -e "${YELLOW}⚠ .env file already exists, skipping creation${NC}"
fi
echo ""

# Initialize Supabase if not already initialized
echo "Checking Supabase project..."
if [ ! -d "supabase/.branches" ]; then
  echo "Initializing Supabase project..."
  supabase init
  echo -e "${GREEN}✓ Supabase project initialized${NC}"
else
  echo -e "${YELLOW}⚠ Supabase project already initialized, skipping${NC}"
fi
echo ""

# Start Supabase
echo "Starting Supabase services..."
supabase start
echo -e "${GREEN}✓ Supabase services started${NC}\n"

# Apply migrations
echo "Applying database migrations..."
supabase db reset
echo -e "${GREEN}✓ Database migrations applied${NC}\n"

echo -e "${GREEN}Local database setup complete!${NC}"
echo -e "You can now run the app with: ${YELLOW}npm run dev${NC}"
echo -e "And launch the iOS emulator with: ${YELLOW}npx expo run:ios${NC}\n"

echo "Supabase local services:"
echo "- Studio: http://localhost:54323"
echo "- API:    http://localhost:54321"
echo "- DB:     http://localhost:54322"
echo "- Email:  http://localhost:54324" 