import { MapPin, AlertCircle, Navigation } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import type { LocationStatus, Location } from '../types';

interface LocationPermissionProps {
  status: LocationStatus;
  error: string | null;
  location: Location | null;
  onRetry: () => void;
  onContinue: () => void;
}

export const LocationPermission = ({
  status,
  error,
  location,
  onRetry,
  onContinue
}: LocationPermissionProps) => {
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-islamic-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-islamic-green" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Finding Your Location</h2>
            <p className="text-gray-600">Please allow location access to find nearby mosques</p>
          </div>
          <LoadingSpinner text="Detecting location..." />
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Location Access Denied</h2>
            <p className="text-gray-600 mb-4">
              We need your location to show nearby mosques and accurate prayer times.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-blue-800 mb-1">📍 Using Default Location</p>
            <p className="text-lg font-bold text-blue-900">
              {location?.name ?? 'Chittagong, Bangladesh'}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={onContinue}
              className="w-full bg-islamic-green hover:bg-islamic-green-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Continue with {location?.name?.split(',')[0] ?? 'Default Location'}
            </button>
            <button
              onClick={onRetry}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Try Again
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              <strong>Tip:</strong> To enable location access, check your browser settings and look
              for site permissions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Location Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            Using {location?.name ?? 'default location'} instead
          </p>
          <button
            onClick={onContinue}
            className="w-full bg-islamic-green hover:bg-islamic-green-dark text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return null;
};
