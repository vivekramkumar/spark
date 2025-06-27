import { LinearGradient } from 'expo-linear-gradient';
import { ThumbsDown, ThumbsUp, Trophy } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  initialState?: {
    currentPlayer: 'player' | 'opponent';
    currentQuestion: string | null;
    playerScore: number;
    opponentScore: number;
    round: number;
    gamePhase: 'question' | 'answering' | 'viewing' | 'waiting' | 'completed';
    usedQuestions: string[];
    playerAnswer: boolean | null;
    opponentAnswer: boolean | null;
  };
  onStateUpdate?: (state: any) => void;
}

export default function NeverHaveIEverGame({ 
  onGameComplete, 
  onBack,
  initialState,
  onStateUpdate 
}: NeverHaveIEverGameProps) {
  const [currentPlayer, setCurrentPlayer] = useState<'player' | 'opponent'>(
    initialState?.currentPlayer || 'player'
  );
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(
    initialState?.currentQuestion || null
  );
  const [playerScore, setPlayerScore] = useState(initialState?.playerScore || 5);
  const [opponentScore, setOpponentScore] = useState(initialState?.opponentScore || 5);
  const [round, setRound] = useState(initialState?.round || 1);
  const [gamePhase, setGamePhase] = useState<'question' | 'answering' | 'viewing' | 'waiting' | 'completed'>(
    initialState?.gamePhase || 'question'
  );
  const [playerAnswer, setPlayerAnswer] = useState<boolean | null>(initialState?.playerAnswer || null);
  const [opponentAnswer, setOpponentAnswer] = useState<boolean | null>(initialState?.opponentAnswer || null);
  const [usedQuestions, setUsedQuestions] = useState<string[]>(initialState?.usedQuestions || []);
  const [isProcessingRound, setIsProcessingRound] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const maxRounds = 10;

  useEffect(() => {
    if (!initialState) {
      generateNewQuestion();
    }
    // Start fade animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (playerAnswer !== null && opponentAnswer !== null && !isProcessingRound) {
      setIsProcessingRound(true);
      const timeout = setTimeout(() => {
        processRound();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [playerAnswer, opponentAnswer, isProcessingRound]);

  useEffect(() => {
    if (currentQuestion) {
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [currentQuestion]);

  useEffect(() => {
    onStateUpdate?.({
      currentPlayer,
      currentQuestion,
      playerScore,
      opponentScore,
      round,
      gamePhase,
      usedQuestions,
      playerAnswer,
      opponentAnswer
    });
  }, [
    currentPlayer,
    currentQuestion,
    playerScore,
    opponentScore,
    round,
    gamePhase,
    usedQuestions,
    playerAnswer,
    opponentAnswer
  ]);

  const generateNewQuestion = () => {
    const availableQuestions = STATEMENTS.filter(s => !usedQuestions.includes(s.id));
    if (availableQuestions.length === 0) {
      setUsedQuestions([]);
      const randomQuestion = STATEMENTS[Math.floor(Math.random() * STATEMENTS.length)];
      setCurrentQuestion(randomQuestion.id);
      setUsedQuestions([randomQuestion.id]);
    } else {
      const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      setCurrentQuestion(randomQuestion.id);
      setUsedQuestions(prev => [...prev, randomQuestion.id]);
    }
  };

  const handlePlayerAnswer = (answer: boolean) => {
    if (isProcessingRound) return;
    Keyboard.dismiss();
    
    setPlayerAnswer(answer);
    setGamePhase('waiting');
    
    // Simulate opponent answer with delay
    const timeout = setTimeout(() => {
      const opponentAnswer = Math.random() > 0.5;
      setOpponentAnswer(opponentAnswer);
    }, 1500);

    return () => clearTimeout(timeout);
  };

  const processRound = () => {
    let newPlayerScore = playerScore;
    let newOpponentScore = opponentScore;

    // Lose a life if you've done it
    if (playerAnswer === true) {
      newPlayerScore = playerScore - 1;
      setPlayerScore(newPlayerScore);
    }
    if (opponentAnswer === true) {
      newOpponentScore = opponentScore - 1;
      setOpponentScore(newOpponentScore);
    }

    // Check for game end
    if (newPlayerScore <= 0 || newOpponentScore <= 0 || round >= maxRounds) {
      setGamePhase('completed');
      const winner = newPlayerScore > newOpponentScore ? 'player' : 'opponent';
      setTimeout(() => onGameComplete(winner), 2000);
    } else {
      // Next round
      setRound(prev => prev + 1);
      setPlayerAnswer(null);
      setOpponentAnswer(null);
      setGamePhase('question');
      setIsProcessingRound(false);
      generateNewQuestion();
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

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (gamePhase === 'completed') {
    const winner = playerScore > opponentScore ? 'You' : 'Luna';
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.backgroundGradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.completedContainer}>
              <Trophy size={Math.min(screenWidth * 0.16, 64)} color="#FFD700" />
              <Text style={styles.completedTitle}>Game Complete!</Text>
              <Text style={styles.completedWinner}>{winner} Won!</Text>
              <Text style={styles.completedScore}>
                Lives Remaining: You {playerScore} - Luna {opponentScore}
              </Text>
              <TouchableOpacity style={styles.continueButton} onPress={() => onGameComplete(playerScore > opponentScore ? 'player' : 'opponent')}>
                <LinearGradient
                  colors={['#00F5FF', '#0080FF']}
                  style={styles.continueButtonGradient}
                >
                  <Text style={styles.continueButtonText}>Continue to Chat</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
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
            <KeyboardAvoidingView 
              style={styles.keyboardView}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={0}
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
                    {renderLives(playerScore)}
                  </View>
                </View>
                <View style={styles.playerLives}>
                  <Text style={styles.livesLabel}>Luna</Text>
                  <View style={styles.livesRow}>
                    {renderLives(opponentScore)}
                  </View>
                </View>
              </View>

              <View style={styles.gameArea}>
                {currentQuestion && (
                  <Animated.View style={[styles.statementContainer, { opacity: fadeAnim }]}>
                    <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(currentQuestion) }]}>
                      <Text style={styles.categoryText}>{currentQuestion.toUpperCase()}</Text>
                    </View>

                    <ScrollView style={styles.statementScroll}>
                      <Text style={styles.statementText}>{currentQuestion}</Text>
                    </ScrollView>

                    {gamePhase === 'question' && !playerAnswer && !isProcessingRound && (
                      <View style={styles.choiceButtons}>
                        <TouchableOpacity
                          style={styles.choiceButton}
                          onPress={() => handlePlayerAnswer(true)}
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
                          onPress={() => handlePlayerAnswer(false)}
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
                        {playerAnswer && (
                          <Text style={styles.yourChoice}>
                            You chose: {playerAnswer ? 'I HAVE' : 'NEVER'}
                          </Text>
                        )}
                      </View>
                    )}

                    {playerAnswer && opponentAnswer && (
                      <View style={styles.resultsContainer}>
                        <View style={styles.resultRow}>
                          <Text style={styles.resultLabel}>You:</Text>
                          <Text style={[
                            styles.resultChoice,
                            { color: playerAnswer ? '#FF006E' : '#06FFA5' }
                          ]}>
                            {playerAnswer ? 'I HAVE' : 'NEVER'}
                          </Text>
                        </View>
                        <View style={styles.resultRow}>
                          <Text style={styles.resultLabel}>Luna:</Text>
                          <Text style={[
                            styles.resultChoice,
                            { color: opponentAnswer ? '#FF006E' : '#06FFA5' }
                          ]}>
                            {opponentAnswer ? 'I HAVE' : 'NEVER'}
                          </Text>
                        </View>
                      </View>
                    )}
                  </Animated.View>
                )}
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
  keyboardView: {
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