import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Crown, Gamepad2, MapPin, Zap } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Define the user profile interface
interface UserProfile {
  id: string | number;
  name: string;
  age: number;
  bio: string;
  images: string[];
  tags?: string[];
  level?: number;
  streak?: number;
  distance?: number;
  location?: string;
  interests?: string[];
  prompts?: Array<{
    question: string;
    answer: string;
  }>;
  gamesWon?: number;
}

interface UserProfileViewProps {
  profile: UserProfile;
  onClose: () => void;
  onLike?: () => void;
  onPass?: () => void;
  showButtons?: boolean;
}

export default function UserProfileView({ 
  profile, 
  onClose, 
  onLike, 
  onPass, 
  showButtons = true 
}: UserProfileViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Configure pan responder for swipe gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (evt, gesture) => {
      const { dx, dy } = gesture;
      const threshold = 15;
      // Allow vertical scrolling when the gesture is more vertical than horizontal
      if (Math.abs(dy) > Math.abs(dx)) {
        return false;
      }
      // Only handle horizontal swipes that are significant enough
      return Math.abs(dx) > threshold;
    },
    onPanResponderGrant: () => {
      setScrollEnabled(false);
    },
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
      rotation.setValue(gesture.dx * 0.05);
    },
    onPanResponderRelease: (_, gesture) => {
      setScrollEnabled(true);
      const threshold = screenWidth * 0.25;
      
      if (gesture.dx > threshold) {
        swipeRight();
      } else if (gesture.dx < -threshold) {
        swipeLeft();
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

  const swipeRight = () => {
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: screenWidth * 1.5, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotation, {
        toValue: 15,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (onLike) onLike();
    });
  };

  const swipeLeft = () => {
    Animated.parallel([
      Animated.timing(position, {
        toValue: { x: -screenWidth * 1.5, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotation, {
        toValue: -15,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (onPass) onPass();
    });
  };

  const handleImageTap = (side: 'left' | 'right') => {
    if (scrollEnabled) {
      if (side === 'left' && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      } else if (side === 'right' && currentImageIndex < profile.images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    }
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: ['-8deg', '0deg', '8deg'],
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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
        style={styles.backgroundGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={onClose}
            >
              <ArrowLeft size={24} color="#00F5FF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{profile.name}</Text>
            <View style={styles.headerPlaceholder} />
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
              {/* Like Overlay */}
              <Animated.View style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}>
                <LinearGradient
                  colors={['rgba(0, 245, 255, 0.9)', 'rgba(0, 128, 255, 0.9)']}
                  style={styles.overlayGradient}
                >
                  <Text style={styles.overlayText}>SPARK!</Text>
                </LinearGradient>
              </Animated.View>

              {/* Pass Overlay */}
              <Animated.View style={[styles.overlay, styles.passOverlay, { opacity: passOpacity }]}>
                <LinearGradient
                  colors={['rgba(255, 59, 48, 0.9)', 'rgba(255, 69, 58, 0.9)']}
                  style={styles.overlayGradient}
                >
                  <Text style={styles.overlayText}>PASS</Text>
                </LinearGradient>
              </Animated.View>

              <ScrollView 
                ref={scrollViewRef}
                style={styles.profileScroll} 
                showsVerticalScrollIndicator={true}
                bounces={true}
                scrollEventThrottle={16}
                scrollEnabled={scrollEnabled}
                contentContainerStyle={styles.scrollContent}
                nestedScrollEnabled={true}
                alwaysBounceVertical={true}
                onScrollBeginDrag={() => {
                  if (!scrollEnabled) {
                    setScrollEnabled(true);
                  }
                }}
              >
                {/* Main Image Section */}
                <View style={styles.imageContainer}>
                  <Image 
                    source={{ uri: profile.images[currentImageIndex] }} 
                    style={styles.mainImage} 
                  />
                  
                  {/* Image Navigation Areas */}
                  <TouchableOpacity 
                    style={[styles.imageNavButton, styles.imageNavLeft]}
                    onPress={() => handleImageTap('left')}
                    activeOpacity={1}
                    hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  />
                  <TouchableOpacity 
                    style={[styles.imageNavButton, styles.imageNavRight]}
                    onPress={() => handleImageTap('right')}
                    activeOpacity={1}
                    hitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
                  />
                  
                  {/* Image Indicators */}
                  <View style={styles.imageIndicators}>
                    {profile.images.map((_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.imageIndicator,
                          { backgroundColor: index === currentImageIndex ? '#00F5FF' : 'rgba(255, 255, 255, 0.4)' }
                        ]}
                      />
                    ))}
                  </View>

                  {/* Basic Info Overlay */}
                  <LinearGradient
                    colors={['transparent', 'rgba(15, 15, 35, 0.9)']}
                    style={styles.imageOverlay}
                  >
                    <View style={styles.basicInfo}>
                      <View style={styles.nameRow}>
                        <Text style={styles.profileName}>{profile.name}, {profile.age}</Text>
                        {profile.level && (
                          <View style={styles.levelBadge}>
                            <Crown size={16} color="#FFD700" />
                            <Text style={styles.levelText}>LVL {profile.level}</Text>
                          </View>
                        )}
                      </View>
                      {(profile.location || profile.distance) && (
                        <View style={styles.locationRow}>
                          <MapPin size={16} color="#9CA3AF" />
                          {profile.location && (
                            <Text style={styles.locationText}>{profile.location}</Text>
                          )}
                          {profile.distance && (
                            <Text style={styles.distanceText}>{profile.distance} km away</Text>
                          )}
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                </View>

                {/* Bio Section */}
                <View style={styles.bioSection}>
                  <Text style={styles.bioText}>{profile.bio}</Text>
                </View>

                {/* Gaming Tags */}
                {profile.tags && profile.tags.length > 0 && (
                  <View style={styles.tagsSection}>
                    <Text style={styles.sectionTitle}>Gaming Style</Text>
                    <View style={styles.tagsContainer}>
                      {profile.tags.map((tag, index) => (
                        <LinearGradient
                          key={index}
                          colors={['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.2)']}
                          style={styles.tag}
                        >
                          <Text style={styles.tagText}>{tag}</Text>
                        </LinearGradient>
                      ))}
                    </View>
                  </View>
                )}

                {/* Battle Stats */}
                {(profile.gamesWon !== undefined || profile.streak !== undefined || profile.level !== undefined) && (
                  <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>Battle Stats</Text>
                    <View style={styles.statsGrid}>
                      {profile.gamesWon !== undefined && (
                        <View style={styles.statItem}>
                          <LinearGradient
                            colors={['rgba(0, 245, 255, 0.1)', 'rgba(0, 128, 255, 0.05)']}
                            style={styles.statItemGradient}
                          >
                            <Gamepad2 size={24} color="#00F5FF" />
                            <Text style={styles.statNumber}>{profile.gamesWon}</Text>
                            <Text style={styles.statLabel}>wins</Text>
                          </LinearGradient>
                        </View>
                      )}
                      
                      {profile.streak !== undefined && (
                        <View style={styles.statItem}>
                          <LinearGradient
                            colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 193, 7, 0.05)']}
                            style={styles.statItemGradient}
                          >
                            <Zap size={24} color="#FFD700" />
                            <Text style={styles.statNumber}>{profile.streak}</Text>
                            <Text style={styles.statLabel}>streak</Text>
                          </LinearGradient>
                        </View>
                      )}
                      
                      {profile.level !== undefined && (
                        <View style={styles.statItem}>
                          <LinearGradient
                            colors={['rgba(255, 107, 107, 0.1)', 'rgba(255, 142, 142, 0.05)']}
                            style={styles.statItemGradient}
                          >
                            <Crown size={24} color="#FF6B6B" />
                            <Text style={styles.statNumber}>{profile.level}</Text>
                            <Text style={styles.statLabel}>level</Text>
                          </LinearGradient>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Interests */}
                {profile.interests && profile.interests.length > 0 && (
                  <View style={styles.interestsSection}>
                    <Text style={styles.sectionTitle}>Interests</Text>
                    <View style={styles.interestsGrid}>
                      {profile.interests.map((interest, index) => (
                        <View key={index} style={styles.interestItem}>
                          <Text style={styles.interestText}>{interest}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Prompts */}
                {profile.prompts && profile.prompts.length > 0 && (
                  <View style={styles.promptsSection}>
                    <Text style={styles.sectionTitle}>Get to Know Me</Text>
                    {profile.prompts.map((prompt, index) => (
                      <View key={index} style={styles.promptItem}>
                        <Text style={styles.promptQuestion}>{prompt.question}</Text>
                        <Text style={styles.promptAnswer}>{prompt.answer}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Bottom Padding for swipe area */}
                <View style={styles.bottomPadding} />
              </ScrollView>
            </Animated.View>
          </View>
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
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  headerPlaceholder: {
    width: 40,
  },
  profileContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
    justifyContent: 'flex-end',
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
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.2)',
  },
  overlay: {
    position: 'absolute',
    top: '40%',
    left: 30,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    zIndex: 100,
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
    backgroundColor: '#1F1F3A',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  imageContainer: {
    position: 'relative',
    height: screenHeight * 0.6,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageNavButton: {
    position: 'absolute',
    top: 0,
    bottom: '50%',
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
    height: 140,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 24,
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
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  levelText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  distanceText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginLeft: 'auto',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bioSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  bioText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    lineHeight: 24,
  },
  tagsSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  tagText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
  },
  statsSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statItem: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statItemGradient: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginTop: 4,
  },
  interestsSection: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  interestItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  interestText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
  },
  promptsSection: {
    padding: 24,
  },
  promptItem: {
    backgroundColor: 'rgba(0, 245, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.2)',
  },
  promptQuestion: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
    marginBottom: 10,
  },
  promptAnswer: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    lineHeight: 22,
  },
  bottomPadding: {
    height: 40,
  },
}); 