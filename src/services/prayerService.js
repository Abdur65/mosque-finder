/**
 * Service to fetch prayer times from Aladhan API
 */

const ALADHAN_API = 'http://api.aladhan.com/v1/timings';

/**
 * Fetch prayer times for a specific location and date
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} method - Calculation method (default: 2 - Islamic Society of North America)
 * @returns {Promise<Object>} Prayer times object
 */
export const fetchPrayerTimes = async (lat, lon, method = 2) => {
  try {
    // Get current date in UNIX timestamp
    const timestamp = Math.floor(Date.now() / 1000);
    
    const url = `${ALADHAN_API}/${timestamp}?latitude=${lat}&longitude=${lon}&method=${method}`;
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Aladhan API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.code !== 200) {
      throw new Error('Failed to fetch prayer times');
    }

    const timings = data.data.timings;
    const date = data.data.date;

    // Extract the 5 main prayers
    return {
      Fajr: timings.Fajr,
      Dhuhr: timings.Dhuhr,
      Asr: timings.Asr,
      Maghrib: timings.Maghrib,
      Isha: timings.Isha,
      date: {
        readable: date.readable,
        hijri: date.hijri.date,
        gregorian: date.gregorian.date
      }
    };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};

/**
 * Determine which prayer is next based on current time
 * @param {Object} prayerTimes - Object with prayer times
 * @returns {string|null} Name of next prayer or null if after Isha
 */
export const getNextPrayer = (prayerTimes) => {
  if (!prayerTimes) return null;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  
  for (const prayer of prayers) {
    const time = prayerTimes[prayer];
    if (!time) continue;

    const [hours, minutes] = time.split(':').map(Number);
    const prayerTime = hours * 60 + minutes;

    if (currentTime < prayerTime) {
      return prayer;
    }
  }

  // If current time is after Isha, next prayer is tomorrow's Fajr
  return 'Fajr';
};

/**
 * Calculate time remaining until next prayer
 * @param {Object} prayerTimes - Object with prayer times
 * @param {string} nextPrayer - Name of next prayer
 * @returns {string} Formatted time remaining (e.g., "2h 15m")
 */
export const getTimeUntilPrayer = (prayerTimes, nextPrayer) => {
  if (!prayerTimes || !nextPrayer) return '';

  const now = new Date();
  const time = prayerTimes[nextPrayer];
  if (!time) return '';

  const [hours, minutes] = time.split(':').map(Number);
  
  const prayerDate = new Date(now);
  prayerDate.setHours(hours, minutes, 0, 0);

  // If prayer time has passed today, it's tomorrow
  if (prayerDate < now) {
    prayerDate.setDate(prayerDate.getDate() + 1);
  }

  const diff = prayerDate - now;
  const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hoursRemaining > 0) {
    return `${hoursRemaining}h ${minutesRemaining}m`;
  }
  return `${minutesRemaining}m`;
};

/**
 * Format time from 24h to 12h format
 * @param {string} time24 - Time in 24h format (HH:MM)
 * @returns {string} Time in 12h format (h:MM AM/PM)
 */
export const formatTime12Hour = (time24) => {
  if (!time24) return '';
  
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};