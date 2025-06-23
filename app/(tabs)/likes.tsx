import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, X, Star, Crown, MapPin, ArrowLeft } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

const LIKES_DATA = [
  {
    id: 1,
    name: 'Emma',
    age: 24,
    bio: 'Adventure seeker and coffee lover ☕️ Always up for a new challenge!',
    images: [
      'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    level: 15,
    distance: 3,
    location: 'San Francisco, CA',
    interests: ['Gaming', 'Travel', 'Photography'],
    likedAt: '2 hours ago',
  },
  {
    id: 2,
    name: 'Sophia',
    age: 26,
    bio: 'Gamer girl with a passion for strategy games and late-night adventures 🎮',
    images: [
      'https://images.pexels.com/photos/1586973/pexels-photo-1586973.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    level: 22,
    distance: 1,
    location: 'San Francisco, CA',
    interests: ['Esports', 'Music', 'Art'],
    likedAt: '5 hours ago',
  },
  {
    id: 3,
    name: 'Maya',
    age: 23,
    bio: 'Competitive spirit meets creative soul. Let\'s see who wins at UNO! 🃏',
    images: [
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    level: 18,
    distance: 7,
    location: 'Oakland, CA',
    interests: ['Gaming', 'Design', 'Fitness'],
    likedAt: '1 day ago',
  },
];

export default function LikesScreen() {
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const position = React.useRef(new Animated.ValueXY()).current;
  const rotation = React.useRef(new Animated.Value(0)).current;

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
      rotation.setValue(gesture.dx * 0.1);
    },
    onPanResponderRelease: (_, gesture) => {
      const threshold = screenWidth * 0.3;
      
      if (gesture.dx > threshold) {
        handleSwipeRight();
      } else if (gesture.dx < -threshold) {
        handleSwipeLeft();
      } else {
        Animated.parallel([
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }),
          Animated.spring(rotation, {
            toValue: 0,
            useNativeDriver: false,
          }),
        ]).start();
      }
    },
  });

  const handleSwipeRight = () => {
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: screenWidth * 1.5, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotation, {
        toValue: 30,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setShowMatch(true);
      setTimeout(() => {
        setSelectedProfile(null);
        setShowMatch(false);
        position.setValue({ x: 0, y: 0 });
        rotation.setValue(0);
      }, 2500);
    });
  };

  const handleSwipeLeft = () => {
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: -screenWidth * 1.5, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotation, {
        toValue: -30,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setSelectedProfile(null);
      position.setValue({ x: 0, y: 0 });
      rotation.setValue(0);
    });
  };

  const handleImageTap = (side: 'left' | 'right') => {
    if (!selectedProfile) return;
    
    if (side === 'left' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (side === 'right' && currentImageIndex < selectedProfile.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOpacity = position.x.interpolate({
    inputRange: [-150, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  if (showMatch) {
    return (
      <View style={styles.matchContainer}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.matchGradient}
        >
          <SafeAreaView style={styles.matchContent}>
            <View style={styles.matchAnimation}>
              <Text style={styles.matchEmoji}>⚡</Text>
              <Text style={styles.matchTitle}>IT'S A MATCH!</Text>
              <Text style={styles.matchSubtitle}>
                You and {selectedProfile?.name} liked each other!
              </Text>
              <TouchableOpacity style={styles.chatButton}>
                <LinearGradient
                  colors={['#00F5FF', '#0080FF']}
                  style={styles.chatButtonGradient}
                >
                  <Text style={styles.chatButtonText}>Start Chatting</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  if (selectedProfile) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.backgroundGradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.profileHeader}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                  setSelectedProfile(null);
                  setCurrentImageIndex(0);
                }}
              >
                <ArrowLeft size={24} color="#00F5FF" />
              </TouchableOpacity>
              <Text style={styles.profileHeaderTitle}>{selectedProfile.name}</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.profileContainer}>
              <Animated.View
                style={[
                  styles.profileCard,
                  {
                    transform: [
                      { translateX: position.x },
                      { translateY: position.y },
                      { rotate: rotateInterpolate },
                    ],
                  },
                ]}
                {...panResponder.panHandlers}
              >
                {/* Overlays */}
                <Animated.View style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}>
                  <LinearGradient
                    colors={['rgba(0, 245, 255, 0.9)', 'rgba(0, 128, 255, 0.9)']}
                    style={styles.overlayGradient}
                  >
                    <Text style={styles.overlayText}>MATCH!</Text>
                  </LinearGradient>
                </Animated.View>

                <Animated.View style={[styles.overlay, styles.passOverlay, { opacity: passOpacity }]}>
                  <LinearGradient
                    colors={['rgba(255, 59, 48, 0.9)', 'rgba(255, 69, 58, 0.9)']}
                    style={styles.overlayGradient}
                  >
                    <Text style={styles.overlayText}>PASS</Text>
                  </LinearGradient>
                </Animated.View>

                <ScrollView style={styles.profileScroll} showsVerticalScrollIndicator={false}>
                  {/* Main Image */}
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: selectedProfile.images[currentImageIndex] }} 
                      style={styles.mainImage} 
                    />
                    
                    {/* Image Navigation */}
                    <TouchableOpacity 
                      style={[styles.imageNavButton, styles.imageNavLeft]}
                      onPress={() => handleImageTap('left')}
                    />
                    <TouchableOpacity 
                      style={[styles.imageNavButton, styles.imageNavRight]}
                      onPress={() => handleImageTap('right')}
                    />
                    
                    {/* Image Indicators */}
                    <View style={styles.imageIndicators}>
                      {selectedProfile.images.map((_: any, index: number) => (
                        <View
                          key={index}
                          style={[
                            styles.imageIndicator,
                            { backgroundColor: index === currentImageIndex ? '#00F5FF' : 'rgba(255, 255, 255, 0.3)' }
                          ]}
                        />
                      ))}
                    </View>

                    {/* Basic Info Overlay */}
                    <LinearGradient
                      colors={['transparent', 'rgba(15, 15, 35, 0.8)']}
                      style={styles.imageOverlay}
                    >
                      <View style={styles.basicInfo}>
                        <View style={styles.nameRow}>
                          <Text style={styles.profileName}>{selectedProfile.name}, {selectedProfile.age}</Text>
                          <View style={styles.levelBadge}>
                            <Crown size={14} color="#FFD700" />
                            <Text style={styles.levelText}>LVL {selectedProfile.level}</Text>
                          </View>
                        </View>
                        <View style={styles.locationRow}>
                          <MapPin size={14} color="#9CA3AF" />
                          <Text style={styles.locationText}>{selectedProfile.location}</Text>
                          <Text style={styles.distanceText}>{selectedProfile.distance} km away</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>

                  {/* Bio Section */}
                  <View style={styles.bioSection}>
                    <Text style={styles.bioText}>{selectedProfile.bio}</Text>
                  </View>

                  {/* Interests */}
                  <View style={styles.interestsSection}>
                    <Text style={styles.sectionTitle}>Interests</Text>
                    <View style={styles.interestsGrid}>
                      {selectedProfile.interests.map((interest: string, index: number) => (
                        <View key={index} style={styles.interestItem}>
                          <Text style={styles.interestText}>{interest}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.bottomPadding} />
                </ScrollView>
              </Animated.View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.actionButton, styles.passButton]} onPress={handleSwipeLeft}>
                <LinearGradient
                  colors={['rgba(255, 59, 48, 0.2)', 'rgba(255, 69, 58, 0.2)']}
                  style={styles.buttonGradient}
                >
                  <X size={28} color="#FF3B30" />
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleSwipeRight}>
                <LinearGradient
                  colors={['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.2)']}
                  style={styles.buttonGradient}
                >
                  <Heart size={28} color="#00F5FF" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
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
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Likes</Text>
            <View style={styles.headerBadge}>
              <Heart size={16} color="#FF6B6B" />
              <Text style={styles.headerBadgeText}>{LIKES_DATA.length} Likes</Text>
            </View>
          </View>

          <ScrollView style={styles.likesContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.subtitle}>People who liked you</Text>
            
            <View style={styles.likesGrid}>
              {LIKES_DATA.map((profile) => (
                <TouchableOpacity
                  key={profile.id}
                  style={styles.likeCard}
                  onPress={() => setSelectedProfile(profile)}
                >
                  <LinearGradient
                    colors={['rgba(0, 245, 255, 0.1)', 'rgba(0, 128, 255, 0.05)']}
                    style={styles.likeCardGradient}
                  >
                    <View style={styles.likeImageContainer}>
                      <Image source={{ uri: profile.images[0] }} style={styles.likeImage} />
                      <LinearGradient
                        colors={['transparent', 'rgba(15, 15, 35, 0.8)']}
                        style={styles.likeImageOverlay}
                      >
                        <View style={styles.likeInfo}>
                          <Text style={styles.likeName}>{profile.name}, {profile.age}</Text>
                          <View style={styles.likeLocationRow}>
                            <MapPin size={12} color="#9CA3AF" />
                            <Text style={styles.likeDistance}>{profile.distance} km</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </View>
                    
                    <View style={styles.likeDetails}>
                      <View style={styles.likeHeader}>
                        <View style={styles.likeLevelBadge}>
                          <Crown size={12} color="#FFD700" />
                          <Text style={styles.likeLevelText}>LVL {profile.level}</Text>
                        </View>
                        <Text style={styles.likeTime}>{profile.likedAt}</Text>
                      </View>
                      
                      <Text style={styles.likeBio} numberOfLines={2}>{profile.bio}</Text>
                      
                      <View style={styles.likeInterests}>
                        {profile.interests.slice(0, 2).map((interest, index) => (
                          <View key={index} style={styles.likeInterestTag}>
                            <Text style={styles.likeInterestText}>{interest}</Text>
                          </View>
                        ))}
                        {profile.interests.length > 2 && (
                          <Text style={styles.moreInterests}>+{profile.interests.length - 2}</Text>
                        )}
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 245, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  headerBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FF6B6B',
    marginLeft: 4,
  },
  likesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 20,
  },
  likesGrid: {
    gap: 16,
  },
  likeCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  likeCardGradient: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  likeImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
  },
  likeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  likeImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 8,
  },
  likeInfo: {
    gap: 2,
  },
  likeName: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  likeLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  likeDistance: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  likeDetails: {
    flex: 1,
    gap: 8,
  },
  likeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  likeLevelText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginLeft: 2,
  },
  likeTime: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  likeBio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    lineHeight: 18,
  },
  likeInterests: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  likeInterestTag: {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  likeInterestText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
  },
  moreInterests: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  // Profile view styles
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  profileHeaderTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  profileContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    flex: 1,
    backgroundColor: '#1F1F3A',
    borderRadius: 20,
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  overlay: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    zIndex: 10,
  },
  overlayGradient: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeOverlay: {
    transform: [{ rotate: '15deg' }],
  },
  passOverlay: {
    transform: [{ rotate: '-15deg' }],
  },
  overlayText: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  profileScroll: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 400,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageNavButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    zIndex: 5,
  },
  imageNavLeft: {
    left: 0,
  },
  imageNavRight: {
    right: 0,
  },
  imageIndicators: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 4,
    zIndex: 6,
  },
  imageIndicator: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  basicInfo: {
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  levelText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
  },
  distanceText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginLeft: 'auto',
  },
  bioSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  bioText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    lineHeight: 24,
  },
  interestsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  interestText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
  },
  bottomPadding: {
    height: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingBottom: 30,
    paddingTop: 20,
    gap: 40,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  passButton: {},
  likeButton: {},
  // Match screen styles
  matchContainer: {
    flex: 1,
  },
  matchGradient: {
    flex: 1,
  },
  matchContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  matchAnimation: {
    alignItems: 'center',
  },
  matchEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  matchTitle: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 245, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  matchSubtitle: {
    fontSize: 20,
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
    textAlign: 'center',
    marginBottom: 40,
  },
  chatButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  chatButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  chatButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
});