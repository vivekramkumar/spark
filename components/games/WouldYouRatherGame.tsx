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
import { Target, Trophy, ArrowLeft, ArrowRight } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface Question {
  id: string;
  optionA: string;
  optionB: string;
  category: 'fun' | 'romantic' | 'deep' | 'wild';
}

const QUESTIONS: Question[] = [
  {
    id: '1',
    optionA: "Have the ability to read minds",
    optionB: "Have the ability to become invisible",
    category: 'fun'
  },
  {
    id: '2',
    optionA: "Go on a romantic dinner date",
    optionB: "Have a fun adventure date",
    category: 'romantic'
  },
  {
    id: '3',
    optionA: "Always know when someone is lying",
    optionB: "Always get away with lying",
    category: 'deep'
  },
  {
    id: '4',
    optionA: "Have unlimited money but no friends",
    optionB: "Have amazing friends but be poor",
    category: 'deep'
  },
  {
    id: '5',
    optionA: "Be able to fly",
    optionB: "Be able to teleport",
    category: 'fun'
  },
  {
    id: '6',
    optionA: "Find your soulmate but they live far away",
    optionB: "Have many good relationships nearby",
    category: 'romantic'
  },
  {
    id: '7',
    optionA: "Always be 10 minutes late",
    optionB: "Always be 20 minutes early",
    category: 'fun'
  },
  {
    id: '8',
    optionA: "Have your dream job but work alone",
    optionB: "Have an okay job with amazing colleagues",
    category: 'deep'
  },
  {
    id: '9',
    optionA: "Go skydiving together",
    optionB: "Go deep sea diving together",
    category: 'wild'
  },
  {
    id: '10',
    optionA: "Be famous but constantly criticized",
    optionB: "Be unknown but deeply loved by few",
    category: 'deep'
  },
  {
    id: '11',
    optionA: "Have a partner who's always honest",
    optionB: "Have a partner who's always supportive",
    category: 'romantic'
  },
  {
    id: '12',
    optionA: "Live in a world without music",
    optionB: "Live in a world without movies",
    category: 'fun'
  },
];

interface WouldYouRatherGameProps {
  onGameComplete: (winner: 'player' | 'opponent') => void;
  onBack: () => void;
}

