import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { Play, Pause, Square, Plus, Minus, Sparkles } from 'lucide-react';

interface TimerProps {
  isDarkMode: boolean;
}

const Timer: React.FC<TimerProps> = ({ isDarkMode }) => {
  const [totalTime, setTotalTime] = useState(300);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Enhanced spring animations
  const scaleSpring = useSpring({
    scale: isFinished ? 1.05 : 1,
    config: { tension: 300, friction: 10 }
  });

  const glowSpring = useSpring({
    boxShadow: isFinished 
      ? '0 0 50px rgba(239, 68, 68, 0.6), 0 0 100px rgba(239, 68, 68, 0.3)' 
      : '0 25px 50px rgba(0, 0, 0, 0.15)',
    config: { duration: 1000 }
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const start = () => {
    setIsRunning(true);
    setIsFinished(false);
  };

  const pause = () => setIsRunning(false);

  const reset = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
    setIsFinished(false);
  };

  const adjustTime = (minutes: number) => {
    if (!isRunning) {
      const newTime = Math.max(60, totalTime + (minutes * 60));
      setTotalTime(newTime);
      setTimeLeft(newTime);
    }
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const circumference = 2 * Math.PI * 90;

  return (
    <div className="max-w-md mx-auto">
      {/* Enhanced 3D Timer Display */}
      <animated.div 
        style={{ ...scaleSpring, ...glowSpring }}
        className={`relative mb-8 p-8 rounded-3xl transform-gpu transition-all duration-300 ${
          isFinished 
            ? isDarkMode ? 'bg-red-900/90 backdrop-blur-xl border border-red-500/50' : 'bg-red-100/90 backdrop-blur-xl border border-red-300/50'
            : isDarkMode ? 'bg-gray-800/90 backdrop-blur-xl border border-gray-700/50' : 'bg-white/90 backdrop-blur-xl border border-white/50'
        }`}
      >
        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-3xl"></div>
        
        {/* Sparkle effects when finished */}
        <AnimatePresence>
          {isFinished && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    x: [0, Math.cos(i * 45 * Math.PI / 180) * 100],
                    y: [0, Math.sin(i * 45 * Math.PI / 180) * 100]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    delay: i * 0.1 
                  }}
                  style={{
                    left: '50%',
                    top: '50%'
                  }}
                >
                  <Sparkles size={16} className="text-yellow-400" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
        
        {/* Main Timer Display */}
        <div className="text-center relative z-10">
          <motion.div 
            className={`text-5xl md:text-6xl font-mono font-bold mb-6 tracking-wider transition-colors duration-300 ${
              isFinished ? 'text-red-600' : 
              timeLeft < 60 ? 'text-orange-600' : 
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
            animate={{
              scale: isFinished ? [1, 1.1, 1] : 1,
              textShadow: isFinished 
                ? '0 0 30px rgba(239, 68, 68, 0.8)' 
                : '0 0 0px rgba(239, 68, 68, 0)'
            }}
            transition={{ duration: 1, repeat: isFinished ? Infinity : 0 }}
          >
            {formatTime(timeLeft)}
          </motion.div>

          {/* Enhanced 3D Progress Circle */}
          <div className="flex justify-center mb-6">
            <motion.div 
              className="relative w-40 h-40"
              animate={{ 
                rotateY: isRunning ? 360 : 0,
                scale: isFinished ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                rotateY: { duration: 8, repeat: isRunning ? Infinity : 0, ease: "linear" },
                scale: { duration: 1, repeat: isFinished ? Infinity : 0 }
              }}
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
                  className={`${
                    isFinished ? 'text-red-400/40' :
                    timeLeft < 60 ? 'text-orange-400/40' : 
                    isDarkMode ? 'text-orange-400/20' : 'text-orange-500/20'
                  }`}
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
                {/* Progress circle */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress / 100)}
                  className={`transition-all duration-1000 ease-linear ${
                    isFinished ? 'text-red-500' : 
                    timeLeft < 60 ? 'text-orange-500' : 
                    'text-orange-400'
                  }`}
                  strokeLinecap="round"
                  animate={{
                    filter: isFinished 
                      ? 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.8))' 
                      : timeLeft < 60 
                      ? 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.6))'
                      : 'drop-shadow(0 0 5px rgba(251, 146, 60, 0.4))'
                  }}
                />
              </svg>
              
              {/* Enhanced center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div 
                  className={`text-2xl font-bold ${
                    isFinished ? 'text-red-600' : isDarkMode ? 'text-white' : 'text-gray-700'
                  }`}
                  animate={{
                    scale: isFinished ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 1, repeat: isFinished ? Infinity : 0 }}
                >
                  {Math.round(progress)}%
                </motion.div>
                <div className={`text-sm ${
                  isFinished ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {isFinished ? 'Done!' : 'Complete'}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </animated.div>

      {/* Enhanced Time Adjustment Controls */}
      <AnimatePresence>
        {!isRunning && !isFinished && (
          <motion.div 
            className="grid grid-cols-4 gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {[
              { minutes: -5, label: '5m', icon: <Minus size={16} /> },
              { minutes: -1, label: '1m', icon: <Minus size={16} /> },
              { minutes: 1, label: '1m', icon: <Plus size={16} /> },
              { minutes: 5, label: '5m', icon: <Plus size={16} /> }
            ].map((btn, index) => (
              <motion.button
                key={index}
                onClick={() => adjustTime(btn.minutes)}
                className={`p-3 rounded-xl shadow-lg transform transition-all duration-200 flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-gray-700/70 backdrop-blur-sm hover:bg-gray-600/70 text-white' 
                    : 'bg-white/70 backdrop-blur-sm hover:bg-white/90 text-gray-700'
                }`}
                whileHover={{ 
                  scale: 1.05, 
                  rotateX: 10,
                  boxShadow: isDarkMode 
                    ? '0 10px 25px rgba(0, 0, 0, 0.5)' 
                    : '0 10px 25px rgba(0, 0, 0, 0.15)'
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {btn.icon}
                <span className="text-xs ml-1">{btn.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Control Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <>
              <motion.button
                onClick={isRunning ? pause : start}
                disabled={timeLeft === 0}
                className={`p-4 rounded-2xl font-semibold text-white shadow-xl transform transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:hover:scale-100 ${
                  isRunning 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500'
                }`}
                whileHover={{ 
                  scale: timeLeft > 0 ? 1.05 : 1, 
                  rotateX: 10,
                  boxShadow: timeLeft > 0 ? (isRunning 
                    ? '0 20px 40px rgba(239, 68, 68, 0.4)' 
                    : '0 20px 40px rgba(34, 197, 94, 0.4)') : undefined
                }}
                whileTap={{ scale: timeLeft > 0 ? 0.95 : 1 }}
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
            </>
          ) : (
            <motion.button
              onClick={reset}
              className="col-span-2 p-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-xl transform transition-all duration-200 flex items-center justify-center space-x-2"
              whileHover={{ 
                scale: 1.05, 
                rotateX: 10,
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Square size={20} />
              <span>New Timer</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Completion Message */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            className={`mt-4 p-6 rounded-2xl border-2 relative overflow-hidden ${
              isDarkMode 
                ? 'bg-red-900/50 border-red-500/50 backdrop-blur-xl' 
                : 'bg-red-50 border-red-200'
            }`}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)'
            }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Animated background pattern */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20"
              animate={{ x: [-100, 100] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.p 
              className={`text-center font-bold relative z-10 ${
                isDarkMode ? 'text-red-300' : 'text-red-800'
              }`}
              animate={{ 
                scale: [1, 1.05, 1],
                textShadow: ['0 0 0px rgba(239, 68, 68, 0)', '0 0 10px rgba(239, 68, 68, 0.8)', '0 0 0px rgba(239, 68, 68, 0)']
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⏰ Time's up! Timer finished!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Timer;