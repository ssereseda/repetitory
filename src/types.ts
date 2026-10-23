export interface Tutor {
  id: string;
  title: string;
  description: string;
  city: string;
  tutorName: string;
  price: number;
  priceLabel: string;
  images: string[];
  avitoUrl: string;
  experience?: string;
  specialization?: string;
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
