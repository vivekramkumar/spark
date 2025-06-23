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
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Gamepad2, Zap, Users, Crown, Star, Shield } from 'lucide-react-native';
import { router } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A3A', '#2D1B69', '#3B1F7A', '#4A1B8A']}
        style={styles.backgroundGradient}
      >
        {/* Animated Background Elements */}
        <View style={styles.backgroundElements}>
          <View style={[styles.floatingElement, styles.element1]} />
          <View style={[styles.floatingElement, styles.element2]} />
          <View style={[styles.floatingElement, styles.element3]} />
          <View style={[styles.floatingElement, styles.element4]} />
          <View style={[styles.floatingElement, styles.element5]} />
          <View style={[styles.floatingElement, styles.element6]} />
        </View>

        <SafeAreaView style={styles.safeArea}>
          <Animated.View style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Animated.View style={[
                styles.logoContainer,
                { transform: [{ scale: scaleAnim }] }
              ]}>
                <LinearGradient
                  colors={['#FF6B6B', '#9D4EDD', '#00F5FF']}
                  style={styles.logoGradient}
                >
                  <Heart size={Math.min(screenWidth * 0.15, 60)} color="#FFFFFF" />
                </LinearGradient>
                
                {/* Orbiting elements */}
                <View style={styles.orbitingElement1}>
                  <Crown size={Math.min(screenWidth * 0.05, 20)} color="#FFD60A" />
                </View>
                <View style={styles.orbitingElement2}>
                  <Star size={Math.min(screenWidth * 0.04, 16)} color="#06FFA5" />
                </View>
                <View style={styles.orbitingElement3}>
                  <Zap size={Math.min(screenWidth * 0.04, 16)} color="#FF6B6B" />
                </View>
                <View style={styles.orbitingElement4}>
                  <Shield size={Math.min(screenWidth * 0.04, 16)} color="#9D4EDD" />
                </View>
              </Animated.View>
              
              <Text style={styles.appName}>SparkMatch</Text>
              <Text style={styles.tagline}>Where Gaming Legends Find Love</Text>
              
              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <LinearGradient
                    colors={['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']}
                    style={styles.featureGradient}
                  >
                    <Gamepad2 size={Math.min(screenWidth * 0.06, 24)} color="#00F5FF" />
                    <Text style={styles.featureText}>Epic Game Battles</Text>
                  </LinearGradient>
                </View>
                <View style={styles.featureItem}>
                  <LinearGradient
                    colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 193, 7, 0.1)']}
                    style={styles.featureGradient}
                  >
                    <Zap size={Math.min(screenWidth * 0.06, 24)} color="#FFD60A" />
                    <Text style={styles.featureText}>Instant Chemistry</Text>
                  </LinearGradient>
                </View>
                <View style={styles.featureItem}>
                  <LinearGradient
                    colors={['rgba(157, 78, 221, 0.2)', 'rgba(199, 125, 255, 0.1)']}
                    style={styles.featureGradient}
                  >
                    <Users size={Math.min(screenWidth * 0.06, 24)} color="#9D4EDD" />
                    <Text style={styles.featureText}>Find Your Player 2</Text>
                  </LinearGradient>
                </View>
              </View>
            </View>

            {/* Preview Section */}
            <View style={styles.previewSection}>
              <Text style={styles.previewTitle}>Meet Your Future Co-Op Partner</Text>
              <View style={styles.previewCard}>
                <LinearGradient
                  colors={['rgba(31, 31, 58, 0.9)', 'rgba(45, 27, 105, 0.8)']}
                  style={styles.previewGradient}
                >
                  <Image 
                    source={{ uri: 'https://images.pexels.com/photos/1586973/pexels-photo-1586973.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                    style={styles.previewImage}
                  />
                  <View style={styles.previewContent}>
                    <View style={styles.previewHeader}>
                      <Text style={styles.previewName}>Luna, 25</Text>
                      <View style={styles.levelBadge}>
                        <Crown size={Math.min(screenWidth * 0.03, 12)} color="#FFD60A" />
                        <Text style={styles.levelText}>LVL 12</Text>
                      </View>
                    </View>
                    <Text style={styles.previewBio}>Gaming queen & coffee enthusiast ☕️✨</Text>
                    <View style={styles.previewTags}>
                      <View style={styles.previewTag}>
                        <Text style={styles.previewTagText}>UNO Master</Text>
                      </View>
                      <View style={styles.previewTag}>
                        <Text style={styles.previewTagText}>Night Owl</Text>
                      </View>
                      <View style={styles.previewTag}>
                        <Text style={styles.previewTagText}>Truth Seeker</Text>
                      </View>
                    </View>
                    <View style={styles.previewStats}>
                      <View style={styles.previewStat}>
                        <Gamepad2 size={Math.min(screenWidth * 0.04, 16)} color="#00F5FF" />
                        <Text style={styles.previewStatText}>47 Wins</Text>
                      </View>
                      <View style={styles.previewStat}>
                        <Zap size={Math.min(screenWidth * 0.04, 16)} color="#FFD60A" />
                        <Text style={styles.previewStatText}>5 Streak</Text>
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
                  colors={['#FF6B6B', '#9D4EDD', '#00F5FF']}
                  style={styles.primaryButtonGradient}
                >
                  <Crown size={Math.min(screenWidth * 0.05, 20)} color="#FFFFFF" />
                  <Text style={styles.primaryButtonText}>Start Your Legend</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => router.push('/(auth)/login')}
              >
                <LinearGradient
                  colors={['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']}
                  style={styles.secondaryButtonGradient}
                >
                  <Text style={styles.secondaryButtonText}>
                    Already a legend? <Text style={styles.secondaryButtonHighlight}>Return to Arena</Text>
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.footerStats}>
                <View style={styles.footerStat}>
                  <Text style={styles.footerStatNumber}>10K+</Text>
                  <Text style={styles.footerStatLabel}>Active Gamers</Text>
                </View>
                <View style={styles.footerStat}>
                  <Text style={styles.footerStatNumber}>500+</Text>
                  <Text style={styles.footerStatLabel}>Daily Matches</Text>
                </View>
                <View style={styles.footerStat}>
                  <Text style={styles.footerStatNumber}>95%</Text>
                  <Text style={styles.footerStatLabel}>Success Rate</Text>
                </View>
              </View>
              <Text style={styles.footerText}>
                Join the ultimate gaming community for love and competition
              </Text>
            </View>
          </Animated.View>
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
  backgroundElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingElement: {
    position: 'absolute',
    borderRadius: 50,
    opacity: 0.06,
  },
  element1: {
    width: 150,
    height: 150,
    backgroundColor: '#00F5FF',
    top: '5%',
    left: '5%',
  },
  element2: {
    width: 100,
    height: 100,
    backgroundColor: '#9D4EDD',
    top: '10%',
    right: '10%',
  },
  element3: {
    width: 80,
    height: 80,
    backgroundColor: '#FFD60A',
    top: '40%',
    left: '10%',
  },
  element4: {
    width: 120,
    height: 120,
    backgroundColor: '#FF6B6B',
    bottom: '20%',
    right: '15%',
  },
  element5: {
    width: 60,
    height: 60,
    backgroundColor: '#06FFA5',
    bottom: '10%',
    left: '20%',
  },
  element6: {
    width: 40,
    height: 40,
    backgroundColor: '#FF9F1C',
    top: '60%',
    right: '25%',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: screenWidth * 0.06,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: screenHeight * 0.06,
    paddingBottom: screenHeight * 0.04,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: screenHeight * 0.04,
  },
  logoGradient: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    borderRadius: screenWidth * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9D4EDD',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 15,
  },
  orbitingElement1: {
    position: 'absolute',
    top: -15,
    right: -15,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 25,
    padding: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  orbitingElement2: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    backgroundColor: 'rgba(6, 255, 165, 0.2)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: 'rgba(6, 255, 165, 0.4)',
  },
  orbitingElement3: {
    position: 'absolute',
    top: '50%',
    right: -25,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.4)',
  },
  orbitingElement4: {
    position: 'absolute',
    bottom: '30%',
    left: -20,
    backgroundColor: 'rgba(157, 78, 221, 0.2)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: 'rgba(157, 78, 221, 0.4)',
  },
  appName: {
    fontSize: Math.min(screenWidth * 0.12, 48),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(157, 78, 221, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
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
    borderRadius: 16,
    overflow: 'hidden',
  },
  featureGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.06,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 12,
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
  previewTitle: {
    fontSize: Math.min(screenWidth * 0.05, 20),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: screenHeight * 0.025,
  },
  previewCard: {
    width: screenWidth * 0.85,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
  },
  previewGradient: {
    borderWidth: 2,
    borderColor: 'rgba(157, 78, 221, 0.3)',
  },
  previewImage: {
    width: '100%',
    height: screenHeight * 0.2,
    resizeMode: 'cover',
  },
  previewContent: {
    padding: screenWidth * 0.05,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewName: {
    fontSize: Math.min(screenWidth * 0.055, 22),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    gap: 4,
  },
  levelText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Bold',
    color: '#FFD60A',
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
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: screenHeight * 0.02,
  },
  previewTag: {
    backgroundColor: 'rgba(0, 245, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  previewTagText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
  },
  previewStats: {
    flexDirection: 'row',
    gap: screenWidth * 0.06,
  },
  previewStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  previewStatText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  actionSection: {
    paddingVertical: screenHeight * 0.03,
    gap: screenHeight * 0.02,
  },
  primaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#9D4EDD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.025,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  secondaryButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  secondaryButtonGradient: {
    alignItems: 'center',
    paddingVertical: screenHeight * 0.02,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  secondaryButtonText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  secondaryButtonHighlight: {
    color: '#00F5FF',
    fontFamily: 'Inter-Bold',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: screenHeight * 0.02,
  },
  footerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: screenHeight * 0.02,
  },
  footerStat: {
    alignItems: 'center',
  },
  footerStatNumber: {
    fontSize: Math.min(screenWidth * 0.05, 20),
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
    marginBottom: 4,
  },
  footerStatLabel: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  footerText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});