import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown, MapPin, Gamepad2, Zap, Heart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SAMPLE_PROFILES = [
  {
    id: 1,
    name: 'Luna',
    age: 25,
    bio: 'Gaming queen & midnight coffee enthusiast ☕️✨ Love exploring new worlds in games and real life. Always up for a challenge! Looking for someone who can keep up with my competitive spirit.',
    images: [
      'https://images.pexels.com/photos/1586973/pexels-photo-1586973.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['Truth Seeker', 'UNO Destroyer', 'Night Owl'],
    gamesWon: 47,
    distance: 2,
    level: 12,
    streak: 5,
    location: 'San Francisco, CA',
    interests: ['Gaming', 'Coffee', 'Photography', 'Travel', 'Music', 'Anime'],
    prompts: [
      {
        question: "My ideal weekend is...",
        answer: "Gaming marathons with coffee breaks and maybe some outdoor adventures if the weather's nice! Nothing beats a good co-op session followed by exploring the city."
      },
      {
        question: "I'm looking for...",
        answer: "Someone who can keep up with my competitive gaming spirit but also enjoys deep conversations over coffee. Bonus points if you can beat me at UNO!"
      },
      {
        question: "My biggest flex is...",
        answer: "I once won a 12-hour gaming tournament while maintaining a perfect coffee-to-water ratio. Priorities, you know?"
      }
    ]
  },
  {
    id: 2,
    name: 'Kai',
    age: 28,
    bio: 'Dare devil with a strategic mind 🎮🔥 Professional gamer by day, adventure seeker by night. Always looking for the next challenge!',
    images: [
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1586973/pexels-photo-1586973.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    tags: ['Dare Master', 'Card Shark', 'Risk Taker'],
    gamesWon: 63,
    distance: 5,
    level: 18,
    streak: 8,
    location: 'Los Angeles, CA',
    interests: ['Esports', 'Rock Climbing', 'Cooking', 'Tech', 'Fitness', 'Travel'],
    prompts: [
      {
        question: "My biggest fear is...",
        answer: "Running out of coffee during a gaming tournament. Priorities, you know? Also spiders, but mainly the coffee thing."
      },
      {
        question: "I'm most proud of...",
        answer: "Building my own gaming setup from scratch and reaching diamond rank in three different games simultaneously."
      },
      {
        question: "You should message me if...",
        answer: "You're ready for some friendly competition and don't mind losing at card games. Fair warning: I'm pretty good at Truth or Dare too!"
      }
    ]
  },
];

export default function DiscoverScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (evt, gesture) => {
      const { dx, dy } = gesture;
      const threshold = 15;
      // Only allow horizontal swipes, not vertical scrolling
      return Math.abs(dx) > threshold && Math.abs(dx) > Math.abs(dy);
    },
    onPanResponderGrant: () => {
      Keyboard.dismiss();
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
      setShowMatch(true);
      setTimeout(() => {
        nextCard();
        setShowMatch(false);
      }, 2500);
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
      nextCard();
    });
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % SAMPLE_PROFILES.length);
    setCurrentImageIndex(0);
    position.setValue({ x: 0, y: 0 });
    rotation.setValue(0);
  };

  const currentProfile = SAMPLE_PROFILES[currentIndex];

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

  const handleImageTap = (side: 'left' | 'right') => {
    if (side === 'left' && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else if (side === 'right' && currentImageIndex < currentProfile.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (showMatch) {
    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.matchContainer}>
          <LinearGradient
            colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
            style={styles.matchGradient}
          >
            <SafeAreaView style={styles.matchContent}>
              <View style={styles.matchAnimation}>
                <Text style={styles.matchEmoji}>⚡</Text>
                <Text style={styles.matchTitle}>SPARK IGNITED!</Text>
                <Text style={styles.matchSubtitle}>
                  You and {currentProfile.name} are ready to battle!
                </Text>
                
                <View style={styles.matchStats}>
                  <View style={styles.matchStatItem}>
                    <Text style={styles.matchStatLabel}>Combined Level</Text>
                    <Text style={styles.matchStatValue}>{currentProfile.level + 15}</Text>
                  </View>
                  <View style={styles.matchStatItem}>
                    <Text style={styles.matchStatLabel}>Power Match</Text>
                    <Text style={styles.matchStatValue}>95%</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.battleButton}>
                  <LinearGradient
                    colors={['#00F5FF', '#0080FF']}
                    style={styles.battleButtonGradient}
                  >
                    <Gamepad2 size={24} color="#0F0F23" />
                    <Text style={styles.battleButtonText}>Enter Arena</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.backgroundGradient}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>SparkMatch</Text>
              <View style={styles.headerStats}>
                <View style={styles.statBadge}>
                  <Zap size={16} color="#FFD700" />
                  <Text style={styles.statText}>Level 15</Text>
                </View>
              </View>
            </View>

            {/* Full Screen Profile */}
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
                  showsVerticalScrollIndicator={false}
                  bounces={true}
                  scrollEventThrottle={16}
                  scrollEnabled={scrollEnabled}
                  contentContainerStyle={styles.scrollContent}
                  nestedScrollEnabled={true}
                >
                  {/* Main Image Section */}
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: currentProfile.images[currentImageIndex] }} 
                      style={styles.mainImage} 
                    />
                    
                    {/* Image Navigation Areas */}
                    <TouchableOpacity 
                      style={[styles.imageNavButton, styles.imageNavLeft]}
                      onPress={() => handleImageTap('left')}
                      activeOpacity={1}
                    />
                    <TouchableOpacity 
                      style={[styles.imageNavButton, styles.imageNavRight]}
                      onPress={() => handleImageTap('right')}
                      activeOpacity={1}
                    />
                    
                    {/* Image Indicators */}
                    <View style={styles.imageIndicators}>
                      {currentProfile.images.map((_, index) => (
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
                          <Text style={styles.profileName}>{currentProfile.name}, {currentProfile.age}</Text>
                          <View style={styles.levelBadge}>
                            <Crown size={16} color="#FFD700" />
                            <Text style={styles.levelText}>LVL {currentProfile.level}</Text>
                          </View>
                        </View>
                        <View style={styles.locationRow}>
                          <MapPin size={16} color="#9CA3AF" />
                          <Text style={styles.locationText}>{currentProfile.location}</Text>
                          <Text style={styles.distanceText}>{currentProfile.distance} km away</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </View>

                  {/* Bio Section */}
                  <View style={styles.bioSection}>
                    <Text style={styles.bioText}>{currentProfile.bio}</Text>
                  </View>

                  {/* Gaming Tags */}
                  <View style={styles.tagsSection}>
                    <Text style={styles.sectionTitle}>Gaming Style</Text>
                    <View style={styles.tagsContainer}>
                      {currentProfile.tags.map((tag, index) => (
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

                  {/* Battle Stats */}
                  <View style={styles.statsSection}>
                    <Text style={styles.sectionTitle}>Battle Stats</Text>
                    <View style={styles.statsGrid}>
                      <View style={styles.statItem}>
                        <LinearGradient
                          colors={['rgba(0, 245, 255, 0.1)', 'rgba(0, 128, 255, 0.05)']}
                          style={styles.statItemGradient}
                        >
                          <Gamepad2 size={24} color="#00F5FF" />
                          <Text style={styles.statNumber}>{currentProfile.gamesWon}</Text>
                          <Text style={styles.statLabel}>wins</Text>
                        </LinearGradient>
                      </View>
                      <View style={styles.statItem}>
                        <LinearGradient
                          colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 193, 7, 0.05)']}
                          style={styles.statItemGradient}
                        >
                          <Zap size={24} color="#FFD700" />
                          <Text style={styles.statNumber}>{currentProfile.streak}</Text>
                          <Text style={styles.statLabel}>streak</Text>
                        </LinearGradient>
                      </View>
                      <View style={styles.statItem}>
                        <LinearGradient
                          colors={['rgba(255, 107, 107, 0.1)', 'rgba(255, 142, 142, 0.05)']}
                          style={styles.statItemGradient}
                        >
                          <Crown size={24} color="#FF6B6B" />
                          <Text style={styles.statNumber}>{currentProfile.level}</Text>
                          <Text style={styles.statLabel}>level</Text>
                        </LinearGradient>
                      </View>
                    </View>
                  </View>

                  {/* Interests */}
                  <View style={styles.interestsSection}>
                    <Text style={styles.sectionTitle}>Interests</Text>
                    <View style={styles.interestsGrid}>
                      {currentProfile.interests.map((interest, index) => (
                        <View key={index} style={styles.interestItem}>
                          <Text style={styles.interestText}>{interest}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Prompts */}
                  <View style={styles.promptsSection}>
                    <Text style={styles.sectionTitle}>Get to Know Me</Text>
                    {currentProfile.prompts.map((prompt, index) => (
                      <View key={index} style={styles.promptItem}>
                        <Text style={styles.promptQuestion}>{prompt.question}</Text>
                        <Text style={styles.promptAnswer}>{prompt.answer}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Bottom Padding for swipe area */}
                  <View style={styles.bottomPadding} />
                </ScrollView>
              </Animated.View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
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
    paddingVertical: 15,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 245, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginLeft: 4,
  },
  profileContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
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
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
  matchStats: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 40,
  },
  matchStatItem: {
    alignItems: 'center',
  },
  matchStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  matchStatValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
  },
  battleButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  battleButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  battleButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
    marginLeft: 8,
  },
});