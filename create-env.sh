#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}SparkMatch Environment Setup${NC}"
echo "===========================\n"

# Function to create local environment file
create_local_env() {
  echo "Creating .env file for local development..."
  cat > .env << EOL
# Supabase configuration - LOCAL DEVELOPMENT
EXPO_PUBLIC_SUPABASE_URL=http://localhost:54321
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
EOL
  echo -e "${GREEN}✓ Local .env file created${NC}"
  echo -e "${YELLOW}Note: You'll need to install Docker and Supabase CLI to run a local Supabase instance${NC}"
}

# Function to create production environment file
create_prod_env() {
  echo "Enter your Supabase project URL (e.g., https://your-project-id.supabase.co):"
  read supabase_url
  
  echo "Enter your Supabase anon key:"
  read supabase_key
  
  echo "Creating .env file for production..."
  cat > .env << EOL
# Supabase configuration - PRODUCTION
EXPO_PUBLIC_SUPABASE_URL=${supabase_url}
EXPO_PUBLIC_SUPABASE_ANON_KEY=${supabase_key}
EOL
  echo -e "${GREEN}✓ Production .env file created${NC}"
}

# Ask user which environment to set up
echo "Which environment do you want to set up?"
echo "1) Local development (requires Docker and Supabase CLI)"
echo "2) Production (requires Supabase project credentials)"
read -p "Enter your choice (1 or 2): " choice

case $choice in
  1)
    create_local_env
    ;;
  2)
    create_prod_env
    ;;
  *)
    echo -e "${RED}Invalid choice. Please run the script again and select 1 or 2.${NC}"
    exit 1
    ;;
esac

echo -e "\n${GREEN}Environment setup complete!${NC}"
echo "You can now run the app with: npm run dev" 