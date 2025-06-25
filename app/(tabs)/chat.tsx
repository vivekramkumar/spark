import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Clock,
  Crown,
  Eye,
  Flame,
  Gamepad2,
  Heart,
  Play,
  Plus,
  Send,
  Smile,
  Target,
  Users,
  Zap
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
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
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import game components
import EmojiStoryGame from '@/components/games/EmojiStoryGame';
import NeverHaveIEverGame from '@/components/games/NeverHaveIEverGame';
import RapidFireGame from '@/components/games/RapidFireGame';
import TruthOrDareGame from '@/components/games/TruthOrDareGame';
import WouldYouRatherGame from '@/components/games/WouldYouRatherGame';
import UserProfileView from '@/components/UserProfileView';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'match';
  timestamp: Date;
  type: 'text' | 'game-invite' | 'system';
  gameType?: string;
  gameName?: string;
  gameStatus?: 'pending' | 'accepted' | 'declined' | 'active';
}

interface ChatMatch {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  level: number;
  streak: number;
  status: 'online' | 'offline' | 'in-game';
}

const SAMPLE_MATCHES: ChatMatch[] = [
  {
    id: '1',
    name: 'Luna',
    avatar: 'https://images.pexels.com/photos/1586973/pexels-photo-1586973.jpeg?auto=compress&cs=tinysrgb&w=800',
    lastMessage: 'Ready for another UNO battle? 🎮',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    unread: 2,
    level: 12,
    streak: 5,
    status: 'online',
  },
  {
    id: '2',
    name: 'Emma',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=800',
    lastMessage: 'That Truth or Dare game was intense! 😅',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unread: 0,
    level: 18,
    streak: 8,
    status: 'in-game',
  },
  {
    id: '3',
    name: 'Sophia',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=800',
    lastMessage: 'Hey! How was your day? ✨',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    unread: 1,
    level: 25,
    streak: 12,
    status: 'offline',
  },
];

const AVAILABLE_GAMES = [
  { 
    id: 'uno', 
    name: 'UNO Battle', 
    icon: Gamepad2, 
    color: '#FF6B6B', 
    description: 'Classic card game battle',
    players: '2 players',
    duration: '5-10 min'
  },
  { 
    id: 'truth-or-dare', 
    name: 'Truth or Dare', 
    icon: Eye, 
    color: '#9D4EDD', 
    description: 'Reveal secrets or take dares',
    players: '2 players',
    duration: '10-15 min'
  },
  { 
    id: 'never-have-i-ever', 
    name: 'Never Have I Ever', 
    icon: Flame, 
    color: '#F72585', 
    description: 'Share your experiences',
    players: '2 players',
    duration: '8-12 min'
  },
  { 
    id: 'would-you-rather', 
    name: 'Would You Rather', 
    icon: Target, 
    color: '#06FFA5', 
    description: 'Impossible choices',
    players: '2 players',
    duration: '5-8 min'
  },
  { 
    id: 'rapid-fire', 
    name: 'Rapid Fire Q&A', 
    icon: Zap, 
    color: '#FFD60A', 
    description: 'Quick questions, instant chemistry',
    players: '2 players',
    duration: '3-5 min'
  },
  { 
    id: 'emoji-story', 
    name: 'Emoji Story', 
    icon: Heart, 
    color: '#FF9F1C', 
    description: 'Create stories with emojis',
    players: '2 players',
    duration: '6-10 min'
  },
];

const SAMPLE_MESSAGES: Message[] = [
  {
    id: '1',
    text: "Hey! Great match earlier! ⚡",
    sender: 'match',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'text',
  },
  {
    id: '2',
    text: "Thanks! You're really good at UNO 😄",
    sender: 'user',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    type: 'text',
  },
  {
    id: '3',
    text: "Want to play another game? I'm thinking Truth or Dare this time 🔥",
    sender: 'match',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    type: 'text',
  },
  {
    id: '4',
    text: "Let's play Truth or Dare",
    sender: 'match',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    type: 'game-invite',
    gameType: 'truth-or-dare',
    gameName: 'Truth or Dare',
    gameStatus: 'pending',
  },
];

