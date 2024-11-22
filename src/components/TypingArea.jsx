import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const TypingArea = ({
  typingText,
  userInput,
  onInputChange,
  onRestart,
  isGameActive,
  elapsedTime,
}) => {
  const inputRef = useRef(null);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    if (isGameActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isGameActive]);

  // Calculate WPM
  const calculateWPM = () => {
    const wordsTyped = userInput.trim().split(' ').length;
    return elapsedTime > 0 ? Math.round((wordsTyped / elapsedTime) * 60) : 0;
  };

  // Calculate Accuracy
  const calculateAccuracy = () => {
    const correctChars = typingText.slice(0, userInput.length).split('').filter((char, index) => char === userInput[index]).length;
    return userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 0;
  };

  // Calculate Progress
  const calculateProgress = () => {
    return Math.min((userInput.length / typingText.length) * 100, 100);
  };

  // Track Errors
  useEffect(() => {
    let errors = 0;
    typingText.split('').forEach((char, index) => {
      if (index < userInput.length && char !== userInput[index]) {
        errors++;
      }
    });
    setErrorCount(errors);
  }, [userInput, typingText]);

  // Render Characters
  const renderCharacters = () => {
    return typingText.split('').map((char, index) => {
      let status = '';
      if (index < userInput.length) {
        status = userInput[index] === char ? 'correct' : 'incorrect';
      }

      return (
        <span
          key={index}
          className={`
            transition-colors duration-200 font-mono text-lg
            ${status === 'correct' ? 'text-green-500' : ''}
            ${status === 'incorrect' ? 'text-red-500' : ''}
            ${index === userInput.length ? 'border-b-2 border-blue-500' : ''}
          `}
        >
          {char}
        </span>
      );
    });
  };

  const isTypingComplete = typingText === userInput;

  return (
    <motion.div
      className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative mb-4">
        <div
          className="absolute top-0 left-0 h-2 bg-blue-500 transition-all"
          style={{ width: `${calculateProgress()}%` }}
        />
        <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>

      <div
        className="mb-4 text-xl text-gray-700 dark:text-gray-300 tracking-wider break-words"
        aria-label="Typing text display"
      >
        {renderCharacters()}
      </div>

      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={onInputChange}
          placeholder={isTypingComplete ? 'Typing complete!' : 'Start typing...'}
          className="flex-grow p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          disabled={isTypingComplete}
          aria-disabled={isTypingComplete}
        />
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Time: {Math.max(0, elapsedTime).toFixed(1)}s
        </div>
        {isTypingComplete && (
          <button
            onClick={onRestart}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
            aria-label="Restart typing game"
          >
            Restart
          </button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">WPM</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{calculateWPM()}</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Accuracy</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{calculateAccuracy()}%</p>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Errors</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{errorCount}</p>
        </div>
      </div>

      {isTypingComplete && (
        <div className="mt-4 text-center text-green-600 dark:text-green-400 font-semibold">
          Typing complete! Great job!
        </div>
      )}
    </motion.div>
  );
};

TypingArea.propTypes = {
  typingText: PropTypes.string.isRequired,
  userInput: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onRestart: PropTypes.func.isRequired,
  isGameActive: PropTypes.bool.isRequired,
  elapsedTime: PropTypes.number.isRequired,
};

export default TypingArea;
