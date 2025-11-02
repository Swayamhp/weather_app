import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Settings, CloudRain, Heart } from "lucide-react";
import WeatherCard from "../components/weatherCard";
import SearchBar from "../components/SearchBar";
import SettingsModal from "../components/SettingsModal";
import { fetchCurrentWeather } from "../store/weatherSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { current, favorites, loading } = useSelector((state) => state.weather);
  const [showSettings, setShowSettings] = useState(false);
  const [searchedCity, setSearchedCity] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const defaultCities = [
    "New York", "London", "Tokyo", "Paris", "Sydney",
    "Berlin", "Toronto", "Dubai", "Singapore", "Mumbai",
  ];

  // Fetch weather initially for default cities when no search is active
  useEffect(() => {
    if (!searchedCity && !showFavorites) {
      defaultCities.forEach((city) => {
        if (!current[city]) dispatch(fetchCurrentWeather({ city }));
      });
    }
  }, [dispatch, searchedCity, showFavorites]);

  // 🔁 Auto-refresh weather data every 60 seconds
  useEffect(() => {
    const citiesToFetch = searchedCity
      ? [searchedCity]
      : showFavorites
      ? favorites
      : defaultCities;

    // Initial fetch
    citiesToFetch.forEach((city) => dispatch(fetchCurrentWeather({ city })));

    // Set interval to refresh every 60 seconds
    const interval = setInterval(() => {
      citiesToFetch.forEach((city) => dispatch(fetchCurrentWeather({ city })));
      console.log("Weather data auto-refreshed");
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch, searchedCity, showFavorites, favorites]);

  const handleCitySearch = (city) => {
    if (!city) return;
    setSearchedCity(city);
    dispatch(fetchCurrentWeather({ city }));
  };

  const handleCitySelect = (city) => {
    window.location.href = `/city/${encodeURIComponent(city)}`;
  };

  const citiesToRender = searchedCity
    ? [searchedCity]
    : showFavorites
    ? favorites
    : defaultCities;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1120] via-[#111827] to-[#1e293b] text-white transition-all duration-700">
      <div className="max-w-7xl mx-auto px-6 py-4">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 text-white">
              <CloudRain className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" size={40} />
              Weather Analytics Dashboard
            </h1>
            <p className="text-slate-400 mt-2 ml-1 text-lg">
              Track real-time weather, forecasts, and climate insights.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowFavorites(!showFavorites);
                setSearchedCity(null);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 
                ${
                  showFavorites
                    ? "bg-pink-600/70 hover:bg-pink-500 shadow-lg shadow-pink-500/30"
                    : "bg-slate-800/60 hover:bg-slate-700/70 shadow-lg hover:shadow-pink-500/20"
                } 
                backdrop-blur-md border border-slate-700 text-slate-200`}
            >
              <Heart size={20} />
              <span>{showFavorites ? "Show All" : "Show Favorites"}</span>
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-5 py-3 
              bg-slate-800/60 hover:bg-slate-700/70 
              backdrop-blur-md border border-slate-700 rounded-xl 
              shadow-lg hover:shadow-blue-500/20 
              transition-all duration-300 text-slate-200 font-medium"
            >
              <Settings size={22} />
              <span className="hidden sm:block">Settings</span>
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="mb-10 z-[80]">
          <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 p-5 rounded-2xl shadow-lg">
            <SearchBar onCitySelect={handleCitySearch} />
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        )}

        {/* Weather Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
          {citiesToRender.map((city) =>
            current[city] ? (
              <WeatherCard
                key={city}
                city={city}
                current={current[city]}
                onSelect={handleCitySelect}
              />
            ) : null
          )}
        </div>

        {/* Footer */}
        {!searchedCity && !showFavorites && (
          <footer className="mt-12 bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-md p-5 border border-slate-700">
            <div className="flex flex-wrap gap-6 justify-center text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                {defaultCities.length} cities monitored
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                Real-time updates every 60s
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
                5-day forecasts
              </div>
            </div>
          </footer>
        )}

        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      </div>
    </div>
  );
};

export default Dashboard;
