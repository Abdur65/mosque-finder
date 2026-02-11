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
import {
  MapPin, List, Map as MapIcon, Clock,
  Calendar, Moon
} from 'lucide-react';
import type { Mosque, Location } from './types';

type MobileView = 'map' | 'list' | 'prayer';

function App() {
  const { location, status, error, isSuccess, setManualLocation } = useGeolocation();
  const { mosques, loading: mosquesLoading, error: mosquesError } = useMosques(location);
  const { prayerTimes, nextPrayer, timeUntilNext, loading: prayerLoading, error: prayerError } =
    usePrayerTimes(location);

  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [activeView, setActiveView] = useState<MobileView>('map');

  if (!isSuccess) {
    return (
      <LocationPermission
        status={status}
        error={error}
        location={location}
        onRetry={() => window.location.reload()}
        onContinue={() => {}}
      />
    );
  }

  const handleMosqueClick = (mosque: Mosque) => {
    setSelectedMosque(mosque);
    if (window.innerWidth < 768) setActiveView('map');
  };

  const handleLocationSearch = (newLocation: Location) => {
    setManualLocation(newLocation.lat, newLocation.lon, newLocation.name);
    setSelectedMosque(null);
  };

  const safeLocation = location!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex flex-col">
      {/* ─── Header ─── */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-3">

            {/* Row 1: Logo + Dates + Mobile toggle */}
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-islamic-green to-islamic-green-dark rounded-xl flex items-center justify-center shadow-md">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-900 leading-tight">Mosque Finder</h1>
                  <p className="text-[11px] text-gray-500">Find mosques & prayer times</p>
                </div>
                <h1 className="sm:hidden text-lg font-bold text-gray-900">Mosque Finder</h1>
              </div>

              {/* Dates — visible once prayer times load */}
              <div className="hidden md:flex items-center gap-2 flex-1">
                {prayerTimes ? (
                  <>
                    <div className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-150 px-3 py-1.5 rounded-full transition-colors">
                      <Calendar className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-gray-700">
                        {prayerTimes.date.gregorianFormatted}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-islamic-green/10 px-3 py-1.5 rounded-full">
                      <Moon className="w-3.5 h-3.5 text-islamic-green flex-shrink-0" />
                      <span className="text-xs font-medium text-islamic-green">
                        {prayerTimes.date.hijriFormatted}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="h-7 w-64 bg-gray-100 rounded-full animate-pulse" />
                )}
              </div>

              {/* Mobile toggle: List | Map | Prayer */}
              <div className="flex md:hidden ml-auto gap-1 bg-gray-100 p-1 rounded-xl">
                {([
                  { view: 'list' as MobileView, Icon: List, label: 'List' },
                  { view: 'map' as MobileView, Icon: MapIcon, label: 'Map' },
                  { view: 'prayer' as MobileView, Icon: Clock, label: 'Prayer' }
                ]).map(({ view, Icon, label }) => (
                  <button
                    key={view}
                    onClick={() => setActiveView(view)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeView === view
                        ? 'bg-white text-islamic-green shadow-sm'
                        : 'text-gray-500'
                    }`}
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xs:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Dates mobile */}
            {prayerTimes && (
              <div className="md:hidden flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-[11px] font-medium text-gray-700">
                    {prayerTimes.date.weekday}, {prayerTimes.date.gregorianDay}{' '}
                    {prayerTimes.date.gregorianMonthName} {prayerTimes.date.gregorianYear}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-islamic-green/10 px-2.5 py-1 rounded-full">
                  <Moon className="w-3 h-3 text-islamic-green" />
                  <span className="text-[11px] font-medium text-islamic-green">
                    {prayerTimes.date.hijriDay} {prayerTimes.date.hijriMonthName}{' '}
                    {prayerTimes.date.hijriYear} AH
                  </span>
                </div>
              </div>
            )}

            {/* Row 3: Search bar */}
            <SearchBar onLocationSelect={handleLocationSearch} currentLocation={safeLocation} />
          </div>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="flex-1 max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">

        {/* Desktop: 3-column layout */}
        <div className="hidden md:flex gap-4 h-[calc(100vh-240px)] min-h-[500px]">

          {/* Col 1: Mosque List */}
          <div className="w-72 lg:w-80 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col flex-shrink-0">
            {mosquesLoading ? (
              <div className="flex-1 flex items-center justify-center">
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

          {/* Col 2: Map */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden">
            {mosquesLoading ? (
              <div className="h-full flex items-center justify-center">
                <LoadingSpinner text="Loading map..." />
              </div>
            ) : (
              <Map
                userLocation={safeLocation}
                mosques={mosques}
                selectedMosque={selectedMosque}
                onMosqueClick={handleMosqueClick}
              />
            )}
          </div>

          {/* Col 3: Prayer Times Sidebar */}
          <div className="w-64 lg:w-72 flex-shrink-0">
            <PrayerTimes
              prayerTimes={prayerTimes}
              nextPrayer={nextPrayer}
              timeUntilNext={timeUntilNext}
              loading={prayerLoading}
              error={prayerError}
              locationName={safeLocation.name}
            />
          </div>
        </div>

        {/* Mobile: tab-based layout */}
        <div className="md:hidden h-[calc(100vh-260px)] min-h-[400px]">
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
                  userLocation={safeLocation}
                  mosques={mosques}
                  selectedMosque={selectedMosque}
                  onMosqueClick={handleMosqueClick}
                />
              )}
            </div>
          )}

          {activeView === 'prayer' && (
            <div className="h-full">
              <PrayerTimes
                prayerTimes={prayerTimes}
                nextPrayer={nextPrayer}
                timeUntilNext={timeUntilNext}
                loading={prayerLoading}
                error={prayerError}
                locationName={safeLocation.name}
              />
            </div>
          )}
        </div>

        {/* Stats row */}
        {!mosquesLoading && !mosquesError && (
          <div className="mt-3 flex items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm text-xs text-gray-600">
              <span className="w-2 h-2 bg-islamic-green rounded-full animate-pulse" />
              <strong className="text-islamic-green">{mosques.length}</strong> mosques within 5 km
              {selectedMosque && (
                <>
                  <span className="text-gray-300 hidden sm:inline">·</span>
                  <span className="hidden sm:inline text-islamic-green font-medium">
                    Directions to: {selectedMosque.name}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-gray-400">Made with care for the Muslim community</p>
      </footer>
    </div>
  );
}

export default App;