export default function WouldYouRatherGame({ onGameComplete, onBack }: WouldYouRatherGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [round, setRound] = useState(1);
  const [gamePhase, setGamePhase] = useState<'question' | 'waiting' | 'results' | 'completed'>('question');
  const [playerChoice, setPlayerChoice] = useState<'A' | 'B' | null>(null);
  const [opponentChoice, setOpponentChoice] = useState<'A' | 'B' | null>(null);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [isProcessingRound, setIsProcessingRound] = useState(false);
  const fadeAnim = new Animated.Value(0);

  const maxRounds = 8;

  useEffect(() => {
    generateNewQuestion();
  }, []);

  useEffect(() => {
    if (playerChoice && opponentChoice && !isProcessingRound) {
      setIsProcessingRound(true);
      setGamePhase('results');
      setTimeout(() => {
        processRound();
      }, 3000);
    }
  }, [playerChoice, opponentChoice, isProcessingRound]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentQuestion]);

  const generateNewQuestion = () => {
    const availableQuestions = QUESTIONS.filter(q => !usedQuestions.includes(q.id));
    if (availableQuestions.length === 0) {
      setUsedQuestions([]);
      setCurrentQuestion(QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)]);
    } else {
      const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      setCurrentQuestion(randomQuestion);
      setUsedQuestions(prev => [...prev, randomQuestion.id]);
    }
    fadeAnim.setValue(0);
  };

  const handlePlayerChoice = (choice: 'A' | 'B') => {
    if (isProcessingRound) return;
    
    setPlayerChoice(choice);
    setGamePhase('waiting');
    
    // Simulate opponent choice
    setTimeout(() => {
      const opponentChoice = Math.random() > 0.5 ? 'A' : 'B';
      setOpponentChoice(opponentChoice);
    }, 2000);
  };

  const processRound = () => {
    // Award points for matching choices (shows compatibility)
    if (playerChoice === opponentChoice) {
      setPlayerScore(prev => prev + 2);
      setOpponentScore(prev => prev + 2);
    } else {
      // Award 1 point each for different choices (shows interesting contrast)
      setPlayerScore(prev => prev + 1);
      setOpponentScore(prev => prev + 1);
    }

    // Check for game end
    if (round >= maxRounds) {
      setGamePhase('completed');
      // In this game, it's more about compatibility than winning
      const winner = Math.random() > 0.5 ? 'player' : 'opponent';
      setTimeout(() => onGameComplete(winner), 2000);
    } else {
      // Next round
      setRound(prev => prev + 1);
      setPlayerChoice(null);
      setOpponentChoice(null);
      setGamePhase('question');
      setIsProcessingRound(false);
      generateNewQuestion();
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fun': return '#06FFA5';
      case 'romantic': return '#FF006E';
      case 'deep': return '#9D4EDD';
      case 'wild': return '#FFD60A';
      default: return '#9CA3AF';
    }
  };

  if (gamePhase === 'completed') {
    const compatibilityScore = Math.round(((playerScore + opponentScore) / (maxRounds * 4)) * 100);
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0F0F23', '#1A1A3A', '#2D1B69']}
          style={styles.backgroundGradient}
        >
          <View style={styles.completedContainer}>
            <Trophy size={Math.min(screenWidth * 0.16, 64)} color="#FFD700" />
            <Text style={styles.completedTitle}>Perfect Match!</Text>
            <Text style={styles.compatibilityScore}>{compatibilityScore}% Compatible</Text>
            <Text style={styles.completedSubtitle}>
              You and Luna have great chemistry! Time to chat and explore more.
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
          <Text style={styles.gameTitle}>Would You Rather</Text>
          <View style={styles.roundInfo}>
            <Text style={styles.roundText}>Round {round}/{maxRounds}</Text>
          </View>
        </View>

        <View style={styles.scoreBoard}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Compatibility</Text>
            <Text style={styles.scoreValue}>{playerScore + opponentScore} pts</Text>
          </View>
        </View>

        <View style={styles.gameArea}>
          {currentQuestion && (
            <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(currentQuestion.category) }]}>
                <Text style={styles.categoryText}>{currentQuestion.category.toUpperCase()}</Text>
              </View>

              <Text style={styles.questionTitle}>Would You Rather...</Text>

              {gamePhase === 'question' && !playerChoice && !isProcessingRound && (
                <View style={styles.optionsContainer}>
                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => handlePlayerChoice('A')}
                  >
                    <LinearGradient
                      colors={['rgba(0, 245, 255, 0.2)', 'rgba(0, 128, 255, 0.1)']}
                      style={styles.optionGradient}
                    >
                      <ArrowLeft size={Math.min(screenWidth * 0.06, 24)} color="#00F5FF" />
                      <ScrollView style={styles.optionTextContainer}>
                        <Text style={styles.optionText}>{currentQuestion.optionA}</Text>
                      </ScrollView>
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.orDivider}>
                    <Text style={styles.orText}>OR</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => handlePlayerChoice('B')}
                  >
                    <LinearGradient
                      colors={['rgba(255, 215, 0, 0.2)', 'rgba(255, 193, 7, 0.1)']}
                      style={styles.optionGradient}
                    >
                      <ScrollView style={styles.optionTextContainer}>
                        <Text style={styles.optionText}>{currentQuestion.optionB}</Text>
                      </ScrollView>
                      <ArrowRight size={Math.min(screenWidth * 0.06, 24)} color="#FFD700" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

              {gamePhase === 'waiting' && (
                <View style={styles.waitingContainer}>
                  <Text style={styles.waitingTitle}>Luna is choosing...</Text>
                  {playerChoice && (
                    <View style={styles.yourChoiceContainer}>
                      <Text style={styles.yourChoiceLabel}>You chose:</Text>
                      <Text style={styles.yourChoiceText}>
                        {playerChoice === 'A' ? currentQuestion.optionA : currentQuestion.optionB}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {gamePhase === 'results' && playerChoice && opponentChoice && (
                <View style={styles.resultsContainer}>
                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>You chose:</Text>
                    <View style={[styles.resultChoice, { 
                      backgroundColor: playerChoice === 'A' ? 'rgba(0, 245, 255, 0.2)' : 'rgba(255, 215, 0, 0.2)' 
                    }]}>
                      <Text style={styles.resultText}>
                        {playerChoice === 'A' ? currentQuestion.optionA : currentQuestion.optionB}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.resultItem}>
                    <Text style={styles.resultLabel}>Luna chose:</Text>
                    <View style={[styles.resultChoice, { 
                      backgroundColor: opponentChoice === 'A' ? 'rgba(0, 245, 255, 0.2)' : 'rgba(255, 215, 0, 0.2)' 
                    }]}>
                      <Text style={styles.resultText}>
                        {opponentChoice === 'A' ? currentQuestion.optionA : currentQuestion.optionB}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.matchIndicator}>
                    {playerChoice === opponentChoice ? (
                      <Text style={styles.matchText}>🎯 Perfect Match! +2 points each</Text>
                    ) : (
                      <Text style={styles.differentText}>✨ Interesting contrast! +1 point each</Text>
                    )}
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
  scoreBoard: {
    alignItems: 'center',
    marginBottom: screenHeight * 0.04,
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
    fontSize: Math.min(screenWidth * 0.06, 24),
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
  questionTitle: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: screenHeight * 0.03,
  },
  optionsContainer: {
    gap: screenHeight * 0.02,
  },
  optionButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: screenWidth * 0.05,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionTextContainer: {
    flex: 1,
    maxHeight: screenHeight * 0.1,
  },
  optionText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: Math.min(screenWidth * 0.055, 22),
  },
  orDivider: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  orText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#9CA3AF',
  },
  waitingContainer: {
    alignItems: 'center',
    paddingVertical: screenHeight * 0.025,
  },
  waitingTitle: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: screenHeight * 0.02,
  },
  yourChoiceContainer: {
    alignItems: 'center',
  },
  yourChoiceLabel: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  yourChoiceText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
    textAlign: 'center',
  },
  resultsContainer: {
    gap: screenHeight * 0.02,
  },
  resultItem: {
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  resultChoice: {
    padding: screenWidth * 0.04,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  matchIndicator: {
    alignItems: 'center',
    marginTop: screenHeight * 0.02,
    padding: screenWidth * 0.04,
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  matchText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#06FFA5',
    textAlign: 'center',
  },
  differentText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
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
  },
  compatibilityScore: {
    fontSize: Math.min(screenWidth * 0.12, 48),
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
    marginBottom: screenHeight * 0.02,
  },
  completedSubtitle: {
    fontSize: Math.min(screenWidth * 0.045, 18),
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