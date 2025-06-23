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
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Trophy, Heart, Gamepad2, Star, Crown, Shield, Zap, CreditCard as Edit3, Camera, Target, Flame, Eye, Award } from 'lucide-react-native';
import { router } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const USER_PROFILE = {
  name: 'Alex',
  age: 25,
  bio: 'Gaming enthusiast & midnight warrior! Always up for a challenge 🎮⚡',
  location: 'San Francisco, CA',
  photos: [
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  level: 15,
  xp: 2847,
  xpToNext: 3200,
  gameStats: {
    totalGames: 89,
    gamesWon: 67,
    winRate: 75,
    favoriteGame: 'UNO Battle',
    currentStreak: 8,
    longestStreak: 15,
    totalPlayTime: '47h 23m',
  },
  badges: [
    { 
      id: 1, 
      name: 'UNO Master', 
      description: 'Won 50+ UNO games', 
      icon: Gamepad2, 
      color: '#FF6B6B',
      rarity: 'Epic',
      unlocked: true 
    },
    { 
      id: 2, 
      name: 'Truth Seeker', 
      description: 'Answered 100+ truth questions', 
      icon: Eye, 
      color: '#9D4EDD',
      rarity: 'Rare',
      unlocked: true 
    },
    { 
      id: 3, 
      name: 'Story Teller', 
      description: 'Created 50+ emoji stories', 
      icon: Flame, 
      color: '#F72585',
      rarity: 'Epic',
      unlocked: true 
    },
    { 
      id: 4, 
      name: 'Streak Master', 
      description: 'Won 10 games in a row', 
      icon: Zap, 
      color: '#FFD60A',
      rarity: 'Legendary',
      unlocked: true 
    },
    { 
      id: 5, 
      name: 'Social Butterfly', 
      description: 'Matched with 100+ players', 
      icon: Heart, 
      color: '#06FFA5',
      rarity: 'Rare',
      unlocked: false 
    },
    { 
      id: 6, 
      name: 'Champion', 
      description: 'Reach level 25', 
      icon: Crown, 
      color: '#FFD700',
      rarity: 'Legendary',
      unlocked: false 
    },
  ],
  interests: ['Gaming', 'Coffee', 'Night Owl', 'Competitive', 'Anime', 'Tech'],
  preferences: {
    onlyGameFinishers: true,
    showDistance: true,
    allowSuperLikes: true,
    darkMode: true,
  },
};

export default function ProfileScreen() {
  const [preferences, setPreferences] = useState(USER_PROFILE.preferences);

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return '#9CA3AF';
      case 'Rare': return '#06FFA5';
      case 'Epic': return '#9D4EDD';
      case 'Legendary': return '#FFD700';
      default: return '#9CA3AF';
    }
  };

  const xpPercentage = (USER_PROFILE.xp / USER_PROFILE.xpToNext) * 100;

  const handleEditProfile = () => {
    router.push('/(tabs)/edit-profile');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
        style={styles.backgroundGradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity style={styles.settingsButton}>
                  <Settings size={Math.min(screenWidth * 0.06, 24)} color="#00F5FF" />
                </TouchableOpacity>
              </View>
              <View style={styles.levelSection}>
                <View style={styles.levelInfo}>
                  <Crown size={Math.min(screenWidth * 0.05, 20)} color="#FFD700" />
                  <Text style={styles.levelText}>Level {USER_PROFILE.level}</Text>
                </View>
                <Text style={styles.xpText}>{USER_PROFILE.xp} / {USER_PROFILE.xpToNext} XP</Text>
              </View>
              <View style={styles.xpBar}>
                <LinearGradient
                  colors={['#00F5FF', '#0080FF']}
                  style={[styles.xpProgress, { width: `${xpPercentage}%` }]}
                />
              </View>
            </View>

            {/* Profile Card */}
            <View style={styles.profileCard}>
              <LinearGradient
                colors={['rgba(0, 245, 255, 0.1)', 'rgba(0, 128, 255, 0.05)']}
                style={styles.profileCardGradient}
              >
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
                      <Edit3 size={Math.min(screenWidth * 0.045, 18)} color="#00F5FF" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.profileLocation}>{USER_PROFILE.location}</Text>
                  <Text style={styles.profileBio}>{USER_PROFILE.bio}</Text>

                  <View style={styles.interestsContainer}>
                    {USER_PROFILE.interests.map((interest, index) => (
                      <LinearGradient
                        key={index}
                        colors={['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']}
                        style={styles.interestTag}
                      >
                        <Text style={styles.interestText}>{interest}</Text>
                      </LinearGradient>
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Game Stats */}
            <View style={styles.statsCard}>
              <LinearGradient
                colors={['rgba(31, 31, 58, 0.8)', 'rgba(45, 27, 105, 0.6)']}
                style={styles.statsCardGradient}
              >
                <Text style={styles.sectionTitle}>Battle Statistics</Text>
                
                <View style={styles.statsGrid}>
                  <View style={styles.statItem}>
                    <LinearGradient
                      colors={['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']}
                      style={styles.statItemGradient}
                    >
                      <Gamepad2 size={Math.min(screenWidth * 0.06, 24)} color="#00F5FF" />
                      <Text style={styles.statNumber}>{USER_PROFILE.gameStats.totalGames}</Text>
                      <Text style={styles.statLabel}>Games Played</Text>
                    </LinearGradient>
                  </View>
                  
                  <View style={styles.statItem}>
                    <LinearGradient
                      colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 193, 7, 0.1)']}
                      style={styles.statItemGradient}
                    >
                      <Trophy size={Math.min(screenWidth * 0.06, 24)} color="#FFD700" />
                      <Text style={styles.statNumber}>{USER_PROFILE.gameStats.gamesWon}</Text>
                      <Text style={styles.statLabel}>Victories</Text>
                    </LinearGradient>
                  </View>
                  
                  <View style={styles.statItem}>
                    <LinearGradient
                      colors={['rgba(6, 255, 165, 0.2)', 'rgba(0, 212, 170, 0.1)']}
                      style={styles.statItemGradient}
                    >
                      <Star size={Math.min(screenWidth * 0.06, 24)} color="#06FFA5" />
                      <Text style={styles.statNumber}>{USER_PROFILE.gameStats.winRate}%</Text>
                      <Text style={styles.statLabel}>Win Rate</Text>
                    </LinearGradient>
                  </View>
                </View>

                <View style={styles.additionalStats}>
                  <View style={styles.additionalStatRow}>
                    <Text style={styles.additionalStatLabel}>Favorite Game:</Text>
                    <Text style={styles.additionalStatValue}>{USER_PROFILE.gameStats.favoriteGame}</Text>
                  </View>
                  <View style={styles.additionalStatRow}>
                    <Text style={styles.additionalStatLabel}>Current Streak:</Text>
                    <Text style={styles.additionalStatValue}>{USER_PROFILE.gameStats.currentStreak} wins</Text>
                  </View>
                  <View style={styles.additionalStatRow}>
                    <Text style={styles.additionalStatLabel}>Best Streak:</Text>
                    <Text style={styles.additionalStatValue}>{USER_PROFILE.gameStats.longestStreak} wins</Text>
                  </View>
                  <View style={styles.additionalStatRow}>
                    <Text style={styles.additionalStatLabel}>Total Play Time:</Text>
                    <Text style={styles.additionalStatValue}>{USER_PROFILE.gameStats.totalPlayTime}</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Achievements */}
            <View style={styles.badgesCard}>
              <LinearGradient
                colors={['rgba(31, 31, 58, 0.8)', 'rgba(45, 27, 105, 0.6)']}
                style={styles.badgesCardGradient}
              >
                <Text style={styles.sectionTitle}>Achievements</Text>
                <View style={styles.badgesGrid}>
                  {USER_PROFILE.badges.map((badge) => (
                    <View key={badge.id} style={[
                      styles.badge, 
                      { 
                        borderColor: badge.unlocked ? getRarityColor(badge.rarity) : '#374151',
                        opacity: badge.unlocked ? 1 : 0.5 
                      }
                    ]}>
                      <LinearGradient
                        colors={badge.unlocked 
                          ? [`${badge.color}20`, `${badge.color}10`]
                          : ['rgba(55, 65, 81, 0.2)', 'rgba(55, 65, 81, 0.1)']
                        }
                        style={styles.badgeGradient}
                      >
                        <badge.icon size={Math.min(screenWidth * 0.06, 24)} color={badge.unlocked ? badge.color : '#6B7280'} />
                        <Text style={[styles.badgeName, { color: badge.unlocked ? '#FFFFFF' : '#6B7280' }]}>
                          {badge.name}
                        </Text>
                        <Text style={[styles.badgeDescription, { color: badge.unlocked ? '#E5E7EB' : '#6B7280' }]}>
                          {badge.description}
                        </Text>
                        <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(badge.rarity) }]}>
                          <Text style={styles.rarityText}>{badge.rarity}</Text>
                        </View>
                      </LinearGradient>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </View>

            {/* Spark+ Subscription */}
            <View style={styles.subscriptionCard}>
              <LinearGradient
                colors={['#FFD60A', '#FFC300', '#FF9F1C']}
                style={styles.subscriptionGradient}
              >
                <Crown size={Math.min(screenWidth * 0.08, 32)} color="#0F0F23" />
                <Text style={styles.subscriptionTitle}>Upgrade to Spark+</Text>
                <Text style={styles.subscriptionSubtitle}>
                  Unlimited games • Premium badges • See who likes you • Advanced stats
                </Text>
                <TouchableOpacity style={styles.upgradeButton}>
                  <View style={styles.upgradeButtonContent}>
                    <Text style={styles.upgradeButtonText}>Try Free for 7 Days</Text>
                  </View>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Preferences */}
            <View style={styles.preferencesCard}>
              <LinearGradient
                colors={['rgba(31, 31, 58, 0.8)', 'rgba(45, 27, 105, 0.6)']}
                style={styles.preferencesCardGradient}
              >
                <Text style={styles.sectionTitle}>Game Preferences</Text>
                
                <View style={styles.preferenceItem}>
                  <View style={styles.preferenceLeft}>
                    <Shield size={Math.min(screenWidth * 0.05, 20)} color="#00F5FF" />
                    <View style={styles.preferenceText}>
                      <Text style={styles.preferenceTitle}>Only Game Finishers</Text>
                      <Text style={styles.preferenceSubtitle}>Match only with players who complete games</Text>
                    </View>
                  </View>
                  <Switch
                    value={preferences.onlyGameFinishers}
                    onValueChange={(value) => updatePreference('onlyGameFinishers', value)}
                    trackColor={{ false: '#374151', true: '#00F5FF' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={styles.preferenceItem}>
                  <View style={styles.preferenceLeft}>
                    <Target size={Math.min(screenWidth * 0.05, 20)} color="#00F5FF" />
                    <View style={styles.preferenceText}>
                      <Text style={styles.preferenceTitle}>Show Distance</Text>
                      <Text style={styles.preferenceSubtitle}>Display how far matches are from you</Text>
                    </View>
                  </View>
                  <Switch
                    value={preferences.showDistance}
                    onValueChange={(value) => updatePreference('showDistance', value)}
                    trackColor={{ false: '#374151', true: '#00F5FF' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={styles.preferenceItem}>
                  <View style={styles.preferenceLeft}>
                    <Heart size={Math.min(screenWidth * 0.05, 20)} color="#00F5FF" />
                    <View style={styles.preferenceText}>
                      <Text style={styles.preferenceTitle}>Allow Super Likes</Text>
                      <Text style={styles.preferenceSubtitle}>Let others send you super likes</Text>
                    </View>
                  </View>
                  <Switch
                    value={preferences.allowSuperLikes}
                    onValueChange={(value) => updatePreference('allowSuperLikes', value)}
                    trackColor={{ false: '#374151', true: '#00F5FF' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                <View style={styles.preferenceItem}>
                  <View style={styles.preferenceLeft}>
                    <Zap size={Math.min(screenWidth * 0.05, 20)} color="#00F5FF" />
                    <View style={styles.preferenceText}>
                      <Text style={styles.preferenceTitle}>Dark Mode</Text>
                      <Text style={styles.preferenceSubtitle}>Use dark theme for better gaming experience</Text>
                    </View>
                  </View>
                  <Switch
                    value={preferences.darkMode}
                    onValueChange={(value) => updatePreference('darkMode', value)}
                    trackColor={{ false: '#374151', true: '#00F5FF' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </LinearGradient>
            </View>
          </ScrollView>
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
  scrollContainer: {
    paddingHorizontal: screenWidth * 0.05,
    paddingBottom: screenHeight * 0.025,
  },
  header: {
    paddingVertical: screenHeight * 0.025,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenHeight * 0.02,
  },
  headerTitle: {
    fontSize: Math.min(screenWidth * 0.08, 32),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 245, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  settingsButton: {
    padding: 8,
  },
  levelSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginLeft: 8,
  },
  xpText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  xpBar: {
    height: 6,
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpProgress: {
    height: '100%',
    borderRadius: 3,
  },
  profileCard: {
    borderRadius: 20,
    marginBottom: screenHeight * 0.025,
    overflow: 'hidden',
  },
  profileCardGradient: {
    padding: screenWidth * 0.06,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.2)',
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
    borderRadius: 16,
    resizeMode: 'cover',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: screenHeight * 0.015,
    right: screenHeight * 0.015,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    borderRadius: 12,
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
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(156, 163, 175, 0.3)',
    borderStyle: 'dashed',
  },
  addPhotoText: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    color: '#9CA3AF',
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
    color: '#FFFFFF',
  },
  editButton: {
    padding: 8,
  },
  profileLocation: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: screenHeight * 0.015,
  },
  profileBio: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    lineHeight: 24,
    marginBottom: screenHeight * 0.025,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    borderRadius: 16,
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  interestText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
  },
  statsCard: {
    borderRadius: 20,
    marginBottom: screenHeight * 0.025,
    overflow: 'hidden',
  },
  statsCardGradient: {
    padding: screenWidth * 0.06,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: screenHeight * 0.025,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: screenHeight * 0.03,
    gap: screenWidth * 0.03,
  },
  statItem: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statItemGradient: {
    alignItems: 'center',
    padding: screenWidth * 0.05,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: Math.min(screenWidth * 0.07, 28),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  additionalStats: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: screenHeight * 0.025,
  },
  additionalStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenHeight * 0.015,
  },
  additionalStatLabel: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  additionalStatValue: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  badgesCard: {
    borderRadius: 20,
    marginBottom: screenHeight * 0.025,
    overflow: 'hidden',
  },
  badgesCardGradient: {
    padding: screenWidth * 0.06,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badge: {
    width: '48%',
    borderRadius: 16,
    marginBottom: screenHeight * 0.02,
    borderWidth: 2,
    overflow: 'hidden',
  },
  badgeGradient: {
    padding: screenWidth * 0.04,
    alignItems: 'center',
    position: 'relative',
  },
  badgeName: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: Math.min(screenWidth * 0.0275, 11),
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 8,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rarityText: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
  subscriptionCard: {
    borderRadius: 20,
    marginBottom: screenHeight * 0.025,
    overflow: 'hidden',
    shadowColor: '#FFD60A',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  subscriptionGradient: {
    padding: screenWidth * 0.08,
    alignItems: 'center',
  },
  subscriptionTitle: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
    marginTop: screenHeight * 0.02,
    marginBottom: 8,
  },
  subscriptionSubtitle: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#0F0F23',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: screenHeight * 0.03,
  },
  upgradeButton: {
    backgroundColor: 'rgba(15, 15, 35, 0.2)',
    paddingHorizontal: screenWidth * 0.08,
    paddingVertical: screenHeight * 0.02,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#0F0F23',
  },
  upgradeButtonContent: {
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
  preferencesCard: {
    borderRadius: 20,
    marginBottom: screenHeight * 0.025,
    overflow: 'hidden',
  },
  preferencesCardGradient: {
    padding: screenWidth * 0.06,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: screenHeight * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  preferenceSubtitle: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});