import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Users, MessageCircle, Shield } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { colors } = useTheme();
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
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
      paddingHorizontal: screenWidth * 0.06,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: screenHeight * 0.06,
    },
    logo: {
      width: screenWidth * 0.2,
      height: screenWidth * 0.2,
      borderRadius: screenWidth * 0.1,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: screenHeight * 0.03,
    },
    appName: {
      fontSize: Math.min(screenWidth * 0.08, 32),
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    tagline: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    featuresContainer: {
      width: '100%',
      marginBottom: screenHeight * 0.06,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: screenHeight * 0.02,
      paddingHorizontal: screenWidth * 0.04,
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginBottom: screenHeight * 0.015,
      borderWidth: 1,
      borderColor: colors.border,
    },
    featureIcon: {
      marginRight: screenWidth * 0.04,
    },
    featureText: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Medium',
      color: colors.text,
      flex: 1,
    },
    previewSection: {
      width: '100%',
      marginBottom: screenHeight * 0.06,
    },
    previewTitle: {
      fontSize: Math.min(screenWidth * 0.05, 20),
      fontFamily: 'Inter-Bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: screenHeight * 0.025,
    },
    previewCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: screenWidth * 0.05,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    previewImage: {
      width: '100%',
      height: screenHeight * 0.15,
      borderRadius: 12,
      marginBottom: screenHeight * 0.02,
    },
    previewName: {
      fontSize: Math.min(screenWidth * 0.045, 18),
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    previewBio: {
      fontSize: Math.min(screenWidth * 0.035, 14),
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 20,
    },
    actionSection: {
      width: '100%',
      gap: screenHeight * 0.02,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: screenHeight * 0.02,
      alignItems: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    primaryButtonText: {
      fontSize: Math.min(screenWidth * 0.045, 18),
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingVertical: screenHeight * 0.02,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    secondaryButtonHighlight: {
      color: colors.primary,
      fontFamily: 'Inter-Bold',
    },
    footer: {
      alignItems: 'center',
      paddingVertical: screenHeight * 0.03,
    },
    footerText: {
      fontSize: Math.min(screenWidth * 0.035, 14),
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
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
              <Heart size={Math.min(screenWidth * 0.08, 32)} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>SparkMatch</Text>
            <Text style={styles.tagline}>
              Connect through meaningful conversations and shared interests
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Users size={Math.min(screenWidth * 0.05, 20)} color={colors.primary} style={styles.featureIcon} />
              <Text style={styles.featureText}>Meet like-minded people</Text>
            </View>
            <View style={styles.featureItem}>
              <MessageCircle size={Math.min(screenWidth * 0.05, 20)} color={colors.primary} style={styles.featureIcon} />
              <Text style={styles.featureText}>Engaging conversations</Text>
            </View>
            <View style={styles.featureItem}>
              <Shield size={Math.min(screenWidth * 0.05, 20)} color={colors.primary} style={styles.featureIcon} />
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
      </SafeAreaView>
    </View>
  );
}