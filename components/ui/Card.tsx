import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useFadeIn, useSlideUp } from '../../hooks/useAnimations';
import { scale, verticalScale } from '../../hooks/useResponsiveDesign';

export type CardVariant = 'default' | 'glass' | 'outline' | 'elevated';

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  onPress?: () => void;
  style?: ViewStyle;
  animated?: boolean;
  animationType?: 'fade' | 'slide' | 'none';
  animationDelay?: number;
  title?: string;
  subtitle?: string;
  borderRadius?: keyof typeof import('../../contexts/ThemeContext').borderRadius;
  shadow?: keyof typeof import('../../contexts/ThemeContext').shadows;
  gradientColors?: string[];
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  onPress,
  style,
  animated = true,
  animationType = 'fade',
  animationDelay = 0,
  title,
  subtitle,
  borderRadius = 'xl',
  shadow = 'md',
  gradientColors,
}) => {
  const { theme } = useTheme();
  const fadeAnim = useFadeIn(500, animationDelay);
  const slideAnim = useSlideUp(500, animationDelay);
  
  // Get card background based on variant
  const getCardBackground = () => {
    switch (variant) {
      case 'default':
        return theme.colors.background.card;
      case 'glass':
        return 'rgba(31, 31, 58, 0.8)';
      case 'outline':
        return 'transparent';
      case 'elevated':
        return theme.colors.background.card;
      default:
        return theme.colors.background.card;
    }
  };
  
  // Get card border based on variant
  const getCardBorder = () => {
    switch (variant) {
      case 'outline':
        return {
          borderWidth: 1,
          borderColor: theme.colors.border.default,
        };
      default:
        return {};
    }
  };
  
  // Get card shadow based on variant
  const getCardShadow = () => {
    if (variant === 'elevated') {
      return theme.shadows[shadow];
    }
    return theme.shadows.none;
  };
  
  // Get animation style
  const getAnimationStyle = () => {
    if (!animated) return {};
    
    switch (animationType) {
      case 'fade':
        return { opacity: fadeAnim };
      case 'slide':
        return {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        };
      default:
        return {};
    }
  };
  
  // Get gradient colors
  const getGradientColors = () => {
    if (gradientColors) {
      return gradientColors;
    }
    
    switch (variant) {
      case 'glass':
        return theme.gradients.glass;
      default:
        return [getCardBackground(), getCardBackground()];
    }
  };
  
  const renderContent = () => (
    <LinearGradient
      colors={getGradientColors()}
      style={[
        styles.card,
        {
          borderRadius: theme.borderRadius[borderRadius],
          ...getCardBorder(),
          ...getCardShadow(),
        },
        style,
      ]}
    >
      {(title || subtitle) && (
        <View style={styles.header}>
          {title && (
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.text.primary,
                  fontFamily: theme.fontFamilies.sans.semibold,
                  fontSize: theme.fontSizes.lg,
                },
              ]}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.text.secondary,
                  fontFamily: theme.fontFamilies.sans.normal,
                  fontSize: theme.fontSizes.sm,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </LinearGradient>
  );
  
  if (onPress) {
    return (
      <Animated.View style={[getAnimationStyle()]}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          style={styles.touchable}
        >
          {renderContent()}
        </TouchableOpacity>
      </Animated.View>
    );
  }
  
  return (
    <Animated.View style={[getAnimationStyle()]}>
      {renderContent()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    overflow: 'hidden',
  },
  card: {
    overflow: 'hidden',
    padding: scale(16),
  },
  header: {
    marginBottom: verticalScale(12),
  },
  title: {
    marginBottom: verticalScale(4),
  },
  subtitle: {
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
});

export default Card; 