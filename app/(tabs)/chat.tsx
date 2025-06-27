import GameContainer from '@/components/games/GameContainer';
import UserProfileView from '@/components/ui/UserProfileView';
import { useTheme } from '@/contexts/ThemeContext';
import { useFadeIn, useSlideUp } from '@/hooks/useAnimations';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Crown,
  Eye,
  Flame,
  Gamepad2,
  Send,
  Zap,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Helper functions
const scale = (size: number) => {
  return Math.round(screenWidth * size / 375);
};

const verticalScale = (size: number) => {
  return Math.round(screenHeight * size / 812);
};

// Types
type GameType = 'truth-or-dare' | 'never-have-i-ever' | 'would-you-rather' | 'rapid-fire' | 'emoji-story';
type Match = Database['public']['Tables']['matches']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

interface ChatMatch {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  last_message_time: string;
  last_message: string;
  game_streak: number;
  profile: Profile;
  unreadCount: number;
}

const AVAILABLE_GAMES = [
  {
    id: 'truth-or-dare',
    name: 'Truth or Dare',
    icon: Eye,
    color: '#9D4EDD',
    description: 'Reveal secrets or take dares',
  },
];

// Helper functions
const formatTime = (date: string | Date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const dismissKeyboard = () => {
  Keyboard.dismiss();
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online': return '#06FFA5';
    case 'offline': return '#6B7280';
    case 'away': return '#FFD60A';
    default: return '#6B7280';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'online': return 'Online';
    case 'offline': return 'Offline';
    case 'away': return 'Away';
    default: return 'Unknown';
  }
};

