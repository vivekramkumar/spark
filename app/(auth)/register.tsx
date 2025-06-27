import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
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

export default function RegisterScreen() {
  const { theme } = useTheme();
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
      if (error.code === 'email_confirmation_required') {
        Alert.alert(
          'Check Your Email',
          error.message,
          [{ text: 'OK', onPress: () => router.push('/(auth)/login') }]
        );
      } else {
        Alert.alert('Registration Failed', error.message);
      }
    } else {
      Alert.alert(
        'Welcome to SparkMatch!',
        'Account created successfully!',
        [{ text: 'Continue', onPress: () => router.replace('/(tabs)') }]
      );
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
      marginBottom: screenHeight * 0.02,
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
    termsContainer: {
      marginTop: screenHeight * 0.02,
      marginBottom: screenHeight * 0.03,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 12,
      padding: screenWidth * 0.04,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    termsText: {
      fontSize: Math.min(screenWidth * 0.035, 14),
      fontFamily: 'Inter-Regular',
      color: theme.colors.text.secondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    termsLink: {
      color: theme.colors.button.primary.background[0],
      fontFamily: 'Inter-Medium',
    },
    registerButton: {
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
    registerButtonText: {
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
    loginLink: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 12,
      paddingVertical: screenHeight * 0.02,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    loginLinkText: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Medium',
      color: theme.colors.text.primary,
    },
    loginLinkHighlight: {
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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join thousands finding meaningful connections
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <View style={[
                  styles.inputContainer,
                  focusedField === 'name' && styles.inputContainerFocused
                ]}>
                  <User size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.secondary} />
                  <TextInput
                    style={styles.textInput}
                    value={formData.name}
                    onChangeText={(text) => updateFormData('name', text)}
                    placeholder="Enter your name"
                    placeholderTextColor={theme.colors.text.secondary}
                    autoCapitalize="words"
                    maxLength={50}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Age</Text>
                <View style={[
                  styles.inputContainer,
                  focusedField === 'age' && styles.inputContainerFocused
                ]}>
                  <Calendar size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.secondary} />
                  <TextInput
                    style={styles.textInput}
                    value={formData.age}
                    onChangeText={(text) => updateFormData('age', text)}
                    placeholder="Your age (18+)"
                    placeholderTextColor={theme.colors.text.secondary}
                    keyboardType="numeric"
                    maxLength={2}
                    onFocus={() => setFocusedField('age')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <View style={[
                  styles.inputContainer,
                  focusedField === 'email' && styles.inputContainerFocused
                ]}>
                  <Mail size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.secondary} />
                  <TextInput
                    style={styles.textInput}
                    value={formData.email}
                    onChangeText={(text) => updateFormData('email', text)}
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
                    value={formData.password}
                    onChangeText={(text) => updateFormData('password', text)}
                    placeholder="Create a password"
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

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={[
                  styles.inputContainer,
                  focusedField === 'confirmPassword' && styles.inputContainerFocused
                ]}>
                  <Lock size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.secondary} />
                  <TextInput
                    style={styles.textInput}
                    value={formData.confirmPassword}
                    onChangeText={(text) => updateFormData('confirmPassword', text)}
                    placeholder="Confirm your password"
                    placeholderTextColor={theme.colors.text.secondary}
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
                      <EyeOff size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.secondary} />
                    ) : (
                      <Eye size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.secondary} />
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

              <TouchableOpacity 
                style={[styles.registerButton, loading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.registerButtonText}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Text>
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
    </View>
  );
}