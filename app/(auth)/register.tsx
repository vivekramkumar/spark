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
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, Calendar, Heart } from 'lucide-react-native';
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
  const { signUp } = useAuth();

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
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
        'Success!',
        'Account created successfully! Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
        style={styles.backgroundGradient}
      >
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
                  <ArrowLeft size={Math.min(screenWidth * 0.06, 24)} color="#00F5FF" />
                </TouchableOpacity>
                
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={['#00F5FF', '#0080FF']}
                    style={styles.logoGradient}
                  >
                    <Heart size={Math.min(screenWidth * 0.08, 32)} color="#FFFFFF" />
                  </LinearGradient>
                </View>
              </View>

              {/* Title Section */}
              <View style={styles.titleSection}>
                <Text style={styles.title}>Join SparkMatch</Text>
                <Text style={styles.subtitle}>
                  Create your account and start your gaming love journey
                </Text>
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Name</Text>
                  <View style={styles.inputContainer}>
                    <User size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                    <TextInput
                      style={styles.textInput}
                      value={formData.name}
                      onChangeText={(text) => updateFormData('name', text)}
                      placeholder="Enter your name"
                      placeholderTextColor="rgba(156, 163, 175, 0.7)"
                      autoCapitalize="words"
                      maxLength={50}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Age</Text>
                  <View style={styles.inputContainer}>
                    <Calendar size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                    <TextInput
                      style={styles.textInput}
                      value={formData.age}
                      onChangeText={(text) => updateFormData('age', text)}
                      placeholder="Enter your age"
                      placeholderTextColor="rgba(156, 163, 175, 0.7)"
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Mail size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                    <TextInput
                      style={styles.textInput}
                      value={formData.email}
                      onChangeText={(text) => updateFormData('email', text)}
                      placeholder="Enter your email"
                      placeholderTextColor="rgba(156, 163, 175, 0.7)"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Lock size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                    <TextInput
                      style={styles.textInput}
                      value={formData.password}
                      onChangeText={(text) => updateFormData('password', text)}
                      placeholder="Create a password"
                      placeholderTextColor="rgba(156, 163, 175, 0.7)"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
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
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View style={styles.inputContainer}>
                    <Lock size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                    <TextInput
                      style={styles.textInput}
                      value={formData.confirmPassword}
                      onChangeText={(text) => updateFormData('confirmPassword', text)}
                      placeholder="Confirm your password"
                      placeholderTextColor="rgba(156, 163, 175, 0.7)"
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
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
                  </View>
                </View>

                <View style={styles.termsContainer}>
                  <Text style={styles.termsText}>
                    By creating an account, you agree to our{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </View>
              </View>

              {/* Action Section */}
              <View style={styles.actionSection}>
                <TouchableOpacity 
                  style={[styles.registerButton, loading && styles.disabledButton]}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ['#6B7280', '#4B5563'] : ['#00F5FF', '#0080FF']}
                    style={styles.registerButtonGradient}
                  >
                    <Text style={styles.registerButtonText}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity 
                  style={styles.loginLink}
                  onPress={() => router.push('/(auth)/login')}
                >
                  <Text style={styles.loginLinkText}>
                    Already have an account? <Text style={styles.loginLinkHighlight}>Sign In</Text>
                  </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: screenHeight * 0.02,
    paddingBottom: screenHeight * 0.03,
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    position: 'absolute',
    left: '50%',
    marginLeft: -screenWidth * 0.06,
  },
  logoGradient: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    borderRadius: screenWidth * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  titleSection: {
    alignItems: 'center',
    paddingBottom: screenHeight * 0.04,
  },
  title: {
    fontSize: Math.min(screenWidth * 0.08, 32),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  formSection: {
    paddingBottom: screenHeight * 0.03,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(31, 31, 58, 0.8)',
    borderRadius: 16,
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
  actionSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: screenHeight * 0.03,
  },
  registerButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: screenHeight * 0.03,
  },
  disabledButton: {
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonGradient: {
    paddingVertical: screenHeight * 0.02,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
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
  dividerText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginHorizontal: screenWidth * 0.04,
  },
  loginLink: {
    alignItems: 'center',
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