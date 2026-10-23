import { useState, useEffect, useCallback, useRef } from 'react';
import { Tutor, GameRound } from './types';
import { getRandomTutors } from './data/tutors';
import {
  calculatePoints,
  getErrorPercent,
  getVerdict,
  getDifferenceText,
  formatPrice,
  determineGameStatus,
  getStatusTitle,
  getStatusDescription,
  getStatusEmoji,
} from './utils/scoring';

type Page = 'home' | 'game' | 'results' | 'about';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [guess, setGuess] = useState(1000);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [sliderAnimated, setSliderAnimated] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  const startGame = useCallback(() => {
    const selected = getRandomTutors(10);
    setTutors(selected);
    setCurrentRound(0);
    setRounds([]);
    setGuess(1000);
    setHasAnswered(false);
    setSliderAnimated(false);
    setPage('game');
  }, []);

  // Animate slider on first game load
  useEffect(() => {
    if (page === 'game' && !sliderAnimated && !hasAnswered) {
      const timer = setTimeout(() => {
        setGuess(1500);
        setTimeout(() => setGuess(800), 300);
        setTimeout(() => setGuess(1000), 600);
        setSliderAnimated(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [page, sliderAnimated, hasAnswered]);

  const handleGuess = () => {
    if (hasAnswered) return;
    const tutor = tutors[currentRound];
    const points = calculatePoints(guess, tutor.price);
    const errorPercent = getErrorPercent(guess, tutor.price);
    const difference = guess - tutor.price;

    const round: GameRound = {
      tutor,
      guess,
      actualPrice: tutor.price,
      points,
      errorPercent,
      difference,
    };

    setRounds((prev) => [...prev, round]);
    setHasAnswered(true);
  };

  const nextRound = () => {
    if (currentRound + 1 >= tutors.length) {
      setPage('results');
    } else {
      setCurrentRound((prev) => prev + 1);
      setGuess(1000);
      setHasAnswered(false);
    }
  };

  const totalPoints = rounds.reduce((sum, r) => sum + r.points, 0);

  const handleShare = async () => {
    const text = `Репетиторий: мой результат — ${totalPoints} из 1000 баллов! Сможешь лучше? 🎯`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Репетиторий', text });
      } catch {
        try {
          await navigator.clipboard.writeText(text);
          alert('Результат скопирован в буфер обмена!');
        } catch {
          alert(text);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('Результат скопирован в буфер обмена!');
      } catch {
        alert(text);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {page === 'home' && <HomePage onStart={startGame} onAbout={() => setPage('about')} />}
      {page === 'game' && tutors.length > 0 && (
        <GamePage
          key={currentRound}
          tutor={tutors[currentRound]}
          currentRound={currentRound}
          totalRounds={tutors.length}
          guess={guess}
          setGuess={setGuess}
          hasAnswered={hasAnswered}
          rounds={rounds}
          onGuess={handleGuess}
          onNext={nextRound}
          sliderRef={sliderRef}
        />
      )}
      {page === 'results' && (
        <ResultsPage
          rounds={rounds}
          totalPoints={totalPoints}
          onRestart={startGame}
          onShare={handleShare}
          onHome={() => setPage('home')}
          onAbout={() => setPage('about')}
        />
      )}
      {page === 'about' && <AboutPage onBack={() => setPage('home')} onRestart={startGame} />}

      {/* Footer */}
      {page !== 'game' && (
        <footer className="mt-auto py-4 px-4 border-t border-gray-100 text-center text-xs text-gray-400">
          <div className="flex justify-center gap-4 flex-wrap">
            <button onClick={() => setPage('about')} className="hover:text-[#26CD94] transition-colors">
              Об игре
            </button>
            <span>·</span>
            <span>Источник данных: Авито</span>
            <span>·</span>
            <button onClick={startGame} className="hover:text-[#26CD94] transition-colors">
              Начать заново
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}

// ============ HOME PAGE ============
function HomePage({ onStart, onAbout }: { onStart: () => void; onAbout: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
      {/* Math decoration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#26CD94] to-[#1ba876] flex items-center justify-center shadow-lg shadow-[#26CD94]/20">
          <span className="text-white text-4xl font-bold">∑</span>
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-sm animate-bounce">
          π
        </div>
        <div className="absolute -bottom-1 -left-2 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs">
          ∞
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">
        Репетиторий
      </h1>

      <h2 className="text-lg md:text-xl text-gray-600 text-center mb-4 max-w-md">
        Сколько стоит репетитор? Попробуй угадать!
      </h2>

      <p className="text-sm text-gray-500 text-center mb-8 max-w-sm leading-relaxed">
        Мы собрали реальные объявления репетиторов по математике из Ленинградской области.
        Сможешь определить, сколько стоят их услуги, не заглядывая в ценник?
      </p>

      <button
        onClick={onStart}
        className="w-full max-w-xs px-8 py-4 bg-[#26CD94] hover:bg-[#1ba876] text-white font-semibold rounded-2xl shadow-lg shadow-[#26CD94]/25 transition-all duration-200 hover:scale-105 active:scale-95 text-lg mb-3"
      >
        Запустить игру
      </button>

      <p className="text-xs text-gray-400 mb-8">
        10 объявлений · 10 попыток · 1000 баллов
      </p>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-3 max-w-sm w-full mb-8">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-2xl mb-1">🎓</div>
          <div className="text-xs text-gray-500">Реальные цены</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-xs text-gray-500">Угадай цену</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-xs text-gray-500">Набери баллы</div>
        </div>
      </div>

      <button
        onClick={onAbout}
        className="text-sm text-gray-400 hover:text-[#26CD94] transition-colors"
      >
        Подробнее об игре →
      </button>
    </div>
  );
}

// ============ GAME PAGE ============
interface GamePageProps {
  tutor: Tutor;
  currentRound: number;
  totalRounds: number;
  guess: number;
  setGuess: (v: number) => void;
  hasAnswered: boolean;
  rounds: GameRound[];
  onGuess: () => void;
  onNext: () => void;
  sliderRef: React.RefObject<HTMLInputElement>;
}

function GamePage({
  tutor,
  currentRound,
  totalRounds,
  guess,
  setGuess,
  hasAnswered,
  rounds,
  onGuess,
  onNext,
  sliderRef,
}: GamePageProps) {
  const totalPoints = rounds.reduce((sum, r) => sum + r.points, 0);
  const progress = ((currentRound + (hasAnswered ? 1 : 0)) / totalRounds) * 100;
  const [imgError, setImgError] = useState(false);

  // Reset image error state when tutor changes
  useEffect(() => {
    setImgError(false);
  }, [tutor.id]);

  return (
    <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-4 py-3 pb-safe animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#26CD94] flex items-center justify-center">
            <span className="text-white text-sm font-bold">∑</span>
          </div>
          <span className="text-sm font-semibold text-gray-700">Репетиторий</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {totalPoints} балл{getPointsSuffix(totalPoints)}
          </span>
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
            {currentRound + 1} из {totalRounds}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-[#26CD94] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Tutor Card */}
      <div className="flex-1 overflow-y-auto">
        {/* Image */}
        <div className="relative mb-4 rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3]">
          {tutor.image && !imgError ? (
            <img
              src={tutor.image}
              alt={tutor.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#26CD94]/10 to-[#26CD94]/5 flex flex-col items-center justify-center">
              <div className="text-5xl mb-2 opacity-30">📐</div>
              <div className="text-xs text-gray-400">Объявление #{tutor.id}</div>
            </div>
          )}
        </div>

        {/* Title & Info */}
        <h2 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
          {tutor.title}
        </h2>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
            <span>📍</span> {tutor.city}
          </span>
        </div>

        {/* Price guessing section */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-base font-semibold text-gray-800 mb-3">
            💰 Сколько стоит занятие?
          </h3>

          {/* Current guess display */}
          <div className="text-center mb-3">
            <span className="text-3xl font-bold text-gray-900 transition-all duration-200">
              {formatPrice(guess)} ₽
            </span>
          </div>

          {/* Slider */}
          <div className="mb-4 px-1">
            <input
              ref={sliderRef}
              type="range"
              min={100}
              max={5000}
              step={50}
              value={guess}
              onChange={(e) => setGuess(Number(e.target.value))}
              disabled={hasAnswered}
              className="w-full h-2 rounded-full appearance-none cursor-pointer disabled:cursor-not-allowed
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-6
                [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-[#26CD94]
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:shadow-[#26CD94]/30
                [&::-webkit-slider-thumb]:border-2
                [&::-webkit-slider-thumb]:border-white
                [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:hover:scale-110
                [&::-moz-range-thumb]:w-6
                [&::-moz-range-thumb]:h-6
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-[#26CD94]
                [&::-moz-range-thumb]:border-2
                [&::-moz-range-thumb]:border-white"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>100 ₽</span>
              <span>5 000 ₽</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mb-4">
            Угадываем минимальную опубликованную цену
          </p>

          {/* Guess button or Result */}
          {!hasAnswered ? (
            <button
              onClick={onGuess}
              className="w-full py-4 bg-[#26CD94] hover:bg-[#1ba876] text-white font-semibold rounded-2xl shadow-lg shadow-[#26CD94]/20 transition-all duration-200 hover:scale-[1.02] active:scale-95 text-base"
            >
              Оценить
            </button>
          ) : (
            <ResultDisplay tutor={tutor} guess={guess} rounds={rounds} />
          )}
        </div>
      </div>

      {/* Next button */}
      {hasAnswered && (
        <div className="mt-4 pb-2">
          <button
            onClick={onNext}
            className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95 text-base"
          >
            {currentRound + 1 >= totalRounds ? 'Итоги →' : 'Следующее объявление →'}
          </button>
        </div>
      )}
    </div>
  );
}

// ============ RESULT DISPLAY ============
function ResultDisplay({
  tutor,
  guess,
  rounds,
}: {
  tutor: Tutor;
  guess: number;
  rounds: GameRound[];
}) {
  const lastRound = rounds[rounds.length - 1];
  const points = lastRound.points;
  const verdict = getVerdict(guess, tutor.price);
  const diffText = getDifferenceText(guess, tutor.price);
  const isCorrect = lastRound.errorPercent <= 5;
  const isOver = guess > tutor.price;

  return (
    <div className="space-y-3 animate-fadeIn">
      {/* Actual price */}
      <div className="bg-gray-50 rounded-2xl p-4 text-center">
        <p className="text-xs text-gray-400 mb-1">Правильная цена</p>
        <p className="text-2xl font-bold text-gray-900">{tutor.priceLabel}</p>
      </div>

      {/* Verdict */}
      <div
        className={`rounded-2xl p-4 text-center ${
          isCorrect
            ? 'bg-green-50 border border-green-100'
            : isOver
            ? 'bg-orange-50 border border-orange-100'
            : 'bg-blue-50 border border-blue-100'
        }`}
      >
        <p
          className={`text-lg font-bold ${
            isCorrect ? 'text-green-700' : isOver ? 'text-orange-700' : 'text-blue-700'
          }`}
        >
          {verdict}
        </p>
        <p className="text-sm text-gray-600 mt-1">{diffText}</p>
      </div>

      {/* Points */}
      <div className="bg-[#26CD94]/5 rounded-2xl p-3 text-center">
        <span className="text-sm text-gray-500">Баллы: </span>
        <span className="text-xl font-bold text-[#26CD94]">+{points}</span>
      </div>

      {/* Avito link */}
      <a
        href={tutor.avitoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center text-sm text-[#26CD94] hover:underline"
      >
        Посмотреть объявление на Авито →
      </a>
    </div>
  );
}

// ============ RESULTS PAGE ============
interface ResultsPageProps {
  rounds: GameRound[];
  totalPoints: number;
  onRestart: () => void;
  onShare: () => void;
  onHome: () => void;
  onAbout: () => void;
}

function ResultsPage({ rounds, totalPoints, onRestart, onShare, onHome, onAbout }: ResultsPageProps) {
  const guesses = rounds.map((r) => ({ guess: r.guess, realPrice: r.actualPrice }));
  const status = determineGameStatus(guesses);
  const exactCount = rounds.filter((r) => r.errorPercent <= 5).length;
  const avgError = rounds.reduce((sum, r) => sum + r.errorPercent, 0) / rounds.length;
  const totalOverestimate = rounds
    .filter((r) => r.difference > 0)
    .reduce((sum, r) => sum + r.difference, 0);
  const totalUnderestimate = rounds
    .filter((r) => r.difference < 0)
    .reduce((sum, r) => sum + Math.abs(r.difference), 0);

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-6 max-w-lg mx-auto w-full">
      {/* Status emoji */}
      <div className="text-6xl mb-4 animate-bounce">{getStatusEmoji(status)}</div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
        {getStatusTitle(status)}
      </h1>

      <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
        {getStatusDescription(status)}
      </p>

      {/* Score */}
      <div className="w-full bg-gradient-to-br from-[#26CD94] to-[#1ba876] rounded-3xl p-6 text-center text-white mb-6 shadow-lg shadow-[#26CD94]/20">
        <p className="text-sm opacity-80 mb-1">Ваш результат</p>
        <p className="text-5xl font-bold">{totalPoints}</p>
        <p className="text-sm opacity-80">из 1000 баллов</p>
      </div>

      {/* Stats */}
      <div className="w-full grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Точных ответов" value={`${exactCount} из ${rounds.length}`} emoji="🎯" />
        <StatCard label="Средняя ошибка" value={`${avgError.toFixed(1)}%`} emoji="📊" />
        <StatCard label="Переоценки" value={`${formatPrice(totalOverestimate)} ₽`} emoji="📈" />
        <StatCard label="Недооценки" value={`${formatPrice(totalUnderestimate)} ₽`} emoji="📉" />
      </div>

      {/* Round details */}
      <div className="w-full mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Подробности по раундам</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {rounds.map((round, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 text-sm"
            >
              <span className="text-gray-600 truncate flex-1 mr-2">
                {round.tutor.city}
              </span>
              <span className="text-gray-400 mr-2 whitespace-nowrap">
                {formatPrice(round.guess)} → {formatPrice(round.actualPrice)} ₽
              </span>
              <span
                className={`font-semibold ${
                  round.points >= 80
                    ? 'text-green-600'
                    : round.points >= 40
                    ? 'text-yellow-600'
                    : 'text-red-500'
                }`}
              >
                +{round.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={onRestart}
          className="w-full py-4 bg-[#26CD94] hover:bg-[#1ba876] text-white font-semibold rounded-2xl shadow-lg shadow-[#26CD94]/20 transition-all duration-200 hover:scale-[1.02] active:scale-95"
        >
          Сыграть ещё раз
        </button>
        <button
          onClick={onShare}
          className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all duration-200"
        >
          Поделиться результатом
        </button>
      </div>

      {/* Footer links */}
      <div className="flex gap-4 mt-6 text-xs text-gray-400">
        <button onClick={onAbout} className="hover:text-[#26CD94] transition-colors">
          Об игре
        </button>
        <span>·</span>
        <span>Источник: Авито</span>
        <span>·</span>
        <button onClick={onHome} className="hover:text-[#26CD94] transition-colors">
          На главную
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-3 text-center">
      <div className="text-xl mb-1">{emoji}</div>
      <div className="text-lg font-bold text-gray-800">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

// ============ ABOUT PAGE ============
function AboutPage({ onBack, onRestart }: { onBack: () => void; onRestart: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Об игре</h1>

      <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
        <p>
          <strong>«Репетиторий»</strong> — это образовательная игра, в которой вы пытаетесь угадать
          стоимость услуг репетиторов по математике на основе реальных объявлений с Авито.
        </p>

        <p>
          Источник данных — опубликованные объявления репетиторов по математике из Ленинградской
          области, собранные с платформы Авито. В игре используются реальные фотографии и заголовки
          из объявлений.
        </p>

        <p>
          Проект является учебным и не связан с компанией Авито. Все цены отражают данные на момент
          сбора информации.
        </p>

        <h3 className="font-semibold text-gray-800 mt-4">Как играть:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Вам показываются 10 случайных объявлений</li>
          <li>Изучите фото и заголовок объявления</li>
          <li>Передвиньте бегунок, чтобы выбрать предполагаемую цену</li>
          <li>Нажмите «Оценить» и узнайте правильный ответ</li>
          <li>За точность начисляются баллы (максимум 100 за объявление)</li>
          <li>Максимальный результат — 1000 баллов</li>
        </ul>

        <h3 className="font-semibold text-gray-800 mt-4">Система баллов:</h3>
        <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-xs">
          <div className="flex justify-between">
            <span>Ошибка 0–5%</span>
            <span className="font-semibold text-green-600">100 баллов</span>
          </div>
          <div className="flex justify-between">
            <span>Ошибка 5–10%</span>
            <span className="font-semibold">80 баллов</span>
          </div>
          <div className="flex justify-between">
            <span>Ошибка 10–20%</span>
            <span className="font-semibold">60 баллов</span>
          </div>
          <div className="flex justify-between">
            <span>Ошибка 20–30%</span>
            <span className="font-semibold">40 баллов</span>
          </div>
          <div className="flex justify-between">
            <span>Ошибка 30–50%</span>
            <span className="font-semibold">20 баллов</span>
          </div>
          <div className="flex justify-between">
            <span>Ошибка более 50%</span>
            <span className="font-semibold text-red-500">0 баллов</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-8 w-full">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-2xl transition-all"
        >
          Назад
        </button>
        <button
          onClick={onRestart}
          className="flex-1 py-3 bg-[#26CD94] hover:bg-[#1ba876] text-white font-semibold rounded-2xl transition-all"
        >
          Играть
        </button>
      </div>
    </div>
  );
}

// ============ HELPERS ============
function getPointsSuffix(n: number): string {
  const abs = Math.abs(n) % 100;
  const lastDigit = abs % 10;
  if (abs > 10 && abs < 20) return 'ов';
  if (lastDigit > 1 && lastDigit < 5) return 'а';
  if (lastDigit === 1) return '';
  return 'ов';
}
