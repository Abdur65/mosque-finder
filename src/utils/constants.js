// Default locations for fallback
export const DEFAULT_LOCATIONS = {
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

// Use Chittagong as primary default
export const DEFAULT_LOCATION = DEFAULT_LOCATIONS.CHITTAGONG;

// Geolocation options
export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000, // 10 seconds
  maximumAge: 0
};

// Location states
export const LOCATION_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  DENIED: 'denied'
};