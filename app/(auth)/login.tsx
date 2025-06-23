import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Heart, Zap, Gamepad2, Shield } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { signIn } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A3A', '#2D1B69', '#3B1F7A']}
        style={styles.backgroundGradient}
      >
        {/* Animated Background Elements */}
        <View style={styles.backgroundElements}>
          <View style={[styles.floatingElement, styles.element1]} />
          <View style={[styles.floatingElement, styles.element2]} />
          <View style={[styles.floatingElement, styles.element3]} />
          <View style={[styles.floatingElement, styles.element4]} />
        </View>

        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView 
            style={styles.keyboardView}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <LinearGradient
                    colors={['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']}
                    style={styles.backButtonGradient}
                  >
                    <ArrowLeft size={Math.min(screenWidth * 0.06, 24)} color="#00F5FF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Hero Section */}
              <View style={styles.heroSection}>
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={['#00F5FF', '#0080FF', '#9D4EDD']}
                    style={styles.logoGradient}
                  >
                    <Heart size={Math.min(screenWidth * 0.12, 48)} color="#FFFFFF" />
                  </LinearGradient>
                  
                  {/* Pulsing rings around logo */}
                  <View style={styles.pulseRing1} />
                  <View style={styles.pulseRing2} />
                </View>
                
                <Text style={styles.welcomeTitle}>Welcome Back, Gamer!</Text>
                <Text style={styles.welcomeSubtitle}>
                  Ready to continue your epic love quest?
                </Text>

                {/* Gaming Stats Preview */}
                <View style={styles.statsPreview}>
                  <View style={styles.statItem}>
                    <Gamepad2 size={Math.min(screenWidth * 0.05, 20)} color="#00F5FF" />
                    <Text style={styles.statText}>Epic Matches</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Zap size={Math.min(screenWidth * 0.05, 20)} color="#FFD60A" />
                    <Text style={styles.statText}>Instant Sparks</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Shield size={Math.min(screenWidth * 0.05, 20)} color="#06FFA5" />
                    <Text style={styles.statText}>Secure Gaming</Text>
                  </View>
                </View>
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                <View style={styles.formContainer}>
                  <LinearGradient
                    colors={['rgba(31, 31, 58, 0.9)', 'rgba(45, 27, 105, 0.8)']}
                    style={styles.formGradient}
                  >
                    <Text style={styles.formTitle}>Sign In to Continue</Text>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Email Address</Text>
                      <View style={[
                        styles.inputContainer,
                        focusedField === 'email' && styles.inputContainerFocused
                      ]}>
                        <LinearGradient
                          colors={focusedField === 'email' 
                            ? ['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']
                            : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                          }
                          style={styles.inputGradient}
                        >
                          <Mail size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                          <TextInput
                            style={styles.textInput}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your gaming email"
                            placeholderTextColor="rgba(156, 163, 175, 0.7)"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                          />
                        </LinearGradient>
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Password</Text>
                      <View style={[
                        styles.inputContainer,
                        focusedField === 'password' && styles.inputContainerFocused
                      ]}>
                        <LinearGradient
                          colors={focusedField === 'password' 
                            ? ['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']
                            : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                          }
                          style={styles.inputGradient}
                        >
                          <Lock size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                          <TextInput
                            style={styles.textInput}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your secret code"
                            placeholderTextColor="rgba(156, 163, 175, 0.7)"
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                          />
                          <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                            ) : (
                              <Eye size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                            )}
                          </TouchableOpacity>
                        </LinearGradient>
                      </View>
                    </View>

                    <TouchableOpacity style={styles.forgotPassword}>
                      <Text style={styles.forgotPasswordText}>Forgot your battle password?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity 
                      style={[styles.loginButton, loading && styles.disabledButton]}
                      onPress={handleLogin}
                      disabled={loading}
                    >
                      <LinearGradient
                        colors={loading 
                          ? ['#6B7280', '#4B5563'] 
                          : ['#00F5FF', '#0080FF', '#9D4EDD']
                        }
                        style={styles.loginButtonGradient}
                      >
                        <Text style={styles.loginButtonText}>
                          {loading ? 'Entering Arena...' : 'Enter the Arena'}
                        </Text>
                        {!loading && <Zap size={Math.min(screenWidth * 0.05, 20)} color="#FFFFFF" />}
                      </LinearGradient>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </View>

              {/* Bottom Section */}
              <View style={styles.bottomSection}>
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <View style={styles.dividerIcon}>
                    <Heart size={Math.min(screenWidth * 0.04, 16)} color="#9CA3AF" />
                  </View>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity 
                  style={styles.registerLink}
                  onPress={() => router.push('/(auth)/register')}
                >
                  <LinearGradient
                    colors={['rgba(157, 78, 221, 0.2)', 'rgba(199, 125, 255, 0.1)']}
                    style={styles.registerLinkGradient}
                  >
                    <Text style={styles.registerLinkText}>
                      New to the game? <Text style={styles.registerLinkHighlight}>Join the Adventure</Text>
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
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
    opacity: 0.1,
  },
  element1: {
    width: 100,
    height: 100,
    backgroundColor: '#00F5FF',
    top: '10%',
    left: '10%',
  },
  element2: {
    width: 60,
    height: 60,
    backgroundColor: '#9D4EDD',
    top: '20%',
    right: '15%',
  },
  element3: {
    width: 80,
    height: 80,
    backgroundColor: '#FFD60A',
    bottom: '30%',
    left: '20%',
  },
  element4: {
    width: 40,
    height: 40,
    backgroundColor: '#FF6B6B',
    bottom: '15%',
    right: '25%',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: screenWidth * 0.06,
  },
  header: {
    paddingTop: screenHeight * 0.02,
    paddingBottom: screenHeight * 0.02,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  backButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  heroSection: {
    alignItems: 'center',
    paddingBottom: screenHeight * 0.04,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: screenHeight * 0.03,
  },
  logoGradient: {
    width: screenWidth * 0.25,
    height: screenWidth * 0.25,
    borderRadius: screenWidth * 0.125,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  pulseRing1: {
    position: 'absolute',
    width: screenWidth * 0.35,
    height: screenWidth * 0.35,
    borderRadius: screenWidth * 0.175,
    borderWidth: 2,
    borderColor: 'rgba(0, 245, 255, 0.3)',
    top: -screenWidth * 0.05,
    left: -screenWidth * 0.05,
  },
  pulseRing2: {
    position: 'absolute',
    width: screenWidth * 0.45,
    height: screenWidth * 0.45,
    borderRadius: screenWidth * 0.225,
    borderWidth: 1,
    borderColor: 'rgba(157, 78, 221, 0.2)',
    top: -screenWidth * 0.1,
    left: -screenWidth * 0.1,
  },
  welcomeTitle: {
    fontSize: Math.min(screenWidth * 0.08, 32),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 245, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  welcomeSubtitle: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: screenHeight * 0.03,
  },
  statsPreview: {
    flexDirection: 'row',
    gap: screenWidth * 0.08,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
  },
  formGradient: {
    padding: screenWidth * 0.08,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.2)',
  },
  formTitle: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: screenHeight * 0.04,
  },
  inputGroup: {
    marginBottom: screenHeight * 0.025,
  },
  inputLabel: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  inputContainerFocused: {
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.02,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  textInput: {
    flex: 1,
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginLeft: screenWidth * 0.03,
  },
  eyeButton: {
    padding: 4,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: screenHeight * 0.015,
    marginBottom: screenHeight * 0.03,
  },
  forgotPasswordText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
  },
  loginButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.025,
    gap: 8,
  },
  loginButtonText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  bottomSection: {
    paddingVertical: screenHeight * 0.04,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight * 0.03,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(156, 163, 175, 0.3)',
  },
  dividerIcon: {
    marginHorizontal: screenWidth * 0.04,
    padding: 8,
    backgroundColor: 'rgba(31, 31, 58, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  registerLink: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  registerLinkGradient: {
    alignItems: 'center',
    paddingVertical: screenHeight * 0.02,
    paddingHorizontal: screenWidth * 0.06,
    borderWidth: 1,
    borderColor: 'rgba(157, 78, 221, 0.3)',
  },
  registerLinkText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  registerLinkHighlight: {
    color: '#9D4EDD',
    fontFamily: 'Inter-Bold',
  },
});