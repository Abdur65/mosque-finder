import type { PrayerTimesData, PrayerName } from '../types';

const ALADHAN_API = 'https://api.aladhan.com/v1/timings';

interface AladhanTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface AladhanDateField {
  date: string;
  day: string;
  month: { number: number; en: string; ar?: string };
  year: string;
  weekday: { en: string; ar?: string };
}

interface AladhanResponse {
  code: number;
  data: {
    timings: AladhanTimings;
    date: {
      readable: string;
      hijri: AladhanDateField;
      gregorian: AladhanDateField;
    };
  };
}

export const fetchPrayerTimes = async (
  lat: number,
  lon: number,
  method = 2
): Promise<PrayerTimesData> => {
  const timestamp = Math.floor(Date.now() / 1000);
  const url = `${ALADHAN_API}/${timestamp}?latitude=${lat}&longitude=${lon}&method=${method}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Aladhan API error: ${response.status}`);
  }

  const data: AladhanResponse = await response.json();

  if (data.code !== 200) {
    throw new Error('Failed to fetch prayer times');
  }

  const { timings, date } = data.data;
  const g = date.gregorian;
  const h = date.hijri;

  const gregorianFormatted = `${g.weekday.en}, ${g.day} ${g.month.en} ${g.year}`;
  const hijriFormatted = `${h.day} ${h.month.en} ${h.year} AH`;

  return {
    Fajr: timings.Fajr,
    Dhuhr: timings.Dhuhr,
    Asr: timings.Asr,
    Maghrib: timings.Maghrib,
    Isha: timings.Isha,
    date: {
      readable: date.readable,
      hijri: h.date,
      gregorian: g.date,
      hijriFormatted,
      gregorianFormatted,
      hijriMonthName: h.month.en,
      gregorianMonthName: g.month.en,
      hijriYear: h.year,
      gregorianYear: g.year,
      hijriDay: h.day,
      gregorianDay: g.day,
      weekday: g.weekday.en
    }
  };
};

export const getNextPrayer = (prayerTimes: PrayerTimesData): PrayerName => {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const prayers: PrayerName[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

  for (const prayer of prayers) {
    const time = prayerTimes[prayer];
    if (!time) continue;
    const [hours, minutes] = time.split(':').map(Number);
    if (currentTime < hours * 60 + minutes) {
      return prayer;
    }
  }

  return 'Fajr';
};

export const getTimeUntilPrayer = (
  prayerTimes: PrayerTimesData,
  nextPrayer: PrayerName
): string => {
  const now = new Date();
  const time = prayerTimes[nextPrayer];
  if (!time) return '';

  const [hours, minutes] = time.split(':').map(Number);
  const prayerDate = new Date(now);
  prayerDate.setHours(hours, minutes, 0, 0);

  if (prayerDate < now) {
    prayerDate.setDate(prayerDate.getDate() + 1);
  }

  const diff = prayerDate.getTime() - now.getTime();
  const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return hoursRemaining > 0
    ? `${hoursRemaining}h ${minutesRemaining}m`
    : `${minutesRemaining}m`;
};

export const formatTime12Hour = (time24: string): string => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};
