import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { Bell, Volume2, Clock, BellRing } from 'lucide-react';

interface AlarmClockProps {
  isDarkMode: boolean;
}

const AlarmClock: React.FC<AlarmClockProps> = ({ isDarkMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarmTime, setAlarmTime] = useState('');
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);

  // Clock hands animation
  const hourHandSpring = useSpring({
    transform: `translate(-50%, -100%) rotate(${(currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5}deg)`,
    config: { tension: 280, friction: 60 }
  });

  const minuteHandSpring = useSpring({
    transform: `translate(-50%, -100%) rotate(${currentTime.getMinutes() * 6 + currentTime.getSeconds() * 0.1}deg)`,
    config: { tension: 280, friction: 60 }
  });

  const secondHandSpring = useSpring({
    transform: `translate(-50%, -100%) rotate(${currentTime.getSeconds() * 6}deg)`,
    config: { tension: 300, friction: 10 }
  });

  // Alarm ringing animation
  const alarmShake = useSpring({
    transform: isAlarmRinging ? 'translateX(0px)' : 'translateX(0px)',
    config: { tension: 500, friction: 10 }
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (isAlarmSet && alarmTime) {
        const currentTimeStr = now.toTimeString().slice(0, 5);
        if (currentTimeStr === alarmTime) {
          setIsAlarmRinging(true);
          setIsAlarmSet(false);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [alarmTime, isAlarmSet]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const setAlarm = () => {
    if (alarmTime) {
      setIsAlarmSet(true);
      setIsAlarmRinging(false);
    }
  };

  const stopAlarm = () => {
    setIsAlarmRinging(false);
    setAlarmTime('');
  };

  return (
    <div className="max-w-md mx-auto">
      {/* Enhanced 3D Clock Display */}
      <animated.div 
        style={alarmShake}
        className={`relative mb-8 p-8 rounded-3xl shadow-2xl transform-gpu transition-all duration-300 ${
          isAlarmRinging 
            ? isDarkMode ? 'bg-red-900/90 backdrop-blur-xl border border-red-500/50' : 'bg-red-100/90 backdrop-blur-xl border border-red-300/50'
            : isDarkMode ? 'bg-gray-800/90 backdrop-blur-xl border border-gray-700/50' : 'bg-white/90 backdrop-blur-xl border border-white/50'
        }`}
      >
        {/* Holographic overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent rounded-3xl"></div>
        
        {/* Alarm ringing effects */}
        <AnimatePresence>
          {isAlarmRinging && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 0],
                    opacity: [0, 0.8, 0],
                    x: Math.cos(i * 60 * Math.PI / 180) * 80,
                    y: Math.sin(i * 60 * Math.PI / 180) * 80
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity,
                    delay: i * 0.1 
                  }}
                  style={{
                    left: '50%',
                    top: '50%'
                  }}
                >
                  <BellRing size={20} className="text-red-500" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
        
        {/* Current Time */}
        <div className="text-center relative z-10">
          <motion.div 
            className={`text-4xl md:text-5xl font-mono font-bold mb-2 tracking-wider ${
              isAlarmRinging ? 'text-red-600' : isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
            animate={{
              scale: isAlarmRinging ? [1, 1.05, 1] : 1,
              textShadow: isAlarmRinging 
                ? '0 0 20px rgba(239, 68, 68, 0.8)' 
                : '0 0 0px rgba(239, 68, 68, 0)'
            }}
            transition={{ duration: 0.5, repeat: isAlarmRinging ? Infinity : 0 }}
          >
            {formatTime(currentTime)}
          </motion.div>
          
          <motion.div 
            className={`text-sm md:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {formatDate(currentTime)}
          </motion.div>
        </div>

        {/* Enhanced 3D Clock Face */}
        <div className="flex justify-center mt-6">
          <motion.div 
            className="relative w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-2xl"
            whileHover={{ scale: 1.1, rotateY: 15 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Clock face */}
            <div className="absolute inset-2 bg-white rounded-full shadow-inner">
              {/* Hour markers */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-4 bg-gray-400 rounded-full"
                  style={{
                    top: '8px',
                    left: '50%',
                    transformOrigin: '50% 48px',
                    transform: `translateX(-50%) rotate(${i * 30}deg)`
                  }}
                />
              ))}
            </div>
            
            {/* Clock hands */}
            <animated.div 
              className="absolute top-1/2 left-1/2 w-1 bg-gray-800 rounded-full origin-bottom"
              style={{ 
                height: '25%',
                ...hourHandSpring
              }}
            />
            <animated.div 
              className="absolute top-1/2 left-1/2 w-0.5 bg-gray-600 rounded-full origin-bottom"
              style={{ 
                height: '35%',
                ...minuteHandSpring
              }}
            />
            <animated.div 
              className="absolute top-1/2 left-1/2 w-px bg-red-500 rounded-full origin-bottom"
              style={{ 
                height: '40%',
                ...secondHandSpring
              }}
            />
            
            {/* Center dot */}
            <motion.div 
              className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
              animate={{ scale: isAlarmRinging ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.5, repeat: isAlarmRinging ? Infinity : 0 }}
            />
          </motion.div>
        </div>
      </animated.div>

      {/* Enhanced Alarm Controls */}
      <motion.div 
        className={`rounded-2xl p-6 shadow-2xl ${
          isDarkMode 
            ? 'bg-gray-700/70 backdrop-blur-xl border border-gray-600/50' 
            : 'bg-white/70 backdrop-blur-xl border border-white/50'
        }`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="mb-4">
          <label className={`block text-sm font-semibold mb-2 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Set Alarm Time
          </label>
          <motion.input
            type="time"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className={`w-full p-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
              isDarkMode 
                ? 'border-gray-600 focus:border-blue-400 bg-gray-800/90 text-white' 
                : 'border-gray-200 focus:border-blue-400 bg-white/90 text-gray-800'
            }`}
            whileFocus={{ scale: 1.02 }}
          />
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {!isAlarmRinging ? (
              <motion.button
                onClick={setAlarm}
                disabled={!alarmTime}
                className={`w-full p-4 rounded-xl font-semibold text-white shadow-xl transform transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
                whileHover={{ 
                  scale: alarmTime ? 1.05 : 1, 
                  rotateX: 10,
                  boxShadow: alarmTime ? '0 20px 40px rgba(59, 130, 246, 0.4)' : undefined
                }}
                whileTap={{ scale: alarmTime ? 0.95 : 1 }}
                style={{ transformStyle: 'preserve-3d' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{ 
                    rotate: isAlarmSet ? [0, 15, -15, 0] : 0,
                    scale: isAlarmSet ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 2, repeat: isAlarmSet ? Infinity : 0 }}
                >
                  <Bell size={20} />
                </motion.div>
                <span>{isAlarmSet ? 'Alarm Set' : 'Set Alarm'}</span>
              </motion.button>
            ) : (
              <motion.button
                onClick={stopAlarm}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl font-semibold shadow-xl transform transition-all duration-200 flex items-center justify-center space-x-2"
                whileHover={{ 
                  scale: 1.05, 
                  rotateX: 10,
                  boxShadow: '0 20px 40px rgba(239, 68, 68, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: 'preserve-3d' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: [0.8, 1.1, 1],
                  boxShadow: '0 0 30px rgba(239, 68, 68, 0.6)'
                }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity }}
                >
                  <Volume2 size={20} />
                </motion.div>
                <span>Stop Alarm</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Alarm Status */}
        <AnimatePresence>
          {isAlarmSet && (
            <motion.div 
              className={`mt-4 p-4 rounded-xl relative overflow-hidden ${
                isDarkMode 
                  ? 'bg-blue-900/50 border border-blue-500/30' 
                  : 'bg-blue-50 border border-blue-200'
              }`}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Pulsing background */}
              <motion.div
                className="absolute inset-0 bg-blue-500/10"
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              <div className="flex items-center justify-center space-x-2 relative z-10">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Clock size={16} className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </motion.div>
                <p className={`text-sm text-center font-medium ${
                  isDarkMode ? 'text-blue-300' : 'text-blue-800'
                }`}>
                  🔔 Alarm set for {alarmTime}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AlarmClock;