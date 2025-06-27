import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Eye, Send, Trophy } from 'lucide-react-native';
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
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const TRUTH_QUESTIONS: Question[] = [
  { id: '1', text: "What's the most embarrassing thing you've done on a date?", difficulty: 'easy' },
  { id: '2', text: "What's your biggest turn-on in a partner?", difficulty: 'medium' },
  { id: '3', text: "Have you ever had a crush on someone you shouldn't have?", difficulty: 'hard' },
  { id: '4', text: "What's the weirdest place you've ever wanted to kiss someone?", difficulty: 'medium' },
  { id: '5', text: "What's your most embarrassing childhood memory?", difficulty: 'easy' },
  { id: '6', text: "What's the most romantic thing someone has done for you?", difficulty: 'easy' },
  { id: '7', text: "Have you ever sent a flirty text to the wrong person?", difficulty: 'medium' },
  { id: '8', text: "What's your biggest relationship deal-breaker?", difficulty: 'hard' },
  { id: '9', text: "What's the most spontaneous thing you've ever done?", difficulty: 'medium' },
  { id: '10', text: "What's your biggest fear in a relationship?", difficulty: 'hard' },
  { id: '11', text: "What's the worst pickup line someone has used on you?", difficulty: 'easy' },
  { id: '12', text: "What's something you've never told anyone?", difficulty: 'hard' },
  { id: '13', text: "What's your most used dating app and why?", difficulty: 'easy' },
  { id: '14', text: "What's the craziest thing you've done to get someone's attention?", difficulty: 'medium' },
  { id: '15', text: "What's your biggest insecurity?", difficulty: 'hard' },
];

interface TruthGameProps {
  onGameComplete: (winner: 'player' | 'opponent') => void;
  onBack: () => void;
  initialState?: {
    currentPlayer: 'player' | 'opponent';
    currentQuestion: Question | null;
    playerScore: number;
    opponentScore: number;
    round: number;
    gamePhase: 'question' | 'answering' | 'viewing' | 'waiting' | 'completed';
    usedQuestions: string[];
    playerAnswer: string;
    opponentAnswer: string;
  };
  onStateUpdate?: (state: any) => void;
}

