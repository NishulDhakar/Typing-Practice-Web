
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const UserProgress = ({ history }) => {
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Performance History
      </h2>
      
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={history}>
          <XAxis dataKey="attempt" />
          <YAxis />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(0,0,0,0.8)', 
              color: 'white',
              border: 'none'
            }} 
          />
          <Line 
            type="monotone" 
            dataKey="wpm" 
            stroke="#8884d8" 
            strokeWidth={3}
          />
          <Line 
            type="monotone" 
            dataKey="accuracy" 
            stroke="#82ca9d" 
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

UserProgress.propTypes = {
  history: PropTypes.arrayOf(
    PropTypes.shape({
      attempt: PropTypes.number.isRequired,
      wpm: PropTypes.number.isRequired,
      accuracy: PropTypes.number.isRequired
    })
  ).isRequired
};

export default UserProgress;