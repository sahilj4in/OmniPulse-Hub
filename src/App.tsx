import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import AlarmClock from './components/AlarmClock';
import Stopwatch from './components/Stopwatch';
import Timer from './components/Timer';
import Weather from './components/Weather';
import ThemeToggle from './components/ThemeToggle';
import { Clock, Watch as StopwatchIcon, Timer as TimerIcon, Cloud } from 'lucide-react';

type OrientationType = 'portrait-up' | 'landscape-right' | 'portrait-down' | 'landscape-left';

function App() {
  const [orientation, setOrientation] = useState<OrientationType>('portrait-up');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Floating particles animation
  const particleAnimation = useSpring({
    from: { transform: 'translateY(100vh) rotate(0deg)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-100vh) rotate(360deg)' });
        await next({ transform: 'translateY(100vh) rotate(0deg)' });
      }
    },
    config: { duration: 20000 },
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        const angle = screen.orientation?.angle || window.orientation || 0;
        
        switch (angle) {
          case 0:
            setOrientation('portrait-up');
            break;
          case 90:
            setOrientation('landscape-right');
            break;
          case 180:
            setOrientation('portrait-down');
            break;
          case -90:
          case 270:
            setOrientation('landscape-left');
            break;
          default:
            setOrientation('portrait-up');
        }
        
        setTimeout(() => setIsTransitioning(false), 100);
      }, 150);
    };

    handleOrientationChange();
    window.addEventListener('orientationchange', handleOrientationChange);
    screen.orientation?.addEventListener('change', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      screen.orientation?.removeEventListener('change', handleOrientationChange);
    };
  }, []);

  const getFeatureConfig = () => {
    const configs = {
      'landscape-right': {
        component: <AlarmClock isDarkMode={isDarkMode} />,
        title: 'Alarm Clock',
        icon: <Clock size={24} />,
        gradient: isDarkMode 
          ? 'from-blue-600 via-purple-700 to-pink-700' 
          : 'from-blue-400 via-purple-500 to-pink-500',
        bgColor: isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' 
          : 'bg-gradient-to-br from-blue-50 to-purple-50',
        particles: 'blue'
      },
      'landscape-left': {
        component: <Stopwatch isDarkMode={isDarkMode} />,
        title: 'Stopwatch',
        icon: <StopwatchIcon size={24} />,
        gradient: isDarkMode 
          ? 'from-green-600 via-emerald-700 to-teal-700' 
          : 'from-green-400 via-emerald-500 to-teal-500',
        bgColor: isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900' 
          : 'bg-gradient-to-br from-green-50 to-emerald-50',
        particles: 'green'
      },
      'portrait-down': {
        component: <Timer isDarkMode={isDarkMode} />,
        title: 'Timer',
        icon: <TimerIcon size={24} />,
        gradient: isDarkMode 
          ? 'from-orange-600 via-red-700 to-pink-700' 
          : 'from-orange-400 via-red-500 to-pink-500',
        bgColor: isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-orange-900 to-red-900' 
          : 'bg-gradient-to-br from-orange-50 to-red-50',
        particles: 'orange'
      },
      'portrait-up': {
        component: <Weather isDarkMode={isDarkMode} />,
        title: 'Weather',
        icon: <Cloud size={24} />,
        gradient: isDarkMode 
          ? 'from-cyan-600 via-blue-700 to-indigo-700' 
          : 'from-cyan-400 via-blue-500 to-indigo-500',
        bgColor: isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-cyan-900 to-blue-900' 
          : 'bg-gradient-to-br from-cyan-50 to-blue-50',
        particles: 'cyan'
      }
    };

    return configs[orientation] || configs['portrait-up'];
  };

  const config = getFeatureConfig();

  return (
    <div className={`min-h-screen ${config.bgColor} transition-all duration-1000 ease-in-out relative overflow-hidden`}>
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <animated.div
            key={i}
            style={{
              ...particleAnimation,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
            }}
            className={`absolute w-2 h-2 rounded-full opacity-20 ${
              config.particles === 'blue' ? 'bg-blue-400' :
              config.particles === 'green' ? 'bg-green-400' :
              config.particles === 'orange' ? 'bg-orange-400' :
              'bg-cyan-400'
            }`}
          />
        ))}
      </div>

      {/* Enhanced 3D Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-10 left-10 w-32 h-32 rounded-full blur-xl ${
            isDarkMode ? 'bg-white/5' : 'bg-white/20'
          }`}
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.05, 0.2, 0.05]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute bottom-10 right-10 w-48 h-48 rounded-full blur-2xl ${
            isDarkMode ? 'bg-white/3' : 'bg-white/10'
          }`}
        />
        <motion.div 
          animate={{ 
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/2 left-1/4 w-24 h-24 rounded-full blur-lg ${
            isDarkMode ? 'bg-white/5' : 'bg-white/15'
          }`}
        />
      </div>

      {/* Theme Toggle */}
      <div className="fixed top-9 right-6 z-30">
        <ThemeToggle isDarkMode={isDarkMode} onToggle={setIsDarkMode} />
      </div>

      {/* Enhanced Header with 3D Effects */}
      <motion.header 
        className="relative z-10 p-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className={`flex items-center justify-center space-x-3 p-6 rounded-3xl bg-gradient-to-r ${config.gradient} text-white shadow-2xl backdrop-blur-sm transition-all duration-500 relative overflow-hidden ${
            isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'
          }`}
          whileHover={{ scale: 1.02, rotateX: 5 }}
          style={{ 
            transformStyle: 'preserve-3d',
            boxShadow: isDarkMode 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
              : '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform skew-x-12 animate-pulse"></div>
          </div>
          
          <motion.div 
            className="transform transition-transform duration-200 relative z-10"
            whileHover={{ scale: 1.2, rotateY: 15 }}
            whileTap={{ scale: 0.9 }}
          >
            {config.icon}
          </motion.div>
          <motion.h1 
            className="text-xl font-bold tracking-wide relative z-10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {config.title}
          </motion.h1>
        </motion.div>
      </motion.header>

      {/* Enhanced Main Content with Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.main 
          key={orientation}
          className="relative z-10 p-4"
          initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="transform-gpu">
            {config.component}
          </div>
        </motion.main>
      </AnimatePresence>

      {/* Enhanced Orientation Indicator */}
      <motion.div 
        className="fixed bottom-4 left-4 z-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <div className={`backdrop-blur-xl px-4 py-2 rounded-full text-xs font-medium border transition-all duration-300 ${
          isDarkMode 
            ? 'bg-black/40 text-white border-white/20' 
            : 'bg-white/40 text-gray-800 border-black/20'
        }`}>
          {orientation.replace('-', ' ').toUpperCase()}
        </div>
      </motion.div>

      {/* Floating Action Bubbles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-3 h-3 rounded-full ${
              isDarkMode ? 'bg-white/10' : 'bg-black/10'
            }`}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
            style={{
              left: `${10 + i * 15}%`,
              bottom: '10%'
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;