export default function TruthOrDareGame({ 
  onGameComplete, 
  onBack,
  initialState,
  onStateUpdate 
}: TruthGameProps) {
  // Game state
  const [currentPlayer, setCurrentPlayer] = useState<'player' | 'opponent'>(
    initialState?.currentPlayer || 'player'
  );
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(
    initialState?.currentQuestion || null
  );
  const [playerScore, setPlayerScore] = useState(initialState?.playerScore || 0);
  const [opponentScore, setOpponentScore] = useState(initialState?.opponentScore || 0);
  const [round, setRound] = useState(initialState?.round || 1);
  const [gamePhase, setGamePhase] = useState<'question' | 'answering' | 'viewing' | 'waiting' | 'completed'>(
    initialState?.gamePhase || 'question'
  );
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [playerAnswer, setPlayerAnswer] = useState(initialState?.playerAnswer || '');
  const [opponentAnswer, setOpponentAnswer] = useState(initialState?.opponentAnswer || '');
  const [usedQuestions, setUsedQuestions] = useState<string[]>(initialState?.usedQuestions || []);
  
  // Animation ref
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const maxRounds = 6;

  // Initialize game state
  useEffect(() => {
    const initGame = async () => {
      try {
        if (!currentQuestion && gamePhase === 'question') {
          await generateNewQuestion();
        }
        // Start fade animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } catch (error) {
        console.error('Error initializing game:', error);
      }
    };

    initGame();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsTimerActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            // Schedule handleSkip for next tick to avoid state update during render
            setTimeout(() => {
              setPlayerAnswer("Time's up! Moving on...");
              setIsTimerActive(false);
              setGamePhase('viewing');
              setTimeout(() => nextTurn(), 5000);
            }, 0);
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
  }, [isTimerActive]);

  // Handle opponent's turn
  useEffect(() => {
    let turnTimeout: ReturnType<typeof setTimeout>;
    let viewTimeout: ReturnType<typeof setTimeout>;

    const handleOpponentTurn = async () => {
      if (currentPlayer === 'opponent' && gamePhase === 'question' && !isProcessingTurn) {
        setIsProcessingTurn(true);
        setGamePhase('waiting');
        
        // Simulate opponent answering
        turnTimeout = setTimeout(() => {
          const opponentAnswers = [
            "I once accidentally called my date by my ex's name... twice! 😅",
            "I'm a sucker for someone who can make me laugh until my stomach hurts.",
            "I may have stalked someone's Instagram for 3 hours straight once...",
            "Definitely during a thunderstorm on a rooftop. So cliché but so romantic!",
            "I used to think babies came from the grocery store until I was 8.",
            "They surprised me with a picnic under the stars with all my favorite foods.",
            "Yes! I sent a heart emoji to my boss instead of my crush. So awkward!",
            "Someone who doesn't respect boundaries or can't communicate honestly.",
            "I booked a flight to another country with just 2 hours notice!",
            "Being vulnerable and having it used against me later.",
            "Are you a parking ticket? Because you've got FINE written all over you. Ugh!",
            "I still sleep with a stuffed animal sometimes when I'm stressed.",
            "Probably this one! I love the gaming aspect and meeting people with similar interests.",
            "I learned their favorite song and played it outside their window. It worked!",
            "I worry that I'm not interesting enough to keep someone's attention long-term."
          ];
          
          const randomAnswer = opponentAnswers[Math.floor(Math.random() * opponentAnswers.length)];
          setOpponentAnswer(randomAnswer);
          setGamePhase('viewing');
          
          // Show opponent's answer for 5 seconds
          viewTimeout = setTimeout(() => {
            nextTurn();
          }, 5000);
        }, 2000);
      }
    };

    handleOpponentTurn();

    return () => {
      if (turnTimeout) clearTimeout(turnTimeout);
      if (viewTimeout) clearTimeout(viewTimeout);
    };
  }, [currentPlayer, gamePhase, isProcessingTurn]);

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
        opponentAnswer
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
    opponentAnswer
  ]);

  const generateNewQuestion = async () => {
    try {
      const availableQuestions = TRUTH_QUESTIONS.filter(q => !usedQuestions.includes(q.id));
      let newQuestion: Question;
      
      if (availableQuestions.length === 0) {
        // Reset used questions if we've used them all
        setUsedQuestions([]);
        newQuestion = TRUTH_QUESTIONS[Math.floor(Math.random() * TRUTH_QUESTIONS.length)];
        setUsedQuestions([newQuestion.id]);
      } else {
        newQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
        setUsedQuestions(prev => [...prev, newQuestion.id]);
      }
      
      setCurrentQuestion(newQuestion);
      
      // Reset game state for new question
      setPlayerAnswer('');
      setOpponentAnswer('');
      setTimeLeft(60);
      setIsTimerActive(false);
      setIsProcessingTurn(false);
    } catch (error) {
      console.error('Error generating new question:', error);
    }
  };

  const handleStartAnswering = () => {
    if (!currentQuestion) {
      generateNewQuestion();
      return;
    }
    
    setGamePhase('answering');
    setTimeLeft(60);
    setIsTimerActive(true);
  };

  const handleSubmitAnswer = () => {
    Keyboard.dismiss();
    if (!playerAnswer.trim()) {
      setPlayerAnswer("I prefer to keep this one private! 😊");
    }
    
    setIsTimerActive(false);
    setPlayerScore(prev => prev + 1);
    setGamePhase('viewing');
    
    // Show player's answer for 5 seconds
    setTimeout(() => {
      nextTurn();
    }, 5000);
  };

  const handleSkip = () => {
    Keyboard.dismiss();
    setPlayerAnswer("I'll pass on this one! 😅");
    setIsTimerActive(false);
    setGamePhase('viewing');
    
    setTimeout(() => {
      nextTurn();
    }, 5000);
  };

  const nextTurn = () => {
    if (round >= maxRounds) {
      // Game is complete, determine winner
      const winner = playerScore > opponentScore ? 'player' : 'opponent';
      setGamePhase('completed');
      onGameComplete(winner);
      return;
    }

    // Switch to next player
    const nextPlayer = currentPlayer === 'player' ? 'opponent' : 'player';
    
    // Increment round when completing a full turn (both players have played)
    if (currentPlayer === 'opponent') {
      setRound(prev => prev + 1);
    }

    // Reset state for next turn
    setCurrentPlayer(nextPlayer);
    setGamePhase('question');
    setIsProcessingTurn(false);
    setPlayerAnswer('');
    setOpponentAnswer('');
    
    // Generate new question for next turn
    generateNewQuestion();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#06FFA5';
      case 'medium': return '#FFD60A';
      case 'hard': return '#FF006E';
      default: return '#9CA3AF';
    }
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
              <Text style={styles.completedTitle}>Truth Session Complete!</Text>
              <Text style={styles.completedWinner}>{winner} shared the most!</Text>
              <Text style={styles.completedScore}>
                Truths shared: You {playerScore} - Luna {opponentScore}
              </Text>
              <Text style={styles.completedSubtitle}>
                Great conversation! You've learned so much about each other.
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
              <ScrollView 
                style={styles.mainScroll}
                contentContainerStyle={styles.mainScrollContent}
                bounces={false}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.header}>
                  <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backButtonText}>← Back</Text>
                  </TouchableOpacity>
                  <Text style={styles.gameTitle}>Truth Session</Text>
                  <View style={styles.roundInfo}>
                    <Text style={styles.roundText}>Round {round}/{maxRounds}</Text>
                  </View>
                </View>

                <View style={styles.scoreBoard}>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>You</Text>
                    <Text style={styles.scoreValue}>{playerScore}</Text>
                  </View>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreLabel}>Luna</Text>
                    <Text style={styles.scoreValue}>{opponentScore}</Text>
                  </View>
                </View>

                <View style={styles.currentPlayerIndicator}>
                  <Text style={styles.currentPlayerText}>
                    {currentPlayer === 'player' ? "Your Turn!" : "Luna's Turn"}
                  </Text>
                </View>

                <View style={styles.gameArea}>
                  {currentQuestion && gamePhase === 'question' && currentPlayer === 'player' && (
                    <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
                      <View style={styles.questionTypeIndicator}>
                        <Eye size={24} color="#FFFFFF" />
                        <Text style={styles.questionTypeText}>TRUTH</Text>
                      </View>

                      <View style={[styles.difficultyBadge, { 
                        backgroundColor: getDifficultyColor(currentQuestion.difficulty) 
                      }]}>
                        <Text style={styles.difficultyText}>
                          {currentQuestion.difficulty.toUpperCase()}
                        </Text>
                      </View>

                      <ScrollView style={styles.questionScroll}>
                        <Text style={styles.questionText}>{currentQuestion.text}</Text>
                      </ScrollView>

                      <TouchableOpacity
                        style={styles.startAnswerButton}
                        onPress={handleStartAnswering}
                      >
                        <LinearGradient
                          colors={['#9D4EDD', '#C77DFF']}
                          style={styles.startAnswerButtonGradient}
                        >
                          <Text style={styles.startAnswerButtonText}>Start Answering</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  )}

                  {gamePhase === 'answering' && currentPlayer === 'player' && (
                    <View style={styles.answeringContainer}>
                      <View style={styles.timerContainer}>
                        <Clock size={20} color="#FFD700" />
                        <Text style={styles.timerText}>{timeLeft}s</Text>
                      </View>

                      <Text style={styles.answeringTitle}>Your turn to share!</Text>
                      <Text style={styles.questionReminder}>{currentQuestion?.text}</Text>

                      <TextInput
                        style={styles.answerInput}
                        value={playerAnswer}
                        onChangeText={setPlayerAnswer}
                        placeholder="Type your honest answer here..."
                        placeholderTextColor="rgba(156, 163, 175, 0.7)"
                        multiline
                        maxLength={500}
                        returnKeyType="done"
                        onSubmitEditing={dismissKeyboard}
                      />

                      <Text style={styles.characterCount}>{playerAnswer.length}/500</Text>

                      <View style={styles.answerActions}>
                        <TouchableOpacity
                          style={styles.submitButton}
                          onPress={handleSubmitAnswer}
                          disabled={!playerAnswer.trim()}
                        >
                          <LinearGradient
                            colors={playerAnswer.trim() ? ['#06FFA5', '#00D4AA'] : ['#374151', '#4B5563']}
                            style={styles.submitButtonGradient}
                          >
                            <Send size={20} color="#FFFFFF" />
                            <Text style={styles.submitButtonText}>Submit Answer</Text>
                          </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                          <Text style={styles.skipButtonText}>Skip Question</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {gamePhase === 'viewing' && (
                    <View style={styles.viewingContainer}>
                      <Text style={styles.viewingTitle}>
                        {currentPlayer === 'player' ? 'Your Answer:' : "Luna's Answer:"}
                      </Text>
                      
                      <View style={styles.answerDisplay}>
                        <LinearGradient
                          colors={currentPlayer === 'player' 
                            ? ['rgba(0, 245, 255, 0.1)', 'rgba(0, 128, 255, 0.05)']
                            : ['rgba(157, 78, 221, 0.1)', 'rgba(199, 125, 255, 0.05)']
                          }
                          style={styles.answerDisplayGradient}
                        >
                          <Text style={styles.answerText}>
                            {currentPlayer === 'player' ? playerAnswer : opponentAnswer}
                          </Text>
                        </LinearGradient>
                      </View>

                      <Text style={styles.viewingSubtitle}>
                        {currentPlayer === 'player' 
                          ? 'Luna can see your answer for a few seconds...'
                          : 'Take a moment to read her answer...'
                        }
                      </Text>
                    </View>
                  )}

                  {gamePhase === 'waiting' && currentPlayer === 'opponent' && (
                    <View style={styles.waitingContainer}>
                      <Text style={styles.waitingTitle}>Luna is thinking...</Text>
                      <Text style={styles.waitingSubtitle}>She's crafting her honest answer</Text>
                      <Text style={styles.questionReminder}>{currentQuestion?.text}</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
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
  },
  mainScroll: {
    flex: 1,
  },
  mainScrollContent: {
    flexGrow: 1,
    padding: screenWidth * 0.05,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: screenHeight * 0.02,
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
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: screenHeight * 0.02,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: screenWidth * 0.03,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: Math.min(screenWidth * 0.08, 32),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  currentPlayerIndicator: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.02,
  },
  currentPlayerText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
  },
  gameArea: {
    flex: 1,
    minHeight: screenHeight * 0.5,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: screenWidth * 0.05,
    minHeight: screenHeight * 0.3,
  },
  questionTypeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: screenHeight * 0.015,
    alignSelf: 'center',
    backgroundColor: '#9D4EDD',
  },
  questionTypeText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: screenWidth * 0.02,
  },
  difficultyBadge: {
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: screenHeight * 0.025,
  },
  difficultyText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Bold',
    color: '#0F0F23',
  },
  questionScroll: {
    maxHeight: screenHeight * 0.2,
    marginVertical: screenHeight * 0.02,
  },
  questionText: {
    fontSize: Math.min(screenWidth * 0.05, 20),
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: Math.min(screenWidth * 0.07, 28),
  },
  startAnswerButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  startAnswerButtonGradient: {
    paddingVertical: screenHeight * 0.02,
    alignItems: 'center',
  },
  startAnswerButtonText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  answeringContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: screenWidth * 0.05,
    minHeight: screenHeight * 0.4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenHeight * 0.02,
  },
  timerText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginLeft: screenWidth * 0.02,
  },
  answeringTitle: {
    fontSize: Math.min(screenWidth * 0.05, 20),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: screenHeight * 0.015,
  },
  questionReminder: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: screenHeight * 0.025,
    lineHeight: Math.min(screenWidth * 0.055, 22),
  },
  answerInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: screenWidth * 0.04,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
    fontSize: Math.min(screenWidth * 0.04, 16),
    minHeight: screenHeight * 0.15,
    textAlignVertical: 'top',
    marginVertical: screenHeight * 0.02,
  },
  characterCount: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'right',
    marginBottom: screenHeight * 0.025,
  },
  answerActions: {
    gap: screenHeight * 0.015,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: screenHeight * 0.02,
    gap: screenWidth * 0.02,
  },
  submitButtonText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: screenHeight * 0.015,
  },
  skipButtonText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textDecorationLine: 'underline',
  },
  viewingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: screenWidth * 0.05,
    minHeight: screenHeight * 0.3,
  },
  viewingTitle: {
    fontSize: Math.min(screenWidth * 0.05, 20),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: screenHeight * 0.025,
  },
  answerDisplay: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: screenHeight * 0.025,
  },
  answerDisplayGradient: {
    padding: screenWidth * 0.05,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  answerText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    lineHeight: Math.min(screenWidth * 0.06, 24),
    textAlign: 'center',
  },
  viewingSubtitle: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  waitingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: screenWidth * 0.05,
    minHeight: screenHeight * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waitingTitle: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: screenHeight * 0.01,
  },
  waitingSubtitle: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: screenHeight * 0.025,
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
    marginBottom: screenHeight * 0.01,
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
    marginBottom: screenHeight * 0.02,
  },
  completedSubtitle: {
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