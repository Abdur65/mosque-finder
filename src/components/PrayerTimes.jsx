import { Clock, Sunrise, Sun, Sunset, Moon, Calendar } from 'lucide-react';
import { formatTime12Hour } from '../services/prayerService';

const prayerIcons = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon
};

const prayerColors = {
  Fajr: 'from-blue-500 to-indigo-500',
  Dhuhr: 'from-yellow-500 to-orange-500',
  Asr: 'from-orange-500 to-red-500',
  Maghrib: 'from-red-500 to-pink-500',
  Isha: 'from-indigo-500 to-purple-500'
};

export const PrayerTimes = ({ prayerTimes, nextPrayer, timeUntilNext, loading, error, locationName }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-islamic-green animate-pulse" />
          <h2 className="text-xl font-bold text-gray-900">Prayer Times</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <div className="animate-pulse">Loading prayer times...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-islamic-green" />
          <h2 className="text-xl font-bold text-gray-900">Prayer Times</h2>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!prayerTimes) {
    return null;
  }

  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
      {/* Header with Dates */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-islamic-green to-islamic-green-dark rounded-xl flex items-center justify-center shadow-md">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Prayer Times</h2>
              <p className="text-sm text-gray-600">{locationName || 'Current Location'}</p>
            </div>
          </div>

          {/* Next Prayer Countdown - Compact */}
          {nextPrayer && timeUntilNext && (
            <div className="hidden md:flex items-center gap-3 bg-islamic-green/10 px-4 py-2 rounded-xl">
              <div className="text-right">
                <p className="text-xs font-medium text-gray-600">Next Prayer</p>
                <p className="text-lg font-bold text-islamic-green">{nextPrayer}</p>
              </div>
              <div className="h-8 w-px bg-islamic-green/30"></div>
              <div className="text-left">
                <p className="text-xs font-medium text-gray-600">In</p>
                <p className="text-lg font-bold text-islamic-green">{timeUntilNext}</p>
              </div>
            </div>
          )}
        </div>

        {/* Dates Row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Gregorian Date */}
          <div className="flex items-center gap-2 bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-2.5 rounded-xl flex-1">
            <Calendar className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-xs text-gray-600 font-medium">English Date</p>
              <p className="text-sm font-bold text-gray-900">{prayerTimes.date?.readable}</p>
            </div>
          </div>

          {/* Hijri Date */}
          {prayerTimes.date?.hijri && (
            <div className="flex items-center gap-2 bg-gradient-to-br from-islamic-green/10 to-islamic-green/5 px-4 py-2.5 rounded-xl flex-1">
              <Calendar className="w-4 h-4 text-islamic-green" />
              <div>
                <p className="text-xs text-islamic-green font-medium">Islamic Date</p>
                <p className="text-sm font-bold text-gray-900">{prayerTimes.date.hijri}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Next Prayer Highlight */}
      {nextPrayer && timeUntilNext && (
        <div className="md:hidden bg-gradient-to-r from-islamic-green to-islamic-green-dark rounded-xl p-4 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Next Prayer</p>
              <p className="text-2xl font-bold">{nextPrayer}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Starting In</p>
              <p className="text-2xl font-bold">{timeUntilNext}</p>
            </div>
          </div>
        </div>
      )}

      {/* Prayer Times Grid - Horizontal */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {prayers.map((prayer) => {
          const Icon = prayerIcons[prayer];
          const isNext = prayer === nextPrayer;
          const time = prayerTimes[prayer];

          return (
            <div
              key={prayer}
              className={`relative overflow-hidden rounded-xl transition-all ${
                isNext 
                  ? 'bg-gradient-to-br from-islamic-green to-islamic-green-dark text-white shadow-xl ring-2 ring-islamic-green ring-offset-2 scale-105' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-lg hover:scale-102'
              }`}
            >
              <div className="p-4">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isNext 
                    ? 'bg-white/20' 
                    : `bg-gradient-to-br ${prayerColors[prayer]} shadow-md`
                }`}>
                  <Icon className={`w-6 h-6 ${isNext ? 'text-white' : 'text-white'}`} />
                </div>

                {/* Prayer Name */}
                <div className="mb-2">
                  <h3 className={`text-lg font-bold ${isNext ? 'text-white' : 'text-gray-900'}`}>
                    {prayer}
                  </h3>
                  {isNext && (
                    <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2 py-0.5 rounded-full mt-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      Next
                    </span>
                  )}
                </div>

                {/* Time */}
                <div>
                  <p className={`text-xl font-bold ${isNext ? 'text-white' : 'text-gray-900'}`}>
                    {formatTime12Hour(time)}
                  </p>
                  <p className={`text-xs ${isNext ? 'text-white/70' : 'text-gray-500'}`}>
                    {time}
                  </p>
                </div>
              </div>

              {/* Next Prayer Indicator */}
              {isNext && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};