import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Trophy, Heart, MessageCircle, Star, CreditCard as Edit3, Camera, Moon, Sun } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors, isDarkMode, toggleTheme } = useTheme();
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
      backgroundColor: colors.background,
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
      color: colors.text,
    },
    settingsButton: {
      padding: 8,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    profileCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: screenHeight * 0.025,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
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
      backgroundColor: colors.primary,
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
      backgroundColor: colors.surface,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    addPhotoText: {
      fontSize: Math.min(screenWidth * 0.06, 24),
      color: colors.textSecondary,
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
      color: colors.text,
    },
    editButton: {
      padding: 8,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    profileLocation: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginBottom: screenHeight * 0.015,
    },
    profileBio: {
      fontSize: Math.min(screenWidth * 0.04, 16),
      fontFamily: 'Inter-Regular',
      color: colors.text,
      lineHeight: 24,
      marginBottom: screenHeight * 0.025,
    },
    interestsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    interestTag: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      paddingHorizontal: screenWidth * 0.04,
      paddingVertical: 8,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    interestText: {
      fontSize: Math.min(screenWidth * 0.035, 14),
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    statsCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: screenHeight * 0.025,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
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
      color: colors.text,
      marginBottom: screenHeight * 0.025,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: screenWidth * 0.03,
    },
    statItem: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: screenWidth * 0.05,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    statNumber: {
      fontSize: Math.min(screenWidth * 0.07, 28),
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginTop: 8,
    },
    statLabel: {
      fontSize: Math.min(screenWidth * 0.03, 12),
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 4,
      textAlign: 'center',
    },
    preferencesCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: screenHeight * 0.025,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: colors.text,
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
      borderBottomColor: colors.border,
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
      color: colors.text,
      marginBottom: 4,
    },
    preferenceSubtitle: {
      fontSize: Math.min(screenWidth * 0.035, 14),
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
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
              <Settings size={Math.min(screenWidth * 0.06, 24)} color={colors.text} />
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
                    <Edit3 size={Math.min(screenWidth * 0.045, 18)} color={colors.text} />
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
                  <Heart size={Math.min(screenWidth * 0.06, 24)} color={colors.primary} />
                  <Text style={styles.statNumber}>{USER_PROFILE.stats.matches}</Text>
                  <Text style={styles.statLabel}>Matches</Text>
                </View>
                
                <View style={styles.statItem}>
                  <MessageCircle size={Math.min(screenWidth * 0.06, 24)} color={colors.secondary} />
                  <Text style={styles.statNumber}>{USER_PROFILE.stats.conversations}</Text>
                  <Text style={styles.statLabel}>Chats</Text>
                </View>
                
                <View style={styles.statItem}>
                  <Star size={Math.min(screenWidth * 0.06, 24)} color={colors.accent} />
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
                  {isDarkMode ? (
                    <Moon size={Math.min(screenWidth * 0.05, 20)} color={colors.text} />
                  ) : (
                    <Sun size={Math.min(screenWidth * 0.05, 20)} color={colors.text} />
                  )}
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Dark Mode</Text>
                    <Text style={styles.preferenceSubtitle}>Switch between light and dark themes</Text>
                  </View>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceLeft}>
                  <Settings size={Math.min(screenWidth * 0.05, 20)} color={colors.text} />
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Show Distance</Text>
                    <Text style={styles.preferenceSubtitle}>Display distance to other users</Text>
                  </View>
                </View>
                <Switch
                  value={preferences.showDistance}
                  onValueChange={(value) => updatePreference('showDistance', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceLeft}>
                  <Heart size={Math.min(screenWidth * 0.05, 20)} color={colors.text} />
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Notifications</Text>
                    <Text style={styles.preferenceSubtitle}>Get notified about new matches and messages</Text>
                  </View>
                </View>
                <Switch
                  value={preferences.allowNotifications}
                  onValueChange={(value) => updatePreference('allowNotifications', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={[styles.preferenceItem, { borderBottomWidth: 0 }]}>
                <View style={styles.preferenceLeft}>
                  <Trophy size={Math.min(screenWidth * 0.05, 20)} color={colors.text} />
                  <View style={styles.preferenceText}>
                    <Text style={styles.preferenceTitle}>Private Mode</Text>
                    <Text style={styles.preferenceSubtitle}>Hide your profile from discovery</Text>
                  </View>
                </View>
                <Switch
                  value={preferences.privateMode}
                  onValueChange={(value) => updatePreference('privateMode', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
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