export default function ChatScreen() {
  const { theme } = useTheme();
  const [matches, setMatches] = useState<ChatMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<ChatMatch | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [viewingProfile, setViewingProfile] = useState(false);
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [currentGameState, setCurrentGameState] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Animation values
  const fadeAnim = useFadeIn(500);
  const slideAnim = useSlideUp(500);
  const messageInputAnim = useRef(new Animated.Value(0)).current;

  // Fetch matches
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get user's profile
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!userProfile) return;

        // Get all matches for the user
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select(`
            *,
            user1:user1_id(id, user_id, name, age, bio, photos, level),
            user2:user2_id(id, user_id, name, age, bio, photos, level)
          `)
          .or(`user1_id.eq.${userProfile.id},user2_id.eq.${userProfile.id}`)
          .eq('status', 'matched')
          .order('last_message_time', { ascending: false });

        if (matchesError) throw matchesError;

        // Transform matches data
        const transformedMatches: ChatMatch[] = matchesData.map(match => {
          const isUser1 = match.user1.id === userProfile.id;
          const otherUser = isUser1 ? match.user2 : match.user1;
          
          return {
            id: match.id,
            status: match.status,
            created_at: match.created_at,
            updated_at: match.updated_at,
            last_message_time: match.last_message_time,
            last_message: match.last_message,
            game_streak: match.game_streak,
            profile: otherUser,
            unreadCount: isUser1 ? match.user1_unread_count : match.user2_unread_count
          };
        });

        setMatches(transformedMatches);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setIsLoading(false);
      }
    };

    fetchMatches();

    // Subscribe to match updates
    const matchesSubscription = supabase
      .channel('matches_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'matches'
      }, () => {
        fetchMatches();
      })
      .subscribe();

    return () => {
      matchesSubscription.unsubscribe();
    };
  }, []);

  // Fetch messages when a match is selected
  useEffect(() => {
    if (!selectedMatch) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('match_id', selectedMatch.id)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;
        setMessages(messagesData || []);

        // Reset unread count
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: userProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (!userProfile) return;

        // Update unread count
        await supabase
          .from('matches')
          .update({
            user1_unread_count: userProfile.id === selectedMatch.profile.id ? 0 : undefined,
            user2_unread_count: userProfile.id !== selectedMatch.profile.id ? 0 : undefined
          })
          .eq('id', selectedMatch.id);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Subscribe to message updates
    const messagesSubscription = supabase
      .channel('messages_channel')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${selectedMatch.id}`
      }, (payload) => {
        setMessages(current => [...current, payload.new as Message]);
      })
      .subscribe();

    return () => {
      messagesSubscription.unsubscribe();
    };
  }, [selectedMatch]);

  // Early return if theme is not initialized
  if (!theme) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F23' }}>
        <ActivityIndicator size="large" color="#00C2FF" />
      </View>
    );
  }

  // Create styles with theme values
  const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0F0F23',
    },
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
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.default,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: scale(18),
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginLeft: scale(10),
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerButton: {
      marginLeft: scale(15),
    },
    headerBadge: {
      backgroundColor: theme.colors.background.card,
      paddingHorizontal: scale(10),
      paddingVertical: verticalScale(5),
      borderRadius: scale(15),
      marginLeft: scale(10),
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerBadgeText: {
      color: theme.colors.text.primary,
      fontSize: scale(12),
      marginLeft: scale(5),
    },
    headerSubtitle: {
      color: theme.colors.text.secondary,
      fontSize: scale(14),
      marginTop: verticalScale(5),
    },
    matchesList: {
      flex: 1,
      paddingHorizontal: scale(20),
    },
    matchesListContent: {
      paddingVertical: verticalScale(10),
    },
    matchItem: {
      marginBottom: verticalScale(10),
      borderRadius: scale(15),
      overflow: 'hidden',
    },
    matchItemGradient: {
      padding: scale(15),
    },
    matchAvatarContainer: {
      position: 'relative',
      marginRight: scale(10),
    },
    matchAvatar: {
      width: scale(50),
      height: scale(50),
      borderRadius: scale(25),
    },
    matchInfo: {
      flex: 1,
    },
    matchHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: verticalScale(5),
    },
    matchNameSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    matchName: {
      fontSize: scale(16),
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginRight: scale(10),
    },
    matchBadges: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    levelBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background.card,
      paddingHorizontal: scale(8),
      paddingVertical: verticalScale(4),
      borderRadius: scale(10),
      marginRight: scale(5),
    },
    levelText: {
      color: theme.colors.text.primary,
      fontSize: scale(12),
      marginLeft: scale(3),
    },
    statusBadge: {
      paddingHorizontal: scale(8),
      paddingVertical: verticalScale(4),
      borderRadius: scale(10),
    },
    statusText: {
      color: theme.colors.text.primary,
      fontSize: scale(12),
    },
    matchTime: {
      color: theme.colors.text.secondary,
      fontSize: scale(12),
    },
    matchFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    matchMessage: {
      color: theme.colors.text.secondary,
      fontSize: scale(14),
      flex: 1,
      marginRight: scale(10),
    },
    unreadBadge: {
      backgroundColor: theme.colors.button.primary.background[0],
      width: scale(20),
      height: scale(20),
      borderRadius: scale(10),
      alignItems: 'center',
      justifyContent: 'center',
    },
    unreadText: {
      color: theme.colors.text.primary,
      fontSize: scale(12),
      fontWeight: 'bold',
    },
    streakRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: verticalScale(5),
    },
    streakText: {
      color: theme.colors.text.secondary,
      fontSize: scale(12),
      marginLeft: scale(5),
    },
    messagesList: {
      flex: 1,
      paddingHorizontal: scale(20),
    },
    messagesListContent: {
      paddingVertical: verticalScale(10),
    },
    messageContainer: {
      marginBottom: verticalScale(10),
      maxWidth: '80%',
    },
    messageUser: {
      alignSelf: 'flex-end',
    },
    messageMatch: {
      alignSelf: 'flex-start',
    },
    messageBubble: {
      padding: scale(15),
      borderRadius: scale(20),
    },
    messageBubbleUser: {
      backgroundColor: theme.colors.button.primary.background[0],
    },
    messageBubbleMatch: {
      backgroundColor: theme.colors.background.card,
    },
    messageText: {
      color: theme.colors.text.primary,
      fontSize: scale(14),
    },
    messageTime: {
      color: theme.colors.text.secondary,
      fontSize: scale(10),
      marginTop: verticalScale(5),
      alignSelf: 'flex-end',
    },
    inputContainer: {
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(10),
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.default,
      backgroundColor: theme.colors.background.primary,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      backgroundColor: theme.colors.background.card,
      borderRadius: scale(25),
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(10),
      color: theme.colors.text.primary,
      marginRight: scale(10),
    },
    sendButton: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      backgroundColor: theme.colors.button.primary.background[0],
      alignItems: 'center',
      justifyContent: 'center',
    },
    gameButton: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      backgroundColor: theme.colors.background.card,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(10),
    },
    gameSelectorContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.background.primary,
      borderTopLeftRadius: scale(20),
      borderTopRightRadius: scale(20),
      padding: scale(20),
      borderTopWidth: 1,
      borderTopColor: theme.colors.border.default,
    },
    gameOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: scale(15),
      backgroundColor: theme.colors.background.card,
      borderRadius: scale(15),
      marginBottom: verticalScale(10),
    },
    gameOptionIcon: {
      width: scale(40),
      height: scale(40),
      borderRadius: scale(20),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: scale(15),
    },
    gameOptionInfo: {
      flex: 1,
    },
    gameOptionTitle: {
      fontSize: scale(16),
      fontWeight: 'bold',
      color: theme.colors.text.primary,
      marginBottom: verticalScale(5),
    },
    gameOptionDescription: {
      fontSize: scale(12),
      color: theme.colors.text.secondary,
    },
  });

  const sendMessage = async () => {
    if (!inputText.trim() || !selectedMatch) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!userProfile) return;

      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: selectedMatch.id,
          sender_id: userProfile.id,
          type: 'text',
          content: inputText.trim(),
        });

      if (error) throw error;

      setInputText('');
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendGameInvite = async (gameId: string, gameName: string) => {
    if (!selectedMatch) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!userProfile) return;

      const { error } = await supabase
        .from('messages')
        .insert({
          match_id: selectedMatch.id,
          sender_id: userProfile.id,
          type: 'game-invite',
          content: `Let's play ${gameName}!`,
          game_type: gameId,
          game_status: 'pending',
        });

      if (error) throw error;

      setShowGameSelector(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending game invite:', error);
    }
  };

  const handleJoinGame = (gameType: GameType, gameName: string) => {
    setCurrentGame(gameType);
    setShowGameSelector(false);
  };

  const handleBackFromGame = () => {
    setCurrentGame(null);
    setCurrentGameState(null);
  };

  const handleGameComplete = async (winner: 'player' | 'opponent') => {
    if (!selectedMatch) return;

    try {
      // Update game streak
      await supabase
        .from('matches')
        .update({
          game_streak: selectedMatch.game_streak + 1
        })
        .eq('id', selectedMatch.id);

      setCurrentGame(null);
      setCurrentGameState(null);
    } catch (error) {
      console.error('Error updating game streak:', error);
    }
  };

  const handleGameStateUpdate = (newState: any) => {
    setCurrentGameState(newState);
  };

  const handleViewProfile = () => {
    setViewingProfile(true);
  };

  // Render profile view
  if (viewingProfile && selectedMatch) {
    const userProfile = {
      id: selectedMatch.profile.id,
      name: selectedMatch.profile.name,
      age: selectedMatch.profile.age,
      bio: selectedMatch.profile.bio,
      images: selectedMatch.profile.photos,
      level: selectedMatch.profile.level,
      streak: selectedMatch.game_streak,
      tags: ["Gamer", "Competitive", "Strategic"],
      interests: ["Gaming", "Coffee", "Music", "Movies"],
      gamesWon: 42,
      location: "San Francisco, CA",
      distance: 5,
    };

    return (
      <UserProfileView
        profile={userProfile}
        onClose={() => setViewingProfile(false)}
        showButtons={false}
      />
    );
  }

  // Render game screens
  if (currentGame && selectedMatch) {
    return (
      <GameContainer
        currentGame={currentGame}
        onGameComplete={handleGameComplete}
        onBack={handleBackFromGame}
        initialState={currentGameState}
        onStateUpdate={handleGameStateUpdate}
      />
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C2FF" />
      </View>
    );
  }

  // Render matches list when no match is selected
  if (!selectedMatch) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.backgroundGradient}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Chats</Text>
                <View style={styles.headerBadge}>
                  <Flame size={16} color="#FF6B6B" />
                  <Text style={styles.headerBadgeText}>{matches.length} Active</Text>
                </View>
              </View>
              <Text style={styles.headerSubtitle}>Your matches and conversations</Text>
            </View>

            <ScrollView 
              style={styles.matchesList} 
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.matchesListContent}
              bounces={true}
              alwaysBounceVertical={true}
            >
              {matches.map((match) => (
                <TouchableOpacity
                  key={match.id}
                  style={styles.matchItem}
                  onPress={() => setSelectedMatch(match)}
                >
                  <LinearGradient
                    colors={['rgba(0, 245, 255, 0.1)', 'rgba(0, 128, 255, 0.05)']}
                    style={styles.matchItemGradient}
                  >
                    <View style={styles.matchAvatarContainer}>
                      <Image 
                        source={{ uri: match.profile.photos[0] }} 
                        style={styles.matchAvatar}
                      />
                    </View>
                    
                    <View style={styles.matchInfo}>
                      <View style={styles.matchHeader}>
                        <View style={styles.matchNameSection}>
                          <Text style={styles.matchName}>{match.profile.name}</Text>
                          <View style={styles.matchBadges}>
                            <View style={styles.levelBadge}>
                              <Crown size={10} color="#FFD700" />
                              <Text style={styles.levelText}>{match.profile.level}</Text>
                            </View>
                          </View>
                        </View>
                        <Text style={styles.matchTime}>
                          {formatTime(match.last_message_time)}
                        </Text>
                      </View>
                      
                      <View style={styles.matchFooter}>
                        <Text style={styles.matchMessage} numberOfLines={1}>
                          {match.last_message}
                        </Text>
                        
                        {match.unreadCount > 0 && (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{match.unreadCount}</Text>
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.streakRow}>
                        <Zap size={12} color="#FFD700" />
                        <Text style={styles.streakText}>
                          {match.game_streak} game streak
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  // Render chat view
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
        style={styles.backgroundGradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => setSelectedMatch(null)}>
                <ArrowLeft size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleViewProfile}>
                <Text style={styles.headerTitle}>{selectedMatch.profile.name}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.levelBadge}>
                <Crown size={12} color="#FFD700" />
                <Text style={styles.levelText}>{selectedMatch.profile.level}</Text>
              </View>
              <View style={styles.streakRow}>
                <Zap size={12} color="#FFD700" />
                <Text style={styles.streakText}>{selectedMatch.game_streak}</Text>
              </View>
            </View>
          </View>

          <KeyboardAvoidingView 
            style={{ flex: 1 }} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <TouchableWithoutFeedback onPress={dismissKeyboard}>
              <ScrollView
                ref={scrollViewRef}
                style={styles.messagesList}
                contentContainerStyle={styles.messagesListContent}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              >
                {messages.map((message) => (
                  <View
                    key={message.id}
                    style={[
                      styles.messageContainer,
                      message.sender_id === selectedMatch.profile.id
                        ? styles.messageMatch
                        : styles.messageUser,
                    ]}
                  >
                    <View
                      style={[
                        styles.messageBubble,
                        message.sender_id === selectedMatch.profile.id
                          ? styles.messageBubbleMatch
                          : styles.messageBubbleUser,
                      ]}
                    >
                      <Text style={styles.messageText}>{message.content}</Text>
                      <Text style={styles.messageTime}>
                        {formatTime(message.created_at)}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </TouchableWithoutFeedback>

            <View style={styles.inputContainer}>
              <View style={styles.inputRow}>
                <TouchableOpacity
                  style={styles.gameButton}
                  onPress={() => setShowGameSelector(true)}
                >
                  <Gamepad2 size={20} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  placeholderTextColor={theme.colors.text.secondary}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                  <Send size={20} color={theme.colors.text.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>

          {showGameSelector && (
            <Animated.View
              style={[
                styles.gameSelectorContainer,
                {
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [300, 0],
                      }),
                    },
                  ],
                  opacity: fadeAnim,
                },
              ]}
            >
              {AVAILABLE_GAMES.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={styles.gameOption}
                  onPress={() => sendGameInvite(game.id, game.name)}
                >
                  <View
                    style={[
                      styles.gameOptionIcon,
                      { backgroundColor: game.color },
                    ]}
                  >
                    <game.icon size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.gameOptionInfo}>
                    <Text style={styles.gameOptionTitle}>{game.name}</Text>
                    <Text style={styles.gameOptionDescription}>
                      {game.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}