export default function ChatScreen() {
  const [selectedMatch, setSelectedMatch] = useState<ChatMatch | null>(null);
  const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewingProfile, setViewingProfile] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    if (showGameSelector) {
      setShowGameSelector(false);
    }
  };

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    setTimeout(() => {
      const responses = [
        "That's awesome! 🔥",
        "I totally agree! ⚡",
        "Interesting... tell me more! 🤔",
        "Same here! What's next? 🎮",
        "You're so funny! 😄",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'match',
        timestamp: new Date(),
        type: 'text',
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 1500);
  };

  const sendGameInvite = (gameId: string, gameName: string) => {
    const gameInvite: Message = {
      id: Date.now().toString(),
      text: `Let's play ${gameName}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'game-invite',
      gameType: gameId,
      gameName: gameName,
      gameStatus: 'pending',
    };

    setMessages(prev => [...prev, gameInvite]);
    setShowGameSelector(false);

    // Simulate acceptance
    setTimeout(() => {
      const acceptMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Game accepted! Let's play ${gameName}! 🎮`,
        sender: 'match',
        timestamp: new Date(),
        type: 'text',
      };
      
      setMessages(prev => [...prev, acceptMessage]);
    }, 2000);
  };

  const handleJoinGame = (gameType: string, gameName: string) => {
    // Update the game status to active
    setMessages(prev => prev.map(msg => 
      msg.type === 'game-invite' && msg.gameType === gameType 
        ? { ...msg, gameStatus: 'active' as const }
        : msg
    ));

    // Launch the actual game
    setCurrentGame(gameType);
  };

  const handleGameComplete = (winner: 'player' | 'opponent') => {
    // Return to chat
    setCurrentGame(null);
    
    // Add completion message
    const completionMessage: Message = {
      id: Date.now().toString(),
      text: `🎉 Game completed! ${winner === 'player' ? 'You won!' : `${selectedMatch?.name} won!`} Great game! 🎮`,
      sender: 'match',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, completionMessage]);
  };

  const handleBackFromGame = () => {
    setCurrentGame(null);
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#06FFA5';
      case 'in-game': return '#FFD60A';
      case 'offline': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'in-game': return 'In Game';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getGameData = (gameType: string) => {
    return AVAILABLE_GAMES.find(g => g.id === gameType) || AVAILABLE_GAMES[0];
  };
  
  // Function to view the user's profile
  const handleViewProfile = () => {
    if (selectedMatch) {
      setViewingProfile(true);
    }
  };

  // Render profile view
  if (viewingProfile && selectedMatch) {
    // Convert the ChatMatch to a profile format compatible with UserProfileView
    const userProfile = {
      id: selectedMatch.id,
      name: selectedMatch.name,
      age: 25, // Assuming age is not in the ChatMatch interface
      bio: "Gaming enthusiast and coffee lover. Let's battle it out in some games! 🎮☕",
      images: [selectedMatch.avatar, selectedMatch.avatar], // Using avatar as placeholder
      level: selectedMatch.level,
      streak: selectedMatch.streak,
      tags: ["Gamer", "Competitive", "Strategic"],
      interests: ["Gaming", "Coffee", "Music", "Movies"],
      gamesWon: 42, // Placeholder
      location: "San Francisco, CA", // Placeholder
      distance: 5, // Placeholder in km
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
    switch (currentGame) {
      case 'truth-or-dare':
        return (
          <TruthOrDareGame
            onGameComplete={handleGameComplete}
            onBack={handleBackFromGame}
          />
        );
      case 'never-have-i-ever':
        return (
          <NeverHaveIEverGame
            onGameComplete={handleGameComplete}
            onBack={handleBackFromGame}
          />
        );
      case 'would-you-rather':
        return (
          <WouldYouRatherGame
            onGameComplete={handleGameComplete}
            onBack={handleBackFromGame}
          />
        );
      case 'rapid-fire':
        return (
          <RapidFireGame
            onGameComplete={handleGameComplete}
            onBack={handleBackFromGame}
          />
        );
      case 'emoji-story':
        return (
          <EmojiStoryGame
            onGameComplete={handleGameComplete}
            onBack={handleBackFromGame}
          />
        );
      case 'uno':
        // For UNO, we'll show a simple placeholder since the full UNO game is complex
        return (
          <View style={styles.container}>
            <LinearGradient
              colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
              style={styles.backgroundGradient}
            >
              <SafeAreaView style={styles.safeArea}>
                <View style={styles.gameContainer}>
                  <View style={styles.gameHeader}>
                    <TouchableOpacity 
                      style={styles.backButton}
                      onPress={handleBackFromGame}
                    >
                      <ArrowLeft size={24} color="#00F5FF" />
                    </TouchableOpacity>
                    <Text style={styles.gameTitle}>UNO vs {selectedMatch.name}</Text>
                  </View>
                  
                  <View style={styles.unoGameContent}>
                    <Text style={styles.unoTitle}>🎮 UNO Battle Arena</Text>
                    <Text style={styles.unoSubtitle}>
                      Get ready for an epic card battle with {selectedMatch.name}!
                    </Text>
                    
                    <View style={styles.unoFeatures}>
                      <Text style={styles.unoFeature}>• Classic UNO rules</Text>
                      <Text style={styles.unoFeature}>• Real-time multiplayer</Text>
                      <Text style={styles.unoFeature}>• Special power cards</Text>
                      <Text style={styles.unoFeature}>• Victory celebrations</Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.startUnoButton}
                      onPress={() => handleGameComplete('player')}
                    >
                      <LinearGradient
                        colors={['#FF6B6B', '#FF8E8E']}
                        style={styles.startUnoButtonGradient}
                      >
                        <Gamepad2 size={24} color="#FFFFFF" />
                        <Text style={styles.startUnoButtonText}>Start UNO Battle</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </SafeAreaView>
            </LinearGradient>
          </View>
        );
      default:
        return null;
    }
  }

  if (!selectedMatch) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.backgroundGradient}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.header}>
              <View style={styles.headerTop}>
                <Text style={styles.headerTitle}>Chats</Text>
                <View style={styles.headerBadge}>
                  <Flame size={16} color="#FF6B6B" />
                  <Text style={styles.headerBadgeText}>{SAMPLE_MATCHES.length} Active</Text>
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
              {SAMPLE_MATCHES.map((match) => (
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
                      <Image source={{ uri: match.avatar }} style={styles.matchAvatar} />
                      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(match.status) }]} />
                    </View>
                    
                    <View style={styles.matchInfo}>
                      <View style={styles.matchHeader}>
                        <View style={styles.matchNameSection}>
                          <Text style={styles.matchName}>{match.name}</Text>
                          <View style={styles.matchBadges}>
                            <View style={styles.levelBadge}>
                              <Crown size={10} color="#FFD700" />
                              <Text style={styles.levelText}>{match.level}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(match.status) }]}>
                              <Text style={styles.statusText}>{getStatusText(match.status)}</Text>
                            </View>
                          </View>
                        </View>
                        <Text style={styles.matchTime}>{formatTime(match.timestamp)}</Text>
                      </View>
                      
                      <View style={styles.matchFooter}>
                        <Text style={styles.matchMessage} numberOfLines={1}>
                          {match.lastMessage}
                        </Text>
                        
                        {match.unread > 0 && (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{match.unread}</Text>
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.streakRow}>
                        <Zap size={12} color="#FFD700" />
                        <Text style={styles.streakText}>
                          {match.streak} game streak
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

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard} accessible={false}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.backgroundGradient}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView 
              style={styles.chatContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
              <View style={styles.chatHeader}>
                <TouchableOpacity 
                  onPress={() => setSelectedMatch(null)}
                  style={styles.backButton}
                >
                  <ArrowLeft size={24} color="#00F5FF" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.chatHeaderInfo}
                  onPress={handleViewProfile}
                >
                  <Text style={styles.chatHeaderTitle}>{selectedMatch.name}</Text>
                  <View style={styles.chatHeaderBadges}>
                    <View style={styles.chatLevelBadge}>
                      <Crown size={12} color="#FFD700" />
                      <Text style={styles.chatLevelText}>LVL {selectedMatch.level}</Text>
                    </View>
                    <View style={[styles.chatStatusBadge, { backgroundColor: getStatusColor(selectedMatch.status) }]}>
                      <Text style={styles.chatStatusText}>{getStatusText(selectedMatch.status)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.chatHeaderRight}
                  onPress={handleViewProfile}
                >
                  <Image source={{ uri: selectedMatch.avatar }} style={styles.chatAvatar} />
                </TouchableOpacity>
              </View>

              <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={true}
                bounces={true}
                alwaysBounceVertical={true}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              >
                {messages.map((message) => (
                  <View
                    key={message.id}
                    style={[
                      styles.messageContainer,
                      message.type === 'game-invite' ? styles.gameInviteContainer : (
                        message.sender === "user" ? styles.userMessage : styles.matchMessageBubble
                      ),
                    ]}
                  >
                    {message.type === 'game-invite' && (
                      <View style={styles.gameInviteWrapper}>
                        <LinearGradient
                          colors={['rgba(15, 15, 35, 0.95)', 'rgba(31, 31, 58, 0.9)']}
                          style={styles.gameInviteCard}
                        >
                          <View style={styles.gameInviteContent}>
                            {/* Game Icon and Header */}
                            <View style={styles.gameInviteHeader}>
                              <View style={styles.gameIconWrapper}>
                                <LinearGradient
                                  colors={[getGameData(message.gameType!).color, `${getGameData(message.gameType!).color}DD`]}
                                  style={styles.gameIconContainer}
                                >
                                  {React.createElement(getGameData(message.gameType!).icon, {
                                    size: Math.min(screenWidth * 0.08, 32),
                                    color: '#FFFFFF'
                                  })}
                                </LinearGradient>
                              </View>
                              
                              <View style={styles.gameInviteInfo}>
                                <Text style={styles.gameInviteTitle}>{message.gameName}</Text>
                                <Text style={styles.gameInviteDescription}>
                                  {getGameData(message.gameType!).description}
                                </Text>
                                
                                <View style={styles.gameMetaInfo}>
                                  <View style={styles.gameMetaItem}>
                                    <Users size={Math.min(screenWidth * 0.035, 14)} color="#9CA3AF" />
                                    <Text style={styles.gameMetaText}>
                                      {getGameData(message.gameType!).players}
                                    </Text>
                                  </View>
                                  <View style={styles.gameMetaItem}>
                                    <Clock size={Math.min(screenWidth * 0.035, 14)} color="#9CA3AF" />
                                    <Text style={styles.gameMetaText}>
                                      {getGameData(message.gameType!).duration}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                            
                            {/* Game Status and Actions */}
                            <View style={styles.gameInviteActions}>
                              <View style={styles.gameInviteStatus}>
                                <Text style={styles.gameInviteFrom}>
                                  {message.sender === 'user' ? 'You invited' : `${selectedMatch.name} invited you`}
                                </Text>
                                <Text style={styles.gameInviteTime}>
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                              </View>
                              
                              {message.gameStatus === 'pending' && (
                                <TouchableOpacity
                                  style={styles.joinGameButton}
                                  onPress={() => handleJoinGame(message.gameType!, message.gameName!)}
                                  activeOpacity={0.8}
                                >
                                  <LinearGradient
                                    colors={['#00F5FF', '#0080FF']}
                                    style={styles.joinGameButtonGradient}
                                  >
                                    <Play size={Math.min(screenWidth * 0.045, 18)} color="#FFFFFF" />
                                    <Text style={styles.joinGameButtonText}>Join Game</Text>
                                  </LinearGradient>
                                </TouchableOpacity>
                              )}
                              
                              {message.gameStatus === 'active' && (
                                <View style={styles.gameActiveStatus}>
                                  <LinearGradient
                                    colors={['rgba(6, 255, 165, 0.2)', 'rgba(0, 212, 170, 0.1)']}
                                    style={styles.gameActiveGradient}
                                  >
                                    <View style={styles.gameActiveIndicator}>
                                      <View style={styles.gameActiveDot} />
                                      <Text style={styles.gameActiveText}>Game Completed</Text>
                                    </View>
                                  </LinearGradient>
                                </View>
                              )}
                            </View>
                          </View>
                        </LinearGradient>
                      </View>
                    )}
                    
                    {message.type === 'text' && (
                      <>
                        <Text style={[
                          styles.messageText,
                          message.sender === 'user' ? styles.userMessageText : styles.matchMessageText,
                        ]}>
                          {message.text}
                        </Text>
                        <Text style={[
                          styles.messageTime,
                          message.sender === 'user' ? styles.userMessageTime : styles.matchMessageTime,
                        ]}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </>
                    )}
                  </View>
                ))}
              </ScrollView>

              {showGameSelector && (
                <View style={styles.gameSelectorContainer}>
                  <LinearGradient
                    colors={['rgba(31, 31, 58, 0.95)', 'rgba(45, 27, 105, 0.95)']}
                    style={styles.gameSelectorGradient}
                  >
                    <View style={styles.gameSelectorHeader}>
                      <Text style={styles.gameSelectorTitle}>Choose a Game</Text>
                      <TouchableOpacity onPress={() => setShowGameSelector(false)}>
                        <Text style={styles.gameSelectorClose}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.gamesScrollContent}
                    >
                      <View style={styles.gamesRow}>
                        {AVAILABLE_GAMES.map((game) => (
                          <TouchableOpacity
                            key={game.id}
                            style={styles.gameOption}
                            onPress={() => sendGameInvite(game.id, game.name)}
                          >
                            <LinearGradient
                              colors={[`${game.color}20`, `${game.color}10`]}
                              style={styles.gameOptionGradient}
                            >
                              {React.createElement(game.icon, {
                                size: Math.min(screenWidth * 0.06, 24),
                                color: game.color
                              })}
                              <Text style={styles.gameOptionText}>{game.name}</Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </ScrollView>
                  </LinearGradient>
                </View>
              )}

              <View style={styles.inputContainer}>
                <LinearGradient
                  colors={['rgba(31, 31, 58, 0.95)', 'rgba(45, 27, 105, 0.95)']}
                  style={styles.inputGradient}
                >
                  <View style={styles.inputRow}>
                    <TouchableOpacity style={styles.inputButton}>
                      <Smile size={Math.min(screenWidth * 0.06, 24)} color="#00F5FF" />
                    </TouchableOpacity>
                    
                    <TextInput
                      style={styles.textInput}
                      value={inputText}
                      onChangeText={setInputText}
                      placeholder="Type a message..."
                      placeholderTextColor="rgba(156, 163, 175, 0.7)"
                      multiline
                      returnKeyType="send"
                      onSubmitEditing={() => {
                        if (inputText.trim()) {
                          sendMessage();
                        }
                      }}
                      onFocus={() => {
                        setTimeout(() => {
                          scrollViewRef.current?.scrollToEnd({ animated: true });
                        }, 100);
                      }}
                    />
                    
                    <TouchableOpacity 
                      style={styles.inputButton}
                      onPress={() => setShowGameSelector(!showGameSelector)}
                    >
                      <Plus size={Math.min(screenWidth * 0.06, 24)} color="#00F5FF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
                      onPress={sendMessage}
                    >
                      <LinearGradient
                        colors={inputText.trim() ? ['#00F5FF', '#0080FF'] : ['#374151', '#4B5563']}
                        style={styles.sendButtonGradient}
                      >
                        <Send size={Math.min(screenWidth * 0.05, 20)} color="#FFFFFF" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            </KeyboardAvoidingView>
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
    paddingHorizontal: screenWidth * 0.05,
    paddingTop: screenHeight * 0.02,
    paddingBottom: screenHeight * 0.025,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: Math.min(screenWidth * 0.08, 32),
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
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  headerBadgeText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Bold',
    color: '#FF6B6B',
    marginLeft: 4,
  },
  headerSubtitle: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  matchesList: {
    flex: 1,
    width: '100%',
  },
  matchesListContent: {
    paddingTop: 10,
    paddingBottom: 20,
    flexGrow: 1,
  },
  matchItem: {
    marginHorizontal: screenWidth * 0.05,
    marginBottom: screenHeight * 0.02,
    borderRadius: 16,
    overflow: 'hidden',
  },
  matchItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: screenWidth * 0.04,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  matchAvatarContainer: {
    position: 'relative',
    marginRight: screenWidth * 0.04,
  },
  matchAvatar: {
    width: screenWidth * 0.14,
    height: screenWidth * 0.14,
    borderRadius: screenWidth * 0.07,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: screenWidth * 0.03,
    height: screenWidth * 0.03,
    borderRadius: screenWidth * 0.015,
    borderWidth: 2,
    borderColor: '#0F0F23',
  },
  matchInfo: {
    flex: 1,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  matchNameSection: {
    flex: 1,
  },
  matchName: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  matchBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  levelText: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginLeft: 2,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
  matchTime: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchMessage: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#00F5FF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#FFD700',
    marginLeft: 4,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.05,
    paddingVertical: screenHeight * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: screenHeight * 0.1,
  },
  backButton: {
    marginRight: screenWidth * 0.04,
    padding: 8,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderTitle: {
    fontSize: Math.min(screenWidth * 0.05, 20),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  chatHeaderBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  chatLevelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  chatLevelText: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginLeft: 4,
  },
  chatStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chatStatusText: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
  chatHeaderRight: {
    marginLeft: screenWidth * 0.04,
  },
  chatAvatar: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: screenWidth * 0.05,
  },
  messagesContainer: {
    flex: 1,
    width: '100%',
  },
  messagesContent: {
    paddingTop: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: screenHeight * 0.02,
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0, 245, 255, 0.2)',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.015,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  matchMessageBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(31, 31, 58, 0.8)',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.015,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gameInviteContainer: {
    alignSelf: 'center',
    width: '95%',
    marginVertical: screenHeight * 0.01,
  },
  gameInviteWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    width: '100%',
  },
  gameInviteCard: {
    borderWidth: 2,
    borderColor: 'rgba(0, 245, 255, 0.3)',
    width: '100%',
  },
  gameInviteContent: {
    padding: screenWidth * 0.05,
    width: '100%',
  },
  gameInviteHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: screenHeight * 0.02,
    maxWidth: '100%',
  },
  gameIconWrapper: {
    marginRight: screenWidth * 0.04,
    flexShrink: 0,
  },
  gameIconContainer: {
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    flexShrink: 0,
  },
  gameInviteInfo: {
    flex: 1,
    minWidth: 0,
  },
  gameInviteTitle: {
    fontSize: Math.min(screenWidth * 0.055, 22),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  gameInviteDescription: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: screenHeight * 0.015,
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  gameMetaInfo: {
    flexDirection: 'row',
    gap: screenWidth * 0.04,
    flexWrap: 'wrap',
  },
  gameMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  gameMetaText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  gameInviteActions: {
    gap: screenHeight * 0.015,
    maxWidth: '100%',
  },
  gameInviteStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  gameInviteFrom: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
    flex: 1,
  },
  gameInviteTime: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.6)',
    flexShrink: 0,
  },
  joinGameButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  joinGameButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.02,
    paddingHorizontal: screenWidth * 0.06,
    gap: 8,
  },
  joinGameButtonText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  gameActiveStatus: {
    borderRadius: 12,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  gameActiveGradient: {
    paddingVertical: screenHeight * 0.015,
    paddingHorizontal: screenWidth * 0.04,
    borderWidth: 1,
    borderColor: 'rgba(6, 255, 165, 0.3)',
    maxWidth: '100%',
  },
  gameActiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  gameActiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#06FFA5',
    flexShrink: 0,
  },
  gameActiveText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Bold',
    color: '#06FFA5',
  },
  messageText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  matchMessageText: {
    color: '#E5E7EB',
  },
  messageTime: {
    fontSize: Math.min(screenWidth * 0.0275, 11),
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  matchMessageTime: {
    color: 'rgba(229, 231, 235, 0.7)',
  },
  gameSelectorContainer: {
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.015,
    maxHeight: screenHeight * 0.3,
    zIndex: 10,
    position: 'absolute',
    bottom: screenHeight * 0.08,
    left: 0,
    right: 0,
  },
  gameSelectorGradient: {
    borderRadius: 16,
    padding: screenWidth * 0.04,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.2)',
  },
  gameSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenHeight * 0.015,
  },
  gameSelectorTitle: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  gameSelectorClose: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    color: '#9CA3AF',
  },
  gamesScrollContent: {
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  gamesRow: {
    flexDirection: 'row',
    gap: screenWidth * 0.03,
    flexWrap: 'nowrap',
  },
  gameOption: {
    borderRadius: 12,
    overflow: 'hidden',
    width: screenWidth * 0.3,
    minWidth: 100,
  },
  gameOptionGradient: {
    padding: screenWidth * 0.03,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 80,
    justifyContent: 'center',
  },
  gameOptionText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },
  inputContainer: {
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.015,
    paddingBottom: Math.max(screenHeight * 0.015, 12),
  },
  inputGradient: {
    borderRadius: 25,
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.015,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.2)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputButton: {
    padding: screenWidth * 0.02,
    marginHorizontal: screenWidth * 0.01,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(31, 31, 58, 0.5)',
    borderRadius: 20,
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.015,
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Regular',
    maxHeight: screenHeight * 0.12,
    marginHorizontal: screenWidth * 0.02,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: screenWidth * 0.01,
  },
  sendButtonGradient: {
    padding: screenWidth * 0.03,
  },
  sendButtonActive: {},
  gameContainer: {
    flex: 1,
    padding: screenWidth * 0.05,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: screenHeight * 0.04,
    paddingTop: screenHeight * 0.02,
  },
  gameTitle: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: screenWidth * 0.04,
  },
  unoGameContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: screenWidth * 0.05,
  },
  unoTitle: {
    fontSize: Math.min(screenWidth * 0.09, 36),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: screenHeight * 0.02,
  },
  unoSubtitle: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: screenHeight * 0.05,
  },
  unoFeatures: {
    alignItems: 'flex-start',
    marginBottom: screenHeight * 0.05,
  },
  unoFeature: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    marginBottom: screenHeight * 0.01,
  },
  startUnoButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  startUnoButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.08,
    paddingVertical: screenHeight * 0.02,
    gap: 8,
  },
  startUnoButtonText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});