/**
 * Service to fetch mosques from Overpass API
 * Overpass queries OpenStreetMap data
 */

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

/**
 * Build Overpass query for mosques within radius
 */
const buildMosqueQuery = (lat, lon, radius = 5000) => {
  return `
    [out:json][timeout:25];
    (
      node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
      way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lon});
    );
    out body;
    >;
    out skel qt;
  `;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Fetch nearby mosques from Overpass API
 */
export const fetchNearbyMosques = async (lat, lon, radius = 5000) => {
  try {
    const query = buildMosqueQuery(lat, lon, radius);
    
    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      body: query,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Process and format mosque data
    const mosques = data.elements
      .filter(element => element.type === 'node' || element.type === 'way')
      .map(element => {
        const mosqueLat = element.lat || element.center?.lat;
        const mosqueLon = element.lon || element.center?.lon;
        
        // Calculate distance from user
        const distance = calculateDistance(lat, lon, mosqueLat, mosqueLon);
        
        return {
          id: element.id,
          name: element.tags?.name || 'Unnamed Mosque',
          lat: mosqueLat,
          lon: mosqueLon,
          distance: distance,
          distanceText: distance < 1 
            ? `${(distance * 1000).toFixed(0)} m` 
            : `${distance.toFixed(1)} km`,
          address: element.tags?.['addr:street'] || '',
          denomination: element.tags?.denomination || '',
        };
      })
      .filter(mosque => mosque.lat && mosque.lon)
      .sort((a, b) => a.distance - b.distance);

    return mosques;
  } catch (error) {
    console.error('Error fetching mosques:', error);
    throw error;
  }
};