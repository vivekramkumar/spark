export interface GameProps {
  onComplete: (winner: "player" | "opponent") => void;
  onStateUpdate: (newState: any) => void;
  gameState: any;
  onBack?: () => void;
  initialState?: any;
} 