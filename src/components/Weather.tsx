import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  RefreshCw,
  Sunrise,
  Sunset,
  Eye,
} from "lucide-react";

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  feelsLike: number;
  icon: string;
  sunrise: number;
  sunset: number;
  timezone: number;
}

interface WeatherProps {
  isDarkMode: boolean;
}

const Weather: React.FC<WeatherProps> = ({ isDarkMode }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  // Floating animation for weather icon
  const iconFloat = useSpring({
    from: { transform: "translateY(0px) rotate(0deg)" },
    to: async (next) => {
      while (true) {
        await next({ transform: "translateY(-10px) rotate(5deg)" });
        await next({ transform: "translateY(0px) rotate(-5deg)" });
        await next({ transform: "translateY(10px) rotate(0deg)" });
        await next({ transform: "translateY(0px) rotate(0deg)" });
      }
    },
    config: { duration: 3000 },
  });

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      setError("");
      setWeather(null);

      let latitude: number;
      let longitude: number;

      try {
        const position = await getCurrentPosition();
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      } catch (geoError) {
        console.warn("Geolocation failed, using fallback location:", geoError);
        // Fallback to Tokyo, Japan coordinates
        latitude = 35.6895;
        longitude = 139.6917;
        setError("Unable to get your location. Showing fallback weather.");
      }

      if (!API_KEY) {
        setError("Missing OpenWeather API key.");
        setLoading(false);
        return;
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Weather data not available");
      }

      const data = await response.json();

      setWeather({
        location: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000,
        feelsLike: Math.round(data.main.feels_like),
        icon: data.weather[0].icon,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezone: data.timezone,
      });
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch weather data"
      );
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        maximumAge: 300000,
      });
    });
  };

  const getWeatherIcon = (iconCode: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      "01d": <Sun className="text-yellow-500" size={48} />,
      "01n": <Sun className="text-gray-400" size={48} />,
      "02d": <Cloud className="text-gray-500" size={48} />,
      "02n": <Cloud className="text-gray-600" size={48} />,
      "03d": <Cloud className="text-gray-500" size={48} />,
      "03n": <Cloud className="text-gray-600" size={48} />,
      "04d": <Cloud className="text-gray-600" size={48} />,
      "04n": <Cloud className="text-gray-700" size={48} />,
      "09d": <CloudRain className="text-blue-500" size={48} />,
      "09n": <CloudRain className="text-blue-600" size={48} />,
      "10d": <CloudRain className="text-blue-500" size={48} />,
      "10n": <CloudRain className="text-blue-600" size={48} />,
      "11d": <CloudRain className="text-purple-500" size={48} />,
      "11n": <CloudRain className="text-purple-600" size={48} />,
      "13d": <CloudSnow className="text-blue-300" size={48} />,
      "13n": <CloudSnow className="text-blue-400" size={48} />,
      "50d": <Wind className="text-gray-400" size={48} />,
      "50n": <Wind className="text-gray-500" size={48} />,
    };

    return iconMap[iconCode] || <Cloud className="text-gray-500" size={48} />;
  };

  // Convert UNIX UTC timestamp + timezone offset to local time string (HH:mm)
  const formatTime = (timestamp: number, timezoneOffset: number) => {
    const localTime = new Date((timestamp + timezoneOffset) * 1000);
    return localTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Text colors based on dark mode
  const textPrimary = isDarkMode ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-700";
  const textTertiary = isDarkMode ? "text-gray-500" : "text-gray-500"; // for icons/info labels

  if (loading) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div
          className={`rounded-3xl p-8 shadow-2xl ${
            isDarkMode
              ? "bg-gray-800/90 backdrop-blur-xl border border-gray-700/50"
              : "bg-white/90 backdrop-blur-xl border border-white/50"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center">
            <motion.div
              className="text-blue-500 mb-4 flex justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={32} />
            </motion.div>
            <motion.p
              className={`${textSecondary}`}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading weather data...
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div
          className={`rounded-3xl p-8 shadow-2xl ${
            isDarkMode
              ? "bg-gray-800/90 backdrop-blur-xl border border-gray-700/50"
              : "bg-white/90 backdrop-blur-xl border border-white/50"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-center">
            <Cloud className={`${textTertiary} mx-auto mb-4`} size={48} />
            <p className="text-red-600 mb-4">{error}</p>
            <motion.button
              onClick={fetchWeatherData}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Main Weather Card */}
      <motion.div
        className={`rounded-3xl p-8 shadow-2xl transform-gpu relative overflow-hidden ${
          isDarkMode
            ? "bg-gray-800/90 backdrop-blur-xl border border-gray-700/50"
            : "bg-white/90 backdrop-blur-xl border border-white/50"
        }`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          rotateX: 5,
          rotateY: 5,
          scale: 1.02,
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-indigo-500/10 rounded-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          aria-hidden="true"
        />
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center space-y-4">
          {/* Location */}
          <div
            className={`flex items-center space-x-2 text-lg font-semibold text-blue-500`}
          >
            <MapPin size={20} />
            <span>
              {weather.location}, {weather.country}
            </span>
          </div>
          {/* Animated Weather Icon */}
          <animated.div style={iconFloat} className="mb-2">
            {getWeatherIcon(weather.icon)}
          </animated.div>
          {/* Temperature */}
          <div className={`text-6xl font-bold leading-none ${textPrimary}`}>
            {weather.temperature}°C
          </div>
          {/* Description */}
          <div className={`capitalize ${textSecondary}`}>
            {weather.description}
          </div>
          {/* Feels Like */}
          <div
            className={`flex items-center space-x-1 text-sm ${textSecondary}`}
          >
            <Thermometer size={16} />
            <span>Feels like {weather.feelsLike}°C</span>
          </div>
          {/* Humidity, Wind, Visibility */}
          <div className="grid grid-cols-3 gap-4 w-full pt-6 border-t border-gray-300/20">
            <div className="flex flex-col items-center">
              <Droplets size={20} className={textTertiary} />
              <span className={`mt-1 text-xs ${textSecondary}`}>Humidity</span>
              <span className={`text-sm font-semibold ${textPrimary}`}>
                {weather.humidity}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Wind size={20} className={textTertiary} />
              <span className={`mt-1 text-xs ${textSecondary}`}>Wind</span>
              <span className={`text-sm font-semibold ${textPrimary}`}>
                {weather.windSpeed.toFixed(1)} m/s
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Eye size={20} className={textTertiary} />
              <span className={`mt-1 text-xs ${textSecondary}`}>
                Visibility
              </span>
              <span className={`text-sm font-semibold ${textPrimary}`}>
                {weather.visibility.toFixed(1)} km
              </span>
            </div>
          </div>
          {/* Sunrise & Sunset */}
          <div className="grid grid-cols-2 gap-6 w-full pt-6 border-t border-gray-300/20">
            <div className="flex items-center space-x-2 justify-center">
              <Sunrise size={20} className={textTertiary} />
              <div className="flex flex-col text-center">
                <span className={`text-xs ${textSecondary}`}>Sunrise</span>
                <span className={`text-sm font-semibold ${textPrimary}`}>
                  {formatTime(weather.sunrise, weather.timezone)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 justify-center">
              <Sunset size={20} className={textTertiary} />
              <div className="flex flex-col text-center">
                <span className={`text-xs ${textSecondary}`}>Sunset</span>
                <span className={`text-sm font-semibold ${textPrimary}`}>
                  {formatTime(weather.sunset, weather.timezone)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Retry button if error exists */}
      {error && (
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <motion.button
            onClick={fetchWeatherData}
            className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Weather;
