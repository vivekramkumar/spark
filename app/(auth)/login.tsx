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
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LoginScreen() {
  const { colors } = useTheme();
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      paddingBottom: screenHeight * 0.04,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: Math.min(screenWidth * 0.08, 32),
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginBottom: screenHeight * 0.04,
    },
    inputGroup: {
      marginBottom: screenHeight * 0.025,
    },
    inputLabel: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: screenWidth * 0.04,
      paddingVertical: screenHeight * 0.015,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputContainerFocused: {
      borderColor: colors.primary,
      backgroundColor: colors.card,
    },
    textInput: {
      flex: 1,
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Regular',
      color: colors.text,
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
      color: colors.primary,
    },
    loginButton: {
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
    disabledButton: {
      backgroundColor: colors.textSecondary,
      shadowOpacity: 0,
      elevation: 0,
    },
    loginButtonText: {
      fontSize: Math.min(screenWidth * 0.045, 18),
      fontFamily: 'Inter-Bold',
      color: '#FFFFFF',
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: screenHeight * 0.03,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      marginHorizontal: screenWidth * 0.04,
      fontSize: Math.min(screenWidth * 0.035, 14),
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    registerLink: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingVertical: screenHeight * 0.02,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    registerLinkText: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    registerLinkHighlight: {
      color: colors.primary,
      fontFamily: 'Inter-Bold',
    },
  });

  return (
    <View style={styles.container}>
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
                <ArrowLeft size={Math.min(screenWidth * 0.06, 24)} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue your journey
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={[
                  styles.inputContainer,
                  focusedField === 'email' && styles.inputContainerFocused
                ]}>
                  <Mail size={Math.min(screenWidth * 0.05, 20)} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[
                  styles.inputContainer,
                  focusedField === 'password' && styles.inputContainerFocused
                ]}>
                  <Lock size={Math.min(screenWidth * 0.05, 20)} color={colors.textSecondary} />
                  <TextInput
                    style={styles.textInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.textSecondary}
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
                      <EyeOff size={Math.min(screenWidth * 0.05, 20)} color={colors.textSecondary} />
                    ) : (
                      <Eye size={Math.min(screenWidth * 0.05, 20)} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
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
    </View>
  );
}