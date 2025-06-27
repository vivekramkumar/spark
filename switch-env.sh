#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to display usage
show_usage() {
  echo -e "${BLUE}SparkMatch Environment Switcher${NC}"
  echo "============================"
  echo ""
  echo "Usage: ./switch-env.sh [local|prod]"
  echo ""
  echo "Options:"
  echo "  local    Switch to local development environment"
  echo "  prod     Switch to production environment"
  echo ""
  echo "Example:"
  echo "  ./switch-env.sh local"
}

# Check if argument is provided
if [ $# -eq 0 ]; then
  show_usage
  exit 1
fi

# Switch to local environment
switch_to_local() {
  echo -e "${YELLOW}Switching to local development environment...${NC}"
  
  # Create or update .env file
  cat > .env << EOL
# Supabase configuration - LOCAL DEVELOPMENT
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
EOL

  echo -e "${GREEN}✓ Environment switched to LOCAL${NC}"
  echo ""
  echo -e "${YELLOW}Next steps:${NC}"
  echo "1. Make sure Docker is running"
  echo "2. Start Supabase: supabase start"
  echo "3. Start the app: npm run dev"
}

# Switch to production environment
switch_to_prod() {
  echo -e "${YELLOW}Switching to production environment...${NC}"
  
  # Check if production values are set
  if [ -z "$PROD_SUPABASE_URL" ] || [ -z "$PROD_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}Error: Production Supabase credentials not set.${NC}"
    echo "Please set your production credentials by running:"
    echo "  export PROD_SUPABASE_URL=https://your-project-id.supabase.co"
    echo "  export PROD_SUPABASE_ANON_KEY=your-anon-key"
    exit 1
  fi
  
  # Create or update .env file
  cat > .env << EOL
# Supabase configuration - PRODUCTION
EXPO_PUBLIC_SUPABASE_URL=$PROD_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_ANON_KEY=$PROD_SUPABASE_ANON_KEY
EOL

  echo -e "${GREEN}✓ Environment switched to PRODUCTION${NC}"
  echo ""
  echo -e "${YELLOW}Next steps:${NC}"
  echo "1. Start the app: npm run dev"
}

# Process argument
case "$1" in
  local)
    switch_to_local
    ;;
  prod)
    switch_to_prod
    ;;
  *)
    echo -e "${RED}Invalid option: $1${NC}"
    show_usage
    exit 1
    ;;
esac 