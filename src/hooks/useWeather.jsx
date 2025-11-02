import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentWeather, fetchForecast } from '../store/weatherSlice';

export const useWeather = (city) => {
  const dispatch = useDispatch();
  const { current, forecast, units, loading, error, lastUpdated } = useSelector(
    state => state.weather
  );

  useEffect(() => {
    if (city) {
      const shouldRefresh = !lastUpdated[city] || 
        Date.now() - lastUpdated[city] > 60000; // 1 minute

      if (shouldRefresh) {
        dispatch(fetchCurrentWeather({ city, units }));
        dispatch(fetchForecast({ city, units }));
      }
    }
  }, [city, units, dispatch, lastUpdated]);

  return {
    current: current[city],
    forecast: forecast[city],
    loading,
    error,
  };
};