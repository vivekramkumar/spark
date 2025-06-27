#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}SparkMatch iOS Setup${NC}"
echo "=====================\n"

# Check if Xcode is installed
echo "Checking if Xcode is installed..."
if ! xcode-select -p &> /dev/null; then
  echo -e "${RED}Error: Xcode is not installed. Please install Xcode from the App Store.${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Xcode is installed${NC}\n"

# Check if CocoaPods is installed
echo "Checking if CocoaPods is installed..."
if ! command -v pod &> /dev/null; then
  echo -e "${YELLOW}Warning: CocoaPods is not installed.${NC}"
  echo "Installing CocoaPods..."
  sudo gem install cocoapods
  if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to install CocoaPods. Please install it manually:${NC}"
    echo "  sudo gem install cocoapods"
    exit 1
  fi
  echo -e "${GREEN}✓ CocoaPods installed${NC}"
else
  echo -e "${GREEN}✓ CocoaPods is installed${NC}"
fi
echo ""

# Install npm dependencies
echo "Installing npm dependencies..."
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}\n"

# Prebuild the app for iOS
echo "Prebuilding the app for iOS..."
npx expo prebuild --platform ios
echo -e "${GREEN}✓ App prebuilt for iOS${NC}\n"

# Install CocoaPods dependencies
echo "Installing CocoaPods dependencies..."
cd ios && pod install && cd ..
echo -e "${GREEN}✓ CocoaPods dependencies installed${NC}\n"

# Build and run the app on iOS simulator
echo "Building and running the app on iOS simulator..."
echo -e "${YELLOW}This may take a few minutes...${NC}"
npx expo run:ios --simulator
echo -e "${GREEN}✓ App running on iOS simulator${NC}\n"

echo -e "${GREEN}iOS setup complete!${NC}"
echo "You can now develop your app for iOS." 