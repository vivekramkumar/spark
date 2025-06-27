import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { usePulse } from '../../hooks/useAnimations';
import { scale, verticalScale } from '../../hooks/useResponsiveDesign';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  animated?: boolean;
  animationType?: 'pulse' | 'scale' | 'none';
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = false,
  style,
  textStyle,
  animated = true,
  animationType = 'scale',
}) => {
  const { theme } = useTheme();
  const pulseAnim = usePulse(1, 1.05, 2000);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Handle press animation
  const handlePressIn = () => {
    if (!animated || animationType === 'none' || disabled || loading) return;
    
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    if (!animated || animationType === 'none' || disabled || loading) return;
    
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Get button colors based on variant
  const getButtonColors = () => {
    if (disabled) {
      return theme.colors.button.disabled.background;
    }
    
    switch (variant) {
      case 'primary':
        return theme.colors.button.primary.background;
      case 'secondary':
        return theme.colors.button.secondary.background;
      case 'success':
        return theme.colors.button.success.background;
      case 'warning':
        return theme.colors.button.warning.background;
      case 'error':
        return theme.colors.button.error.background;
      case 'outline':
      case 'ghost':
        return ['transparent', 'transparent'];
      default:
        return theme.colors.button.primary.background;
    }
  };
  
  // Get text color based on variant
  const getTextColor = () => {
    if (disabled) {
      return theme.colors.button.disabled.text;
    }
    
    switch (variant) {
      case 'primary':
        return theme.colors.button.primary.text;
      case 'secondary':
        return theme.colors.button.secondary.text;
      case 'success':
        return theme.colors.button.success.text;
      case 'warning':
        return theme.colors.button.warning.text;
      case 'error':
        return theme.colors.button.error.text;
      case 'outline':
      case 'ghost':
        return theme.colors.text.primary;
      default:
        return theme.colors.button.primary.text;
    }
  };
  
  // Get button size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return {
          paddingVertical: verticalScale(6),
          paddingHorizontal: scale(12),
          fontSize: theme.fontSizes.xs,
        };
      case 'sm':
        return {
          paddingVertical: verticalScale(8),
          paddingHorizontal: scale(16),
          fontSize: theme.fontSizes.sm,
        };
      case 'md':
        return {
          paddingVertical: verticalScale(10),
          paddingHorizontal: scale(20),
          fontSize: theme.fontSizes.md,
        };
      case 'lg':
        return {
          paddingVertical: verticalScale(12),
          paddingHorizontal: scale(24),
          fontSize: theme.fontSizes.lg,
        };
      case 'xl':
        return {
          paddingVertical: verticalScale(16),
          paddingHorizontal: scale(32),
          fontSize: theme.fontSizes.xl,
        };
      default:
        return {
          paddingVertical: verticalScale(10),
          paddingHorizontal: scale(20),
          fontSize: theme.fontSizes.md,
        };
    }
  };
  
  // Get border styles for outline variant
  const getBorderStyles = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: theme.colors.border.default,
      };
    }
    return {};
  };
  
  // Get animation style
  const getAnimationStyle = () => {
    if (!animated) return {};
    
    switch (animationType) {
      case 'pulse':
        return { transform: [{ scale: pulseAnim }] };
      case 'scale':
        return { transform: [{ scale: scaleAnim }] };
      default:
        return {};
    }
  };
  
  const sizeStyles = getSizeStyles();
  const borderStyles = getBorderStyles();
  const buttonColors = getButtonColors();
  const textColor = getTextColor();
  
  return (
    <Animated.View
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        getAnimationStyle(),
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.touchable,
          fullWidth && styles.fullWidth,
        ]}
      >
        <LinearGradient
          colors={buttonColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradient,
            {
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
              borderRadius: rounded ? theme.borderRadius['3xl'] : theme.borderRadius.lg,
            },
            borderStyles,
            variant === 'ghost' && styles.ghostStyle,
          ]}
        >
          {loading ? (
            <ActivityIndicator
              color={textColor}
              size={size === 'xs' || size === 'sm' ? 'small' : 'large'}
            />
          ) : (
            <View style={styles.contentContainer}>
              {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
              <Text
                style={[
                  styles.text,
                  {
                    color: textColor,
                    fontSize: sizeStyles.fontSize,
                    fontFamily: theme.fontFamilies.sans.semibold,
                  },
                  textStyle,
                ]}
              >
                {title}
              </Text>
              {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  touchable: {
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostStyle: {
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: scale(8),
  },
  iconRight: {
    marginLeft: scale(8),
  },
});

export default Button; 