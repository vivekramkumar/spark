import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshCw, AlertCircle } from 'lucide-react-native';

export default function IndexScreen() {
  const { session, loading, connectionError, retryConnection } = useAuth();

  useEffect(() => {
    if (!loading && !connectionError) {
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/welcome');
      }
    }
  }, [session, loading, connectionError]);

  if (connectionError) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.backgroundGradient}
        >
          <View style={styles.errorContainer}>
            <AlertCircle size={64} color="#FF6B6B" />
            <Text style={styles.errorTitle}>Connection Error</Text>
            <Text style={styles.errorMessage}>
              Unable to connect to Supabase. Please check your configuration:
            </Text>
            <View style={styles.errorSteps}>
              <Text style={styles.errorStep}>1. Create a Supabase project at supabase.com</Text>
              <Text style={styles.errorStep}>2. Copy your project URL and anon key</Text>
              <Text style={styles.errorStep}>3. Update your .env file with the credentials</Text>
              <Text style={styles.errorStep}>4. Run the database migration</Text>
            </View>
            <TouchableOpacity style={styles.retryButton} onPress={retryConnection}>
              <LinearGradient
                colors={['#00F5FF', '#0080FF']}
                style={styles.retryButtonGradient}
              >
                <RefreshCw size={20} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Retry Connection</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
        style={styles.backgroundGradient}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00F5FF" />
          <Text style={styles.loadingText}>Loading SparkMatch...</Text>
        </View>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  errorContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    maxWidth: 400,
  },
  errorTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorSteps: {
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  errorStep: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    marginBottom: 8,
    lineHeight: 20,
  },
  retryButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});