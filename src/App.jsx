import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from './components/Button';
import PerformanceStats from './components/PerformanceStats';
import UserProgress from './components/UserProgress';
import ThemeToggle from './components/ThemeToggle';
import LoadingScreen from './components/LoadingScreen';
import TypingArea from './components/TypingArea';
import Footer from './components/Footer'; // Import Footer component
import { calculateStats, generateChallengeTexts } from './utils/gameUtils';

const App = ({ initialDifficulty = 'medium' }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [challengeTexts, setChallengeTexts] = useState([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    streak: 0,
  });
  const [history, setHistory] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [difficulty, setDifficulty] = useState(initialDifficulty);

  useEffect(() => {
    const texts = generateChallengeTexts(difficulty);
    setChallengeTexts(texts);
  }, [difficulty]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let intervalId;
    if (isGameActive && startTime) {
      intervalId = setInterval(() => {
        setElapsedTime((Date.now() - startTime) / 1000);
      }, 100);
    }
    return () => intervalId && clearInterval(intervalId);
  }, [isGameActive, startTime]);

  const handleInputChange = (e) => {
    if (!isGameActive) {
      setIsGameActive(true);
      setStartTime(Date.now());
    }

    const newInput = e.target.value;
    setUserInput(newInput);

    const currentText = challengeTexts[currentTextIndex];
    if (newInput.length === currentText.length) {
      const newStats = calculateStats(newInput, currentText, startTime);
      setStats((prev) => ({
        wpm: newStats.wpm,
        accuracy: newStats.accuracy,
        streak: prev.streak + 1,
      }));

      setHistory((prev) => [
        ...prev,
        {
          attempt: prev.length + 1,
          wpm: newStats.wpm,
          accuracy: newStats.accuracy,
          text: currentText,
        },
      ]);

      const nextIndex = (currentTextIndex + 1) % challengeTexts.length;
      setCurrentTextIndex(nextIndex);
      setUserInput('');
      setIsGameActive(false);
      setElapsedTime(0);
    }
  };

  const restartGame = () => {
    setUserInput('');
    setIsGameActive(false);
    setStartTime(null);
    setElapsedTime(0);
    setCurrentTextIndex(0);
  };

  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    restartGame();
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Typing Game
          </h1>
          <div className="flex items-center space-x-4">
            <select
              value={difficulty}
              onChange={(e) => changeDifficulty(e.target.value)}
              className="mr-4 p-2 rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </div>
        <TypingArea
          typingText={challengeTexts[currentTextIndex] || ''}
          userInput={userInput}
          onInputChange={handleInputChange}
          onRestart={restartGame}
          isGameActive={isGameActive}
          elapsedTime={elapsedTime}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PerformanceStats stats={stats} />
          <UserProgress history={history} />
        </div>
        <div className="mt-8 flex justify-center">
          <Button onClick={restartGame} variant="primary">
            Restart Game
          </Button>
        </div>
      </div>
      {/* Footer component */}
      <Footer />
    </div>
  );
};

App.propTypes = {
  initialDifficulty: PropTypes.oneOf(['easy', 'medium', 'hard']),
};

export default App;
