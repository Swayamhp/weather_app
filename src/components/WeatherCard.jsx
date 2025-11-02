import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Wind, Droplets, Gauge } from 'lucide-react';
import { addFavorite, removeFavorite } from '../store/weatherSlice';

const WeatherCard = ({ city, onSelect, current }) => {
  const dispatch = useDispatch();
  const { favorites, units } = useSelector((state) => state.weather);
  const isFavorite = favorites.includes(city);

  if (!current) return null;

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) dispatch(removeFavorite(city));
    else dispatch(addFavorite(city));
  };

  const tempUnit = units === 'metric' ? '°C' : '°F';
  const windUnit = units === 'metric' ? 'm/s' : 'mph';

  // 🎨 High-contrast gradients for readability
  const getWeatherGradient = (condition) => {
    const desc = condition.toLowerCase();
    if (desc.includes('clear')) {
      return {
        bg: 'from-[#2563EB] via-[#1E40AF] to-[#1E3A8A]', // vivid blue
        text: 'text-blue-50',
      };
    } else if (desc.includes('cloud')) {
      return {
        bg: 'from-[#475569] via-[#334155] to-[#1E293B]', // dark slate
        text: 'text-gray-100',
      };
    } else if (desc.includes('rain') || desc.includes('drizzle')) {
      return {
        bg: 'from-[#1E3A8A] via-[#1E40AF] to-[#3B82F6]', // deep ocean blue
        text: 'text-blue-50',
      };
    } else if (desc.includes('thunder')) {
      return {
        bg: 'from-[#4C1D95] via-[#312E81] to-[#1E1B4B]', // royal purple
        text: 'text-indigo-100',
      };
    } else if (desc.includes('snow')) {
      return {
        bg: 'from-[#E0F2FE] via-[#BAE6FD] to-[#7DD3FC]', // light icy blue
        text: 'text-slate-800',
      };
    } else if (desc.includes('mist') || desc.includes('fog') || desc.includes('haze')) {
      return {
        bg: 'from-[#CBD5E1] via-[#94A3B8] to-[#475569]', // soft fog gray
        text: 'text-slate-900',
      };
    } else if (desc.includes('sun')) {
      return {
        bg: 'from-[#FBBF24] via-[#F59E0B] to-[#B45309]', // golden sun
        text: 'text-amber-50',
      };
    }
    return {
      bg: 'from-[#0F172A] via-[#1E293B] to-[#334155]', // default dark
      text: 'text-gray-100',
    };
  };

  const { bg, text } = getWeatherGradient(current.description || current.main);

  return (
    <div
      onClick={() => onSelect(city)}
      className={`
        relative overflow-hidden rounded-3xl cursor-pointer
        bg-gradient-to-br ${bg}
        border border-white/10
        backdrop-blur-xl
        shadow-[0_10px_30px_rgba(0,0,0,0.25)]
        hover:shadow-[0_15px_35px_rgba(0,0,0,0.4)]
        hover:scale-[1.02]
        transition-all duration-300 ease-in-out p-6
        ${text}
      `}
    >
      {/* Subtle light overlay */}
      <div className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none" />

      {/* Header */}
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div>
          <h3 className="text-2xl font-bold tracking-tight">{current.city}</h3>
          <p className="text-sm opacity-80">{current.country}</p>
        </div>

        <button
          onClick={handleFavorite}
          className={`p-2 rounded-full transition-all backdrop-blur-md ${
            isFavorite
              ? 'text-red-500 bg-white/30 shadow-md'
              : 'text-white/70 hover:text-red-500 hover:bg-white/20'
          }`}
        >
          <Heart fill={isFavorite ? 'currentColor' : 'none'} size={22} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div>
          <p className="text-6xl font-extrabold leading-none drop-shadow-md">
            {Math.round(current.temp)}{tempUnit}
          </p>
          <p className="opacity-80 text-sm mt-1">
            Feels like {Math.round(current.feels_like)}{tempUnit}
          </p>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 flex items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-sm">
            <img
              src={`https://openweathermap.org/img/wn/${current.icon.replace('n', 'd')}@2x.png`}
              alt={current.description}
              className="w-16 h-16 object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]"
            />
          </div>
          <p className="capitalize text-sm mt-2 opacity-90 font-medium">
            {current.description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="grid grid-cols-3 gap-3 text-sm border-t border-white/20 pt-3 relative z-10 opacity-90">
        <div className="flex items-center gap-2">
          <Wind size={18} className="opacity-80" />
          <span>{current.wind_speed} {windUnit}</span>
        </div>
        <div className="flex items-center gap-2">
          <Droplets size={18} className="opacity-80" />
          <span>{current.humidity}%</span>
        </div>
        <div className="flex items-center gap-2">
          <Gauge size={18} className="opacity-80" />
          <span>{current.pressure} hPa</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
