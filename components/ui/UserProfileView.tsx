import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Crown, Gamepad2, MapPin, Trophy } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface UserProfile {
  id: string;
  name: string;
  age: number;
  bio: string;
  images: string[];
  level: number;
  streak?: number;
  tags: string[];
  interests: string[];
  gamesWon: number;
  location: string;
  distance: number;
}

interface UserProfileViewProps {
  profile: UserProfile;
  onClose: () => void;
  showButtons?: boolean;
}

export default function UserProfileView({ profile, onClose, showButtons = true }: UserProfileViewProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.default,
    },
    backButton: {
      marginRight: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    imageContainer: {
      height: 300,
      borderRadius: 20,
      overflow: 'hidden',
      marginBottom: 20,
    },
    image: {
      width: '100%',
      height: '100%',
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: 5,
    },
    location: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    locationText: {
      color: theme.colors.text.secondary,
      marginLeft: 5,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 20,
      padding: 15,
      backgroundColor: theme.colors.background.card,
      borderRadius: 15,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginTop: 5,
    },
    statLabel: {
      color: theme.colors.text.secondary,
      marginTop: 2,
    },
    bio: {
      color: theme.colors.text.primary,
      marginBottom: 20,
      lineHeight: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: 10,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 20,
    },
    tag: {
      backgroundColor: theme.colors.background.card,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      color: theme.colors.text.primary,
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    button: {
      flex: 1,
      marginHorizontal: 5,
      paddingVertical: 12,
      borderRadius: 25,
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: theme.colors.button.primary.background[0],
    },
    secondaryButton: {
      backgroundColor: theme.colors.button.secondary.background[0],
    },
    buttonText: {
      color: theme.colors.text.primary,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <ArrowLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: profile.images[0] }} style={styles.image} />
        </View>
        <Text style={styles.name}>{profile.name}, {profile.age}</Text>
        <View style={styles.location}>
          <MapPin size={16} color={theme.colors.text.secondary} />
          <Text style={styles.locationText}>
            {profile.location} • {profile.distance}km away
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Crown size={20} color={theme.colors.text.primary} />
            <Text style={styles.statValue}>Lv. {profile.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statItem}>
            <Trophy size={20} color={theme.colors.text.primary} />
            <Text style={styles.statValue}>{profile.gamesWon}</Text>
            <Text style={styles.statLabel}>Games Won</Text>
          </View>
          <View style={styles.statItem}>
            <Gamepad2 size={20} color={theme.colors.text.primary} />
            <Text style={styles.statValue}>{profile.streak || 0}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>
        <Text style={styles.bio}>{profile.bio}</Text>
        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagsContainer}>
          {profile.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.tagsContainer}>
          {profile.interests.map((interest, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{interest}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      {showButtons && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.buttonText}>Pass</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.primaryButton]}>
            <Text style={styles.buttonText}>Like</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
} 