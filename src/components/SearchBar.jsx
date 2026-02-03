import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, MapPin, Navigation2 } from 'lucide-react';
import { searchLocation, formatLocationName } from '../services/searchService';

export const SearchBar = ({ onLocationSelect, currentLocation }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery) => {
    const trimmed = searchQuery.trim();
    
    if (!trimmed || trimmed.length < 2) {
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
      
      if (locations.length === 0) {
        setError('No locations found. Try a different search.');
      }
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Auto-search as user types (debounced)
    if (value.trim().length >= 2) {
      handleSearch(value);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };

  const handleSelectLocation = (location) => {
    onLocationSelect({
      lat: location.lat,
      lon: location.lon,
      name: formatLocationName(location)
    });
    
    // Clear search
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
    // Trigger browser geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSelect({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            name: 'Your Location'
          });
          setQuery('');
          setResults([]);
          setShowResults(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0 || error) {
              setShowResults(true);
            }
          }}
          placeholder="Search city (e.g., Dubai, Istanbul, Jakarta)..."
          className="w-full pl-12 pr-24 py-3.5 text-base border-2 border-gray-200 rounded-xl focus:border-islamic-green focus:outline-none focus:ring-2 focus:ring-islamic-green/20 transition-all"
        />
        
        {/* Search Icon */}
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        
        {/* Right side buttons */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Use Current Location Button */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="p-2 text-islamic-green hover:bg-islamic-green/10 rounded-lg transition-colors"
            title="Use my current location"
          >
            <Navigation2 className="w-4 h-4" />
          </button>

          {/* Clear/Loading Button */}
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
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto">
          {error ? (
            <div className="p-4 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : (
            <div className="py-1">
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(result)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-0"
                >
                  <div className="w-10 h-10 bg-islamic-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-islamic-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 mb-0.5">
                      {result.city || result.name.split(',')[0]}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {result.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Current Location Display */}
      {currentLocation && !showResults && (
        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          <MapPin className="w-4 h-4 text-islamic-green" />
          <span className="font-medium">Showing results for:</span>
          <span className="text-islamic-green font-semibold">{currentLocation.name}</span>
        </div>
      )}
    </div>
  );
};