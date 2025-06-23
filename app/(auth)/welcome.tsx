import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Gamepad2, Zap, Users } from 'lucide-react-native';
import { router } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
        style={styles.backgroundGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#00F5FF', '#0080FF']}
                style={styles.logoGradient}
              >
                <Heart size={Math.min(screenWidth * 0.12, 48)} color="#FFFFFF" />
              </LinearGradient>
            </View>
            
            <Text style={styles.appName}>SparkMatch</Text>
            <Text style={styles.tagline}>Where Gaming Hearts Connect</Text>
            
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <Gamepad2 size={Math.min(screenWidth * 0.06, 24)} color="#00F5FF" />
                <Text style={styles.featureText}>Play Games Together</Text>
              </View>
              <View style={styles.featureItem}>
                <Zap size={Math.min(screenWidth * 0.06, 24)} color="#FFD60A" />
                <Text style={styles.featureText}>Instant Chemistry</Text>
              </View>
              <View style={styles.featureItem}>
                <Users size={Math.min(screenWidth * 0.06, 24)} color="#FF6B6B" />
                <Text style={styles.featureText}>Find Your Player 2</Text>
              </View>
            </View>
          </View>

          {/* Preview Section */}
          <View style={styles.previewSection}>
            <View style={styles.previewCard}>
              <LinearGradient
                colors={['rgba(0, 245, 255, 0.1)', 'rgba(0, 128, 255, 0.05)']}
                style={styles.previewGradient}
              >
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/1586973/pexels-photo-1586973.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                  style={styles.previewImage}
                />
                <View style={styles.previewContent}>
                  <Text style={styles.previewName}>Luna, 25</Text>
                  <Text style={styles.previewBio}>Gaming queen & coffee enthusiast ☕️✨</Text>
                  <View style={styles.previewTags}>
                    <View style={styles.previewTag}>
                      <Text style={styles.previewTagText}>UNO Master</Text>
                    </View>
                    <View style={styles.previewTag}>
                      <Text style={styles.previewTagText}>Night Owl</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => router.push('/(auth)/register')}
            >
              <LinearGradient
                colors={['#00F5FF', '#0080FF']}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Join thousands of gamers finding love through play
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: screenWidth * 0.06,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: screenHeight * 0.08,
    paddingBottom: screenHeight * 0.04,
  },
  logoContainer: {
    marginBottom: screenHeight * 0.03,
  },
  logoGradient: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    borderRadius: screenWidth * 0.1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    fontSize: Math.min(screenWidth * 0.12, 48),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 245, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: screenHeight * 0.04,
    textAlign: 'center',
  },
  featuresContainer: {
    gap: screenHeight * 0.02,
    alignItems: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: screenWidth * 0.03,
  },
  featureText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
  },
  previewSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: screenHeight * 0.02,
  },
  previewCard: {
    width: screenWidth * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  previewGradient: {
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.2)',
  },
  previewImage: {
    width: '100%',
    height: screenHeight * 0.25,
    resizeMode: 'cover',
  },
  previewContent: {
    padding: screenWidth * 0.05,
  },
  previewName: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  previewBio: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    marginBottom: screenHeight * 0.02,
    lineHeight: 20,
  },
  previewTags: {
    flexDirection: 'row',
    gap: 8,
  },
  previewTag: {
    backgroundColor: 'rgba(0, 245, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  previewTagText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
  },
  actionSection: {
    paddingVertical: screenHeight * 0.03,
    gap: screenHeight * 0.02,
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonGradient: {
    paddingVertical: screenHeight * 0.02,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: screenHeight * 0.015,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: screenHeight * 0.02,
  },
  footerText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});