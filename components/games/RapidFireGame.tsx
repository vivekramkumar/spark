import { LinearGradient } from 'expo-linear-gradient';
import { Clock, User, Users, Zap } from 'lucide-react-native';
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

interface Question {
  id: string;
  question: string;
  category: 'personal' | 'fun' | 'preferences' | 'random';
  optionA?: string;
  optionB?: string;
}

interface GameResult {
  question: string;
  playerAnswer: string;
  opponentAnswer: string;
  category: string;
}

const QUESTIONS: Question[] = [
  { id: '1', question: "Coffee or tea?", category: 'preferences', optionA: "Coffee", optionB: "Tea" },
  { id: '2', question: "Morning person or night owl?", category: 'personal', optionA: "Morning person", optionB: "Night owl" },
  { id: '3', question: "Beach or mountains?", category: 'preferences', optionA: "Beach", optionB: "Mountains" },
  { id: '4', question: "Cats or dogs?", category: 'preferences', optionA: "Cats", optionB: "Dogs" },
  { id: '5', question: "What's your favorite color?", category: 'personal', optionA: "Warm colors", optionB: "Cool colors" },
  { id: '6', question: "Pizza or burgers?", category: 'preferences', optionA: "Pizza", optionB: "Burgers" },
  { id: '7', question: "Netflix or YouTube?", category: 'preferences', optionA: "Netflix", optionB: "YouTube" },
  { id: '8', question: "What's your dream vacation?", category: 'personal', optionA: "Adventure trip", optionB: "Relaxing getaway" },
  { id: '9', question: "Sweet or salty snacks?", category: 'preferences', optionA: "Sweet", optionB: "Salty" },
  { id: '10', question: "What's your biggest fear?", category: 'personal', optionA: "Heights", optionB: "Public speaking" },
  { id: '11', question: "Summer or winter?", category: 'preferences', optionA: "Summer", optionB: "Winter" },
  { id: '12', question: "What's your favorite movie genre?", category: 'personal', optionA: "Action/Adventure", optionB: "Comedy/Romance" },
  { id: '13', question: "Early bird or procrastinator?", category: 'personal', optionA: "Early bird", optionB: "Procrastinator" },
  { id: '14', question: "Text or call?", category: 'preferences', optionA: "Text", optionB: "Call" },
  { id: '15', question: "What's your hidden talent?", category: 'personal', optionA: "Creative skill", optionB: "Athletic skill" },
  { id: '16', question: "Introvert or extrovert?", category: 'personal', optionA: "Introvert", optionB: "Extrovert" },
  { id: '17', question: "What's your go-to karaoke song?", category: 'fun', optionA: "Classic rock", optionB: "Pop hits" },
  { id: '18', question: "Superhero or villain?", category: 'fun', optionA: "Superhero", optionB: "Villain" },
  { id: '19', question: "What's your biggest pet peeve?", category: 'personal', optionA: "Loud noises", optionB: "Being late" },
  { id: '20', question: "Adventure or relaxation?", category: 'preferences', optionA: "Adventure", optionB: "Relaxation" },
];

interface RapidFireGameProps {
  onGameComplete: (winner: 'player' | 'opponent') => void;
  onBack: () => void;
  initialState?: {
    currentPlayer: 'player' | 'opponent';
    currentQuestion: Question | null;
    playerScore: number;
    opponentScore: number;
    round: number;
    gamePhase: 'question' | 'answering' | 'viewing' | 'waiting' | 'completed' | 'opponent-turn' | 'results';
    usedQuestions: string[];
    playerAnswer: string;
    opponentAnswer: string;
    timeLeft: number;
  };
  onStateUpdate?: (state: any) => void;
}

