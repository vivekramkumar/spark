import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, Plus, X, Save, MapPin, User, CreditCard as Edit3, Image as ImageIcon, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface UserProfile {
  name: string;
  age: string;
  bio: string;
  location: string;
  photos: string[];
  interests: string[];
}

const INITIAL_PROFILE: UserProfile = {
  name: 'Alex',
  age: '25',
  bio: 'Gaming enthusiast & midnight warrior! Always up for a challenge 🎮⚡',
  location: 'San Francisco, CA',
  photos: [
    'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  interests: ['Gaming', 'Coffee', 'Night Owl', 'Competitive', 'Anime', 'Tech'],
};

const AVAILABLE_INTERESTS = [
  'Gaming', 'Coffee', 'Night Owl', 'Competitive', 'Anime', 'Tech', 'Travel', 
  'Photography', 'Music', 'Art', 'Fitness', 'Cooking', 'Reading', 'Movies',
  'Dancing', 'Hiking', 'Yoga', 'Sports', 'Fashion', 'Design', 'Writing',
  'Meditation', 'Pets', 'Nature', 'Adventure', 'Comedy', 'Science'
];

// Sample photos for replacement (in a real app, these would come from user's gallery)
const SAMPLE_PHOTOS = [
  'https://images.pexels.com/photos/1586973/pexels-photo-1586973.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800',
];

export default function EditProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [showPhotoSelector, setShowPhotoSelector] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showInterestSelector, setShowInterestSelector] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handlePhotoSelect = (photoUrl: string) => {
    if (selectedPhotoIndex !== null) {
      // Replace existing photo
      const newPhotos = [...profile.photos];
      newPhotos[selectedPhotoIndex] = photoUrl;
      updateProfile('photos', newPhotos);
    } else {
      // Add new photo
      if (profile.photos.length < 6) {
        updateProfile('photos', [...profile.photos, photoUrl]);
      }
    }
    setShowPhotoSelector(false);
    setSelectedPhotoIndex(null);
  };

  const handleDeletePhoto = (index: number) => {
    if (profile.photos.length > 1) {
      const newPhotos = profile.photos.filter((_, i) => i !== index);
      updateProfile('photos', newPhotos);
    } else {
      Alert.alert('Cannot Delete', 'You must have at least one photo.');
    }
  };

  const handleAddPhoto = () => {
    if (profile.photos.length >= 6) {
      Alert.alert('Photo Limit', 'You can have a maximum of 6 photos.');
      return;
    }
    setSelectedPhotoIndex(null);
    setShowPhotoSelector(true);
  };

  const handleReplacePhoto = (index: number) => {
    setSelectedPhotoIndex(index);
    setShowPhotoSelector(true);
  };

  const handleFileUpload = () => {
    if (Platform.OS === 'web') {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handlePhotoSelect(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInterest = (interest: string) => {
    const currentInterests = profile.interests;
    if (currentInterests.includes(interest)) {
      updateProfile('interests', currentInterests.filter(i => i !== interest));
    } else {
      if (currentInterests.length < 10) {
        updateProfile('interests', [...currentInterests, interest]);
      } else {
        Alert.alert('Interest Limit', 'You can select a maximum of 10 interests.');
      }
    }
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    setHasUnsavedChanges(false);
    Alert.alert('Success', 'Profile updated successfully!');
    router.back();
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
        style={styles.backgroundGradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
              <ArrowLeft size={Math.min(screenWidth * 0.06, 24)} color="#00F5FF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity 
              style={[styles.headerButton, styles.saveButton]} 
              onPress={handleSave}
              disabled={!hasUnsavedChanges}
            >
              <Save size={Math.min(screenWidth * 0.06, 24)} color={hasUnsavedChanges ? "#00F5FF" : "#6B7280"} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            {/* Photos Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Photos</Text>
              <Text style={styles.sectionSubtitle}>Add up to 6 photos to showcase yourself</Text>
              
              <View style={styles.photosGrid}>
                {profile.photos.map((photo, index) => (
                  <View key={index} style={styles.photoContainer}>
                    <Image source={{ uri: photo }} style={styles.photo} />
                    <View style={styles.photoOverlay}>
                      <TouchableOpacity
                        style={styles.photoAction}
                        onPress={() => handleReplacePhoto(index)}
                      >
                        <Camera size={Math.min(screenWidth * 0.04, 16)} color="#FFFFFF" />
                      </TouchableOpacity>
                      {profile.photos.length > 1 && (
                        <TouchableOpacity
                          style={[styles.photoAction, styles.deleteAction]}
                          onPress={() => handleDeletePhoto(index)}
                        >
                          <Trash2 size={Math.min(screenWidth * 0.04, 16)} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                    </View>
                    {index === 0 && (
                      <View style={styles.primaryBadge}>
                        <Text style={styles.primaryBadgeText}>Main</Text>
                      </View>
                    )}
                  </View>
                ))}
                
                {profile.photos.length < 6 && (
                  <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                    <LinearGradient
                      colors={['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']}
                      style={styles.addPhotoGradient}
                    >
                      <Plus size={Math.min(screenWidth * 0.08, 32)} color="#00F5FF" />
                      <Text style={styles.addPhotoText}>Add Photo</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Basic Info Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <View style={styles.inputContainer}>
                  <User size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                  <TextInput
                    style={styles.textInput}
                    value={profile.name}
                    onChangeText={(text) => updateProfile('name', text)}
                    placeholder="Enter your name"
                    placeholderTextColor="rgba(156, 163, 175, 0.7)"
                    maxLength={50}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Age</Text>
                <View style={styles.inputContainer}>
                  <Edit3 size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                  <TextInput
                    style={styles.textInput}
                    value={profile.age}
                    onChangeText={(text) => updateProfile('age', text)}
                    placeholder="Enter your age"
                    placeholderTextColor="rgba(156, 163, 175, 0.7)"
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <View style={styles.inputContainer}>
                  <MapPin size={Math.min(screenWidth * 0.05, 20)} color="#9CA3AF" />
                  <TextInput
                    style={styles.textInput}
                    value={profile.location}
                    onChangeText={(text) => updateProfile('location', text)}
                    placeholder="Enter your location"
                    placeholderTextColor="rgba(156, 163, 175, 0.7)"
                    maxLength={100}
                  />
                </View>
              </View>
            </View>

            {/* Bio Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.sectionSubtitle}>Tell others about yourself</Text>
              
              <View style={styles.bioContainer}>
                <TextInput
                  style={styles.bioInput}
                  value={profile.bio}
                  onChangeText={(text) => updateProfile('bio', text)}
                  placeholder="Write something interesting about yourself..."
                  placeholderTextColor="rgba(156, 163, 175, 0.7)"
                  multiline
                  maxLength={500}
                  textAlignVertical="top"
                />
                <Text style={styles.characterCount}>{profile.bio.length}/500</Text>
              </View>
            </View>

            {/* Interests Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Interests</Text>
                  <Text style={styles.sectionSubtitle}>Select up to 10 interests</Text>
                </View>
                <TouchableOpacity
                  style={styles.editInterestsButton}
                  onPress={() => setShowInterestSelector(true)}
                >
                  <Edit3 size={Math.min(screenWidth * 0.04, 16)} color="#00F5FF" />
                  <Text style={styles.editInterestsText}>Edit</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.interestsContainer}>
                {profile.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <LinearGradient
                      colors={['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']}
                      style={styles.interestTagGradient}
                    >
                      <Text style={styles.interestTagText}>{interest}</Text>
                    </LinearGradient>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.bottomPadding} />
          </ScrollView>

          {/* Photo Selector Modal */}
          {showPhotoSelector && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <LinearGradient
                  colors={['rgba(31, 31, 58, 0.95)', 'rgba(45, 27, 105, 0.95)']}
                  style={styles.modalGradient}
                >
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {selectedPhotoIndex !== null ? 'Replace Photo' : 'Add Photo'}
                    </Text>
                    <TouchableOpacity onPress={() => setShowPhotoSelector(false)}>
                      <X size={Math.min(screenWidth * 0.06, 24)} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView style={styles.photoSelectorScroll}>
                    <View style={styles.photoSelectorOptions}>
                      {Platform.OS === 'web' && (
                        <TouchableOpacity style={styles.uploadOption} onPress={handleFileUpload}>
                          <LinearGradient
                            colors={['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']}
                            style={styles.uploadOptionGradient}
                          >
                            <ImageIcon size={Math.min(screenWidth * 0.08, 32)} color="#00F5FF" />
                            <Text style={styles.uploadOptionText}>Upload from Device</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}

                      <Text style={styles.samplePhotosTitle}>Sample Photos</Text>
                      <View style={styles.samplePhotosGrid}>
                        {SAMPLE_PHOTOS.map((photo, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.samplePhoto}
                            onPress={() => handlePhotoSelect(photo)}
                          >
                            <Image source={{ uri: photo }} style={styles.samplePhotoImage} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </ScrollView>
                </LinearGradient>
              </View>
            </View>
          )}

          {/* Interest Selector Modal */}
          {showInterestSelector && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <LinearGradient
                  colors={['rgba(31, 31, 58, 0.95)', 'rgba(45, 27, 105, 0.95)']}
                  style={styles.modalGradient}
                >
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Select Interests</Text>
                    <TouchableOpacity onPress={() => setShowInterestSelector(false)}>
                      <X size={Math.min(screenWidth * 0.06, 24)} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.interestCounter}>
                    {profile.interests.length}/10 selected
                  </Text>

                  <ScrollView style={styles.interestSelectorScroll}>
                    <View style={styles.availableInterests}>
                      {AVAILABLE_INTERESTS.map((interest, index) => {
                        const isSelected = profile.interests.includes(interest);
                        return (
                          <TouchableOpacity
                            key={index}
                            style={[styles.availableInterest, isSelected && styles.selectedInterest]}
                            onPress={() => toggleInterest(interest)}
                          >
                            <Text style={[
                              styles.availableInterestText,
                              isSelected && styles.selectedInterestText
                            ]}>
                              {interest}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                </LinearGradient>
              </View>
            </View>
          )}

          {/* Hidden file input for web */}
          {Platform.OS === 'web' && (
            <input
              ref={fileInputRef as any}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButton: {
    padding: 8,
  },
  saveButton: {
    opacity: 1,
  },
  headerTitle: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: screenWidth * 0.05,
  },
  section: {
    marginTop: screenHeight * 0.03,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: screenHeight * 0.02,
  },
  sectionTitle: {
    fontSize: Math.min(screenWidth * 0.055, 22),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: screenWidth * 0.03,
    marginTop: screenHeight * 0.02,
  },
  photoContainer: {
    position: 'relative',
    width: (screenWidth - screenWidth * 0.1 - screenWidth * 0.06) / 3,
    height: screenHeight * 0.15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 8,
  },
  photoAction: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 6,
  },
  deleteAction: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#00F5FF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  primaryBadgeText: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
  addPhotoButton: {
    width: (screenWidth - screenWidth * 0.1 - screenWidth * 0.06) / 3,
    height: screenHeight * 0.15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addPhotoGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0, 245, 255, 0.3)',
    borderStyle: 'dashed',
  },
  addPhotoText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
    marginTop: 4,
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
    borderRadius: 12,
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.015,
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
  bioContainer: {
    backgroundColor: 'rgba(31, 31, 58, 0.8)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: screenHeight * 0.015,
  },
  bioInput: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    padding: screenWidth * 0.04,
    minHeight: screenHeight * 0.12,
  },
  characterCount: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'right',
    paddingHorizontal: screenWidth * 0.04,
    paddingBottom: screenWidth * 0.03,
  },
  editInterestsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  editInterestsText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
    marginLeft: 4,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: screenHeight * 0.015,
  },
  interestTag: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  interestTagGradient: {
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  interestTagText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
  },
  bottomPadding: {
    height: screenHeight * 0.05,
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: screenWidth * 0.9,
    maxHeight: screenHeight * 0.8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalGradient: {
    padding: screenWidth * 0.05,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenHeight * 0.025,
  },
  modalTitle: {
    fontSize: Math.min(screenWidth * 0.055, 22),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  photoSelectorScroll: {
    maxHeight: screenHeight * 0.6,
  },
  photoSelectorOptions: {
    gap: screenHeight * 0.02,
  },
  uploadOption: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  uploadOptionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.025,
    borderWidth: 2,
    borderColor: 'rgba(0, 245, 255, 0.3)',
    borderStyle: 'dashed',
  },
  uploadOptionText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
    marginLeft: screenWidth * 0.03,
  },
  samplePhotosTitle: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: screenHeight * 0.02,
    marginBottom: screenHeight * 0.015,
  },
  samplePhotosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: screenWidth * 0.02,
  },
  samplePhoto: {
    width: (screenWidth * 0.8 - screenWidth * 0.06) / 3,
    height: screenHeight * 0.1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  samplePhotoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  interestCounter: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: screenHeight * 0.02,
  },
  interestSelectorScroll: {
    maxHeight: screenHeight * 0.5,
  },
  availableInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  availableInterest: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedInterest: {
    backgroundColor: 'rgba(0, 245, 255, 0.2)',
    borderColor: 'rgba(0, 245, 255, 0.5)',
  },
  availableInterestText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
  },
  selectedInterestText: {
    color: '#00F5FF',
  },
});