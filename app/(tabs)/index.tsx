import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ColorValue,
  Dimensions,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileData, SwipeCard } from '../../components/ui/SwipeCard';
import { useTheme } from '../../contexts/ThemeContext';
import { applyAnimation, useFadeIn, useSlideUp } from '../../hooks/useAnimations';
import { scale, verticalScale } from '../../hooks/useResponsiveDesign';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ProfilePrompt {
  question: string;
  answer: string;
}

interface Profile extends ProfileData {
  gamesWon: number;
  level: number;
  streak: number;
  interests: string[];
  prompts: ProfilePrompt[];
}

const SAMPLE_PROFILES: Profile[] = [
  {
    id: '1',
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
    id: '2',
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
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatch, setShowMatch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values
  const fadeAnim = useFadeIn(500);
  const slideAnim = useSlideUp(500);
  const matchAnimation = useRef(new Animated.Value(0)).current;
  
  const currentProfile = SAMPLE_PROFILES[currentIndex];

  // Create styles with theme values
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
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(10),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: scale(24),
      fontWeight: 'bold',
      color: theme?.colors.text.primary,
    },
    cardsContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    animationOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    },
    matchContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme?.colors.background.primary + 'E6',
      padding: scale(20),
      borderRadius: scale(20),
    },
    matchText: {
      fontSize: scale(32),
      fontWeight: 'bold',
      color: theme?.colors.text.primary,
      marginBottom: verticalScale(10),
    },
    matchSubtext: {
      fontSize: scale(16),
      color: theme?.colors.text.secondary,
      textAlign: 'center',
    },
  });

  // Handle match animation
  useEffect(() => {
    if (showMatch) {
      Animated.spring(matchAnimation, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      matchAnimation.setValue(0);
    }
  }, [showMatch]);

  const handleSwipeLeft = (profile: ProfileData) => {
    nextCard();
  };

  const handleSwipeRight = (profile: ProfileData) => {
    setShowMatch(true);
    setTimeout(() => {
      nextCard();
      setShowMatch(false);
    }, 2500);
  };

  const handleCardPress = (profile: ProfileData) => {
    // Apply animation when viewing full profile
    applyAnimation('slideUp', 300);
    setShowProfile(true);
  };

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % SAMPLE_PROFILES.length);
    setCurrentImageIndex(0);
    
    // Reset scroll position when changing profiles
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Early return if theme is not initialized
  if (!theme) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <LinearGradient
          colors={[theme.colors.background.primary, theme.colors.background.secondary] as [ColorValue, ColorValue]}
          style={styles.backgroundGradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Discover</Text>
            </View>

            <View style={styles.cardsContainer}>
              {currentProfile && (
                <SwipeCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                  onCardPress={handleCardPress}
                  index={currentIndex}
                  totalCards={SAMPLE_PROFILES.length}
                />
              )}
            </View>

            {/* Match animation overlay */}
            {showMatch && (
              <Animated.View
                style={[
                  styles.animationOverlay,
                  {
                    opacity: matchAnimation,
                    transform: [
                      {
                        scale: matchAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.matchContainer}>
                  <Text style={styles.matchText}>It's a Match! 🎉</Text>
                  <Text style={styles.matchSubtext}>
                    You and {currentProfile.name} liked each other
                  </Text>
                </View>
              </Animated.View>
            )}
          </SafeAreaView>
        </LinearGradient>
      </View>
    </TouchableWithoutFeedback>
  );
}