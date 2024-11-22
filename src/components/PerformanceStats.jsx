import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Trophy, Zap, Target } from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <motion.div
    className={`p-5 rounded-lg shadow-lg flex items-center justify-between hover:shadow-xl transition-transform ${color}`}
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 250 }}
    aria-label={`${title}: ${value}`}
  >
    <div className="flex items-center space-x-4">
      <Icon className="w-12 h-12 text-gray-700 dark:text-gray-300" />
      <div>
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{title}</h3>
        <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  </motion.div>
);

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
};

const PerformanceStats = ({ stats }) => {
  // Validate and format stats
  const formattedStats = {
    wpm: Number.isFinite(stats.wpm) ? Math.round(stats.wpm) : 0,
    accuracy: Number.isFinite(stats.accuracy) ? `${Math.round(stats.accuracy)}%` : "0%",
    streak: Number.isFinite(stats.streak) ? stats.streak : 0,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        icon={Zap}
        title="WPM"
        value={formattedStats.wpm}
        color="bg-blue-200 dark:bg-blue-800"
      />
      <StatCard
        icon={Target}
        title="Accuracy"
        value={formattedStats.accuracy}
        color="bg-green-200 dark:bg-green-800"
      />
      <StatCard
        icon={Trophy}
        title="Streak"
        value={formattedStats.streak}
        color="bg-purple-200 dark:bg-purple-800"
      />
    </div>
  );
};

PerformanceStats.propTypes = {
  stats: PropTypes.shape({
    wpm: PropTypes.number,
    accuracy: PropTypes.number,
    streak: PropTypes.number,
  }).isRequired,
};

export default PerformanceStats;
