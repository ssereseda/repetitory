export interface Tutor {
  id: string;
  title: string;
  city: string;
  price: number;
  priceLabel: string;
  image: string | null;
  avitoUrl: string;
}

export interface GameRound {
  tutor: Tutor;
  guess: number;
  actualPrice: number;
  points: number;
  errorPercent: number;
  difference: number;
}

export interface GameState {
  rounds: GameRound[];
  currentRound: number;
  totalPoints: number;
  isFinished: boolean;
}

export type GameStatus = 'generous' | 'expert' | 'bargain';
