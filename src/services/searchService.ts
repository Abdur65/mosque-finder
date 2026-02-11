import type { SearchResult } from '../types';

const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

interface NominatimAddress {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city_district?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  country?: string;
  postcode?: string;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
  class: string;
  importance: number;
  address: NominatimAddress;
}

export const searchLocation = async (query: string): Promise<SearchResult[]> => {
  if (!query || query.trim().length < 2) {
    throw new Error('Search query must be at least 2 characters');
  }

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: '8',
    addressdetails: '1',
    extratags: '1',
    namedetails: '1',
  });

  const response = await fetch(`${NOMINATIM_API}?${params}`, {
    headers: { 'User-Agent': 'MosqueFinder/1.0 (Educational Project)' }
  });

  if (!response.ok) {
    throw new Error(`Nominatim API error: ${response.status}`);
  }

  const data: NominatimResult[] = await response.json();

  if (!data || data.length === 0) {
    throw new Error('No results found for this location');
  }

  return data.map(result => ({
    lat: parseFloat(result.lat),
    lon: parseFloat(result.lon),
    name: result.display_name,
    displayName: result.display_name,
    city:
      result.address?.city ||
      result.address?.town ||
      result.address?.village ||
      result.address?.municipality ||
      '',
    country: result.address?.country || '',
    type: result.type,
    category: result.class,
    importance: result.importance,
    road: result.address?.road,
    neighbourhood:
      result.address?.neighbourhood ||
      result.address?.suburb ||
      result.address?.city_district
  }));
};

export const formatLocationName = (location: SearchResult): string => {
  if (!location) return '';

  if (location.city && location.country) {
    return `${location.city}, ${location.country}`;
  }

  const parts = location.name.split(',').slice(0, 2);
  return parts.join(',').trim();
};

export const getPlaceLabel = (result: SearchResult): string => {
  const { category, type } = result;

  if (category === 'amenity' && ['mosque', 'place_of_worship'].includes(type)) {
    return 'Mosque';
  }
  if (category === 'place') {
    if (['city', 'town'].includes(type)) return 'City';
    if (['village', 'hamlet', 'suburb'].includes(type)) return 'Area';
    if (type === 'neighbourhood') return 'Neighbourhood';
    return 'Place';
  }
  if (category === 'highway') return 'Street';
  if (category === 'building') return 'Building';
  if (category === 'tourism') return 'Landmark';
  if (category === 'boundary' || category === 'administrative') return 'Region';
  if (category === 'natural') return 'Natural';
  return 'Location';
};
