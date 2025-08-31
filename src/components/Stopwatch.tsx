import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { Play, Pause, Square, Flag, Trophy, Zap } from 'lucide-react';

interface Lap {
  id: number;
  totalTime: number;
  lapTime: number;
  isFastest: boolean;
  isSlowest: boolean;
}

interface StopwatchProps {
  isDarkMode: boolean;
}

const Stopwatch: React.FC<StopwatchProps> = ({ isDarkMode }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);

  // Enhanced spring animation for the main display
  const timeSpring = useSpring({
    scale: isRunning ? 1.02 : 1,
    config: { tension: 300, friction: 10 }
  });

  // Pulsing animation for running state
  const pulseSpring = useSpring({
    opacity: isRunning ? [0.5, 1, 0.5] : 1,
    config: { duration: 1000 },
    loop: isRunning
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time => time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  // Update lap statistics when laps change
  useEffect(() => {
    if (laps.length > 1) {
      const lapTimes = laps.map(lap => lap.lapTime);
      const fastest = Math.min(...lapTimes);
      const slowest = Math.max(...lapTimes);
      
      setLaps(prevLaps => 
        prevLaps.map(lap => ({
          ...lap,
          isFastest: lap.lapTime === fastest && lapTimes.filter(t => t === fastest).length === 1,
          isSlowest: lap.lapTime === slowest && lapTimes.filter(t => t === slowest).length === 1
        }))
      );
    }
  }, [laps.length]);

  const formatTime = (centiseconds: number) => {
    const hours = Math.floor(centiseconds / 360000);
    const minutes = Math.floor((centiseconds % 360000) / 6000);
    const seconds = Math.floor((centiseconds % 6000) / 100);
    const cs = centiseconds % 100;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  };

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  const addLap = () => {
    if (time > 0) {
      const lastLapTime = laps.length > 0 ? laps[laps.length - 1].totalTime : 0;
      const lapTime = time - lastLapTime;
      
      setLaps(prev => [...prev, {
        id: prev.length + 1,
        totalTime: time,
        lapTime: lapTime,
        isFastest: false,
        isSlowest: false
      }]);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Enhanced 3D Stopwatch Display */}
      <motion.div 
        className={`relative mb-8 p-8 rounded-3xl shadow-2xl transform-gpu ${
          isDarkMode 
            ? 'bg-gray-800/90 backdrop-blur-xl border border-gray-700/50' 
            : 'bg-white/90 backdrop-blur-xl border border-white/50'
        }`}
        style={timeSpring}
        whileHover={{ 
          rotateX: 5,
          rotateY: 5,
          scale: 1.02
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-blue-500/5 to-transparent rounded-3xl"></div>
        
        {/* Main Timer Display */}
        <animated.div className="text-center relative z-10" style={pulseSpring}>
          <motion.div 
            className={`text-5xl md:text-6xl font-mono font-bold mb-6 tracking-wider transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
            animate={{ 
              textShadow: isRunning 
                ? '0 0 20px rgba(34, 197, 94, 0.5)' 
                : '0 0 0px rgba(34, 197, 94, 0)'
            }}
          >
            {formatTime(time)}
          </motion.div>

          {/* Enhanced 3D Progress Circle */}
          <div className="flex justify-center mb-6">
            <motion.div 
              className="relative w-40 h-40"
              animate={{ rotateY: isRunning ? 360 : 0 }}
              transition={{ duration: 4, repeat: isRunning ? Infinity : 0, ease: "linear" }}
            >
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Outer glow ring */}
                <circle
                  cx="100"
                  cy="100"
                  r="95"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className={`${isDarkMode ? 'text-green-400/20' : 'text-green-500/20'}`}
                />
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className={`${isDarkMode ? 'text-gray-700' : 'text-gray-200'}`}
                />
                {/* Animated progress circle */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - (time % 6000) / 6000)}`}
                  className="text-green-500 transition-all duration-100 ease-linear"
                  strokeLinecap="round"
                  animate={{
                    filter: isRunning 
                      ? 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.8))' 
                      : 'drop-shadow(0 0 0px rgba(34, 197, 94, 0))'
                  }}
                />
              </svg>
              
              {/* Center pulse indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className={`w-6 h-6 rounded-full transition-colors duration-200 ${
                    isRunning ? 'bg-green-500' : isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
                  }`}
                  animate={{
                    scale: isRunning ? [1, 1.3, 1] : 1,
                    boxShadow: isRunning 
                      ? '0 0 20px rgba(34, 197, 94, 0.8)' 
                      : '0 0 0px rgba(34, 197, 94, 0)'
                  }}
                  transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
                />
              </div>
            </motion.div>
          </div>
        </animated.div>
      </motion.div>

      {/* Enhanced Control Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.button
          onClick={isRunning ? pause : start}
          className={`p-4 rounded-2xl font-semibold text-white shadow-xl transform transition-all duration-200 flex items-center justify-center space-x-2 ${
            isRunning 
              ? 'bg-gradient-to-r from-orange-500 to-red-500' 
              : 'bg-gradient-to-r from-green-500 to-emerald-500'
          }`}
          whileHover={{ 
            scale: 1.05, 
            rotateX: 10,
            boxShadow: isRunning 
              ? '0 20px 40px rgba(239, 68, 68, 0.4)' 
              : '0 20px 40px rgba(34, 197, 94, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <motion.div
            animate={{ rotate: isRunning ? 0 : 360 }}
            transition={{ duration: 0.3 }}
          >
            {isRunning ? <Pause size={20} /> : <Play size={20} />}
          </motion.div>
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </motion.button>

        <motion.button
          onClick={reset}
          className={`p-4 rounded-2xl font-semibold text-white shadow-xl transform transition-all duration-200 flex items-center justify-center space-x-2 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-gray-600 to-gray-700' 
              : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}
          whileHover={{ 
            scale: 1.05, 
            rotateX: 10,
            boxShadow: '0 20px 40px rgba(107, 114, 128, 0.4)'
          }}
          whileTap={{ scale: 0.95 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Square size={20} />
          <span>Reset</span>
        </motion.button>
      </div>

      {/* Enhanced Lap Button */}
      <motion.button
        onClick={addLap}
        disabled={time === 0}
        className={`w-full mb-6 p-4 rounded-2xl font-semibold text-white shadow-xl transform transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
            : 'bg-gradient-to-r from-blue-500 to-purple-500'
        }`}
        whileHover={{ 
          scale: time > 0 ? 1.05 : 1, 
          rotateX: 10,
          boxShadow: time > 0 ? '0 20px 40px rgba(59, 130, 246, 0.4)' : undefined
        }}
        whileTap={{ scale: time > 0 ? 0.95 : 1 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Flag size={20} />
        <span>Lap</span>
      </motion.button>

      {/* Enhanced Lap Times with Statistics */}
      <AnimatePresence>
        {laps.length > 0 && (
          <motion.div 
            className={`rounded-3xl p-6 shadow-2xl max-h-64 overflow-hidden ${
              isDarkMode 
                ? 'bg-gray-800/90 backdrop-blur-xl border border-gray-700/50' 
                : 'bg-white/90 backdrop-blur-xl border border-white/50'
            }`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center mb-4">
              <Trophy className={`mr-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} size={20} />
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                Lap Times ({laps.length})
              </h3>
            </div>
            
            <div className="max-h-40 overflow-y-auto space-y-2 custom-scrollbar">
              {laps.slice().reverse().map((lap, index) => (
                <motion.div 
                  key={lap.id}
                  className={`flex justify-between items-center p-3 rounded-xl transition-all duration-200 ${
                    lap.isFastest 
                      ? isDarkMode ? 'bg-green-900/50 border border-green-500/30' : 'bg-green-100 border border-green-300'
                      : lap.isSlowest 
                      ? isDarkMode ? 'bg-red-900/50 border border-red-500/30' : 'bg-red-100 border border-red-300'
                      : isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Lap {laps.length - index}
                    </span>
                    {lap.isFastest && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Zap size={14} className="text-green-500" />
                      </motion.div>
                    )}
                    {lap.isSlowest && laps.length > 2 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      </motion.div>
                    )}
                  </div>
                  <div className="text-right">
                    <motion.div 
                      className={`text-sm font-mono font-bold ${
                        lap.isFastest ? 'text-green-600' :
                        lap.isSlowest ? 'text-red-600' :
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}
                      animate={{
                        scale: lap.isFastest || lap.isSlowest ? [1, 1.1, 1] : 1
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      {formatTime(lap.lapTime)}
                    </motion.div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatTime(lap.totalTime)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Lap Statistics */}
            {laps.length > 1 && (
              <motion.div 
                className={`mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-center ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Fastest Lap
                  </p>
                  <p className={`text-sm font-mono font-bold text-green-500`}>
                    {formatTime(Math.min(...laps.map(l => l.lapTime)))}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Average Lap
                  </p>
                  <p className={`text-sm font-mono font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>
                    {formatTime(Math.round(laps.reduce((sum, lap) => sum + lap.lapTime, 0) / laps.length))}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#374151' : '#f3f4f6'};
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#6b7280' : '#9ca3af'};
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#9ca3af' : '#6b7280'};
        }
      `}</style>
    </div>
  );
};

export default Stopwatch;