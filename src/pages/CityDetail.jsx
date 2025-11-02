import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useWeather } from "../hooks/useWeather.jsx";
import TemperatureChart from "../components/TemperatureChart.jsx";
import { useSelector } from "react-redux";

const CityDetail = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const { current, forecast, loading } = useWeather(cityName);
  const { units } = useSelector((state) => state.weather);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center">
        <p className="text-cyan-300 text-lg font-semibold animate-pulse">
          Loading weather data...
        </p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] flex items-center justify-center">
        <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-bold mb-4 text-white">City not found</h2>
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium shadow-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const tempUnit = units === "metric" ? "°C" : "°F";
  const windUnit = units === "metric" ? "m/s" : "mph";

  const hourlyForecast = forecast?.hourly
    ? Object.values(forecast.hourly).map((item) => ({
        time: item.time,
        temp: item.temp_max || item.temp_min || item.temp,
        icon: item.icon,
        description: item.description,
      }))
    : [];

  const dailyForecast = forecast?.daily
    ? Array.isArray(forecast.daily)
      ? forecast.daily
      : Object.values(forecast.daily)
    : [];

  const getWeatherGradient = (desc) => {
    const d = desc.toLowerCase();
    if (d.includes("cloud")) return "bg-gradient-to-br from-gray-600 to-blue-700";
    if (d.includes("rain")) return "bg-gradient-to-br from-blue-800 to-indigo-700";
    if (d.includes("sun") || d.includes("clear"))
      return "bg-gradient-to-br from-amber-400 to-orange-600";
    if (d.includes("snow")) return "bg-gradient-to-br from-blue-200 to-cyan-400 text-gray-900";
    if (d.includes("storm")) return "bg-gradient-to-br from-purple-800 to-gray-700";
    return "bg-gradient-to-br from-indigo-700 to-cyan-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-6 text-gray-100">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/")}
            className="p-2 bg-white/10 backdrop-blur-md rounded-full text-cyan-400 hover:bg-white/20 transition"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              {current.city}, {current.country}
            </h1>
            <p className="text-cyan-300 text-lg capitalize">
              {current.description}
            </p>
          </div>
        </div>

        {/* Current Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className={`rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center border border-white/10 text-white transition-all duration-500 ${getWeatherGradient(
              current.description
            )}`}
          >
            <img
              src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
              alt={current.description}
              className="w-28 h-28 mb-3 drop-shadow-xl"
            />
            <div className="text-6xl font-extrabold mb-1">
              {Math.round(current.temp)}
              {tempUnit}
            </div>
            <p className="text-lg capitalize">{current.description}</p>
            <p className="text-md mt-1">
              Feels like {Math.round(current.feels_like)}
              {tempUnit}
            </p>
          </div>

          {/* Weather Details */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 lg:col-span-2 border border-white/10">
            <h3 className="text-lg font-semibold mb-4 text-cyan-300">
              Weather Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                ["Humidity", `${current.humidity}%`],
                ["Wind Speed", `${current.wind_speed} ${windUnit}`],
                ["Pressure", `${current.pressure} hPa`],
                ["Visibility", `${(current.visibility / 1000).toFixed(1)} km`],
                ["Sunrise", new Date(current.sunrise).toLocaleTimeString()],
                ["Sunset", new Date(current.sunset).toLocaleTimeString()],
              ].map(([label, value], i) => (
                <div key={i} className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm text-gray-300">{label}</p>
                  <p className="text-xl font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Temperature Chart */}
        {hourlyForecast.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10">
            <TemperatureChart hourly={hourlyForecast} units={units} />
          </div>
        )}

        {/* Forecast Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hourly Forecast */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} className="text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">
                Hourly Forecast
              </h3>
            </div>
            {hourlyForecast.length > 0 ? (
              <div className="space-y-3">
                {hourlyForecast.map((hour, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-white/10"
                  >
                    <span className="text-gray-300">
                      {new Date(hour.time).getHours()}:00
                    </span>
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://openweathermap.org/img/wn/${hour.icon}@2x.png`}
                        alt={hour.description}
                        className="w-8 h-8"
                      />
                      <div className="text-right">
                        <span className="font-semibold text-white">
                          {Math.round(hour.temp)} {tempUnit}
                        </span>
                        <p className="text-xs text-gray-400 capitalize">
                          {hour.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">
                No hourly forecast available.
              </p>
            )}
          </div>

          {/* Daily Forecast */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} className="text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">
                5-Day Forecast
              </h3>
            </div>
            {dailyForecast.length > 0 ? (
              <div className="space-y-3">
                {dailyForecast.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-white/10"
                  >
                    <span className="text-gray-300">
                      {new Date(day.date || day.dt * 1000).toLocaleDateString(
                        "en-US",
                        { weekday: "short" }
                      )}
                    </span>
                    <div className="flex items-center gap-4">
                      <img
                        src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                        alt={day.description}
                        className="w-8 h-8"
                      />
                      <div className="text-right">
                        <span className="font-semibold text-white">
                          {Math.round(day.temp_max || day.temp)} {tempUnit}
                        </span>
                        <span className="text-gray-400 ml-2">
                          {Math.round(day.temp_min || day.temp)} {tempUnit}
                        </span>
                        <p className="text-xs text-gray-400 capitalize">
                          {day.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">
                No daily forecast available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetail;
