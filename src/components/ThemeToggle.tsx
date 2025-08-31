import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: (isDark: boolean) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <motion.button
      onClick={() => onToggle(!isDarkMode)}
      className={`relative w-16 h-8 rounded-full p-1 transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-purple-500/25' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg shadow-orange-500/25'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        animate={{
          x: isDarkMode ? 32 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDarkMode ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDarkMode ? (
            <Moon size={14} className="text-indigo-400" />
          ) : (
            <Sun size={14} className="text-orange-500" />
          )}
        </motion.div>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;