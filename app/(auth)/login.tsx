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
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>
                  Ready to continue your gaming love story?
                </Text>
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Mail size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                    <TextInput
                      style={styles.textInput}
                      value={email}
                      onChangeText={setEmail}
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
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
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

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Action Section */}
              <View style={styles.actionSection}>
                <TouchableOpacity 
                  style={[styles.loginButton, loading && styles.disabledButton]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={loading ? ['#6B7280', '#4B5563'] : ['#00F5FF', '#0080FF']}
                    style={styles.loginButtonGradient}
                  >
                    <Text style={styles.loginButtonText}>
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity 
                  style={styles.registerLink}
                  onPress={() => router.push('/(auth)/register')}
                >
                  <Text style={styles.registerLinkText}>
                    Don't have an account? <Text style={styles.registerLinkHighlight}>Sign Up</Text>
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
    paddingBottom: screenHeight * 0.04,
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
    paddingBottom: screenHeight * 0.05,
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
    paddingBottom: screenHeight * 0.04,
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
  forgotPassword: {
    alignItems: 'flex-end',
    marginTop: screenHeight * 0.015,
  },
  forgotPasswordText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
  },
  actionSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: screenHeight * 0.03,
  },
  loginButton: {
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
  loginButtonGradient: {
    paddingVertical: screenHeight * 0.02,
    alignItems: 'center',
  },
  loginButtonText: {
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
  registerLink: {
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  registerLinkHighlight: {
    color: '#00F5FF',
    fontFamily: 'Inter-Bold',
  },
});