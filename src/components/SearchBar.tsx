import { useState, useRef, useEffect } from 'react';
import {
  Search, X, Loader2, MapPin, Navigation2,
  Building2, Route, Landmark, Globe
} from 'lucide-react';
import { searchLocation, formatLocationName, getPlaceLabel } from '../services/searchService';
import type { SearchResult, Location } from '../types';

interface SearchBarProps {
  onLocationSelect: (location: Location) => void;
  currentLocation: Location | null;
}

const categoryIcon = (category: string, type: string) => {
  if (category === 'amenity') return Building2;
  if (category === 'highway') return Route;
  if (category === 'tourism' || category === 'natural') return Landmark;
  if (category === 'boundary' || category === 'administrative') return Globe;
  if (type === 'city' || type === 'town' || category === 'place') return MapPin;
  return MapPin;
};

const labelColor = (label: string) => {
  if (label === 'Mosque') return 'bg-islamic-green/15 text-islamic-green';
  if (label === 'City') return 'bg-blue-100 text-blue-700';
  if (label === 'Street') return 'bg-orange-100 text-orange-700';
  if (label === 'Landmark') return 'bg-purple-100 text-purple-700';
  if (label === 'Area' || label === 'Neighbourhood') return 'bg-teal-100 text-teal-700';
  return 'bg-gray-100 text-gray-600';
};

export const SearchBar = ({ onLocationSelect, currentLocation }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setError(null);
    setShowResults(true);

    try {
      const locations = await searchLocation(trimmed);
      setResults(locations);
      if (locations.length === 0) setError('No locations found. Try a different search.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length >= 2) {
      debounceRef.current = setTimeout(() => handleSearch(value), 300);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelectLocation = (result: SearchResult) => {
    onLocationSelect({
      lat: result.lat,
      lon: result.lon,
      name: formatLocationName(result)
    });
    setQuery('');
    setResults([]);
    setShowResults(false);
    setError(null);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setError(null);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onLocationSelect({
          lat: coords.latitude,
          lon: coords.longitude,
          name: 'Your Location'
        });
        setQuery('');
        setResults([]);
        setShowResults(false);
      },
      err => console.error('Geolocation error:', err)
    );
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (results.length > 0 || error) setShowResults(true); }}
          placeholder="Search city, street, landmark, mosque..."
          className="w-full pl-12 pr-28 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-islamic-green focus:outline-none focus:ring-2 focus:ring-islamic-green/20 bg-white transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="p-2 text-islamic-green hover:bg-islamic-green/10 rounded-lg transition-colors"
            title="Use my current location"
          >
            <Navigation2 className="w-4 h-4" />
          </button>
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Results Dropdown */}
      {showResults && (results.length > 0 || error) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[26rem] overflow-y-auto">
          {error ? (
            <div className="p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : (
            <div className="py-1">
              {results.map((result, index) => {
                const Icon = categoryIcon(result.category, result.type);
                const label = getPlaceLabel(result);
                const primaryName =
                  result.city ||
                  result.road ||
                  result.name.split(',')[0];
                const secondary = result.name
                  .split(',')
                  .slice(1, 3)
                  .join(',')
                  .trim();

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectLocation(result)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-900 text-sm">{primaryName}</p>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${labelColor(label)}`}>
                          {label}
                        </span>
                      </div>
                      {secondary && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{secondary}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Current location chip */}
      {currentLocation && !showResults && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="w-3.5 h-3.5 text-islamic-green flex-shrink-0" />
          <span>Showing results for:</span>
          <span className="font-semibold text-islamic-green truncate">{currentLocation.name}</span>
        </div>
      )}
    </div>
  );
};
