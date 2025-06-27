import { useTheme } from '@/contexts/ThemeContext';
import { useResponsiveDesign } from '@/hooks/useResponsiveDesign';
import { router } from 'expo-router';
import { Heart, MessageCircle, Shield, Users } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { theme } = useTheme();
  const { 
    normalize, 
    getSafePaddings, 
    hasNotch, 
    getStatusBarHeight,
    getHorizontalPadding,
    insets
  } = useResponsiveDesign();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    safeArea: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: getHorizontalPadding(),
      paddingTop: hasNotch() ? normalize(10) : getStatusBarHeight(),
      paddingBottom: insets.bottom > 0 ? insets.bottom : normalize(20),
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: Platform.OS === 'ios' ? normalize(20) : 0,
    },
    logoContainer: {
      alignItems: 'center',
      marginTop: hasNotch() ? normalize(40) : normalize(20),
      marginBottom: normalize(30),
    },
    logo: {
      width: normalize(80),
      height: normalize(80),
      borderRadius: normalize(40),
      backgroundColor: theme.colors.button.primary.background[0],
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: normalize(16),
    },
    appName: {
      fontSize: normalize(32),
      fontFamily: 'Inter-Bold',
      color: theme.colors.text.primary,
      marginBottom: normalize(8),
    },
    tagline: {
      fontSize: normalize(16),
      fontFamily: 'Inter-Medium',
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: normalize(24),
    },
    featuresContainer: {
      width: '100%',
      marginBottom: normalize(30),
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: normalize(16),
      paddingHorizontal: normalize(16),
      backgroundColor: theme.colors.background.secondary,
      borderRadius: normalize(12),
      marginBottom: normalize(12),
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    featureIcon: {
      marginRight: normalize(16),
    },
    featureText: {
      fontSize: normalize(16),
      fontFamily: 'Inter-Medium',
      color: theme.colors.text.primary,
      flex: 1,
    },
    previewSection: {
      width: '100%',
      marginBottom: normalize(30),
    },
    previewTitle: {
      fontSize: normalize(20),
      fontFamily: 'Inter-Bold',
      color: theme.colors.text.primary,
      textAlign: 'center',
      marginBottom: normalize(16),
    },
    previewCard: {
      backgroundColor: theme.colors.background.card,
      borderRadius: normalize(16),
      padding: normalize(20),
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      shadowColor: theme.colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    previewImage: {
      width: '100%',
      height: normalize(120),
      borderRadius: normalize(12),
      marginBottom: normalize(16),
    },
    previewName: {
      fontSize: normalize(18),
      fontFamily: 'Inter-Bold',
      color: theme.colors.text.primary,
      marginBottom: normalize(4),
    },
    previewBio: {
      fontSize: normalize(14),
      fontFamily: 'Inter-Regular',
      color: theme.colors.text.secondary,
      lineHeight: normalize(20),
    },
    actionSection: {
      width: '100%',
      gap: normalize(16),
      marginBottom: normalize(16),
    },
    primaryButton: {
      backgroundColor: theme.colors.button.primary.background[0],
      borderRadius: normalize(12),
      paddingVertical: normalize(16),
      alignItems: 'center',
      shadowColor: theme.colors.button.primary.background[0],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    primaryButtonText: {
      fontSize: normalize(18),
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    secondaryButton: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: normalize(12),
      paddingVertical: normalize(16),
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    secondaryButtonText: {
      fontSize: normalize(16),
      fontFamily: 'Inter-Medium',
      color: theme.colors.text.primary,
    },
    secondaryButtonHighlight: {
      color: theme.colors.button.primary.background[0],
      fontFamily: 'Inter-Bold',
    },
    footer: {
      alignItems: 'center',
      paddingVertical: normalize(16),
    },
    footerText: {
      fontSize: normalize(14),
      fontFamily: 'Inter-Regular',
      color: theme.colors.text.secondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <Animated.View style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logo}>
                <Heart size={normalize(32)} color="#FFFFFF" />
              </View>
              <Text style={styles.appName}>SparkMatch</Text>
              <Text style={styles.tagline}>
                Connect through meaningful conversations and shared interests
              </Text>
            </View>

            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Users size={normalize(20)} color={theme.colors.button.primary.background[0]} style={styles.featureIcon} />
                <Text style={styles.featureText}>Meet like-minded people</Text>
              </View>
              <View style={styles.featureItem}>
                <MessageCircle size={normalize(20)} color={theme.colors.button.primary.background[0]} style={styles.featureIcon} />
                <Text style={styles.featureText}>Engaging conversations</Text>
              </View>
              <View style={styles.featureItem}>
                <Shield size={normalize(20)} color={theme.colors.button.primary.background[0]} style={styles.featureIcon} />
                <Text style={styles.featureText}>Safe and secure platform</Text>
              </View>
            </View>

            {/* Preview */}
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>Meet Your Match</Text>
              <View style={styles.previewCard}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/1586973/pexels-photo-1586973.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                  style={styles.previewImage}
                />
                <Text style={styles.previewName}>Luna, 25</Text>
                <Text style={styles.previewBio}>
                  Coffee enthusiast and book lover. Looking for genuine connections and meaningful conversations.
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => router.push('/(auth)/register')}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => router.push('/(auth)/login')}
              >
                <Text style={styles.secondaryButtonText}>
                  Already have an account? <Text style={styles.secondaryButtonHighlight}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Join thousands of people finding meaningful connections
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}