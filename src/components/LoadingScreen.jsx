import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    },
    exit: { opacity: 0 }
  };

  const letterVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  const letters = "LOADING...".split("");

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900"
    >
      <div className="text-center">
        <div className="flex space-x-2">
          {letters.map((letter, i) => (
            <motion.span
              key={i}
              variants={letterVariants}
              className="text-4xl font-bold text-white"
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="h-1 bg-primary-light mt-4 origin-left"
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;