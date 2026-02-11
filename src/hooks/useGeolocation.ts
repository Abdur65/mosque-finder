import { useState, useEffect } from 'react';
import { DEFAULT_LOCATION, GEOLOCATION_OPTIONS, LOCATION_STATUS } from '../utils/constants';
import type { Location, LocationStatus } from '../types';

interface UseGeolocationReturn {
  location: Location | null;
  status: LocationStatus;
  error: string | null;
  isLoading: boolean;
  isDenied: boolean;
  isSuccess: boolean;
  isError: boolean;
  setManualLocation: (lat: number, lon: number, name?: string) => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<Location | null>(null);
  const [status, setStatus] = useState<LocationStatus>(LOCATION_STATUS.IDLE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus(LOCATION_STATUS.ERROR);
      setError('Geolocation is not supported by your browser');
      setLocation(DEFAULT_LOCATION);
      return;
    }

    setStatus(LOCATION_STATUS.LOADING);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ lat: coords.latitude, lon: coords.longitude, name: 'Your Location' });
        setStatus(LOCATION_STATUS.SUCCESS);
        setError(null);
      },
      err => {
        let errorMessage = 'Unable to retrieve your location';
        let statusType: LocationStatus = LOCATION_STATUS.ERROR;

        if (err.code === err.PERMISSION_DENIED) {
          errorMessage = 'Location permission denied';
          statusType = LOCATION_STATUS.DENIED;
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMessage = 'Location information unavailable';
        } else if (err.code === err.TIMEOUT) {
          errorMessage = 'Location request timed out';
        }

        setError(errorMessage);
        setStatus(statusType);
        setLocation(DEFAULT_LOCATION);
      },
      GEOLOCATION_OPTIONS
    );
  }, []);

  const setManualLocation = (lat: number, lon: number, name = 'Selected Location') => {
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
