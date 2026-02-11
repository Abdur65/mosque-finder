import type { Mosque } from '../types';

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

const buildMosqueQuery = (lat: number, lon: number, radius = 5000): string => `
  [out:json][timeout:25];
  (
    node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
    way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
  );
  out body;
  >;
  out skel qt;
`;

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

interface OverpassElement {
  id: number;
  type: 'node' | 'way' | 'relation';
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export const fetchNearbyMosques = async (
  lat: number,
  lon: number,
  radius = 5000
): Promise<Mosque[]> => {
  const query = buildMosqueQuery(lat, lon, radius);

  const response = await fetch(OVERPASS_API, {
    method: 'POST',
    body: query,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status}`);
  }

  const data: { elements: OverpassElement[] } = await response.json();

  return data.elements
    .filter(el => el.type === 'node' || el.type === 'way')
    .map(el => {
      const mosqueLat = el.lat ?? el.center?.lat ?? 0;
      const mosqueLon = el.lon ?? el.center?.lon ?? 0;
      const distance = calculateDistance(lat, lon, mosqueLat, mosqueLon);

      return {
        id: el.id,
        name: el.tags?.name ?? 'Unnamed Mosque',
        lat: mosqueLat,
        lon: mosqueLon,
        distance,
        distanceText:
          distance < 1
            ? `${(distance * 1000).toFixed(0)} m`
            : `${distance.toFixed(1)} km`,
        address: el.tags?.['addr:street'] ?? '',
        denomination: el.tags?.denomination ?? ''
      };
    })
    .filter(m => m.lat !== 0 && m.lon !== 0)
    .sort((a, b) => a.distance - b.distance);
};
