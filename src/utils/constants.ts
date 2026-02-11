import type { Location, GeolocationOptions, LocationStatus } from '../types';

export const DEFAULT_LOCATIONS: Record<string, Location> = {
  CHITTAGONG: {
    lat: 22.3569,
    lon: 91.7832,
    name: 'Chittagong, Bangladesh'
  },
  MECCA: {
    lat: 21.4225,
    lon: 39.8262,
    name: 'Mecca, Saudi Arabia'
  }
};

export const DEFAULT_LOCATION: Location = DEFAULT_LOCATIONS.CHITTAGONG;

export const GEOLOCATION_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

export const LOCATION_STATUS: Record<string, LocationStatus> = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  DENIED: 'denied'
};
