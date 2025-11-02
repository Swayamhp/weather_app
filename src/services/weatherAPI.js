import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class WeatherAPI {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
    });
  }

  async getCurrentWeather(city, units = 'metric') {
    console.log("This is current weather",city);
    const cacheKey = `current_${city}_${units}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await this.client.get('/weather', {
      params: {
        q: city,
        units,
        appid: API_KEY,
      },
    });
    console.log("This is response",response);

    const data = this.transformCurrentWeather(response.data);
    this.setToCache(cacheKey, data);
    return data;
  }

  async getForecast(city, units = 'metric') {
    const cacheKey = `forecast_${city}_${units}`;
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    const response = await this.client.get('/forecast', {
      params: {
        q: city,
        units,
        appid: API_KEY,
      },
    });

    const data = this.transformForecast(response.data);
    this.setToCache(cacheKey, data);
    return data;
  }

  async searchCities(query) {
    if (!query.trim()) return [];
    
    const response = await this.client.get('/find', {
      params: {
        q: query,
        type: 'like',
        sort: 'population',
        cnt: 5,
        appid: API_KEY,
      },
    });

    return response.data.list.map(city => ({
      name: city.name,
      country: city.sys.country,
      lat: city.coord.lat,
      lon: city.coord.lon,
    }));
  }

  transformCurrentWeather(data) {
    return {
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
      wind_deg: data.wind.deg,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      visibility: data.visibility,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      city: data.name,
      country: data.sys.country,
    };
  }

  transformForecast(data) {
    const daily = {};
    const hourly = data.list.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000),
      temp: Math.round(item.main.temp),
      feels_like: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      pressure: item.main.pressure,
      wind_speed: item.wind.speed,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      pop: item.pop * 100, // Probability of precipitation
    }));

    // Group by day for 5-day forecast
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!daily[date]) {
        daily[date] = {
          date: new Date(item.dt * 1000),
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          items: [],
        };
      }
      daily[date].items.push(item);
    });

    const dailyForecast = Object.values(daily)
      .slice(0, 5)
      .map(day => ({
        date: day.date,
        temp_min: Math.round(Math.min(...day.items.map(item => item.main.temp_min))),
        temp_max: Math.round(Math.max(...day.items.map(item => item.main.temp_max))),
        icon: day.items[Math.floor(day.items.length / 2)].weather[0].icon,
        description: day.items[Math.floor(day.items.length / 2)].weather[0].description,
      }));

    return { hourly, daily: dailyForecast };
  }

  getFromCache(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    cache.delete(key);
    return null;
  }

  setToCache(key, data) {
    cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}

export const weatherAPI = new WeatherAPI();