const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper resolver configuration
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add source extensions
config.resolver.sourceExts.push('sql');

// Enable require.context feature for expo-router
config.transformer.unstable_allowRequireContext = true;

module.exports = config;