import React from 'react';
import { X, Thermometer, Database, Cloud } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setUnits } from '../store/weatherSlice';

const SettingsModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { units } = useSelector((state) => state.weather);

  const handleUnitChange = (newUnits) => {
    dispatch(setUnits(newUnits));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-[999]">
      <div
        className="relative bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b]
        rounded-2xl p-8 w-full max-w-md border border-slate-700/70 
        shadow-[0_0_25px_rgba(59,130,246,0.25)] text-slate-100
        animate-fadeIn backdrop-blur-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-700/60 pb-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Cloud className="text-blue-400" size={24} />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/40 rounded-full transition-all"
          >
            <X size={22} className="text-slate-300 hover:text-white" />
          </button>
        </div>

        {/* Temperature Units */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Thermometer size={22} className="text-blue-400" />
            <h3 className="text-lg font-medium">Temperature Units</h3>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleUnitChange('metric')}
              className={`flex-1 py-3 rounded-xl font-medium border transition-all duration-300 ${
                units === 'metric'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                  : 'bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-slate-700/50'
              }`}
            >
              Celsius (°C)
            </button>
            <button
              onClick={() => handleUnitChange('imperial')}
              className={`flex-1 py-3 rounded-xl font-medium border transition-all duration-300 ${
                units === 'imperial'
                  ? 'bg-blue-600 text-white border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                  : 'bg-slate-800/50 text-slate-300 border-slate-600 hover:bg-slate-700/50'
              }`}
            >
              Fahrenheit (°F)
            </button>
          </div>
        </div>

        {/* Cache Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Database size={20} className="text-cyan-400" />
            <h3 className="text-lg font-medium">Data Caching</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Weather data is cached for <span className="text-blue-400">5 minutes</span> to reduce API
            calls and improve performance.
          </p>
        </div>

        {/* API Info */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
            <Cloud className="text-indigo-400" size={20} />
            Data Source
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Powered by <span className="text-blue-400">OpenWeatherMap</span>. Updated every minute
            for real-time accuracy.
          </p>
        </div>

        {/* Done Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 transition-all rounded-xl 
            font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
