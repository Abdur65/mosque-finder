/**
 * Service to search for locations using Nominatim API (OpenStreetMap)
 */

const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

/**
 * Search for a location by city name or address
 * @param {string} query - Search query (e.g., "Paris", "Dubai", "New York")
 * @returns {Promise<Array>} Array of location results
 */
export const searchLocation = async (query) => {
  if (!query || query.trim().length < 2) {
    throw new Error('Search query must be at least 2 characters');
  }

  try {
    const url = `${NOMINATIM_API}?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MosqueFinder/1.0 (Educational Project)'
      }
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error('No results found for this location');
    }

    // Format results
    return data.map(result => ({
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      name: result.display_name,
      city: result.address?.city || result.address?.town || result.address?.village || '',
      country: result.address?.country || '',
      type: result.type,
      importance: result.importance
    }));
  } catch (error) {
    console.error('Error searching location:', error);
    throw error;
  }
};

/**
 * Get a shortened, user-friendly name from a location result
 * @param {Object} location - Location object from search results
 * @returns {string} Formatted name
 */
export const formatLocationName = (location) => {
  if (!location) return '';
  
  // Try to build a concise name: City, Country
  if (location.city && location.country) {
    return `${location.city}, ${location.country}`;
  }
  
  // Fallback to splitting the full display name
  const parts = location.name.split(',').slice(0, 2);
  return parts.join(',').trim();
};