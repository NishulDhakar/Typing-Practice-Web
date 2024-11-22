const WORD_POOLS = {
  common: ['the', 'be', 'to', 'of', 'and', 'in', 'that', 'have', 'it', 'for'],
  tech: ['algorithm', 'interface', 'database', 'network', 'framework', 'system', 'application', 'software', 'computer', 'programming'],
  science: ['quantum', 'molecule', 'particle', 'energy', 'research', 'experiment', 'theory', 'observation', 'hypothesis', 'analysis'],
  random: ['explore', 'discover', 'challenge', 'innovate', 'create', 'transform', 'develop', 'inspire', 'imagine', 'evolve']
};

export const generateRandomText = (length) => {
  const wordPools = [
    ...WORD_POOLS.common, 
    ...WORD_POOLS.tech, 
    ...WORD_POOLS.science, 
    ...WORD_POOLS.random
  ];
  
  const words = [];
  let currentLength = 0;
  
  while (currentLength < length) {
    const randomWord = wordPools[Math.floor(Math.random() * wordPools.length)];
    
    if (currentLength + randomWord.length + 1 <= length) {
      words.push(randomWord);
      currentLength += randomWord.length + 1;
    } else {
      break;
    }
  }
  
  return words.join(' ').slice(0, length);
};
