import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EmojiStoryGame from './EmojiStoryGame';
import NeverHaveIEverGame from './NeverHaveIEverGame';
import RapidFireGame from './RapidFireGame';
import TruthOrDareGame from './TruthOrDareGame';
import WouldYouRatherGame from './WouldYouRatherGame';

type GameType = 'truth-or-dare' | 'never-have-i-ever' | 'would-you-rather' | 'rapid-fire' | 'emoji-story';

interface Question {
  id: string;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface BaseGameState {
  currentPlayer: 'player' | 'opponent';
  playerScore: number;
  opponentScore: number;
  round: number;
  gamePhase: 'question' | 'answering' | 'viewing' | 'waiting' | 'completed' | 'results' | 'prompt' | 'creating';
  usedQuestions: string[];
}

interface TruthGameState extends BaseGameState {
  currentQuestion: Question | null;
  playerAnswer: string;
  opponentAnswer: string;
}

interface NeverHaveIEverGameState extends BaseGameState {
  currentQuestion: string | null;
  playerAnswer: boolean | null;
  opponentAnswer: boolean | null;
}

interface WouldYouRatherGameState extends BaseGameState {
  currentQuestion: Question | null;
  playerAnswer: 'A' | 'B' | null;
  opponentAnswer: 'A' | 'B' | null;
}

interface RapidFireGameState extends BaseGameState {
  currentQuestion: Question | null;
  playerAnswer: string;
  opponentAnswer: string;
  timeLeft: number;
}

interface EmojiStoryGameState extends BaseGameState {
  currentPrompt: string | null;
  playerStory: string;
  opponentStory: string;
  timeLeft: number;
  usedPrompts: string[];
}

type GameState = 
  | TruthGameState 
  | NeverHaveIEverGameState 
  | WouldYouRatherGameState 
  | RapidFireGameState 
  | EmojiStoryGameState;

interface GameContainerProps {
  currentGame: GameType;
  onGameComplete: (winner: 'player' | 'opponent') => void;
  onBack: () => void;
  initialState?: GameState;
  onStateUpdate: (newState: GameState) => void;
}

const formatGameTitle = (game: GameType): string => {
  return game
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function GameContainer({
  currentGame,
  onGameComplete,
  onBack,
  initialState,
  onStateUpdate,
}: GameContainerProps) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border.default,
    },
    backButton: {
      marginRight: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text.primary,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    message: {
      color: theme.colors.text.primary,
      fontSize: 16,
      textAlign: 'center',
    },
  });

  const renderGame = () => {
    const gameProps = {
      onGameComplete,
      onBack,
      initialState,
      onStateUpdate,
    };

    switch (currentGame) {
      case 'truth-or-dare':
        return <TruthOrDareGame {...(gameProps as any)} />;
      case 'never-have-i-ever':
        return <NeverHaveIEverGame {...(gameProps as any)} />;
      case 'would-you-rather':
        return <WouldYouRatherGame {...(gameProps as any)} />;
      case 'rapid-fire':
        return <RapidFireGame {...(gameProps as any)} />;
      case 'emoji-story':
        return <EmojiStoryGame {...(gameProps as any)} />;
      default:
        return (
          <View style={styles.content}>
            <Text style={styles.message}>
              Game components will be implemented separately
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{formatGameTitle(currentGame)}</Text>
      </View>
      {renderGame()}
    </View>
  );
} 