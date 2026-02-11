import { Clock, Sunrise, Sun, Sunset, Moon, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { formatTime12Hour } from '../services/prayerService';
import type { PrayerTimesData, PrayerName } from '../types';
import type { LucideIcon } from 'lucide-react';

const prayerIcons: Record<PrayerName, LucideIcon> = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: Sun,
  Maghrib: Sunset,
  Isha: Moon
};

const prayerGradients: Record<PrayerName, string> = {
  Fajr: 'from-blue-500 to-indigo-600',
  Dhuhr: 'from-amber-400 to-orange-500',
  Asr: 'from-orange-500 to-red-500',
  Maghrib: 'from-rose-500 to-pink-600',
  Isha: 'from-indigo-500 to-purple-600'
};

const prayerBg: Record<PrayerName, string> = {
  Fajr: 'bg-blue-50',
  Dhuhr: 'bg-amber-50',
  Asr: 'bg-orange-50',
  Maghrib: 'bg-rose-50',
  Isha: 'bg-indigo-50'
};

interface PrayerTimesProps {
  prayerTimes: PrayerTimesData | null;
  nextPrayer: PrayerName | null;
  timeUntilNext: string;
  loading: boolean;
  error: string | null;
  locationName?: string;
}

const PRAYERS: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export const PrayerTimes = ({
  prayerTimes,
  nextPrayer,
  timeUntilNext,
  loading,
  error,
  locationName
}: PrayerTimesProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-islamic-green to-islamic-green-dark">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-sm font-bold text-white">Prayer Times</h2>
              <p className="text-[10px] text-white/70">{locationName ?? 'Current Location'}</p>
            </div>
          </div>
          <button
            onClick={() => setCollapsed(v => !v)}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white md:hidden"
            aria-label={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Next prayer banner */}
      {nextPrayer && timeUntilNext && !collapsed && (
        <div className="px-4 py-3 bg-islamic-green/5 border-b border-islamic-green/10 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">Next Prayer</p>
            <p className="text-base font-bold text-islamic-green">{nextPrayer}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">In</p>
            <p className="text-base font-bold text-islamic-green">{timeUntilNext}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-islamic-green/10 px-2 py-1 rounded-lg">
            <span className="w-2 h-2 bg-islamic-green rounded-full animate-pulse" />
            <span className="text-[10px] font-semibold text-islamic-green">LIVE</span>
          </div>
        </div>
      )}

      {/* Prayer list */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-2">
                <Clock className="w-8 h-8 text-islamic-green animate-pulse" />
                <p className="text-xs text-gray-500">Loading prayer times...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="p-4">
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                <p className="text-red-700 text-xs">{error}</p>
              </div>
            </div>
          )}

          {prayerTimes && !loading && (
            <div className="py-2">
              {PRAYERS.map(prayer => {
                const Icon = prayerIcons[prayer];
                const isNext = prayer === nextPrayer;
                const time = prayerTimes[prayer];

                return (
                  <div
                    key={prayer}
                    className={`mx-3 my-1.5 rounded-xl transition-all ${
                      isNext
                        ? `bg-gradient-to-r ${prayerGradients[prayer]} text-white shadow-md`
                        : `${prayerBg[prayer]} hover:shadow-sm`
                    }`}
                  >
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isNext
                            ? 'bg-white/20'
                            : `bg-gradient-to-br ${prayerGradients[prayer]}`
                        }`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-sm font-bold ${
                              isNext ? 'text-white' : 'text-gray-800'
                            }`}
                          >
                            {prayer}
                          </span>
                          {isNext && (
                            <span className="inline-flex items-center gap-1 text-[9px] bg-white/25 px-1.5 py-0.5 rounded-full font-semibold">
                              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                              NEXT
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p
                          className={`text-sm font-bold ${
                            isNext ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {formatTime12Hour(time)}
                        </p>
                        <p
                          className={`text-[10px] ${
                            isNext ? 'text-white/70' : 'text-gray-400'
                          }`}
                        >
                          {time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
