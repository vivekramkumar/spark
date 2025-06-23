import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Gamepad2, 
  Zap, 
  Clock, 
  Trophy, 
  Target, 
  Heart, 
  Eye, 
  Flame,
  Crown,
  Star,
  Shield,
  ArrowLeft
} from 'lucide-react-native';

// Import game components
import TruthOrDareGame from '@/components/games/TruthOrDareGame';
import NeverHaveIEverGame from '@/components/games/NeverHaveIEverGame';
import WouldYouRatherGame from '@/components/games/WouldYouRatherGame';
import RapidFireGame from '@/components/games/RapidFireGame';
import EmojiStoryGame from '@/components/games/EmojiStoryGame';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Game types
interface Game {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  players: string;
  duration: string;
  category: 'Card' | 'Truth' | 'Dare' | 'Strategy';
}

const AVAILABLE_GAMES: Game[] = [
  {
    id: 'uno',
    name: 'UNO Battle',
    description: 'Classic card game with a competitive twist',
    icon: Gamepad2,
    color: ['#FF6B6B', '#FF8E8E'],
    difficulty: 'Medium',
    players: '2',
    duration: '5-10 min',
    category: 'Card',
  },
  {
    id: 'truth-or-dare',
    name: 'Truth Session',
    description: 'Share honest answers to deep questions',
    icon: Eye,
    color: ['#9D4EDD', '#C77DFF'],
    difficulty: 'Hard',
    players: '2',
    duration: '10-15 min',
    category: 'Truth',
  },
  {
    id: 'never-have-i-ever',
    name: 'Never Have I Ever',
    description: 'Discover each other\'s wild experiences',
    icon: Flame,
    color: ['#F72585', '#FF006E'],
    difficulty: 'Medium',
    players: '2',
    duration: '8-12 min',
    category: 'Truth',
  },
  {
    id: 'would-you-rather',
    name: 'Would You Rather',
    description: 'Impossible choices that reveal personality',
    icon: Target,
    color: ['#06FFA5', '#00D4AA'],
    difficulty: 'Easy',
    players: '2',
    duration: '5-8 min',
    category: 'Strategy',
  },
  {
    id: 'rapid-fire',
    name: 'Rapid Fire Q&A',
    description: 'Quick questions for instant chemistry check',
    icon: Zap,
    color: ['#FFD60A', '#FFC300'],
    difficulty: 'Easy',
    players: '2',
    duration: '3-5 min',
    category: 'Strategy',
  },
  {
    id: 'emoji-story',
    name: 'Emoji Story',
    description: 'Create stories using only emojis',
    icon: Heart,
    color: ['#FF9F1C', '#FFBF69'],
    difficulty: 'Medium',
    players: '2',
    duration: '6-10 min',
    category: 'Dare',
  },
];

// UNO Card types (keeping existing UNO logic)
type CardColor = 'red' | 'blue' | 'green' | 'yellow' | 'wild';
type CardValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'skip' | 'reverse' | 'draw2' | 'wild' | 'wild4';

interface UnoCard {
  id: string;
  color: CardColor;
  value: CardValue;
}

interface GameState {
  playerHand: UnoCard[];
  opponentHand: UnoCard[];
  currentCard: UnoCard;
  currentPlayer: 'player' | 'opponent';
  direction: 1 | -1;
  gamePhase: 'waiting' | 'playing' | 'finished';
  winner?: 'player' | 'opponent';
}

const CARD_COLORS = {
  red: '#FF6B6B',
  blue: '#4ECDC4',
  green: '#45B7D1',
  yellow: '#FFA726',
  wild: '#6C5CE7',
};

const generateCard = (color: CardColor, value: CardValue): UnoCard => ({
  id: `${color}-${value}-${Math.random()}`,
  color,
  value,
});

