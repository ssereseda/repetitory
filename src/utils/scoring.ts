import { GameStatus } from '../types';

export function calculatePoints(guess: number, realPrice: number): number {
  const errorPercent = (Math.abs(guess - realPrice) / realPrice) * 100;

  if (errorPercent <= 5) return 100;
  if (errorPercent <= 10) return 80;
  if (errorPercent <= 20) return 60;
  if (errorPercent <= 30) return 40;
  if (errorPercent <= 50) return 20;
  return 0;
}

export function getErrorPercent(guess: number, realPrice: number): number {
  return (Math.abs(guess - realPrice) / realPrice) * 100;
}

export function getVerdict(guess: number, realPrice: number): string {
  const errorPercent = getErrorPercent(guess, realPrice);

  if (errorPercent <= 5) return 'Точно!';
  if (errorPercent <= 20) return 'Почти угадал!';
  if (guess > realPrice) return 'Ты переоценил стоимость';
  return 'Ты недооценил стоимость';
}

export function getDifferenceText(guess: number, realPrice: number): string {
  const diff = guess - realPrice;
  if (diff > 0) return `На ${formatPrice(diff)} ₽ больше`;
  if (diff < 0) return `На ${formatPrice(Math.abs(diff))} ₽ меньше`;
  return 'В точку!';
}

export function formatPrice(value: number): string {
  return value.toLocaleString('ru-RU');
}

export function determineGameStatus(
  guesses: { guess: number; realPrice: number }[]
): GameStatus {
  let totalOverestimate = 0;
  let totalUnderestimate = 0;

  for (const { guess, realPrice } of guesses) {
    const diff = guess - realPrice;
    if (diff > 0) {
      totalOverestimate += diff;
    } else {
      totalUnderestimate += Math.abs(diff);
    }
  }

  const netBias = totalOverestimate - totalUnderestimate;
  const totalGuesses = guesses.length;
  const avgRealPrice =
    guesses.reduce((sum, g) => sum + g.realPrice, 0) / totalGuesses;
  const normalizedBias = netBias / (avgRealPrice * totalGuesses);

  // If bias is small relative to average prices, it's an expert
  if (Math.abs(normalizedBias) < 0.1) {
    return 'expert';
  }

  if (netBias > 0) {
    return 'generous';
  }

  return 'bargain';
}

export function getStatusTitle(status: GameStatus): string {
  switch (status) {
    case 'generous':
      return 'Щедрый ученик';
    case 'expert':
      return 'Эксперт по репетиторам';
    case 'bargain':
      return 'Охотник за скидками';
  }
}

export function getStatusDescription(status: GameStatus): string {
  switch (status) {
    case 'generous':
      return 'Кажется, ты готов платить за знания больше, чем просят преподаватели!';
    case 'expert':
      return 'Отлично ориентируешься в ценах на образовательные услуги!';
    case 'bargain':
      return 'Ты явно умеешь экономить. Но хорошие занятия иногда стоят дороже, чем кажется!';
  }
}

export function getStatusEmoji(status: GameStatus): string {
  switch (status) {
    case 'generous':
      return '💰';
    case 'expert':
      return '🎯';
    case 'bargain':
      return '🏷️';
  }
}
