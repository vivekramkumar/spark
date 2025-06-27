import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { Camera, CreditCard as Edit3, Heart, MessageCircle, Moon, Settings, Star, Sun, Trophy } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const USER_PROFILE = {
  name: 'Alex',
  age: 25,
  bio: 'Coffee enthusiast and book lover. Always up for deep conversations and new adventures.',
  location: 'San Francisco, CA',
  photos: [
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  interests: ['Coffee', 'Books', 'Travel', 'Photography', 'Music', 'Art'],
  stats: {
    matches: 47,
    conversations: 23,
    connections: 12,
  },
};

export default function ProfileScreen() {
  const { theme, toggleTheme } = useTheme();
  const [preferences, setPreferences] = useState({
    showDistance: true,
    allowNotifications: true,
    privateMode: false,
  });

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleEditProfile = () => {
    router.push('/(tabs)/edit-profile');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    safeArea: {
      flex: 1,
    },
    scrollContainer: {
      paddingHorizontal: screenWidth * 0.05,
      paddingBottom: screenHeight * 0.025,
    },
    header: {
      paddingVertical: screenHeight * 0.025,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: Math.min(screenWidth * 0.08, 32),
      fontFamily: 'Inter-Bold',
      color: theme.colors.text.primary,
    },
    settingsButton: {
      padding: 8,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    profileCard: {
      backgroundColor: theme.colors.background.card,
      borderRadius: 16,
      marginBottom: screenHeight * 0.025,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      shadowColor: theme.colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    profileCardContent: {
      padding: screenWidth * 0.06,
    },
    photosContainer: {
      marginBottom: screenHeight * 0.025,
    },
    mainPhotoContainer: {
      position: 'relative',
      marginBottom: screenHeight * 0.015,
    },
    mainPhoto: {
      width: '100%',
      height: screenHeight * 0.25,
      borderRadius: 12,
      resizeMode: 'cover',
    },
    editPhotoButton: {
      position: 'absolute',
      bottom: screenHeight * 0.015,
      right: screenHeight * 0.015,
      backgroundColor: theme.colors.button.primary.background[0],
      borderRadius: 20,
      padding: 8,
    },
    secondaryPhotos: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    secondaryPhoto: {
      width: '22%',
      height: screenHeight * 0.1,
      borderRadius: 8,
      overflow: 'hidden',
    },
    secondaryPhotoImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    addPhotoButton: {
      width: '22%',
      height: screenHeight * 0.1,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.border.default,
      borderStyle: 'dashed',
    },
    addPhotoText: {
      fontSize: Math.min(screenWidth * 0.06, 24),
      color: theme.colors.text.secondary,
      fontFamily: 'Inter-Bold',
    },
    profileInfo: {
      marginTop: screenHeight * 0.025,
    },
    nameRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    profileName: {
      fontSize: Math.min(screenWidth * 0.07, 28),
      fontFamily: 'Inter-Bold',
      color: theme.colors.text.primary,
    },
    editButton: {
      padding: 8,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    profileLocation: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Medium',
      color: theme.colors.text.secondary,
      marginBottom: screenHeight * 0.015,
    },
    profileBio: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Regular',
      color: theme.colors.text.primary,
      lineHeight: 24,
      marginBottom: screenHeight * 0.025,
    },
    interestsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    interestTag: {
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 20,
      paddingHorizontal: screenWidth * 0.04,
      paddingVertical: 8,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    interestText: {
      fontSize: Math.min(screenWidth * 0.035, 14),
      fontFamily: 'Inter-Medium',
      color: theme.colors.text.primary,
    },
    statsCard: {
      backgroundColor: theme.colors.background.card,
      borderRadius: 16,
      marginBottom: screenHeight * 0.025,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      shadowColor: theme.colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    statsCardContent: {
      padding: screenWidth * 0.06,
    },
    sectionTitle: {
      fontSize: Math.min(screenWidth * 0.06, 24),
      fontFamily: 'Inter-Bold',
      color: theme.colors.text.primary,
      marginBottom: screenHeight * 0.025,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: screenWidth * 0.03,
    },
    statItem: {
      flex: 1,
      backgroundColor: theme.colors.background.secondary,
      borderRadius: 12,
      padding: screenWidth * 0.05,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border.default,
    },
    statNumber: {
      fontSize: Math.min(screenWidth * 0.07, 28),
      fontFamily: 'Inter-Bold',
      color: theme.colors.text.primary,
      marginTop: 8,
    },
    statLabel: {
      fontSize: Math.min(screenWidth * 0.03, 12),
      fontFamily: 'Inter-Medium',
      color: theme.colors.text.secondary,
      marginTop: 4,
      textAlign: 'center',
    },
    preferencesCard: {
      backgroundColor: theme.colors.background.card,
      borderRadius: 16,
      marginBottom: screenHeight * 0.025,
      borderWidth: 1,
      borderColor: theme.colors.border.default,
      shadowColor: theme.colors.text.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    preferencesCardContent: {
      padding: screenWidth * 0.06,
    },
    preferenceItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: screenHeight * 0.02,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.default,
    },
    preferenceLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    preferenceText: {
      marginLeft: screenWidth * 0.04,
      flex: 1,
    },
    preferenceTitle: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Medium',
      color: theme.colors.text.primary,
      marginBottom: 4,
    },
    preferenceSubtitle: {
      fontSize: Math.min(screenWidth * 0.035, 14),
      fontFamily: 'Inter-Regular',
      color: theme.colors.text.secondary,
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity style={styles.settingsButton}>
              <Settings size={Math.min(screenWidth * 0.06, 24)} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileCardContent}>
              <View style={styles.photosContainer}>
                <View style={styles.mainPhotoContainer}>
                  <Image source={{ uri: USER_PROFILE.photos[0] }} style={styles.mainPhoto} />
                  <TouchableOpacity style={styles.editPhotoButton} onPress={handleEditProfile}>
                    <Camera size={Math.min(screenWidth * 0.05, 20)} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <View style={styles.secondaryPhotos}>
                  {USER_PROFILE.photos.slice(1).map((photo, index) => (
                    <TouchableOpacity key={index} style={styles.secondaryPhoto} onPress={handleEditProfile}>
                      <Image source={{ uri: photo }} style={styles.secondaryPhotoImage} />
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity style={styles.addPhotoButton} onPress={handleEditProfile}>
                    <Text style={styles.addPhotoText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.profileName}>{USER_PROFILE.name}, {USER_PROFILE.age}</Text>
                  <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                    <Edit3 size={Math.min(screenWidth * 0.045, 18)} color={theme.colors.text.primary} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.profileLocation}>{USER_PROFILE.location}</Text>
                <Text style={styles.profileBio}>{USER_PROFILE.bio}</Text>

                <View style={styles.interestsContainer}>
                  {USER_PROFILE.interests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statsCardContent}>
              <Text style={styles.sectionTitle}>Your Activity</Text>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Heart size={Math.min(screenWidth * 0.06, 24)} color={theme.colors.button.primary.background[0]} />
                  <Text style={styles.statNumber}>{USER_PROFILE.stats.matches}</Text>
                  <Text style={styles.statLabel}>Matches</Text>
                </View>
                
                <View style={styles.statItem}>
                  <MessageCircle size={Math.min(screenWidth * 0.06, 24)} color={theme.colors.button.secondary.background[0]} />
                  <Text style={styles.statNumber}>{USER_PROFILE.stats.conversations}</Text>
                  <Text style={styles.statLabel}>Chats</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Star size={Math.min(screenWidth * 0.06, 24)} color={theme.colors.button.warning.background[0]} />
                  <Text style={styles.statNumber}>{USER_PROFILE.stats.connections}</Text>
                  <Text style={styles.statLabel}>Connections</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.preferencesCard}>
            <View style={styles.preferencesCardContent}>
              <Text style={styles.sectionTitle}>Preferences</Text>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceLeft}>
                  {theme.mode === 'dark' ? (
                    <Moon size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.primary} />
                  ) : (
                    <Sun size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.primary} />
                  )}
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Dark Mode</Text>
                    <Text style={styles.preferenceSubtitle}>Toggle dark/light theme</Text>
                  </View>
                </View>
                <Switch
                  value={theme.mode === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: theme.colors.border.default, true: theme.colors.button.primary.background[0] }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceLeft}>
                  <Settings size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.primary} />
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Show Distance</Text>
                    <Text style={styles.preferenceSubtitle}>Show distance on profiles</Text>
                  </View>
                </View>
                <Switch
                  value={preferences.showDistance}
                  onValueChange={(value) => updatePreference('showDistance', value)}
                  trackColor={{ false: theme.colors.border.default, true: theme.colors.button.primary.background[0] }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceLeft}>
                  <Heart size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.primary} />
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Notifications</Text>
                    <Text style={styles.preferenceSubtitle}>Enable push notifications</Text>
                  </View>
                </View>
                <Switch
                  value={preferences.allowNotifications}
                  onValueChange={(value) => updatePreference('allowNotifications', value)}
                  trackColor={{ false: theme.colors.border.default, true: theme.colors.button.primary.background[0] }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={[styles.preferenceItem, { borderBottomWidth: 0 }]}>
                <View style={styles.preferenceLeft}>
                  <Trophy size={Math.min(screenWidth * 0.05, 20)} color={theme.colors.text.primary} />
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Private Mode</Text>
                    <Text style={styles.preferenceSubtitle}>Hide your profile from search</Text>
                  </View>
                </View>
                <Switch
                  value={preferences.privateMode}
                  onValueChange={(value) => updatePreference('privateMode', value)}
                  trackColor={{ false: theme.colors.border.default, true: theme.colors.button.primary.background[0] }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}