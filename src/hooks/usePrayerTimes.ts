import { useState, useEffect } from 'react';
import { fetchPrayerTimes, getNextPrayer, getTimeUntilPrayer } from '../services/prayerService';
import type { PrayerTimesData, PrayerName, Location } from '../types';

interface UsePrayerTimesReturn {
  prayerTimes: PrayerTimesData | null;
  nextPrayer: PrayerName | null;
  timeUntilNext: string;
  loading: boolean;
  error: string | null;
}

export const usePrayerTimes = (location: Location | null): UsePrayerTimesReturn => {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [nextPrayer, setNextPrayer] = useState<PrayerName | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location?.lat || !location?.lon) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const times = await fetchPrayerTimes(location.lat, location.lon);
        setPrayerTimes(times);
        const next = getNextPrayer(times);
        setNextPrayer(next);
        setTimeUntilNext(getTimeUntilPrayer(times, next));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch prayer times';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [location?.lat, location?.lon]);

  useEffect(() => {
    if (!prayerTimes) return;

    const interval = setInterval(() => {
      const next = getNextPrayer(prayerTimes);
      setNextPrayer(next);
      setTimeUntilNext(getTimeUntilPrayer(prayerTimes, next));
    }, 60000);

    return () => clearInterval(interval);
  }, [prayerTimes]);

  return { prayerTimes, nextPrayer, timeUntilNext, loading, error };
};
