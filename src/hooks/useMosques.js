import { useState, useEffect } from 'react';
import { fetchNearbyMosques } from '../services/mosqueService';

export const useMosques = (location, radius = 5000) => {
  const [mosques, setMosques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location?.lat || !location?.lon) return;

    const loadMosques = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchNearbyMosques(location.lat, location.lon, radius);
        setMosques(data);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch mosques:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMosques();
  }, [location?.lat, location?.lon, radius]);

  return { mosques, loading, error };
};