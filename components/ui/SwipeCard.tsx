import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { scale, verticalScale } from '../../hooks/useResponsiveDesign';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

export interface ProfileData {
  id: string;
  name: string;
  age: number;
  bio: string;
  images: string[];
  distance?: number;
  location?: string;
  tags?: string[];
}

interface SwipeCardProps {
  profile: ProfileData;
  onSwipeLeft: (profile: ProfileData) => void;
  onSwipeRight: (profile: ProfileData) => void;
  onSwipeUp?: (profile: ProfileData) => void;
  onCardPress?: (profile: ProfileData) => void;
  index: number;
  totalCards: number;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onCardPress,
  index,
  totalCards,
}) => {
  const { theme } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;
  const scrollEnabled = useRef(true);

  // Early return if profile is undefined
  if (!profile) {
    console.warn('SwipeCard: profile is undefined');
    return null;
  }

  // Create styles with theme values
  const styles = StyleSheet.create({
    card: {
      position: 'absolute',
      width: SCREEN_WIDTH * 0.9,
      height: SCREEN_HEIGHT * 0.7,
      overflow: 'hidden',
      backgroundColor: theme.colors.background.card,
      borderRadius: scale(20),
    },
    cardTouchable: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    imageContainer: {
      height: SCREEN_HEIGHT * 0.4, // Reduced height for image
      width: '100%',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    profileInfo: {
      padding: scale(20),
      paddingBottom: verticalScale(20),
    },
    name: {
      color: theme.colors.text.primary,
      fontSize: scale(24),
      fontWeight: 'bold',
      marginBottom: verticalScale(4),
    },
    location: {
      color: theme.colors.text.primary,
      fontSize: scale(16),
      marginBottom: verticalScale(2),
    },
    distance: {
      color: theme.colors.text.secondary,
      fontSize: scale(14),
      marginBottom: verticalScale(8),
    },
    bio: {
      color: theme.colors.text.secondary,
      fontSize: scale(14),
      marginBottom: verticalScale(10),
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: verticalScale(8),
    },
    tag: {
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(5),
      borderRadius: scale(20),
      marginRight: scale(8),
      marginBottom: verticalScale(8),
      backgroundColor: theme.colors.background.secondary,
    },
    tagText: {
      color: theme.colors.text.primary,
      fontSize: scale(12),
    },
    paginationContainer: {
      position: 'absolute',
      top: verticalScale(16),
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      zIndex: 1,
    },
    paginationDot: {
      width: scale(8),
      height: scale(8),
      borderRadius: scale(4),
      marginHorizontal: scale(3),
    },
    imageNavigation: {
      position: 'absolute',
      top: 0,
      height: SCREEN_HEIGHT * 0.4,
      left: 0,
      right: 0,
      flexDirection: 'row',
    },
    imageNavButton: {
      flex: 1,
      height: '100%',
    },
    navArea: {
      width: '100%',
      height: '100%',
    },
    swipeIndicator: {
      position: 'absolute',
      top: verticalScale(50),
      padding: scale(10),
      borderWidth: scale(2),
      borderRadius: scale(10),
      transform: [{ rotate: '-30deg' }],
    },
    likeIndicator: {
      right: scale(20),
      borderColor: theme.colors.button.success.background[0],
    },
    nopeIndicator: {
      left: scale(20),
      borderColor: theme.colors.button.error.background[0],
    },
    swipeIndicatorText: {
      fontSize: scale(24),
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      textShadowColor: theme.colors.background.secondary,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 5,
    },
  });

  // Animation interpolations
  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });
  
  const likeOpacity = position.x.interpolate({
    inputRange: [0, SCREEN_WIDTH * 0.25],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const nopeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 0.25, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  const superLikeOpacity = position.y.interpolate({
    inputRange: [-SCREEN_HEIGHT * 0.15, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  // Scale for the next card
  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: [1, 0.9, 1],
    extrapolate: 'clamp',
  });

  // Opacity for the current card
  const cardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
    outputRange: [0.5, 1, 0.5],
    extrapolate: 'clamp',
  });
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // Only handle horizontal gestures
        const dx = Math.abs(gestureState.dx);
        const dy = Math.abs(gestureState.dy);
        return dx > dy;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only handle horizontal gestures
        const dx = Math.abs(gestureState.dx);
        const dy = Math.abs(gestureState.dy);
        return dx > dy;
      },
      onPanResponderGrant: () => {
        scrollEnabled.current = false;
      },
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
      },
      onPanResponderRelease: (event, gesture) => {
        scrollEnabled.current = true;
        if (gesture.dx > SWIPE_THRESHOLD) {
          forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          forceSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const forceSwipe = (direction: 'left' | 'right' | 'up') => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : direction === 'left' ? -SCREEN_WIDTH * 1.5 : 0;
    const y = direction === 'up' ? -SCREEN_HEIGHT * 1.5 : 0;
    
    Animated.timing(position, {
      toValue: { x, y },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true,
    }).start(() => {
      onSwipeComplete(direction);
    });
  };

  const onSwipeComplete = (direction: 'left' | 'right' | 'up') => {
    if (direction === 'right') {
      onSwipeRight(profile);
    } else if (direction === 'left') {
      onSwipeLeft(profile);
    } else if (direction === 'up' && onSwipeUp) {
      onSwipeUp(profile);
    }
    
    position.setValue({ x: 0, y: 0 });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleNextImage = () => {
    if (currentImageIndex < profile.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-30deg', '0deg', '30deg'],
      extrapolate: 'clamp',
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }, ...position.getTranslateTransform()],
      opacity: cardOpacity,
      zIndex: totalCards - index,
    };
  };

  const renderCard = () => {
    const cardStyle = getCardStyle();

    return (
      <Animated.View style={[styles.card, cardStyle]} {...panResponder.panHandlers}>
        <ScrollView 
          style={styles.scrollView}
          scrollEnabled={scrollEnabled.current}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: profile.images[currentImageIndex] }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.paginationContainer}>
              {profile.images.map((_: string, i: number) => (
                <View
                  key={i}
                  style={[
                    styles.paginationDot,
                    {
                      backgroundColor:
                        i === currentImageIndex
                          ? theme.colors.text.primary
                          : theme.colors.text.secondary + '80',
                    },
                  ]}
                />
              ))}
            </View>
            <View style={styles.imageNavigation}>
              <TouchableOpacity
                style={styles.imageNavButton}
                onPress={handlePrevImage}
              >
                <View style={styles.navArea} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imageNavButton}
                onPress={handleNextImage}
              >
                <View style={styles.navArea} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.name}>{profile.name}, {profile.age}</Text>
            {profile.location && (
              <Text style={styles.location}>{profile.location}</Text>
            )}
            {profile.distance !== undefined && (
              <Text style={styles.distance}>{profile.distance} km away</Text>
            )}
            <Text style={styles.bio}>{profile.bio}</Text>
            {profile.tags && profile.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {profile.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  return renderCard();
};

export default SwipeCard; 