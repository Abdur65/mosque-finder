import { MapPin, Navigation, ChevronRight } from 'lucide-react';
import type { Mosque } from '../types';

interface MosqueListProps {
  mosques: Mosque[];
  selectedMosque: Mosque | null;
  onMosqueClick: (mosque: Mosque) => void;
}

export const MosqueList = ({ mosques, selectedMosque, onMosqueClick }: MosqueListProps) => {
  if (mosques.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Mosques Found</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Try adjusting your location or expanding the search radius
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <h2 className="text-base font-bold text-gray-900">
          Nearby Mosques
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {mosques.length} found · Click to get directions
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {mosques.map((mosque, index) => {
          const isSelected = selectedMosque?.id === mosque.id;

          return (
            <button
              key={mosque.id}
              onClick={() => onMosqueClick(mosque)}
              className={`w-full text-left px-4 py-3.5 transition-all border-b border-gray-100 last:border-0 group ${
                isSelected
                  ? 'bg-islamic-green/8 border-l-4 border-l-islamic-green'
                  : 'hover:bg-gray-50 border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-islamic-green text-white'
                      : 'bg-gray-100 text-gray-500 group-hover:bg-islamic-green/15 group-hover:text-islamic-green'
                  }`}
                >
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-semibold text-sm truncate mb-0.5 transition-colors ${
                      isSelected ? 'text-islamic-green' : 'text-gray-900'
                    }`}
                  >
                    {mosque.name}
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Navigation className="w-3 h-3 text-islamic-green flex-shrink-0" />
                    <span className="font-semibold text-islamic-green">{mosque.distanceText}</span>
                    {mosque.address && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span className="truncate">{mosque.address}</span>
                      </>
                    )}
                  </div>

                  {mosque.denomination && (
                    <span className="inline-block mt-1.5 px-2 py-0.5 bg-gray-100 text-[10px] font-medium text-gray-600 rounded-full">
                      {mosque.denomination}
                    </span>
                  )}
                </div>

                <ChevronRight
                  className={`w-4 h-4 flex-shrink-0 transition-all ${
                    isSelected
                      ? 'text-islamic-green'
                      : 'text-gray-300 group-hover:text-gray-400 group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
