import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, Trophy, Clock, Send } from 'lucide-react-native';

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
}

export default function TruthOrDareGame({ onGameComplete, onBack }: TruthGameProps) {
  const [currentPlayer, setCurrentPlayer] = useState<'player' | 'opponent'>('player');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gamePhase, setGamePhase] = useState<'question' | 'answering' | 'viewing' | 'waiting' | 'completed'>('question');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isProcessingTurn, setIsProcessingTurn] = useState(false);
  const [playerAnswer, setPlayerAnswer] = useState('');
  const [opponentAnswer, setOpponentAnswer] = useState('');
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const fadeAnim = new Animated.Value(0);

  const maxRounds = 6;

  useEffect(() => {
    generateNewQuestion();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && gamePhase === 'answering') {
      handleSubmitAnswer();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, gamePhase]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentQuestion]);

  // Handle opponent's turn automatically
  useEffect(() => {
    if (currentPlayer === 'opponent' && gamePhase === 'question' && !isProcessingTurn) {
      setIsProcessingTurn(true);
      setGamePhase('waiting');
      
      // Simulate opponent answering
      setTimeout(() => {
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
        setTimeout(() => {
          nextTurn();
        }, 5000);
      }, 2000);
    }
  }, [currentPlayer, gamePhase, isProcessingTurn]);

  const generateNewQuestion = () => {
    const availableQuestions = TRUTH_QUESTIONS.filter(q => !usedQuestions.includes(q.id));
    if (availableQuestions.length === 0) {
      setUsedQuestions([]);
      setCurrentQuestion(TRUTH_QUESTIONS[Math.floor(Math.random() * TRUTH_QUESTIONS.length)]);
    } else {
      const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      setCurrentQuestion(randomQuestion);
      setUsedQuestions(prev => [...prev, randomQuestion.id]);
    }
    fadeAnim.setValue(0);
  };

  const handleStartAnswering = () => {
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
    setIsProcessingTurn(false);
    
    if (round >= maxRounds) {
      setGamePhase('completed');
      const winner = playerScore >= opponentScore ? 'player' : 'opponent';
      setTimeout(() => onGameComplete(winner), 2000);
    } else {
      // Switch players
      const nextPlayer = currentPlayer === 'player' ? 'opponent' : 'player';
      setCurrentPlayer(nextPlayer);
      
      // Increment round only after both players have played
      if (currentPlayer === 'opponent') {
        setRound(prev => prev + 1);
      }
      
      setGamePhase('question');
      setCurrentQuestion(null);
      setPlayerAnswer('');
      setOpponentAnswer('');
      generateNewQuestion();
    }
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
                {gamePhase === 'question' && currentPlayer === 'player' && currentQuestion && (
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
  scoreBoard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: screenHeight * 0.025,
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
    marginBottom: screenHeight * 0.025,
  },
  currentPlayerText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
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
    maxHeight: screenHeight * 0.25,
    marginBottom: screenHeight * 0.03,
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
    backgroundColor: 'rgba(31, 31, 58, 0.8)',
    borderRadius: 20,
    padding: screenWidth * 0.06,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    backgroundColor: 'rgba(31, 31, 58, 0.5)',
    borderRadius: 16,
    padding: screenWidth * 0.04,
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: screenHeight * 0.15,
    textAlignVertical: 'top',
    marginBottom: screenHeight * 0.01,
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
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.05,
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
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.05,
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