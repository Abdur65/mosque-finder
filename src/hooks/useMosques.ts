import { useState, useEffect } from 'react';
import { fetchNearbyMosques } from '../services/mosqueService';
import type { Mosque, Location } from '../types';

interface UseMosquesReturn {
  mosques: Mosque[];
  loading: boolean;
  error: string | null;
}

export const useMosques = (
  location: Location | null,
  radius = 5000
): UseMosquesReturn => {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location?.lat || !location?.lon) return;

    const loadMosques = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchNearbyMosques(location.lat, location.lon, radius);
        setMosques(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch mosques';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadMosques();
  }, [location?.lat, location?.lon, radius]);

  return { mosques, loading, error };
};
