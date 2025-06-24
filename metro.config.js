const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ensure proper resolver configuration
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add source extensions
config.resolver.sourceExts.push('sql');

// Disable new architecture features that might cause crashes
config.transformer.unstable_allowRequireContext = false;

module.exports = config;