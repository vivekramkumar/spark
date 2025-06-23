import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Trophy, Clock, ThumbsUp, ThumbsDown } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Statement {
  id: string;
  text: string;
  category: 'fun' | 'romantic' | 'wild' | 'deep';
}

const STATEMENTS: Statement[] = [
  { id: '1', text: "Never have I ever... sent a text to the wrong person", category: 'fun' },
  { id: '2', text: "Never have I ever... had a crush on a celebrity", category: 'romantic' },
  { id: '3', text: "Never have I ever... gone on a blind date", category: 'romantic' },
  { id: '4', text: "Never have I ever... stayed up all night gaming", category: 'fun' },
  { id: '5', text: "Never have I ever... forgotten someone's name on a date", category: 'fun' },
  { id: '6', text: "Never have I ever... had a long-distance relationship", category: 'romantic' },
  { id: '7', text: "Never have I ever... been caught singing in the shower", category: 'fun' },
  { id: '8', text: "Never have I ever... fallen asleep during a movie date", category: 'romantic' },
  { id: '9', text: "Never have I ever... pretended to like something to impress someone", category: 'deep' },
  { id: '10', text: "Never have I ever... gone skydiving or bungee jumping", category: 'wild' },
  { id: '11', text: "Never have I ever... had a secret social media account", category: 'wild' },
  { id: '12', text: "Never have I ever... cried during a romantic movie", category: 'romantic' },
  { id: '13', text: "Never have I ever... eaten something I dropped on the floor", category: 'fun' },
  { id: '14', text: "Never have I ever... had a crush on a friend's partner", category: 'deep' },
  { id: '15', text: "Never have I ever... gone to a concert alone", category: 'wild' },
];

interface NeverHaveIEverGameProps {
  onGameComplete: (winner: 'player' | 'opponent') => void;
  onBack: () => void;
}

