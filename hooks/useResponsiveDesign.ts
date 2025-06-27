import { useEffect, useState } from 'react';
import { Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Get window dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions for scaling (based on iPhone 13 - 390x844)
const baseWidth = 390;
const baseHeight = 844;

// Calculate normalized scale based on screen width
const widthScale = SCREEN_WIDTH / baseWidth;
const heightScale = SCREEN_HEIGHT / baseHeight;

// Reference dimensions (based on standard iPhone design)
const STANDARD_WIDTH = 375;
const STANDARD_HEIGHT = 812;

// Calculate the scale factors
const widthScaleFactor = SCREEN_WIDTH / STANDARD_WIDTH;
const heightScaleFactor = SCREEN_HEIGHT / STANDARD_HEIGHT;

// Utility to normalize font sizes across different devices
export const normalize = (size: number, based: 'width' | 'height' = 'width') => {
  const scale = based === 'width' ? widthScale : heightScale;
  const newSize = size * scale;
  
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

// Scale width dimensions
export const scale = (size: number) => {
  return Math.round(size * widthScale);
};

// Scale height dimensions
export const verticalScale = (size: number) => {
  return Math.round(size * heightScale);
};

// Scale both width and height with a moderate factor
export const moderateScale = (size: number, factor = 0.5) => {
  return Math.round(size + (scale(size) - size) * factor);
};

// Get device type based on screen width
export const getDeviceType = () => {
  if (SCREEN_WIDTH >= 768) {
    return 'tablet';
  }
  return 'phone';
};

// Hook to listen for dimension changes
export const useResponsiveDimensions = () => {
  const [dimensions, setDimensions] = useState({
    window: Dimensions.get('window'),
    screen: Dimensions.get('screen'),
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window, screen }) => {
      setDimensions({ window, screen });
    });

    return () => subscription.remove();
  }, []);

  return {
    window: dimensions.window,
    screen: dimensions.screen,
    isLandscape: dimensions.window.width > dimensions.window.height,
    isTablet: getDeviceType() === 'tablet',
  };
};

// Helper to get safe area insets
export const getSafeAreaInsets = () => {
  const isIOS = Platform.OS === 'ios';
  const isIphoneX = isIOS && 
    (SCREEN_HEIGHT >= 812 || SCREEN_WIDTH >= 812);
  
  return {
    top: isIphoneX ? 44 : isIOS ? 20 : 0,
    bottom: isIphoneX ? 34 : 0,
    left: isIphoneX ? 44 : 0,
    right: isIphoneX ? 44 : 0,
  };
};

// Helper to adjust styles based on screen size
export const getResponsiveStyles = (smallScreen: any, largeScreen: any) => {
  return SCREEN_WIDTH < 375 ? smallScreen : largeScreen;
};

export const useResponsiveDesign = () => {
  const insets = useSafeAreaInsets();

  // Normalize a size based on screen width
  const normalize = (size: number): number => {
    return Math.round(size * widthScaleFactor);
  };

  // Get horizontal padding that scales with screen size
  const getHorizontalPadding = (percentage = 0.05): number => {
    return SCREEN_WIDTH * percentage;
  };

  // Get status bar height
  const getStatusBarHeight = (): number => {
    if (Platform.OS === 'ios') {
      return insets.top;
    }
    return StatusBar.currentHeight || 0;
  };

  // Get bottom safe area height (for home indicator on newer iPhones)
  const getBottomSafeAreaHeight = (): number => {
    return insets.bottom;
  };

  // Get safe paddings for all edges
  const getSafePaddings = () => {
    return {
      paddingTop: getStatusBarHeight(),
      paddingBottom: getBottomSafeAreaHeight(),
      paddingLeft: insets.left,
      paddingRight: insets.right,
    };
  };

  // Check if device has notch
  const hasNotch = (): boolean => {
    return insets.top > 20;
  };

  // Check if device is a tablet
  const isTablet = (): boolean => {
    const { width, height } = Dimensions.get('window');
    const aspectRatio = height / width;
    return aspectRatio < 1.6;
  };

  // Get appropriate font size based on device type
  const getFontSize = (size: number): number => {
    return isTablet() ? size * 1.2 : size;
  };

  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    normalize,
    getHorizontalPadding,
    getStatusBarHeight,
    getBottomSafeAreaHeight,
    getSafePaddings,
    hasNotch,
    isTablet,
    getFontSize,
    insets,
  };
};

export default {
  normalize,
  scale,
  verticalScale,
  moderateScale,
  getDeviceType,
  useResponsiveDimensions,
  getSafeAreaInsets,
  getResponsiveStyles,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
}; 