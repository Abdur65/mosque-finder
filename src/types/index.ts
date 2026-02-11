export interface Location {
  lat: number;
  lon: number;
  name: string;
}

export interface Mosque {
  id: number | string;
  name: string;
  lat: number;
  lon: number;
  distance: number;
  distanceText: string;
  address: string;
  denomination: string;
}

export interface PrayerTimesDate {
  readable: string;
  hijri: string;
  gregorian: string;
  hijriFormatted: string;
  gregorianFormatted: string;
  hijriMonthName: string;
  gregorianMonthName: string;
  hijriYear: string;
  gregorianYear: string;
  hijriDay: string;
  gregorianDay: string;
  weekday: string;
}

export interface PrayerTimesData {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  date: PrayerTimesDate;
}

export type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface SearchResult {
  lat: number;
  lon: number;
  name: string;
  city: string;
  country: string;
  type: string;
  category: string;
  importance: number;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  displayName: string;
}

export type LocationStatus = 'idle' | 'loading' | 'success' | 'error' | 'denied';

export interface RouteCoordinate {
  lat: number;
  lng: number;
}

export interface GeolocationOptions {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}
