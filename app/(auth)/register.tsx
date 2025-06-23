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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Calendar, Heart, Zap, Crown, Shield, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { signUp } = useAuth();

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your gamer name');
      return false;
    }
    if (!formData.age || parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
      Alert.alert('Error', 'Please enter a valid age (18-100)');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const { error } = await signUp(formData.email, formData.password, {
      name: formData.name,
      age: parseInt(formData.age),
    });
    setLoading(false);

    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else {
      Alert.alert(
        'Welcome to SparkMatch!',
        'Account created successfully! Your gaming love journey begins now.',
        [{ text: 'Start Playing', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  };

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
                    colors={['#FF6B6B', '#9D4EDD', '#00F5FF']}
                    style={styles.logoGradient}
                  >
                    <Crown size={Math.min(screenWidth * 0.12, 48)} color="#FFFFFF" />
                  </LinearGradient>
                  
                  {/* Orbiting elements */}
                  <View style={styles.orbitingElement1}>
                    <Star size={Math.min(screenWidth * 0.04, 16)} color="#FFD60A" />
                  </View>
                  <View style={styles.orbitingElement2}>
                    <Zap size={Math.min(screenWidth * 0.04, 16)} color="#06FFA5" />
                  </View>
                  <View style={styles.orbitingElement3}>
                    <Heart size={Math.min(screenWidth * 0.04, 16)} color="#FF6B6B" />
                  </View>
                </View>
                
                <Text style={styles.welcomeTitle}>Join the Elite</Text>
                <Text style={styles.welcomeSubtitle}>
                  Create your legend and find your Player 2
                </Text>

                {/* Benefits Preview */}
                <View style={styles.benefitsContainer}>
                  <View style={styles.benefitItem}>
                    <LinearGradient
                      colors={['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']}
                      style={styles.benefitGradient}
                    >
                      <Shield size={Math.min(screenWidth * 0.05, 20)} color="#00F5FF" />
                      <Text style={styles.benefitText}>Verified Gamers</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.benefitItem}>
                    <LinearGradient
                      colors={['rgba(157, 78, 221, 0.2)', 'rgba(199, 125, 255, 0.1)']}
                      style={styles.benefitGradient}
                    >
                      <Crown size={Math.min(screenWidth * 0.05, 20)} color="#9D4EDD" />
                      <Text style={styles.benefitText}>Level Up Together</Text>
                    </LinearGradient>
                  </View>
                </View>
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                <View style={styles.formContainer}>
                  <LinearGradient
                    colors={['rgba(31, 31, 58, 0.95)', 'rgba(45, 27, 105, 0.9)', 'rgba(74, 27, 138, 0.8)']}
                    style={styles.formGradient}
                  >
                    <Text style={styles.formTitle}>Create Your Gaming Profile</Text>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Gamer Name</Text>
                      <View style={[
                        styles.inputContainer,
                        focusedField === 'name' && styles.inputContainerFocused
                      ]}>
                        <LinearGradient
                          colors={focusedField === 'name' 
                            ? ['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']
                            : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                          }
                          style={styles.inputGradient}
                        >
                          <User size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                          <TextInput
                            style={styles.textInput}
                            value={formData.name}
                            onChangeText={(text) => updateFormData('name', text)}
                            placeholder="Enter your epic gamer name"
                            placeholderTextColor="rgba(156, 163, 175, 0.7)"
                            autoCapitalize="words"
                            maxLength={50}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                          />
                        </LinearGradient>
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Age</Text>
                      <View style={[
                        styles.inputContainer,
                        focusedField === 'age' && styles.inputContainerFocused
                      ]}>
                        <LinearGradient
                          colors={focusedField === 'age' 
                            ? ['rgba(157, 78, 221, 0.2)', 'rgba(199, 125, 255, 0.1)']
                            : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                          }
                          style={styles.inputGradient}
                        >
                          <Calendar size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                          <TextInput
                            style={styles.textInput}
                            value={formData.age}
                            onChangeText={(text) => updateFormData('age', text)}
                            placeholder="Your age (18+)"
                            placeholderTextColor="rgba(156, 163, 175, 0.7)"
                            keyboardType="numeric"
                            maxLength={2}
                            onFocus={() => setFocusedField('age')}
                            onBlur={() => setFocusedField(null)}
                          />
                        </LinearGradient>
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Email</Text>
                      <View style={[
                        styles.inputContainer,
                        focusedField === 'email' && styles.inputContainerFocused
                      ]}>
                        <LinearGradient
                          colors={focusedField === 'email' 
                            ? ['rgba(255, 215, 0, 0.2)', 'rgba(255, 193, 7, 0.1)']
                            : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                          }
                          style={styles.inputGradient}
                        >
                          <Mail size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                          <TextInput
                            style={styles.textInput}
                            value={formData.email}
                            onChangeText={(text) => updateFormData('email', text)}
                            placeholder="Your gaming email"
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
                            ? ['rgba(6, 255, 165, 0.2)', 'rgba(0, 212, 170, 0.1)']
                            : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                          }
                          style={styles.inputGradient}
                        >
                          <Lock size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                          <TextInput
                            style={styles.textInput}
                            value={formData.password}
                            onChangeText={(text) => updateFormData('password', text)}
                            placeholder="Create a strong password"
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

                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Confirm Password</Text>
                      <View style={[
                        styles.inputContainer,
                        focusedField === 'confirmPassword' && styles.inputContainerFocused
                      ]}>
                        <LinearGradient
                          colors={focusedField === 'confirmPassword' 
                            ? ['rgba(255, 107, 107, 0.2)', 'rgba(255, 142, 142, 0.1)']
                            : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']
                          }
                          style={styles.inputGradient}
                        >
                          <Shield size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                          <TextInput
                            style={styles.textInput}
                            value={formData.confirmPassword}
                            onChangeText={(text) => updateFormData('confirmPassword', text)}
                            placeholder="Confirm your password"
                            placeholderTextColor="rgba(156, 163, 175, 0.7)"
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField(null)}
                          />
                          <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                            ) : (
                              <Eye size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                            )}
                          </TouchableOpacity>
                        </LinearGradient>
                      </View>
                    </View>

                    <View style={styles.termsContainer}>
                      <LinearGradient
                        colors={['rgba(0, 245, 255, 0.1)', 'rgba(157, 78, 221, 0.1)']}
                        style={styles.termsGradient}
                      >
                        <Text style={styles.termsText}>
                          By joining, you agree to our{' '}
                          <Text style={styles.termsLink}>Gaming Code</Text>
                          {' '}and{' '}
                          <Text style={styles.termsLink}>Privacy Shield</Text>
                        </Text>
                      </LinearGradient>
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity 
                      style={[styles.registerButton, loading && styles.disabledButton]}
                      onPress={handleRegister}
                      disabled={loading}
                    >
                      <LinearGradient
                        colors={loading 
                          ? ['#6B7280', '#4B5563'] 
                          : ['#FF6B6B', '#9D4EDD', '#00F5FF']
                        }
                        style={styles.registerButtonGradient}
                      >
                        <Text style={styles.registerButtonText}>
                          {loading ? 'Creating Legend...' : 'Begin Your Legend'}
                        </Text>
                        {!loading && <Crown size={Math.min(screenWidth * 0.05, 20)} color="#FFFFFF" />}
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
                    <Star size={Math.min(screenWidth * 0.04, 16)} color="#9CA3AF" />
                  </View>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity 
                  style={styles.loginLink}
                  onPress={() => router.push('/(auth)/login')}
                >
                  <LinearGradient
                    colors={['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']}
                    style={styles.loginLinkGradient}
                  >
                    <Text style={styles.loginLinkText}>
                      Already a legend? <Text style={styles.loginLinkHighlight}>Return to Arena</Text>
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
    opacity: 0.08,
  },
  element1: {
    width: 120,
    height: 120,
    backgroundColor: '#00F5FF',
    top: '8%',
    left: '5%',
  },
  element2: {
    width: 80,
    height: 80,
    backgroundColor: '#9D4EDD',
    top: '15%',
    right: '10%',
  },
  element3: {
    width: 60,
    height: 60,
    backgroundColor: '#FFD60A',
    top: '45%',
    left: '15%',
  },
  element4: {
    width: 100,
    height: 100,
    backgroundColor: '#FF6B6B',
    bottom: '25%',
    right: '20%',
  },
  element5: {
    width: 40,
    height: 40,
    backgroundColor: '#06FFA5',
    bottom: '10%',
    left: '25%',
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
    paddingBottom: screenHeight * 0.03,
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
    shadowColor: '#9D4EDD',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  orbitingElement1: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  orbitingElement2: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    backgroundColor: 'rgba(6, 255, 165, 0.2)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(6, 255, 165, 0.3)',
  },
  orbitingElement3: {
    position: 'absolute',
    top: '50%',
    right: -20,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  welcomeTitle: {
    fontSize: Math.min(screenWidth * 0.08, 32),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(157, 78, 221, 0.3)',
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
  benefitsContainer: {
    flexDirection: 'row',
    gap: screenWidth * 0.04,
  },
  benefitItem: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  benefitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  benefitText: {
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
    borderColor: 'rgba(157, 78, 221, 0.3)',
  },
  formTitle: {
    fontSize: Math.min(screenWidth * 0.055, 22),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: screenHeight * 0.03,
  },
  inputGroup: {
    marginBottom: screenHeight * 0.02,
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
    shadowColor: '#9D4EDD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.018,
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
  termsContainer: {
    marginTop: screenHeight * 0.02,
    marginBottom: screenHeight * 0.03,
    borderRadius: 12,
    overflow: 'hidden',
  },
  termsGradient: {
    padding: screenWidth * 0.04,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.2)',
  },
  termsText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    color: '#00F5FF',
    fontFamily: 'Inter-Medium',
  },
  registerButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#9D4EDD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.025,
    gap: 8,
  },
  registerButtonText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  bottomSection: {
    paddingVertical: screenHeight * 0.03,
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
  loginLink: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  loginLinkGradient: {
    alignItems: 'center',
    paddingVertical: screenHeight * 0.02,
    paddingHorizontal: screenWidth * 0.06,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  loginLinkText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  loginLinkHighlight: {
    color: '#00F5FF',
    fontFamily: 'Inter-Bold',
  },
});