export default function NeverHaveIEverGame({ onGameComplete, onBack }: NeverHaveIEverGameProps) {
  const [currentStatement, setCurrentStatement] = useState<Statement | null>(null);
  const [playerLives, setPlayerLives] = useState(5);
  const [opponentLives, setOpponentLives] = useState(5);
  const [round, setRound] = useState(1);
  const [gamePhase, setGamePhase] = useState<'statement' | 'waiting' | 'completed'>('statement');
  const [playerChoice, setPlayerChoice] = useState<'done' | 'never' | null>(null);
  const [opponentChoice, setOpponentChoice] = useState<'done' | 'never' | null>(null);
  const [usedStatements, setUsedStatements] = useState<string[]>([]);
  const [isProcessingRound, setIsProcessingRound] = useState(false);
  const fadeAnim = new Animated.Value(0);

  const maxRounds = 10;

  useEffect(() => {
    generateNewStatement();
  }, []);

  useEffect(() => {
    if (playerChoice && opponentChoice && !isProcessingRound) {
      setIsProcessingRound(true);
      setTimeout(() => {
        processRound();
      }, 2000);
    }
  }, [playerChoice, opponentChoice, isProcessingRound]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentStatement]);

  const generateNewStatement = () => {
    const availableStatements = STATEMENTS.filter(s => !usedStatements.includes(s.id));
    if (availableStatements.length === 0) {
      // Reset if all statements used
      setUsedStatements([]);
      setCurrentStatement(STATEMENTS[Math.floor(Math.random() * STATEMENTS.length)]);
    } else {
      const randomStatement = availableStatements[Math.floor(Math.random() * availableStatements.length)];
      setCurrentStatement(randomStatement);
      setUsedStatements(prev => [...prev, randomStatement.id]);
    }
    fadeAnim.setValue(0);
  };

  const handlePlayerChoice = (choice: 'done' | 'never') => {
    if (isProcessingRound) return;
    
    setPlayerChoice(choice);
    setGamePhase('waiting');
    
    // Simulate opponent choice
    setTimeout(() => {
      const opponentChoice = Math.random() > 0.5 ? 'done' : 'never';
      setOpponentChoice(opponentChoice);
    }, 1500);
  };

  const processRound = () => {
    let newPlayerLives = playerLives;
    let newOpponentLives = opponentLives;

    // Lose a life if you've done it
    if (playerChoice === 'done') {
      newPlayerLives = playerLives - 1;
      setPlayerLives(newPlayerLives);
    }
    if (opponentChoice === 'done') {
      newOpponentLives = opponentLives - 1;
      setOpponentLives(newOpponentLives);
    }

    // Check for game end
    if (newPlayerLives <= 0 || newOpponentLives <= 0 || round >= maxRounds) {
      setGamePhase('completed');
      const winner = newPlayerLives > newOpponentLives ? 'player' : 'opponent';
      setTimeout(() => onGameComplete(winner), 2000);
    } else {
      // Next round
      setRound(prev => prev + 1);
      setPlayerChoice(null);
      setOpponentChoice(null);
      setGamePhase('statement');
      setIsProcessingRound(false);
      generateNewStatement();
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fun': return '#06FFA5';
      case 'romantic': return '#FF006E';
      case 'wild': return '#FFD60A';
      case 'deep': return '#9D4EDD';
      default: return '#9CA3AF';
    }
  };

  const renderLives = (lives: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <View
        key={index}
        style={[
          styles.lifeIndicator,
          { backgroundColor: index < lives ? '#FF006E' : 'rgba(255, 255, 255, 0.2)' }
        ]}
      />
    ));
  };

  if (gamePhase === 'completed') {
    const winner = playerLives > opponentLives ? 'You' : 'Luna';
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.backgroundGradient}
        >
          <View style={styles.completedContainer}>
            <Trophy size={Math.min(screenWidth * 0.16, 64)} color="#FFD700" />
            <Text style={styles.completedTitle}>Game Complete!</Text>
            <Text style={styles.completedWinner}>{winner} Won!</Text>
            <Text style={styles.completedScore}>
              Lives Remaining: You {playerLives} - Luna {opponentLives}
            </Text>
            <TouchableOpacity style={styles.continueButton} onPress={() => onGameComplete(playerLives > opponentLives ? 'player' : 'opponent')}>
              <LinearGradient
                colors={['#00F5FF', '#0080FF']}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>Continue to Chat</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.gameTitle}>Never Have I Ever</Text>
          <View style={styles.roundInfo}>
            <Text style={styles.roundText}>Round {round}/{maxRounds}</Text>
          </View>
        </View>

        <View style={styles.livesContainer}>
          <View style={styles.playerLives}>
            <Text style={styles.livesLabel}>You</Text>
            <View style={styles.livesRow}>
              {renderLives(playerLives)}
            </View>
          </View>
          <View style={styles.playerLives}>
            <Text style={styles.livesLabel}>Luna</Text>
            <View style={styles.livesRow}>
              {renderLives(opponentLives)}
            </View>
          </View>
        </View>

        <View style={styles.gameArea}>
          {currentStatement && (
            <Animated.View style={[styles.statementContainer, { opacity: fadeAnim }]}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(currentStatement.category) }]}>
                <Text style={styles.categoryText}>{currentStatement.category.toUpperCase()}</Text>
              </View>

              <ScrollView style={styles.statementScroll}>
                <Text style={styles.statementText}>{currentStatement.text}</Text>
              </ScrollView>

              {gamePhase === 'statement' && !playerChoice && !isProcessingRound && (
                <View style={styles.choiceButtons}>
                  <TouchableOpacity
                    style={styles.choiceButton}
                    onPress={() => handlePlayerChoice('done')}
                  >
                    <LinearGradient
                      colors={['#FF006E', '#F72585']}
                      style={styles.choiceButtonGradient}
                    >
                      <ThumbsDown size={Math.min(screenWidth * 0.06, 24)} color="#FFFFFF" />
                      <Text style={styles.choiceButtonText}>I HAVE</Text>
                      <Text style={styles.choiceButtonSubtext}>Lose a life</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.choiceButton}
                    onPress={() => handlePlayerChoice('never')}
                  >
                    <LinearGradient
                      colors={['#06FFA5', '#00D4AA']}
                      style={styles.choiceButtonGradient}
                    >
                      <ThumbsUp size={Math.min(screenWidth * 0.06, 24)} color="#FFFFFF" />
                      <Text style={styles.choiceButtonText}>NEVER</Text>
                      <Text style={styles.choiceButtonSubtext}>Stay safe</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {gamePhase === 'waiting' && (
                <View style={styles.waitingContainer}>
                  <Text style={styles.waitingTitle}>Waiting for Luna...</Text>
                  {playerChoice && (
                    <Text style={styles.yourChoice}>
                      You chose: {playerChoice === 'done' ? 'I HAVE' : 'NEVER'}
                    </Text>
                  )}
                </View>
              )}

              {playerChoice && opponentChoice && (
                <View style={styles.resultsContainer}>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>You:</Text>
                    <Text style={[
                      styles.resultChoice,
                      { color: playerChoice === 'done' ? '#FF006E' : '#06FFA5' }
                    ]}>
                      {playerChoice === 'done' ? 'I HAVE' : 'NEVER'}
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Luna:</Text>
                    <Text style={[
                      styles.resultChoice,
                      { color: opponentChoice === 'done' ? '#FF006E' : '#06FFA5' }
                    ]}>
                      {opponentChoice === 'done' ? 'I HAVE' : 'NEVER'}
                    </Text>
                  </View>
                </View>
              )}
            </Animated.View>
          )}
        </View>
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
    padding: screenWidth * 0.05,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenHeight * 0.025,
    paddingTop: screenHeight * 0.02,
    minHeight: screenHeight * 0.08,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
  },
  gameTitle: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  roundInfo: {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  roundText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
  },
  livesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: screenHeight * 0.04,
  },
  playerLives: {
    alignItems: 'center',
  },
  livesLabel: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  livesRow: {
    flexDirection: 'row',
    gap: 4,
  },
  lifeIndicator: {
    width: screenWidth * 0.03,
    height: screenWidth * 0.03,
    borderRadius: screenWidth * 0.015,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
  },
  statementContainer: {
    backgroundColor: 'rgba(31, 31, 58, 0.8)',
    borderRadius: 20,
    padding: screenWidth * 0.06,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryBadge: {
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: screenHeight * 0.025,
  },
  categoryText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
  statementScroll: {
    maxHeight: screenHeight * 0.25,
    marginBottom: screenHeight * 0.03,
  },
  statementText: {
    fontSize: Math.min(screenWidth * 0.055, 22),
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: Math.min(screenWidth * 0.08, 32),
  },
  choiceButtons: {
    flexDirection: 'row',
    gap: screenWidth * 0.04,
  },
  choiceButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  choiceButtonGradient: {
    paddingVertical: screenHeight * 0.025,
    alignItems: 'center',
  },
  choiceButtonText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  choiceButtonSubtext: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  waitingContainer: {
    alignItems: 'center',
    paddingVertical: screenHeight * 0.025,
  },
  waitingTitle: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  yourChoice: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
  },
  resultsContainer: {
    gap: screenHeight * 0.015,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  resultLabel: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  resultChoice: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
  },
  completedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: screenWidth * 0.05,
  },
  completedTitle: {
    fontSize: Math.min(screenWidth * 0.08, 32),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: screenHeight * 0.025,
    marginBottom: 8,
  },
  completedWinner: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
    marginBottom: screenHeight * 0.02,
  },
  completedScore: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: screenHeight * 0.05,
  },
  continueButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    paddingHorizontal: screenWidth * 0.08,
    paddingVertical: screenHeight * 0.02,
  },
  continueButtonText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
});