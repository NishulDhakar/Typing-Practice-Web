import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Moon, Sun, Gamepad2, BarChart2, RefreshCw, Award, Zap, Bookmark } from 'lucide-react';
import PerformanceStats from './components/PerformanceStats';
import UserProgress from './components/UserProgress';
import LoadingScreen from './components/LoadingScreen';
import TypingArea from './components/TypingArea';
// import TypingGame from './components/TypingGame';
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
  const [showTypingGame, setShowTypingGame] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Define difficulty colors and labels
  const difficultyOptions = {
    easy: { color: 'bg-green-500', label: 'Easy' },
    medium: { color: 'bg-blue-500', label: 'Medium' },
    hard: { color: 'bg-red-500', label: 'Hard' }
  };

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

      // Show confetti effect when completing a challenge
      if (newStats.accuracy > 90) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

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

  const toggleTypingGame = () => {
    setShowTypingGame(!showTypingGame);
  };

  // Custom toggle button component
  const GameToggleButton = () => (
    <button
      onClick={toggleTypingGame}
      className="relative group overflow-hidden px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
    >
      {/* Background shine effect */}
      <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"></div>
      
      {/* Button content */}
      <div className="flex items-center justify-center space-x-2">
        <Gamepad2 size={18} className="animate-pulse" />
        <span>{showTypingGame ? 'Classic Mode' : 'Arcade Mode'}</span>
      </div>
      
      {/* Animated border */}
      <div className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </button>
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Animated background patterns for light/dark modes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {isDark ? (
          // Dark mode pattern - subtle stars
          Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
                animation: `twinkle ${Math.random() * 5 + 2}s infinite alternate`
              }}
            />
          ))
        ) : (
          // Light mode pattern - subtle gradient shapes
          Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-100 to-purple-100"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.4,
                filter: 'blur(70px)',
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `float ${Math.random() * 10 + 20}s infinite alternate`
              }}
            />
          ))
        )}
      </div>

      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {Array.from({ length: 100 }).map((_, i) => (
            <div 
              key={i}
              className="absolute"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                top: '-10px',
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                animation: `confetti ${Math.random() * 3 + 2}s forwards`
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header with glass effect */}
        <div className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-xl shadow-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <Zap className="text-yellow-500 mr-2" size={28} />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                TypeMaster Pro
              </h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Difficulty selector with pills */}
              <div className="flex rounded-full overflow-hidden p-1 bg-gray-200 dark:bg-gray-700">
                {Object.entries(difficultyOptions).map(([key, { color, label }]) => (
                  <button
                    key={key}
                    onClick={() => changeDifficulty(key)}
                    className={`px-4 py-1 text-sm font-medium transition-all rounded-[15px] duration-200 ${
                      difficulty === key 
                        ? `${color} text-white` 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              
              {/* Theme toggle with animation */}
              <button 
                onClick={() => setIsDark(!isDark)}
                className="relative w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 transition-colors duration-300"
              >
                <Sun className={`absolute text-yellow-500 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'}`} size={20} />
                <Moon className={`absolute text-blue-400 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'}`} size={20} />
              </button>
              
              {/* Game toggle button */}
              {/* <GameToggleButton /> */}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          {/* {showTypingGame ? (
            <TypingGame />
          ) : ( */}
            <>
              <TypingArea
                typingText={challengeTexts[currentTextIndex] || ''}
                userInput={userInput}
                onInputChange={handleInputChange}
                onRestart={restartGame}
                isGameActive={isGameActive}
                elapsedTime={elapsedTime}
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <Award className="text-yellow-500 mr-2" size={24} />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Performance Stats</h2>
                  </div>
                  <PerformanceStats stats={stats} />
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl shadow-md">
                  <div className="flex items-center mb-4">
                    <BarChart2 className="text-blue-500 mr-2" size={24} />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Your Progress</h2>
                  </div>
                  <UserProgress history={history} />
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={restartGame}
                  className="group flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
                >
                  <RefreshCw size={18} className="mr-2 group-hover:rotate-180 transition-transform duration-500" />
                  Restart Game
                </button>
              </div>
            </>
          {/* )} */}
        </div>
        
        {/* Tips & Tricks section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <Bookmark className="text-purple-500 mr-2" size={24} />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Typing Tips</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Posture", tip: "Keep your back straight and wrists elevated while typing." },
              { title: "Focus", tip: "Look at the screen, not the keyboard, to improve accuracy." },
              { title: "Practice", tip: "Regular practice for just 15 minutes a day can boost your speed." }
            ].map((item, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2">{item.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Custom animated footer */}
      <footer className="relative py-10 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
  <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
    <div className="flex items-center mb-4 md:mb-0">
      <Zap className="text-yellow-500 mr-2" size={20} />
      <span className="font-bold text-gray-800 dark:text-white">TypeMaster Pro</span>
    </div>

    <div className="text-gray-600 dark:text-gray-400 text-sm">
      <span>Improve your typing skills with daily practice</span>
    </div>

    <div className="flex space-x-4 mt-4 md:mt-0">
      <a 
        href="https://x.com/NishulDhakar" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
      >
        Twitter
      </a>
      <a 
        href="https://www.linkedin.com/in/nishuldhakar/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
      >
        LinkedIn
      </a>
      <a 
        href="https://github.com/nishuldhakar" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
      >
        GitHub
      </a>
    </div>
  </div>
</footer>

      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes twinkle {
          0% { opacity: 0.1; }
          100% { opacity: 0.7; }
        }
        
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(20px) rotate(-5deg); }
        }
        
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); }
          100% { transform: translateY(100vh) rotate(720deg); }
        }
      `}</style>
    </div>
  );
};

App.propTypes = {
  initialDifficulty: PropTypes.oneOf(['easy', 'medium', 'hard',]),
};

export default App;