const generateDeck = (): UnoCard[] => {
  const deck: UnoCard[] = [];
  const colors: CardColor[] = ['red', 'blue', 'green', 'yellow'];
  
  colors.forEach(color => {
    for (let i = 0; i <= 9; i++) {
      deck.push(generateCard(color, i as CardValue));
      if (i !== 0) deck.push(generateCard(color, i as CardValue));
    }
    
    ['skip', 'reverse', 'draw2'].forEach(action => {
      deck.push(generateCard(color, action as CardValue));
      deck.push(generateCard(color, action as CardValue));
    });
  });
  
  for (let i = 0; i < 4; i++) {
    deck.push(generateCard('wild', 'wild'));
    deck.push(generateCard('wild', 'wild4'));
  }
  
  return deck.sort(() => Math.random() - 0.5);
};

const initializeGame = (): GameState => {
  const deck = generateDeck();
  const playerHand = deck.slice(0, 7);
  const opponentHand = deck.slice(7, 14);
  const currentCard = deck[14];
  
  return {
    playerHand,
    opponentHand,
    currentCard,
    currentPlayer: 'player',
    direction: 1,
    gamePhase: 'playing',
  };
};

export default function GamesScreen() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);

  const startGame = (gameId: string) => {
    setSelectedGame(gameId);
    if (gameId === 'uno') {
      setGameState(initializeGame());
    }
  };

  const handleGameComplete = (winner: 'player' | 'opponent') => {
    // Reset game state and return to game selection
    setSelectedGame(null);
    setGameState(null);
    setSelectedCard(null);
    setIsProcessingTurn(false);
    
    // Show completion message
    Alert.alert(
      'Game Complete!',
      `${winner === 'player' ? 'You won!' : 'Luna won!'} Chat is now unlocked!`,
      [{ text: 'Continue', onPress: () => {} }]
    );
  };

  const canPlayCard = (card: UnoCard): boolean => {
    if (!gameState) return false;
    const { currentCard } = gameState;
    
    return (
      card.color === 'wild' ||
      card.color === currentCard.color ||
      card.value === currentCard.value
    );
  };

  const playCard = (card: UnoCard) => {
    if (!gameState || !canPlayCard(card) || gameState.currentPlayer !== 'player' || isProcessingTurn) return;

    setIsProcessingTurn(true);
    const newPlayerHand = gameState.playerHand.filter(c => c.id !== card.id);
    
    let newCurrentPlayer: 'player' | 'opponent' = 'opponent';
    let newDirection = gameState.direction;
    
    if (card.value === 'skip') {
      newCurrentPlayer = 'player';
    } else if (card.value === 'reverse') {
      newDirection = gameState.direction * -1;
      newCurrentPlayer = 'player';
    } else if (card.value === 'draw2') {
      newCurrentPlayer = 'player';
    }

    const newGameState: GameState = {
      ...gameState,
      playerHand: newPlayerHand,
      currentCard: card,
      currentPlayer: newCurrentPlayer,
      direction: newDirection,
      gamePhase: newPlayerHand.length === 0 ? 'finished' : 'playing',
      winner: newPlayerHand.length === 0 ? 'player' : undefined,
    };

    setGameState(newGameState);
    setSelectedCard(null);

    if (newCurrentPlayer === 'opponent' && newGameState.gamePhase === 'playing') {
      setTimeout(() => simulateOpponentTurn(newGameState), 1500);
    } else {
      setIsProcessingTurn(false);
    }
  };

  const simulateOpponentTurn = (currentState: GameState) => {
    const playableCards = currentState.opponentHand.filter(canPlayCard);
    
    if (playableCards.length > 0) {
      const randomCard = playableCards[Math.floor(Math.random() * playableCards.length)];
      const newOpponentHand = currentState.opponentHand.filter(c => c.id !== randomCard.id);
      
      setGameState({
        ...currentState,
        opponentHand: newOpponentHand,
        currentCard: randomCard,
        currentPlayer: 'player',
        gamePhase: newOpponentHand.length === 0 ? 'finished' : 'playing',
        winner: newOpponentHand.length === 0 ? 'opponent' : undefined,
      });
    } else {
      const newCard = generateCard('red', 1);
      setGameState({
        ...currentState,
        opponentHand: [...currentState.opponentHand, newCard],
        currentPlayer: 'player',
      });
    }
    setIsProcessingTurn(false);
  };

  const renderCard = (card: UnoCard, isPlayable: boolean = false, onPress?: () => void) => (
    <TouchableOpacity
      key={card.id}
      style={[
        styles.card,
        { backgroundColor: CARD_COLORS[card.color] },
        selectedCard === card.id && styles.selectedCard,
        !isPlayable && styles.disabledCard,
      ]}
      onPress={onPress}
      disabled={!isPlayable || isProcessingTurn}
    >
      <Text style={styles.cardText}>
        {typeof card.value === 'number' ? card.value : card.value.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#06FFA5';
      case 'Medium': return '#FFD60A';
      case 'Hard': return '#FF006E';
      default: return '#9CA3AF';
    }
  };

  // Render specific game components
  if (selectedGame === 'truth-or-dare') {
    return (
      <TruthOrDareGame
        onGameComplete={handleGameComplete}
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  if (selectedGame === 'never-have-i-ever') {
    return (
      <NeverHaveIEverGame
        onGameComplete={handleGameComplete}
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  if (selectedGame === 'would-you-rather') {
    return (
      <WouldYouRatherGame
        onGameComplete={handleGameComplete}
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  if (selectedGame === 'rapid-fire') {
    return (
      <RapidFireGame
        onGameComplete={handleGameComplete}
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  if (selectedGame === 'emoji-story') {
    return (
      <EmojiStoryGame
        onGameComplete={handleGameComplete}
        onBack={() => setSelectedGame(null)}
      />
    );
  }

  // Game selection screen
  if (!selectedGame) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.backgroundGradient}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <View style={styles.header}>
                <View style={styles.headerTop}>
                  <Text style={styles.headerTitle}>Game Arena</Text>
                  <View style={styles.headerBadge}>
                    <Crown size={Math.min(screenWidth * 0.04, 16)} color="#FFD700" />
                    <Text style={styles.headerBadgeText}>Pro Player</Text>
                  </View>
                </View>
                <Text style={styles.headerSubtitle}>Choose your battleground</Text>
              </View>

              <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Your Battle Stats</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <LinearGradient
                      colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 193, 7, 0.1)']}
                      style={styles.statCardGradient}
                    >
                      <Trophy size={Math.min(screenWidth * 0.06, 24)} color="#FFD700" />
                      <Text style={styles.statNumber}>47</Text>
                      <Text style={styles.statLabel}>Victories</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.statCard}>
                    <LinearGradient
                      colors={['rgba(0, 245, 255, 0.1)', 'rgba(0, 128, 255, 0.1)']}
                      style={styles.statCardGradient}
                    >
                      <Zap size={Math.min(screenWidth * 0.06, 24)} color="#00F5FF" />
                      <Text style={styles.statNumber}>89%</Text>
                      <Text style={styles.statLabel}>Win Rate</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.statCard}>
                    <LinearGradient
                      colors={['rgba(157, 78, 221, 0.1)', 'rgba(199, 125, 255, 0.1)']}
                      style={styles.statCardGradient}
                    >
                      <Clock size={Math.min(screenWidth * 0.06, 24)} color="#9D4EDD" />
                      <Text style={styles.statNumber}>5:32</Text>
                      <Text style={styles.statLabel}>Avg. Game</Text>
                    </LinearGradient>
                  </View>
                </View>
              </View>

              <View style={styles.gamesSection}>
                <Text style={styles.sectionTitle}>Available Games</Text>
                <View style={styles.gamesGrid}>
                  {AVAILABLE_GAMES.map((game) => (
                    <TouchableOpacity
                      key={game.id}
                      style={styles.gameCard}
                      onPress={() => startGame(game.id)}
                    >
                      <LinearGradient
                        colors={[...game.color, 'rgba(0,0,0,0.1)']}
                        style={styles.gameCardGradient}
                      >
                        <View style={styles.gameCardHeader}>
                          <game.icon size={Math.min(screenWidth * 0.08, 32)} color="#FFFFFF" />
                          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(game.difficulty) }]}>
                            <Text style={styles.difficultyText}>{game.difficulty}</Text>
                          </View>
                        </View>
                        
                        <Text style={styles.gameCardTitle}>{game.name}</Text>
                        <Text style={styles.gameCardDescription}>{game.description}</Text>
                        
                        <View style={styles.gameCardFooter}>
                          <View style={styles.gameInfo}>
                            <Text style={styles.gameInfoText}>{game.players} players</Text>
                            <Text style={styles.gameInfoText}>{game.duration}</Text>
                          </View>
                          <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{game.category}</Text>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.achievementsSection}>
                <Text style={styles.sectionTitle}>Recent Achievements</Text>
                <View style={styles.achievementsList}>
                  <View style={styles.achievementItem}>
                    <LinearGradient
                      colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 193, 7, 0.1)']}
                      style={styles.achievementGradient}
                    >
                      <Star size={Math.min(screenWidth * 0.05, 20)} color="#FFD700" />
                      <Text style={styles.achievementText}>Truth Master - Answered 50 truth questions</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.achievementItem}>
                    <LinearGradient
                      colors={['rgba(0, 245, 255, 0.1)', 'rgba(0, 128, 255, 0.1)']}
                      style={styles.achievementGradient}
                    >
                      <Shield size={Math.min(screenWidth * 0.05, 20)} color="#00F5FF" />
                      <Text style={styles.achievementText}>Story Teller - Created 25 emoji stories</Text>
                    </LinearGradient>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  // UNO Game Screen (keeping existing logic)
  if (selectedGame === 'uno' && gameState) {
    if (gameState.gamePhase === 'finished') {
      return (
        <View style={styles.container}>
          <LinearGradient
            colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
            style={styles.backgroundGradient}
          >
            <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
              <View style={styles.gameOverContainer}>
                <Text style={styles.gameOverTitle}>
                  {gameState.winner === 'player' ? 'VICTORY! 🏆' : 'DEFEAT! 😤'}
                </Text>
                <Text style={styles.gameOverSubtitle}>
                  {gameState.winner === 'player' 
                    ? 'Epic battle! Chat is now unlocked with your match.'
                    : 'Close game! Ready for a rematch?'
                  }
                </Text>
                <TouchableOpacity 
                  style={styles.playAgainButton} 
                  onPress={() => handleGameComplete(gameState.winner || 'player')}
                >
                  <LinearGradient
                    colors={['#00F5FF', '#0080FF']}
                    style={styles.playAgainButtonGradient}
                  >
                    <Text style={styles.playAgainButtonText}>
                      {gameState.winner === 'player' ? 'Start Chat' : 'Play Again'}
                    </Text>
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
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <View style={styles.gameContainer}>
              <View style={styles.gameHeader}>
                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setSelectedGame(null)}
                >
                  <ArrowLeft size={Math.min(screenWidth * 0.06, 24)} color="#00F5FF" />
                </TouchableOpacity>
                <Text style={styles.gameTitle}>UNO vs Luna</Text>
                <Text style={styles.turnIndicator}>
                  {gameState.currentPlayer === 'player' ? 'Your Turn' : "Luna's Turn"}
                </Text>
              </View>

              <View style={styles.opponentSection}>
                <Text style={styles.handLabel}>Luna's Hand ({gameState.opponentHand.length})</Text>
                <View style={styles.opponentCards}>
                  {gameState.opponentHand.slice(0, 5).map((_, index) => (
                    <View key={index} style={[styles.cardBack, { marginLeft: index * -20 }]} />
                  ))}
                </View>
              </View>

              <View style={styles.currentCardSection}>
                <Text style={styles.currentCardLabel}>Current Card</Text>
                {renderCard(gameState.currentCard)}
              </View>

              <View style={styles.playerSection}>
                <Text style={styles.handLabel}>Your Hand ({gameState.playerHand.length})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playerCards}>
                  {gameState.playerHand.map((card) => 
                    renderCard(
                      card,
                      canPlayCard(card) && gameState.currentPlayer === 'player' && !isProcessingTurn,
                      () => setSelectedCard(selectedCard === card.id ? null : card.id)
                    )
                  )}
                </ScrollView>
                {selectedCard && !isProcessingTurn && (
                  <TouchableOpacity
                    style={styles.playCardButton}
                    onPress={() => {
                      const card = gameState.playerHand.find(c => c.id === selectedCard);
                      if (card) playCard(card);
                    }}
                  >
                    <LinearGradient
                      colors={['#00F5FF', '#0080FF']}
                      style={styles.playCardButtonGradient}
                    >
                      <Text style={styles.playCardButtonText}>Play Card</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  return null;
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
    paddingVertical: screenHeight * 0.04,
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
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 12,
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  headerBadgeText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginLeft: 4,
  },
  headerSubtitle: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  statsSection: {
    marginBottom: screenHeight * 0.04,
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
    gap: screenWidth * 0.03,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statCardGradient: {
    padding: screenWidth * 0.05,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginTop: 4,
  },
  gamesSection: {
    marginBottom: screenHeight * 0.04,
  },
  gamesGrid: {
    gap: screenHeight * 0.02,
  },
  gameCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  gameCardGradient: {
    padding: screenWidth * 0.06,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  gameCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenHeight * 0.02,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
  gameCardTitle: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  gameCardDescription: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: screenHeight * 0.02,
  },
  gameCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameInfo: {
    flex: 1,
  },
  gameInfoText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryText: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  achievementsSection: {
    marginBottom: screenHeight * 0.04,
  },
  achievementsList: {
    gap: screenHeight * 0.015,
  },
  achievementItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  achievementGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: screenWidth * 0.04,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  achievementText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
    marginLeft: screenWidth * 0.03,
    flex: 1,
  },
  gameContainer: {
    flex: 1,
    padding: screenWidth * 0.05,
  },
  gameHeader: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.025,
    paddingTop: screenHeight * 0.02,
    minHeight: screenHeight * 0.08,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: screenHeight * 0.02,
    padding: 8,
  },
  gameTitle: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  turnIndicator: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  opponentSection: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.04,
  },
  handLabel: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
    marginBottom: screenHeight * 0.015,
  },
  opponentCards: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBack: {
    width: screenWidth * 0.125,
    height: screenHeight * 0.09,
    backgroundColor: '#1F1F3A',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  currentCardSection: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.04,
  },
  currentCardLabel: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
    marginBottom: screenHeight * 0.015,
  },
  playerSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  playerCards: {
    flexDirection: 'row',
    marginBottom: screenHeight * 0.025,
  },
  card: {
    width: screenWidth * 0.15,
    height: screenHeight * 0.1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedCard: {
    transform: [{ translateY: -10 }],
    borderColor: '#00F5FF',
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  disabledCard: {
    opacity: 0.4,
  },
  cardText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  playCardButton: {
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  playCardButtonGradient: {
    paddingHorizontal: screenWidth * 0.06,
    paddingVertical: screenHeight * 0.015,
  },
  playCardButtonText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
  gameOverContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: screenWidth * 0.1,
  },
  gameOverTitle: {
    fontSize: Math.min(screenWidth * 0.12, 48),
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
    textAlign: 'center',
    marginBottom: screenHeight * 0.02,
    textShadowColor: 'rgba(0, 245, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  gameOverSubtitle: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Medium',
    color: '#E5E7EB',
    textAlign: 'center',
    marginBottom: screenHeight * 0.05,
  },
  playAgainButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  playAgainButtonGradient: {
    paddingHorizontal: screenWidth * 0.08,
    paddingVertical: screenHeight * 0.02,
  },
  playAgainButtonText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
});