import { MapPin, Navigation } from 'lucide-react';

export const MosqueList = ({ mosques, selectedMosque, onMosqueClick }) => {
  if (mosques.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <MapPin className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No Mosques Found
        </h3>
        <p className="text-sm text-gray-500">
          Try adjusting your location or expanding the search radius
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 bg-white border-b sticky top-0 z-10">
        <h2 className="text-lg font-bold text-gray-900">
          Nearby Mosques ({mosques.length})
        </h2>
        <p className="text-sm text-gray-600">
          Click on a mosque to view on map
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {mosques.map((mosque) => {
          const isSelected = selectedMosque?.id === mosque.id;
          
          return (
            <button
              key={mosque.id}
              onClick={() => onMosqueClick(mosque)}
              className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                isSelected ? 'bg-islamic-green/10 border-l-4 border-islamic-green' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-islamic-green' : 'bg-gray-100'
                }`}>
                  <MapPin className={`w-5 h-5 ${
                    isSelected ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {mosque.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Navigation className="w-4 h-4" />
                    <span className="font-medium text-islamic-green">
                      {mosque.distanceText}
                    </span>
                    <span>away</span>
                  </div>

                  {mosque.address && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {mosque.address}
                    </p>
                  )}

                  {mosque.denomination && (
                    <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                      {mosque.denomination}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};