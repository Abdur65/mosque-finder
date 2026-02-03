import { useState, useEffect } from 'react';
import { DEFAULT_LOCATION, GEOLOCATION_OPTIONS, LOCATION_STATUS } from '../utils/constants';

/**
 * Custom hook to handle browser geolocation
 * Returns current location, loading state, and error information
 */
export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState(LOCATION_STATUS.IDLE);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setStatus(LOCATION_STATUS.ERROR);
      setError('Geolocation is not supported by your browser');
      setLocation(DEFAULT_LOCATION);
      return;
    }

    // Set loading state
    setStatus(LOCATION_STATUS.LOADING);

    // Request user's location
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          lat: latitude,
          lon: longitude,
          name: 'Your Location'
        });
        setStatus(LOCATION_STATUS.SUCCESS);
        setError(null);
      },
      // Error callback
      (err) => {
        console.error('Geolocation error:', err);
        
        // Handle different error types
        let errorMessage = 'Unable to retrieve your location';
        let statusType = LOCATION_STATUS.ERROR;

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            statusType = LOCATION_STATUS.DENIED;
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case err.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'An unknown error occurred';
        }

        setError(errorMessage);
        setStatus(statusType);
        // Fall back to default location
        setLocation(DEFAULT_LOCATION);
      },
      // Options
      GEOLOCATION_OPTIONS
    );
  }, []);

  /**
   * Manually set a location (for search functionality in future epics)
   */
  const setManualLocation = (lat, lon, name = 'Selected Location') => {
    setLocation({ lat, lon, name });
    setStatus(LOCATION_STATUS.SUCCESS);
    setError(null);
  };

  return {
    location,
    status,
    error,
    isLoading: status === LOCATION_STATUS.LOADING,
    isDenied: status === LOCATION_STATUS.DENIED,
    isSuccess: status === LOCATION_STATUS.SUCCESS,
    isError: status === LOCATION_STATUS.ERROR,
    setManualLocation
  };
};