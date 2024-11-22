import { generateRandomText } from './textGenerators';

export const calculateStats = (userInput, originalText, startTime) => {
  const accuracy = calculateAccuracy(userInput, originalText);
  const timeInMinutes = Math.max((Date.now() - startTime) / 60000, 0.1);
  const wordCount = originalText.trim().split(/\s+/).length;
  const wpm = Math.round((wordCount / timeInMinutes) * (accuracy / 100));

  return { 
    wpm: Math.max(wpm, 0), 
    accuracy 
  };
};

export const calculateAccuracy = (userInput, originalText) => {
  let correctChars = 0;
  for (let i = 0; i < Math.min(userInput.length, originalText.length); i++) {
    if (userInput[i] === originalText[i]) {
      correctChars++;
    }
  }
  return Math.round((correctChars / originalText.length) * 100);
};

export const generateChallengeTexts = (difficulty = 'medium', count = 10) => {
  const difficulties = {
    easy: { minLength: 20, maxLength: 40 },
    medium: { minLength: 40, maxLength: 60 },
    hard: { minLength: 60, maxLength: 100 }
  };

  const { minLength, maxLength } = difficulties[difficulty] || difficulties.medium;
  return Array.from({ length: count }, () => 
    generateRandomText(Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength)
  );
};




