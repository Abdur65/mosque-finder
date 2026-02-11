import type { Location, RouteCoordinate } from '../types';

const OSRM_API = 'https://router.project-osrm.org/route/v1';

export const fetchRoute = async (
  from: Location,
  to: Location,
  profile: 'foot' | 'driving' | 'cycling' = 'foot'
): Promise<RouteCoordinate[]> => {
  const url = `${OSRM_API}/${profile}/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OSRM API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.routes || data.routes.length === 0) {
    throw new Error('No route found');
  }

  // OSRM returns [lon, lat] pairs, convert to { lat, lng }
  const coordinates: [number, number][] = data.routes[0].geometry.coordinates;
  return coordinates.map(([lon, lat]) => ({ lat, lng: lon }));
};
