import { useState } from 'react';
import { useGeolocation } from './hooks/useGeolocation';
import { useMosques } from './hooks/useMosques';
import { usePrayerTimes } from './hooks/usePrayerTimes';
import { LocationPermission } from './components/LocationPermission';
import { Map } from './components/Map';
import { MosqueList } from './components/MosqueList';
import { PrayerTimes } from './components/PrayerTimes';
import { SearchBar } from './components/SearchBar';
import { LoadingSpinner } from './components/LoadingSpinner';
import { MapPin, List, Map as MapIcon } from 'lucide-react';

function App() {
  const { location, status, error, isSuccess, setManualLocation } = useGeolocation();
  const { mosques, loading: mosquesLoading, error: mosquesError } = useMosques(location);
  const { prayerTimes, nextPrayer, timeUntilNext, loading: prayerLoading, error: prayerError } = usePrayerTimes(location);
  const [selectedMosque, setSelectedMosque] = useState(null);
  const [activeView, setActiveView] = useState('map'); // 'map', 'list'

  // Handle continuing with default location
  const handleContinue = () => {
    // This will trigger useEffect in useMosques and usePrayerTimes
  };

  // Show location permission/loading UI
  if (!isSuccess) {
    return (
      <LocationPermission 
        status={status}
        error={error}
        location={location}
        onRetry={() => window.location.reload()}
        onContinue={handleContinue}
      />
    );
  }

  const handleMosqueClick = (mosque) => {
    setSelectedMosque(mosque);
    // On mobile, switch to map view when mosque is selected
    if (window.innerWidth < 768) {
      setActiveView('map');
    }
  };

  const handleLocationSearch = (newLocation) => {
    // Update location via the hook
    setManualLocation(newLocation.lat, newLocation.lon, newLocation.name);
    // Clear selected mosque when location changes
    setSelectedMosque(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            {/* Top row: Logo and mobile controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-islamic-green to-islamic-green-dark rounded-xl flex items-center justify-center shadow-md">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Mosque Finder
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Find nearby mosques & prayer times</p>
                </div>
              </div>

              {/* Mobile view toggle - Only List and Map */}
              <div className="flex md:hidden gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveView('list')}
                  className={`p-2.5 rounded-md transition-all ${
                    activeView === 'list' ? 'bg-white text-islamic-green shadow-sm' : 'text-gray-600'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveView('map')}
                  className={`p-2.5 rounded-md transition-all ${
                    activeView === 'map' ? 'bg-white text-islamic-green shadow-sm' : 'text-gray-600'
                  }`}
                  aria-label="Map view"
                >
                  <MapIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-full">
              <SearchBar 
                onLocationSelect={handleLocationSearch}
                currentLocation={location}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Top Section: Map & List (Desktop: Side by side, Mobile: Toggle) */}
        <div>
          {/* Desktop Layout: Two columns side by side */}
          <div className="hidden md:grid md:grid-cols-2 gap-6 h-[600px]">
            {/* Left: Mosque List */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
              {mosquesLoading ? (
                <div className="h-full flex items-center justify-center">
                  <LoadingSpinner text="Finding mosques..." />
                </div>
              ) : mosquesError ? (
                <div className="p-6 text-center">
                  <p className="text-red-600 text-sm">{mosquesError}</p>
                </div>
              ) : (
                <MosqueList 
                  mosques={mosques}
                  selectedMosque={selectedMosque}
                  onMosqueClick={handleMosqueClick}
                />
              )}
            </div>

            {/* Right: Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {mosquesLoading ? (
                <div className="h-full flex items-center justify-center">
                  <LoadingSpinner text="Loading map..." />
                </div>
              ) : (
                <Map 
                  userLocation={location}
                  mosques={mosques}
                  selectedMosque={selectedMosque}
                  onMosqueClick={handleMosqueClick}
                />
              )}
            </div>
          </div>

          {/* Mobile Layout: Toggle between views */}
          <div className="md:hidden h-[500px]">
            {activeView === 'list' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                {mosquesLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <LoadingSpinner text="Finding mosques..." />
                  </div>
                ) : mosquesError ? (
                  <div className="p-6 text-center">
                    <p className="text-red-600 text-sm">{mosquesError}</p>
                  </div>
                ) : (
                  <MosqueList 
                    mosques={mosques}
                    selectedMosque={selectedMosque}
                    onMosqueClick={handleMosqueClick}
                  />
                )}
              </div>
            )}

            {activeView === 'map' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                {mosquesLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <LoadingSpinner text="Loading map..." />
                  </div>
                ) : (
                  <Map 
                    userLocation={location}
                    mosques={mosques}
                    selectedMosque={selectedMosque}
                    onMosqueClick={handleMosqueClick}
                  />
                )}
              </div>
            )}
          </div>

          {/* Stats Row */}
          {!mosquesLoading && !mosquesError && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-islamic-green rounded-full animate-pulse"></span>
                  <strong className="text-islamic-green">{mosques.length}</strong> mosques found
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">
                  within <strong>5km</strong> radius
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section: Prayer Times - Full Width */}
        <div>
          <PrayerTimes 
            prayerTimes={prayerTimes}
            nextPrayer={nextPrayer}
            timeUntilNext={timeUntilNext}
            loading={prayerLoading}
            error={prayerError}
            locationName={location?.name}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-sm text-gray-500">
          Made with ❤️ for the Muslim community
        </p>
      </footer>
    </div>
  );
}

export default App;