import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LoginScreen() {
  const { theme } = useTheme();
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
      backgroundColor: theme.colors.background.primary,
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
      backgroundColor: theme.colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: Math.min(screenWidth * 0.08, 32),
      fontFamily: 'Inter-Bold',
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Medium',
      color: theme.colors.text.secondary,
      marginBottom: screenHeight * 0.04,
    },
    inputGroup: {
      marginBottom: screenHeight * 0.025,
    },
    inputLabel: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Medium',
      color: theme.colors.text.primary,
      marginBottom: 8,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 12,
      paddingHorizontal: screenWidth * 0.04,
      paddingVertical: screenHeight * 0.015,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    inputContainerFocused: {
      borderColor: theme.colors.button.primary.background[0],
      backgroundColor: theme.colors.background.card,
    },
    textInput: {
      flex: 1,
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Regular',
      color: theme.colors.text.primary,
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
      color: theme.colors.button.primary.background[0],
    },
    loginButton: {
      backgroundColor: theme.colors.button.primary.background[0],
      borderRadius: 12,
      paddingVertical: screenHeight * 0.02,
      alignItems: 'center',
      shadowColor: theme.colors.button.primary.background[0],
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    disabledButton: {
      backgroundColor: theme.colors.text.secondary,
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
      backgroundColor: theme.colors.border.default,
    },
    dividerText: {
      marginHorizontal: screenWidth * 0.04,
      fontSize: Math.min(screenWidth * 0.035, 14),
      fontFamily: 'Inter-Medium',
      color: theme.colors.text.secondary,
    },
    registerLink: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 12,
      paddingVertical: screenHeight * 0.02,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    registerLinkText: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Medium',
      color: theme.colors.text.primary,
    },
    registerLinkHighlight: {
      color: theme.colors.button.primary.background[0],
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
                <ArrowLeft size={Math.min(screenWidth * 0.06, 24)} color={theme.colors.text.primary} />
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
                  <Mail size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.secondary} />
                  <TextInput
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor={theme.colors.text.secondary}
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
                  <Lock size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.secondary} />
                  <TextInput
                    style={styles.textInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor={theme.colors.text.secondary}
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
                      <EyeOff size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.secondary} />
                    ) : (
                      <Eye size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.secondary} />
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