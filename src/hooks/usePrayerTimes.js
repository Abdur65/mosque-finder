import { useState, useEffect } from 'react';
import { fetchPrayerTimes, getNextPrayer, getTimeUntilPrayer } from '../services/prayerService';

export const usePrayerTimes = (location) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch prayer times when location changes
  useEffect(() => {
    if (!location?.lat || !location?.lon) return;

    const loadPrayerTimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const times = await fetchPrayerTimes(location.lat, location.lon);
        setPrayerTimes(times);
        
        // Determine next prayer
        const next = getNextPrayer(times);
        setNextPrayer(next);
        
        // Calculate time until next prayer
        const timeRemaining = getTimeUntilPrayer(times, next);
        setTimeUntilNext(timeRemaining);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch prayer times:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPrayerTimes();
  }, [location?.lat, location?.lon]);

  // Update next prayer and time remaining every minute
  useEffect(() => {
    if (!prayerTimes) return;

    const interval = setInterval(() => {
      const next = getNextPrayer(prayerTimes);
      setNextPrayer(next);
      
      const timeRemaining = getTimeUntilPrayer(prayerTimes, next);
      setTimeUntilNext(timeRemaining);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [prayerTimes]);

  return {
    prayerTimes,
    nextPrayer,
    timeUntilNext,
    loading,
    error
  };
};