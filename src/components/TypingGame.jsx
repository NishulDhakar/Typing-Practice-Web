import React, { useState, useEffect } from 'react';
import { Clock, Award, ChevronUp, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

// List of words for each level with categories
const LEVELS = [
  { 
    name: "Beginner", 
    words: ["cat", "dog", "sun", "hat", "pen", "cup", "book", "fish", "bird", "desk"],
    time: 30,
    color: "emerald"
  },
  { 
    name: "Easy", 
    words: ["apple", "beach", "chair", "dance", "eagle", "fruit", "grape", "house", "juice", "kite"],
    time: 25,
    color: "blue"
  },
  { 
    name: "Medium", 
    words: ["guitar", "jungle", "kitten", "laptop", "mountain", "nature", "orange", "planet", "quarry", "rabbit"],
    time: 20,
    color: "violet"
  },
  { 
    name: "Hard", 
    words: ["elephant", "fireworks", "hamburger", "internet", "jacket", "keyboard", "landscape", "magazine", "navigate", "orchard"],
    time: 15,
    color: "amber"
  },
  { 
    name: "Expert", 
    words: ["kangaroo", "lightning", "notebook", "octopus", "penguin", "question", "resource", "skeleton", "telephone", "universe"],
    time: 10,
    color: "rose"
  },
];

const TypingGame = () => {
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('typingGameHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [timeLeft, setTimeLeft] = useState(LEVELS[level].time);
  const [currentWord, setCurrentWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [gameState, setGameState] = useState("ready"); // ready, playing, paused, over
  const [wordsTyped, setWordsTyped] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState({ show: false, correct: true });
  const [animations, setAnimations] = useState([]);

  // Initialize game
  useEffect(() => {
    if (gameState === "ready") {
      const randomWord = getRandomWord();
      setCurrentWord(randomWord);
    }
  }, [gameState]);

  // Timer logic
  useEffect(() => {
    if (gameState === "playing") {
      if (timeLeft > 0) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        endGame();
      }
    }
  }, [timeLeft, gameState]);

  // Update high score in localStorage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('typingGameHighScore', score.toString());
    }
  }, [score, highScore]);

  // Hide feedback after 1 second
  useEffect(() => {
    if (feedback.show) {
      const timer = setTimeout(() => setFeedback({ ...feedback, show: false }), 1000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Handle animations
  useEffect(() => {
    if (animations.length > 0) {
      const timer = setTimeout(() => {
        setAnimations(prev => prev.slice(1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [animations]);

  const getRandomWord = () => {
    return LEVELS[level].words[Math.floor(Math.random() * LEVELS[level].words.length)];
  };

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(LEVELS[level].time);
    setScore(0);
    setWordsTyped(0);
    setMistakes(0);
    setAccuracy(100);
    setInputValue("");
  };

  const endGame = () => {
    setGameState("over");
    
    // Add level completion animation if all words were typed
    if (wordsTyped >= LEVELS[level].words.length) {
      setAnimations(prev => [...prev, { type: "levelUp", level: level }]);
    }
  };

  const restartGame = () => {
    setLevel(0);
    setScore(0);
    setGameState("ready");
    setInputValue("");
    const randomWord = getRandomWord();
    setCurrentWord(randomWord);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Early check for mistakes
    if (!currentWord.startsWith(value) && value.length > 0) {
      setMistakes(mistakes + 1);
      updateAccuracy();
      setFeedback({ show: true, correct: false });
    }

    // Check if the typed word matches the current word
    if (value.trim().toLowerCase() === currentWord.toLowerCase()) {
      // Success!
      const points = Math.ceil((currentWord.length * 5) * (accuracy / 100));
      setScore(score + points);
      setWordsTyped(wordsTyped + 1);
      setInputValue("");
      setFeedback({ show: true, correct: true });
      
      // Add score animation
      setAnimations(prev => [...prev, { 
        type: "score", 
        points,
        position: { x: Math.random() * 80 + 10, y: Math.random() * 40 + 30 } 
      }]);
      
      // Check for level completion
      if (wordsTyped + 1 >= LEVELS[level].words.length && level < LEVELS.length - 1) {
        setLevel(level + 1);
        setTimeLeft(LEVELS[level + 1].time);
        // Add bonus time for completing a level
        setTimeLeft(prev => prev + 5);
      }
      
      const randomWord = getRandomWord();
      setCurrentWord(randomWord);
    }
  };

  const updateAccuracy = () => {
    const totalAttempts = wordsTyped + mistakes;
    const newAccuracy = totalAttempts > 0 
      ? Math.floor((wordsTyped / totalAttempts) * 100) 
      : 100;
    setAccuracy(newAccuracy);
  };

  const getLevelColor = (lvl) => {
    return LEVELS[lvl].color;
  };

  const getProgressPercentage = () => {
    return Math.min((wordsTyped / LEVELS[level].words.length) * 100, 100);
  };

  const renderGameScreen = () => {
    return (
      <div className="w-full max-w-md">
        {/* Game stats bar */}
        <div className="flex justify-between items-center mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="mr-2 text-blue-500" size={20} />
            <span className="font-mono text-xl">{timeLeft}s</span>
          </div>
          <div className="flex items-center">
            <Award className="mr-2 text-yellow-500" size={20} />
            <span className="font-mono text-xl">{score}</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="mr-2 text-green-500" size={20} />
            <span className="font-mono">{accuracy}%</span>
          </div>
        </div>

        {/* Level indicator */}
        <div className="mb-6">
          <div className="flex justify-between mb-1">
            <span className={`font-bold text-${getLevelColor(level)}-500`}>
              Level {level + 1}: {LEVELS[level].name}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Words: {wordsTyped}/{LEVELS[level].words.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`bg-${getLevelColor(level)}-500 h-2 rounded-full transition-all duration-500`} 
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Current word display */}
        <div className="relative">
          <p className={`text-3xl font-bold mb-4 text-center p-6 rounded-lg ${feedback.show ? (feedback.correct ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30') : 'bg-gray-100 dark:bg-gray-800'} transition-colors duration-300`}>
            {currentWord.split('').map((char, index) => {
              let color = "text-gray-400";
              if (index < inputValue.length) {
                color = inputValue[index] === char 
                  ? "text-green-500 dark:text-green-400" 
                  : "text-red-500 dark:text-red-400";
              }
              if (index === inputValue.length) {
                color += " border-b-2 border-blue-500 dark:border-blue-400";
              }
              return (
                <span key={index} className={color}>
                  {char}
                </span>
              );
            })}
          </p>
          
          {/* Feedback indicator */}
          {feedback.show && (
            <div className={`absolute top-0 right-0 mt-2 mr-2 ${feedback.correct ? 'text-green-500' : 'text-red-500'}`}>
              {feedback.correct ? <CheckCircle size={20} /> : <XCircle size={20} />}
            </div>
          )}
        </div>

        {/* Input field */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          autoFocus
          className="w-full p-3 mt-4 text-lg border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder="Type here..."
        />
      </div>
    );
  };

  const renderStartScreen = () => {
    return (
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Ready to Type?</h2>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
            Test your typing speed and accuracy through 5 increasingly difficult levels.
          </p>
          <div className="space-y-2 text-left mb-4">
            {LEVELS.map((lvl, idx) => (
              <div key={idx} className="flex items-center">
                <div className={`w-3 h-3 rounded-full bg-${lvl.color}-500 mr-2`}></div>
                <span className="font-medium">{lvl.name}</span>
                <span className="ml-auto text-sm text-gray-500">{lvl.time}s</span>
              </div>
            ))}
          </div>
          
          {highScore > 0 && (
            <p className="mt-4 text-yellow-600 dark:text-yellow-400 font-bold">
              Your High Score: {highScore}
            </p>
          )}
        </div>
        
        <button
          onClick={startGame}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
        >
          Start Game
        </button>
      </div>
    );
  };

  const renderGameOverScreen = () => {
    return (
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">Game Over!</h2>
        
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">SCORE</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{score}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">LEVEL</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{level + 1}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">WORDS</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{wordsTyped}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">ACCURACY</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{accuracy}%</p>
            </div>
          </div>
          
          {score > highScore ? (
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <p className="text-yellow-700 dark:text-yellow-300 font-bold">New High Score! 🎉</p>
            </div>
          ) : (
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              High Score: {highScore}
            </p>
          )}
        </div>
        
        <button
          onClick={restartGame}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center mx-auto"
        >
          <RotateCcw size={18} className="mr-2" /> Play Again
        </button>
      </div>
    );
  };

  // Floating animations
  const renderAnimations = () => {
    return animations.map((anim, index) => {
      if (anim.type === "score") {
        return (
          <div 
            key={index}
            className="absolute pointer-events-none text-lg font-bold text-green-500 dark:text-green-400 animate-float"
            style={{
              left: `${anim.position.x}%`,
              top: `${anim.position.y}%`,
              animation: "float 2s forwards",
            }}
          >
            +{anim.points}
          </div>
        );
      } else if (anim.type === "levelUp") {
        return (
          <div 
            key={index}
            className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/50 animate-fadeOut"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center animate-scaleIn">
              <ChevronUp size={40} className="text-green-500 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                Level {anim.level + 1} Complete!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Moving to Level {anim.level + 2}
              </p>
            </div>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute bg-blue-500/5 rounded-full"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
      
      {/* Game title */}
      <h1 className="text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
        Speed Typer
      </h1>
      
      {/* Game content */}
      {gameState === "ready" && renderStartScreen()}
      {gameState === "playing" && renderGameScreen()}
      {gameState === "over" && renderGameOverScreen()}
      
      {/* Floating animations */}
      {renderAnimations()}
      
      {/* Custom CSS */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        @keyframes fadeOut {
          0% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-float {
          animation: float 2s forwards;
        }
        .animate-fadeOut {
          animation: fadeOut 2s forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s forwards;
        }
      `}</style>
    </div>
  );
};

export default TypingGame;