export default function RapidFireGame({ 
  onGameComplete, 
  onBack,
  initialState,
  onStateUpdate 
}: RapidFireGameProps) {
  const [currentPlayer, setCurrentPlayer] = useState<'player' | 'opponent'>(
    initialState?.currentPlayer || 'player'
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(
    initialState?.currentQuestion || null
  );
  const [playerScore, setPlayerScore] = useState(initialState?.playerScore || 0);
  const [opponentScore, setOpponentScore] = useState(initialState?.opponentScore || 0);
  const [round, setRound] = useState(initialState?.round || 1);
  const [gamePhase, setGamePhase] = useState<'question' | 'answering' | 'viewing' | 'waiting' | 'completed' | 'opponent-turn' | 'results'>(
    initialState?.gamePhase || 'question'
  );
  const [playerAnswer, setPlayerAnswer] = useState(initialState?.playerAnswer || '');
  const [opponentAnswer, setOpponentAnswer] = useState(initialState?.opponentAnswer || '');
  const [usedQuestions, setUsedQuestions] = useState<string[]>(initialState?.usedQuestions || []);
  const [timeLeft, setTimeLeft] = useState(initialState?.timeLeft || 15);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const maxQuestions = 10;

  // Initialize game
  useEffect(() => {
    if (!initialState) {
      generateNewQuestion();
    }
    setGameStarted(true);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update parent component with current state when it changes
  useEffect(() => {
    if (onStateUpdate) {
      onStateUpdate({
        currentPlayer,
        currentQuestion,
        playerScore,
        opponentScore,
        round,
        gamePhase,
        usedQuestions,
        playerAnswer,
        opponentAnswer,
        timeLeft
      });
    }
  }, [
    currentPlayer,
    currentQuestion,
    playerScore,
    opponentScore,
    round,
    gamePhase,
    usedQuestions,
    playerAnswer,
    opponentAnswer,
    timeLeft
  ]);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0 && gameStarted) {
      timerRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsTimerActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            if (currentPlayer === 'player' && gamePhase === 'question' && !isProcessingTurn) {
              // Schedule state updates for next tick to avoid state update during render
              setTimeout(() => {
                setIsProcessingTurn(true);
                setPlayerAnswer("Time's up!");
                setIsTimerActive(false);
                setCurrentPlayer('opponent');
                setGamePhase('question');
                generateNewQuestion();
              }, 0);
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isTimerActive, gameStarted]);

  // Handle opponent's turn
  useEffect(() => {
    let turnTimeout: ReturnType<typeof setTimeout>;
    let answerTimeout: ReturnType<typeof setTimeout>;

    const handleOpponentTurn = async () => {
      if (currentPlayer === 'opponent' && gamePhase === 'question' && !isProcessingTurn && gameStarted) {
        setIsProcessingTurn(true);
        setGamePhase('opponent-turn');
        setIsTimerActive(false);
        
        // Simulate opponent answering
        turnTimeout = setTimeout(() => {
          const opponentResponses = [
            "Coffee definitely!", "I'm a night owl", "Mountains for sure", "Dogs all the way",
            "Blue is my favorite", "Pizza always wins", "Netflix and chill", "Japan would be amazing",
            "Sweet tooth here", "Heights scare me", "Summer vibes", "Comedy movies",
            "Total procrastinator", "I prefer texting", "I can juggle!", "Bit of both",
            "Don't Stop Believin'", "Superhero for sure", "Loud chewing", "Adventure seeker"
          ];
          const randomResponse = opponentResponses[Math.floor(Math.random() * opponentResponses.length)];
          setOpponentAnswer(randomResponse);
          
          // Add to game results
          if (currentQuestion) {
            setGameResults(prev => [...prev, {
              question: currentQuestion.question,
              playerAnswer: playerAnswer || "No answer",
              opponentAnswer: randomResponse,
              category: currentQuestion.category
            }]);
          }
          
          answerTimeout = setTimeout(() => {
            nextQuestion();
          }, 2000);
        }, 1500);
      }
    };

    handleOpponentTurn();

    return () => {
      if (turnTimeout) clearTimeout(turnTimeout);
      if (answerTimeout) clearTimeout(answerTimeout);
    };
  }, [currentPlayer, gamePhase, isProcessingTurn, gameStarted]);

  const nextQuestion = () => {
    // Check if game should end
    if (questionIndex >= maxQuestions - 1) {
      setGamePhase('completed');
      onGameComplete(playerScore > opponentScore ? 'player' : 'opponent');
      return;
    }

    // Switch to next player
    const nextPlayer = currentPlayer === 'player' ? 'opponent' : 'player';
    
    // Increment question index when completing a full turn (both players have played)
    if (currentPlayer === 'opponent') {
      setQuestionIndex(prev => prev + 1);
    }

    // Reset state for next question
    setCurrentPlayer(nextPlayer);
    setGamePhase('question');
    setIsProcessingTurn(false);
    setPlayerAnswer('');
    setOpponentAnswer('');
    setTimeLeft(15);
    setIsTimerActive(false);
    
    // Generate new question
    generateNewQuestion();

    // Animate question transition
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  const generateNewQuestion = () => {
    const availableQuestions = QUESTIONS.filter(q => !usedQuestions.includes(q.id));
    let selectedQuestion: Question;
    
    if (availableQuestions.length === 0) {
      setUsedQuestions([]);
      selectedQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    } else {
      selectedQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      setUsedQuestions(prev => [...prev, selectedQuestion.id]);
    }
    
    setCurrentQuestion(selectedQuestion);
    fadeAnim.setValue(0);
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const startPlayerTurn = () => {
    setGameStarted(true);
    setTimeLeft(10);
    setIsTimerActive(true);
  };

  const handleAnswer = (answer: string) => {
    if (isProcessingTurn || currentPlayer !== 'player') return;
    Keyboard.dismiss();
    
    setIsProcessingTurn(true);
    setPlayerAnswer(answer);
    setIsTimerActive(false);
    
    // Switch to opponent's turn
    setCurrentPlayer('opponent');
    setGamePhase('question');
    generateNewQuestion();
  };

  const handleSkip = () => {
    if (isProcessingTurn || currentPlayer !== 'player') return;
    Keyboard.dismiss();
    
    setIsProcessingTurn(true);
    setPlayerAnswer("Skipped");
    setIsTimerActive(false);
    
    // Switch to opponent's turn
    setCurrentPlayer('opponent');
    setGamePhase('question');
    generateNewQuestion();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return '#9D4EDD';
      case 'fun': return '#06FFA5';
      case 'preferences': return '#FFD60A';
      case 'random': return '#FF006E';
      default: return '#9CA3AF';
    }
  };

  const handleContinueToChat = () => {
    setGamePhase('completed');
    setTimeout(() => onGameComplete('player'), 500);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (gamePhase === 'results') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.backgroundGradient}
        >
          <SafeAreaView style={styles.safeArea}>
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Zap size={Math.min(screenWidth * 0.08, 32)} color="#FFD60A" />
              <Text style={styles.resultsTitle}>Game Results</Text>
              <Text style={styles.resultsSubtitle}>
                Here's how you both answered all {maxQuestions} questions!
              </Text>
            </View>

            <ScrollView style={styles.resultsTable} showsVerticalScrollIndicator={false}>
              <View style={styles.tableHeader}>
                <View style={styles.tableHeaderCell}>
                  <Text style={styles.tableHeaderText}>Question</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <User size={Math.min(screenWidth * 0.04, 16)} color="#00F5FF" />
                  <Text style={styles.tableHeaderText}>You</Text>
                </View>
                <View style={styles.tableHeaderCell}>
                  <Users size={Math.min(screenWidth * 0.04, 16)} color="#9D4EDD" />
                  <Text style={styles.tableHeaderText}>Luna</Text>
                </View>
              </View>

              {gameResults.map((result, index) => (
                <View key={index} style={styles.tableRow}>
                  <LinearGradient
                    colors={['rgba(31, 31, 58, 0.8)', 'rgba(45, 27, 105, 0.6)']}
                    style={styles.tableRowGradient}
                  >
                    <View style={styles.questionCell}>
                      <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(result.category) }]}>
                        <Text style={styles.categoryIndicatorText}>
                          {result.category.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <Text style={styles.questionCellText}>{result.question}</Text>
                    </View>
                    
                    <View style={styles.answerCell}>
                      <View style={styles.playerAnswerContainer}>
                        <Text style={styles.playerAnswerText}>{result.playerAnswer}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.answerCell}>
                      <View style={styles.opponentAnswerContainer}>
                        <Text style={styles.opponentAnswerText}>{result.opponentAnswer}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              ))}
            </ScrollView>

            <View style={styles.resultsFooter}>
              <View style={styles.compatibilityScore}>
                <Text style={styles.compatibilityLabel}>Compatibility Score</Text>
                <Text style={styles.compatibilityValue}>
                  {Math.round(Math.random() * 20 + 80)}%
                </Text>
                <Text style={styles.compatibilityDescription}>
                  Great chemistry! You have similar interests and complementary differences.
                </Text>
              </View>

              <TouchableOpacity style={styles.continueButton} onPress={handleContinueToChat}>
                <LinearGradient
                  colors={['#00F5FF', '#0080FF']}
                  style={styles.continueButtonGradient}
                >
                  <Text style={styles.continueButtonText}>Start Chatting</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  if (gamePhase === 'completed') {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.backgroundGradient}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.completedContainer}>
            <Zap size={Math.min(screenWidth * 0.16, 64)} color="#FFD60A" />
            <Text style={styles.completedTitle}>Lightning Round Complete!</Text>
            <Text style={styles.completedSubtitle}>
              You both answered {maxQuestions} questions in record time!
            </Text>
            <Text style={styles.completedDescription}>
              Great chemistry and quick thinking. Time to dive deeper in chat!
            </Text>
            <TouchableOpacity style={styles.continueButton} onPress={() => onGameComplete('player')}>
              <LinearGradient
                colors={['#00F5FF', '#0080FF']}
                style={styles.continueButtonGradient}
              >
                <Text style={styles.continueButtonText}>Start Chatting</Text>
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
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.gameTitle}>Rapid Fire Q&A</Text>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>{questionIndex + 1}/{maxQuestions}</Text>
          </View>
        </View>

        <View style={styles.currentPlayerIndicator}>
          <Text style={styles.currentPlayerText}>
            {currentPlayer === 'player' ? "Your Turn!" : "Luna's Turn"}
          </Text>
        </View>
          <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
              style={styles.keyboardView}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={0}
            >

        {currentPlayer === 'player' && gamePhase === 'question' && gameStarted && (
          <View style={styles.timerContainer}>
            <Clock size={Math.min(screenWidth * 0.06, 24)} color="#FFD60A" />
            <Text style={styles.timerText}>{timeLeft}s</Text>
            <View style={styles.timerBar}>
              <View style={[styles.timerProgress, { width: `${(timeLeft / 10) * 100}%` }]} />
            </View>
          </View>
        )}

        <View style={styles.gameArea}>
          {currentQuestion && currentPlayer === 'player' && gamePhase === 'question' && (
            <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(currentQuestion.category) }]}>
                <Text style={styles.categoryText}>{currentQuestion.question.toUpperCase()}</Text>
              </View>

              <ScrollView style={styles.questionScroll}>
                <Text style={styles.questionText}>{currentQuestion.question}</Text>
              </ScrollView>

              {!gameStarted ? (
                <View style={styles.startGameSection}>
                  <Text style={styles.startGamePrompt}>Ready to start the rapid fire round?</Text>
                  <TouchableOpacity
                    style={styles.startGameButton}
                    onPress={startPlayerTurn}
                  >
                    <LinearGradient
                      colors={['#00F5FF', '#0080FF']}
                      style={styles.startGameButtonGradient}
                    >
                      <Zap size={Math.min(screenWidth * 0.05, 20)} color="#FFFFFF" />
                      <Text style={styles.startGameButtonText}>Start Game</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.answerSection}>
                  <Text style={styles.answerPrompt}>Quick! What's your answer?</Text>
                  <View style={styles.quickAnswers}>
                    {/* Always show A and B options for all questions */}
                    <TouchableOpacity
                      style={styles.quickAnswerButton}
                      onPress={() => handleAnswer(currentQuestion.question)}
                      disabled={isProcessingTurn}
                    >
                      <LinearGradient
                        colors={['#00F5FF', '#0080FF']}
                        style={styles.quickAnswerGradient}
                      >
                        <Text style={styles.quickAnswerText}>A</Text>
                        <Text style={styles.quickAnswerSubtext}>
                          {currentQuestion.question}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.quickAnswerButton}
                      onPress={() => handleAnswer(currentQuestion.question)}
                      disabled={isProcessingTurn}
                    >
                      <LinearGradient
                        colors={['#FFD60A', '#FFC300']}
                        style={styles.quickAnswerGradient}
                      >
                        <Text style={styles.quickAnswerText}>B</Text>
                        <Text style={styles.quickAnswerSubtext}>
                          {currentQuestion.question}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                    style={styles.skipButton} 
                    onPress={handleSkip}
                    disabled={isProcessingTurn}
                  >
                    <Text style={styles.skipButtonText}>Skip Question</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          )}

          {gamePhase === 'opponent-turn' && currentPlayer === 'opponent' && (
            <View style={styles.opponentTurnContainer}>
              <Text style={styles.opponentTurnTitle}>Luna's Turn</Text>
              <Text style={styles.opponentTurnSubtitle}>She's answering the same question...</Text>
              <View style={styles.questionDisplay}>
                <Text style={styles.questionDisplayText}>{currentQuestion?.question}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.answersPreview}>
          <Text style={styles.answersTitle}>Answers So Far:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.answersRow}>
              {playerAnswer && (
                <View style={[styles.answerBubble, styles.playerAnswerBubble]}>
                  <Text style={styles.answerBubbleLabel}>You:</Text>
                  <Text style={styles.answerBubbleText}>{playerAnswer}</Text>
                </View>
              )}
              {opponentAnswer && (
                <View style={[styles.answerBubble, styles.opponentAnswerBubble]}>
                  <Text style={styles.answerBubbleLabel}>Luna:</Text>
                  <Text style={styles.answerBubbleText}>{opponentAnswer}</Text>
                </View>
              )}
            </View>
          </ScrollView>
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
  progressInfo: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  progressText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Bold',
    color: '#FFD60A',
  },
  currentPlayerIndicator: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.02,
  },
  currentPlayerText: {
    fontSize: Math.min(screenWidth * 0.05, 20),
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenHeight * 0.025,
    gap: screenWidth * 0.03,
  },
  timerText: {
    fontSize: Math.min(screenWidth * 0.05, 20),
    fontFamily: 'Inter-Bold',
    color: '#FFD60A',
  },
  timerBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  timerProgress: {
    height: '100%',
    backgroundColor: '#FFD60A',
    borderRadius: 3,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
  },
  questionContainer: {
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
  questionScroll: {
    maxHeight: screenHeight * 0.12,
    marginBottom: screenHeight * 0.03,
  },
  questionText: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: Math.min(screenWidth * 0.08, 32),
  },
  startGameSection: {
    alignItems: 'center',
  },
  startGamePrompt: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: screenHeight * 0.025,
    textAlign: 'center',
  },
  startGameButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  startGameButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: screenWidth * 0.08,
    paddingVertical: screenHeight * 0.02,
    gap: 8,
  },
  startGameButtonText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  answerSection: {
    alignItems: 'center',
  },
  answerPrompt: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: screenHeight * 0.025,
  },
  quickAnswers: {
    flexDirection: 'row',
    gap: screenWidth * 0.04,
    marginBottom: screenHeight * 0.02,
    justifyContent: 'center',
  },
  quickAnswerButton: {
    borderRadius: 16,
    overflow: 'hidden',
    flex: 1,
    maxWidth: screenWidth * 0.35,
  },
  quickAnswerGradient: {
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.02,
    alignItems: 'center',
    minHeight: screenHeight * 0.08,
    justifyContent: 'center',
  },
  quickAnswerText: {
    fontSize: Math.min(screenWidth * 0.05, 20),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
    marginBottom: 4,
  },
  quickAnswerSubtext: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#0F0F23',
    textAlign: 'center',
    opacity: 0.8,
  },
  skipButton: {
    marginTop: screenHeight * 0.02,
    padding: screenHeight * 0.015,
  },
  skipButtonText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
  opponentTurnContainer: {
    alignItems: 'center',
    paddingVertical: screenHeight * 0.05,
  },
  opponentTurnTitle: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  opponentTurnSubtitle: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: screenHeight * 0.025,
  },
  questionDisplay: {
    backgroundColor: 'rgba(157, 78, 221, 0.1)',
    padding: screenWidth * 0.04,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(157, 78, 221, 0.3)',
  },
  questionDisplayText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9D4EDD',
    textAlign: 'center',
  },
  answersPreview: {
    marginTop: screenHeight * 0.025,
  },
  answersTitle: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: screenHeight * 0.015,
  },
  answersRow: {
    flexDirection: 'row',
    gap: screenWidth * 0.02,
  },
  answerBubble: {
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: screenWidth * 0.2,
  },
  playerAnswerBubble: {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  opponentAnswerBubble: {
    backgroundColor: 'rgba(157, 78, 221, 0.1)',
    borderColor: 'rgba(157, 78, 221, 0.3)',
  },
  answerBubbleLabel: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Bold',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  answerBubbleText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  // Results screen styles
  resultsContainer: {
    flex: 1,
    paddingTop: screenHeight * 0.02,
    paddingHorizontal: screenWidth * 0.05,
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.03,
  },
  resultsTitle: {
    fontSize: Math.min(screenWidth * 0.08, 32),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: screenHeight * 0.02,
    marginBottom: 8,
  },
  resultsSubtitle: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  resultsTable: {
    flex: 1,
    marginBottom: screenHeight * 0.02,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderRadius: 12,
    padding: screenWidth * 0.03,
    marginBottom: screenHeight * 0.02,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  tableHeaderCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tableHeaderText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
  },
  tableRow: {
    marginBottom: screenHeight * 0.015,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tableRowGradient: {
    flexDirection: 'row',
    padding: screenWidth * 0.03,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  questionCell: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: screenWidth * 0.02,
  },
  categoryIndicator: {
    width: screenWidth * 0.06,
    height: screenWidth * 0.06,
    borderRadius: screenWidth * 0.03,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: screenWidth * 0.02,
  },
  categoryIndicatorText: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
  questionCellText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    flex: 1,
  },
  answerCell: {
    flex: 1.5,
    paddingHorizontal: screenWidth * 0.01,
  },
  playerAnswerContainer: {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderRadius: 8,
    padding: screenWidth * 0.02,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  playerAnswerText: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Medium',
    color: '#00F5FF',
    textAlign: 'center',
  },
  opponentAnswerContainer: {
    backgroundColor: 'rgba(157, 78, 221, 0.1)',
    borderRadius: 8,
    padding: screenWidth * 0.02,
    borderWidth: 1,
    borderColor: 'rgba(157, 78, 221, 0.3)',
  },
  opponentAnswerText: {
    fontSize: Math.min(screenWidth * 0.025, 10),
    fontFamily: 'Inter-Medium',
    color: '#9D4EDD',
    textAlign: 'center',
  },
  resultsFooter: {
    alignItems: 'center',
    paddingTop: screenHeight * 0.02,
  },
  compatibilityScore: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.03,
    backgroundColor: 'rgba(31, 31, 58, 0.8)',
    borderRadius: 16,
    padding: screenWidth * 0.05,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  compatibilityLabel: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  compatibilityValue: {
    fontSize: Math.min(screenWidth * 0.12, 48),
    fontFamily: 'Inter-Bold',
    color: '#06FFA5',
    marginBottom: 8,
  },
  compatibilityDescription: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    textAlign: 'center',
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
    marginBottom: screenHeight * 0.02,
    textAlign: 'center',
  },
  completedSubtitle: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#FFD60A',
    marginBottom: screenHeight * 0.02,
    textAlign: 'center',
  },
  completedDescription: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
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