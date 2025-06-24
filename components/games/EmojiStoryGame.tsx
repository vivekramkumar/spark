import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Trophy, Clock, Send, Shuffle } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const EMOJI_SETS = [
  ['🌟', '🎭', '🌙', '🔥', '💫'],
  ['🎨', '🎪', '🎯', '🎲', '🎸'],
  ['🌺', '🦋', '🌈', '☀️', '🌊'],
  ['🍕', '🎂', '🍓', '☕', '🍯'],
  ['🚀', '🎢', '🎠', '🎡', '🎪'],
  ['💎', '🎁', '🎊', '🎉', '✨'],
  ['🦄', '🐙', '🦊', '🐺', '🦅'],
  ['🏰', '🗽', '🎪', '🎭', '🎨'],
];

const STORY_PROMPTS = [
  "Tell a story about a magical adventure",
  "Describe your perfect date",
  "Create a story about friendship",
  "Tell a tale of mystery and intrigue",
  "Describe a funny mishap",
  "Create a romantic story",
  "Tell about an epic journey",
  "Describe a dream you had",
];

interface EmojiStoryGameProps {
  onGameComplete: (winner: 'player' | 'opponent') => void;
  onBack: () => void;
}

export default function EmojiStoryGame({ onGameComplete, onBack }: EmojiStoryGameProps) {
  const [currentEmojis, setCurrentEmojis] = useState<string[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [playerStory, setPlayerStory] = useState<string>('');
  const [opponentStory, setOpponentStory] = useState<string>('');
  const [round, setRound] = useState(1);
  const [gamePhase, setGamePhase] = useState<'writing' | 'waiting' | 'results' | 'completed'>('writing');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per story
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [isProcessingRound, setIsProcessingRound] = useState(false);

  const maxRounds = 3;

  useEffect(() => {
    generateNewChallenge();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && gamePhase === 'writing' && !isProcessingRound) {
      handleSubmitStory();
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft, gamePhase, isProcessingRound]);

  const generateNewChallenge = () => {
    const randomEmojiSet = EMOJI_SETS[Math.floor(Math.random() * EMOJI_SETS.length)];
    const randomPrompt = STORY_PROMPTS[Math.floor(Math.random() * STORY_PROMPTS.length)];
    
    setCurrentEmojis(randomEmojiSet);
    setCurrentPrompt(randomPrompt);
    setTimeLeft(120);
    setIsTimerActive(true);
    setPlayerStory('');
    setOpponentStory('');
    setGamePhase('writing');
    setIsProcessingRound(false);
  };

  const handleSubmitStory = () => {
    if (isProcessingRound) return;
    Keyboard.dismiss();
    
    setIsProcessingRound(true);
    
    if (!playerStory.trim()) {
      setPlayerStory("I ran out of time! 😅");
    }
    
    setIsTimerActive(false);
    setGamePhase('waiting');
    
    // Simulate opponent story
    setTimeout(() => {
      const opponentStories = [
        `${currentEmojis[0]} Once upon a time, there was a magical place ${currentEmojis[1]} where dreams came true ${currentEmojis[2]}. Every day brought new adventures ${currentEmojis[3]} and endless possibilities ${currentEmojis[4]}!`,
        `${currentEmojis[0]} The story begins with a mysterious character ${currentEmojis[1]} who discovered something incredible ${currentEmojis[2]}. Through challenges and triumphs ${currentEmojis[3]}, they found what they were looking for ${currentEmojis[4]}.`,
        `${currentEmojis[0]} In a world full of wonder ${currentEmojis[1]}, two souls met by chance ${currentEmojis[2]}. Their journey together was filled with laughter ${currentEmojis[3]} and unforgettable moments ${currentEmojis[4]}.`,
      ];
      const randomStory = opponentStories[Math.floor(Math.random() * opponentStories.length)];
      setOpponentStory(randomStory);
      setGamePhase('results');
      
      setTimeout(() => {
        processRound();
      }, 5000);
    }, 3000);
  };

  const processRound = () => {
    // Award points based on story length and emoji usage
    const playerEmojiCount = currentEmojis.filter(emoji => playerStory.includes(emoji)).length;
    const playerPoints = Math.min(playerStory.length / 20, 5) + playerEmojiCount;
    
    const opponentEmojiCount = currentEmojis.filter(emoji => opponentStory.includes(emoji)).length;
    const opponentPoints = Math.min(opponentStory.length / 20, 5) + opponentEmojiCount;
    
    setPlayerScore(prev => prev + Math.round(playerPoints));
    setOpponentScore(prev => prev + Math.round(opponentPoints));

    if (round >= maxRounds) {
      setGamePhase('completed');
      const winner = playerScore + playerPoints > opponentScore + opponentPoints ? 'player' : 'opponent';
      setTimeout(() => onGameComplete(winner), 2000);
    } else {
      setRound(prev => prev + 1);
      setTimeout(() => {
        generateNewChallenge();
      }, 3000);
    }
  };

  const addEmojiToStory = (emoji: string) => {
    setPlayerStory(prev => prev + emoji);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
              <Heart size={Math.min(screenWidth * 0.16, 64)} color="#FF9F1C" />
              <Text style={styles.completedTitle}>Stories Complete!</Text>
              <Text style={styles.completedWinner}>{winner} Won!</Text>
              <Text style={styles.completedScore}>
                Final Score: {playerScore} - {opponentScore}
              </Text>
              <Text style={styles.completedSubtitle}>
                Amazing creativity! Your stories revealed so much personality.
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
                <Text style={styles.gameTitle}>Emoji Story</Text>
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

              <View style={styles.timerContainer}>
                <Clock size={Math.min(screenWidth * 0.05, 20)} color="#FF9F1C" />
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              </View>

              <View style={styles.gameArea}>
                {gamePhase === 'writing' && (
                  <View style={styles.writingContainer}>
                    <View style={styles.promptContainer}>
                      <Text style={styles.promptTitle}>Story Prompt:</Text>
                      <Text style={styles.promptText}>{currentPrompt}</Text>
                    </View>

                    <View style={styles.emojiContainer}>
                      <Text style={styles.emojiTitle}>Use these emojis in your story:</Text>
                      <View style={styles.emojiRow}>
                        {currentEmojis.map((emoji, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.emojiButton}
                            onPress={() => addEmojiToStory(emoji)}
                            disabled={isProcessingRound}
                          >
                            <Text style={styles.emojiText}>{emoji}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    <View style={styles.storyInputContainer}>
                      <TextInput
                        style={styles.storyInput}
                        value={playerStory}
                        onChangeText={setPlayerStory}
                        placeholder="Write your emoji story here..."
                        placeholderTextColor="rgba(156, 163, 175, 0.7)"
                        multiline
                        maxLength={500}
                        editable={!isProcessingRound}
                        returnKeyType="done"
                        onSubmitEditing={dismissKeyboard}
                      />
                      <Text style={styles.characterCount}>{playerStory.length}/500</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleSubmitStory}
                      disabled={!playerStory.trim() || isProcessingRound}
                    >
                      <LinearGradient
                        colors={playerStory.trim() && !isProcessingRound ? ['#FF9F1C', '#FFBF69'] : ['#374151', '#4B5563']}
                        style={styles.submitButtonGradient}
                      >
                        <Send size={Math.min(screenWidth * 0.05, 20)} color="#FFFFFF" />
                        <Text style={styles.submitButtonText}>Submit Story</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}

                {gamePhase === 'waiting' && (
                  <View style={styles.waitingContainer}>
                    <Text style={styles.waitingTitle}>Luna is writing her story...</Text>
                    <Text style={styles.waitingSubtitle}>Using the same emojis and prompt</Text>
                    <View style={styles.yourStoryPreview}>
                      <Text style={styles.previewLabel}>Your story:</Text>
                      <ScrollView style={styles.previewScroll}>
                        <Text style={styles.previewText}>{playerStory}</Text>
                      </ScrollView>
                    </View>
                  </View>
                )}

                {gamePhase === 'results' && (
                  <View style={styles.resultsContainer}>
                    <Text style={styles.resultsTitle}>Story Showdown!</Text>
                    
                    <View style={styles.storyComparison}>
                      <View style={styles.storyResult}>
                        <Text style={styles.storyAuthor}>Your Story:</Text>
                        <ScrollView style={styles.storyScroll}>
                          <Text style={styles.storyText}>{playerStory}</Text>
                        </ScrollView>
                      </View>

                      <View style={styles.storyResult}>
                        <Text style={styles.storyAuthor}>Luna's Story:</Text>
                        <ScrollView style={styles.storyScroll}>
                          <Text style={styles.storyText}>{opponentStory}</Text>
                        </ScrollView>
                      </View>
                    </View>

                    <View style={styles.scoringInfo}>
                      <Text style={styles.scoringText}>
                        Points awarded for creativity and emoji usage!
                      </Text>
                    </View>
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
    backgroundColor: 'rgba(255, 159, 28, 0.1)',
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 28, 0.3)',
  },
  roundText: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Bold',
    color: '#FF9F1C',
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
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: screenHeight * 0.025,
    gap: 8,
  },
  timerText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Bold',
    color: '#FF9F1C',
  },
  gameArea: {
    flex: 1,
  },
  writingContainer: {
    flex: 1,
  },
  promptContainer: {
    backgroundColor: 'rgba(31, 31, 58, 0.8)',
    borderRadius: 16,
    padding: screenWidth * 0.05,
    marginBottom: screenHeight * 0.025,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  promptTitle: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#FF9F1C',
    marginBottom: 8,
  },
  promptText: {
    fontSize: Math.min(screenWidth * 0.045, 18),
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    lineHeight: Math.min(screenWidth * 0.06, 24),
  },
  emojiContainer: {
    marginBottom: screenHeight * 0.025,
  },
  emojiTitle: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: screenHeight * 0.015,
    textAlign: 'center',
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  emojiButton: {
    backgroundColor: 'rgba(255, 159, 28, 0.1)',
    borderRadius: 25,
    padding: screenWidth * 0.03,
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 28, 0.3)',
  },
  emojiText: {
    fontSize: Math.min(screenWidth * 0.06, 24),
  },
  storyInputContainer: {
    flex: 1,
    marginBottom: screenHeight * 0.025,
  },
  storyInput: {
    backgroundColor: 'rgba(31, 31, 58, 0.8)',
    borderRadius: 16,
    padding: screenWidth * 0.04,
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: screenHeight * 0.15,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: Math.min(screenWidth * 0.03, 12),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
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
    gap: 8,
  },
  submitButtonText: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  waitingContainer: {
    alignItems: 'center',
    paddingVertical: screenHeight * 0.025,
  },
  waitingTitle: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  waitingSubtitle: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: screenHeight * 0.025,
  },
  yourStoryPreview: {
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderRadius: 16,
    padding: screenWidth * 0.04,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  previewLabel: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Bold',
    color: '#00F5FF',
    marginBottom: 8,
  },
  previewScroll: {
    maxHeight: screenHeight * 0.12,
  },
  previewText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    lineHeight: 20,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: Math.min(screenWidth * 0.06, 24),
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: screenHeight * 0.025,
  },
  storyComparison: {
    flex: 1,
    gap: screenHeight * 0.02,
  },
  storyResult: {
    backgroundColor: 'rgba(31, 31, 58, 0.8)',
    borderRadius: 16,
    padding: screenWidth * 0.04,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
  },
  storyAuthor: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    fontFamily: 'Inter-Bold',
    color: '#FF9F1C',
    marginBottom: 8,
  },
  storyScroll: {
    maxHeight: screenHeight * 0.15,
  },
  storyText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Regular',
    color: '#E5E7EB',
    lineHeight: 20,
  },
  scoringInfo: {
    alignItems: 'center',
    marginTop: screenHeight * 0.025,
  },
  scoringText: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
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