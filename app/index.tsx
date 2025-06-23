import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshCw, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Circle as XCircle, ExternalLink, Copy } from 'lucide-react-native';
import { checkEnvironmentSetup } from '@/lib/supabase';

export default function IndexScreen() {
  const { session, loading, connectionError, retryConnection } = useAuth();
  const [envCheck, setEnvCheck] = useState(checkEnvironmentSetup());
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!loading && !connectionError) {
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/welcome');
      }
    }
  }, [session, loading, connectionError]);

  const handleRetry = async () => {
    setEnvCheck(checkEnvironmentSetup());
    await retryConnection();
  };

  const copyToClipboard = (text: string) => {
    // For web, use the Clipboard API
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
  };

  if (connectionError) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.backgroundGradient}
        >
          <ScrollView contentContainerStyle={styles.errorContainer} showsVerticalScrollIndicator={false}>
            <AlertCircle size={64} color="#FF6B6B" />
            <Text style={styles.errorTitle}>Connection Error</Text>
            <Text style={styles.errorMessage}>
              Unable to connect to Supabase. Let's fix this step by step:
            </Text>

            {/* Environment Check */}
            <View style={styles.checkSection}>
              <Text style={styles.checkTitle}>Environment Configuration</Text>
              
              <View style={styles.checkItem}>
                {envCheck.url ? (
                  <CheckCircle size={20} color="#06FFA5" />
                ) : (
                  <XCircle size={20} color="#FF6B6B" />
                )}
                <Text style={styles.checkText}>
                  Supabase URL: {envCheck.url ? '✅ Set' : '❌ Missing'}
                </Text>
              </View>

              <View style={styles.checkItem}>
                {envCheck.hasKey ? (
                  <CheckCircle size={20} color="#06FFA5" />
                ) : (
                  <XCircle size={20} color="#FF6B6B" />
                )}
                <Text style={styles.checkText}>
                  Supabase Key: {envCheck.hasKey ? '✅ Set' : '❌ Missing'}
                </Text>
              </View>

              {envCheck.issues.length > 0 && (
                <View style={styles.issuesContainer}>
                  <Text style={styles.issuesTitle}>Issues Found:</Text>
                  {envCheck.issues.map((issue, index) => (
                    <Text key={index} style={styles.issueText}>• {issue}</Text>
                  ))}
                </View>
              )}
            </View>

            {/* Setup Steps */}
            <View style={styles.stepsContainer}>
              <Text style={styles.stepsTitle}>Setup Instructions:</Text>
              
              <View style={styles.step}>
                <Text style={styles.stepNumber}>1</Text>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Create Supabase Project</Text>
                  <Text style={styles.stepDescription}>
                    Go to supabase.com and create a new project. Wait 2-3 minutes for it to fully initialize.
                  </Text>
                  <TouchableOpacity 
                    style={styles.linkButton}
                    onPress={() => {
                      if (typeof window !== 'undefined') {
                        window.open('https://supabase.com/dashboard', '_blank');
                      }
                    }}
                  >
                    <ExternalLink size={16} color="#00F5FF" />
                    <Text style={styles.linkText}>Open Supabase Dashboard</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.step}>
                <Text style={styles.stepNumber}>2</Text>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Get Your Credentials</Text>
                  <Text style={styles.stepDescription}>
                    In your Supabase dashboard, go to Settings → API and copy:
                  </Text>
                  <View style={styles.credentialItem}>
                    <Text style={styles.credentialLabel}>Project URL</Text>
                    <TouchableOpacity 
                      style={styles.copyButton}
                      onPress={() => copyToClipboard('EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co')}
                    >
                      <Copy size={14} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.credentialItem}>
                    <Text style={styles.credentialLabel}>anon/public key</Text>
                    <TouchableOpacity 
                      style={styles.copyButton}
                      onPress={() => copyToClipboard('EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here')}
                    >
                      <Copy size={14} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.step}>
                <Text style={styles.stepNumber}>3</Text>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Update Environment File</Text>
                  <Text style={styles.stepDescription}>
                    Create/update your .env file in the project root:
                  </Text>
                  <View style={styles.codeBlock}>
                    <Text style={styles.codeText}>
                      EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co{'\n'}
                      EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.step}>
                <Text style={styles.stepNumber}>4</Text>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Run Database Migration</Text>
                  <Text style={styles.stepDescription}>
                    In Supabase dashboard, go to SQL Editor and run the migration from:
                    supabase/migrations/20250623181540_wispy_pebble.sql
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.detailsButton} onPress={() => setShowDetails(!showDetails)}>
              <Text style={styles.detailsButtonText}>
                {showDetails ? 'Hide' : 'Show'} Technical Details
              </Text>
            </TouchableOpacity>

            {showDetails && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailsTitle}>Current Configuration:</Text>
                <Text style={styles.detailsText}>URL: {envCheck.url || 'Not set'}</Text>
                <Text style={styles.detailsText}>
                  Key: {envCheck.hasKey ? 'Set (hidden for security)' : 'Not set'}
                </Text>
              </View>
            )}

            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <LinearGradient
                colors={['#00F5FF', '#0080FF']}
                style={styles.retryButtonGradient}
              >
                <RefreshCw size={20} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Test Connection</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 40,
    maxWidth: 500,
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
  checkSection: {
    width: '100%',
    backgroundColor: 'rgba(31, 31, 58, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  checkTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  checkText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
  },
  issuesContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  issuesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  issueText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#FF6B6B',
    marginBottom: 4,
  },
  stepsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  stepsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  step: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00F5FF',
    color: '#0F0F23',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 20,
    marginBottom: 8,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
  },
  credentialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  credentialLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
  },
  copyButton: {
    padding: 4,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    lineHeight: 18,
  },
  detailsButton: {
    marginBottom: 16,
  },
  detailsButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: 'rgba(31, 31, 58, 0.5)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 4,
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