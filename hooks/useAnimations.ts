import { useEffect, useRef } from 'react';
import { Animated, Easing, LayoutAnimation, Platform, UIManager } from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Custom animation presets
export const AnimationPresets = {
  // Smooth fade in animation
  fadeIn: (duration = 400) => {
    return {
      duration,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    };
  },
  
  // Slide up animation
  slideUp: (duration = 300) => {
    return {
      duration,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.8,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.8,
      },
    };
  },
  
  // Bounce animation
  bounce: (duration = 500) => {
    return {
      duration,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: 0.6,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.6,
      },
    };
  }
};

// Hook for fade in animation
export const useFadeIn = (duration = 500, delay = 0) => {
  const opacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
    
    return () => {
      opacity.setValue(0);
    };
  }, []);
  
  return opacity;
};

// Hook for slide up animation
export const useSlideUp = (duration = 500, delay = 0) => {
  const translateY = useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration,
      delay,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start();
    
    return () => {
      translateY.setValue(50);
    };
  }, []);
  
  return translateY;
};

// Hook for scale animation (like for hearts/likes)
export const useScale = (initialValue = 0, finalValue = 1, duration = 300, delay = 0) => {
  const scale = useRef(new Animated.Value(initialValue)).current;
  
  useEffect(() => {
    Animated.spring(scale, {
      toValue: finalValue,
      friction: 6,
      tension: 40,
      delay,
      useNativeDriver: true,
    }).start();
    
    return () => {
      scale.setValue(initialValue);
    };
  }, []);
  
  return scale;
};

// Hook for pulse animation (like for buttons)
export const usePulse = (minValue = 1, maxValue = 1.1, duration = 1000) => {
  const scale = useRef(new Animated.Value(minValue)).current;
  
  useEffect(() => {
    const pulseAnimation = Animated.sequence([
      Animated.timing(scale, {
        toValue: maxValue,
        duration: duration / 2,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(scale, {
        toValue: minValue,
        duration: duration / 2,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease),
      }),
    ]);
    
    Animated.loop(pulseAnimation).start();
    
    return () => {
      scale.stopAnimation();
      scale.setValue(minValue);
    };
  }, []);
  
  return scale;
};

// Hook for swipe animation
export const useSwipe = () => {
  const swipeAnim = useRef(new Animated.Value(0)).current;
  
  const swipeLeft = (callback?: () => void) => {
    Animated.timing(swipeAnim, {
      toValue: -500,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start(() => {
      if (callback) callback();
      swipeAnim.setValue(0);
    });
  };
  
  const swipeRight = (callback?: () => void) => {
    Animated.timing(swipeAnim, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.out(Easing.exp),
    }).start(() => {
      if (callback) callback();
      swipeAnim.setValue(0);
    });
  };
  
  const resetSwipe = () => {
    Animated.spring(swipeAnim, {
      toValue: 0,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  return {
    swipeAnim,
    swipeLeft,
    swipeRight,
    resetSwipe,
  };
};

// Apply layout animation
export const applyAnimation = (animationType: 'fadeIn' | 'slideUp' | 'bounce' = 'fadeIn', duration?: number) => {
  const animation = AnimationPresets[animationType](duration);
  LayoutAnimation.configureNext(animation);
};

// Create a sequence of animations
export const createSequence = (animations: Animated.CompositeAnimation[], callback?: () => void) => {
  return Animated.sequence(animations).start(callback);
};

export default {
  useFadeIn,
  useSlideUp,
  useScale,
  usePulse,
  useSwipe,
  applyAnimation,
  createSequence,
  AnimationPresets,
}; 