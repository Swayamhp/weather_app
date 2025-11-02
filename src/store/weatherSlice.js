import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { weatherAPI } from '../services/weatherAPI';

// Utility to convert any Date objects into serializable timestamps
const normalizeWeatherData = (data) => {
  const copy = { ...data };
  for (const key in copy) {
    if (copy[key] instanceof Date) {
      copy[key] = copy[key].getTime(); // convert Date -> timestamp
    } else if (typeof copy[key] === 'object' && copy[key] !== null) {
      copy[key] = normalizeWeatherData(copy[key]); // recursively handle nested data
    }
  }
  return copy;
};

export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrentWeather',
  async ({ city, units = 'metric' }, { rejectWithValue }) => {
    try {
      const data = await weatherAPI.getCurrentWeather(city, units);
      const safeData = normalizeWeatherData(data);
      return { city, data: safeData, timestamp: Date.now() };
    } catch (error) {
      console.log("This erroror ")
      return rejectWithValue(error.message);
    }
  }
);

export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async ({ city, units = 'metric' }, { rejectWithValue }) => {
    try {
      const data = await weatherAPI.getForecast(city, units);
      const safeData = normalizeWeatherData(data);
      return { city, data: safeData, timestamp: Date.now() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    current: {},
    forecast: {},
    favorites: JSON.parse(localStorage.getItem('weatherFavorites')) || [],
    units: localStorage.getItem('weatherUnits') || 'metric',
    loading: false,
    error: null,
    lastUpdated: {},
  },
  reducers: {
    addFavorite: (state, action) => {
      const city = action.payload;
      if (!state.favorites.includes(city)) {
        state.favorites.push(city);
        localStorage.setItem('weatherFavorites', JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(city => city !== action.payload);
      localStorage.setItem('weatherFavorites', JSON.stringify(state.favorites));
    },
    setUnits: (state, action) => {
      state.units = action.payload;
      localStorage.setItem('weatherUnits', action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.current[action.payload.city] = action.payload.data;
        state.lastUpdated[action.payload.city] = action.payload.timestamp;
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.forecast[action.payload.city] = action.payload.data;
      });
  },
});

export const { addFavorite, removeFavorite, setUnits, clearError } = weatherSlice.actions;
export default weatherSlice.reducer;
