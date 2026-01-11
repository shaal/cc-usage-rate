/**
 * Time String Parser - Parses various time formats from Claude usage page
 *
 * Supports:
 * - Relative times: '2 hr 48 min', '30 min', '1 hr', '5 min ago'
 * - Absolute times: 'Thu 7:59 AM', 'Mon 10:30 PM', '9:15 AM'
 *
 * Converts these to standardized time values for calculations.
 */

/**
 * Result of parsing a relative time string
 */
export interface RelativeTimeResult {
  type: 'relative';
  totalMinutes: number;
  hours: number;
  minutes: number;
  originalString: string;
}

/**
 * Result of parsing an absolute time string
 */
export interface AbsoluteTimeResult {
  type: 'absolute';
  hours: number; // 0-23 (24-hour format)
  minutes: number;
  dayOfWeek: string | null; // e.g., 'Thu', 'Mon', or null if not specified
  originalString: string;
}

/**
 * Union type for all parsed time results
 */
export type ParsedTimeResult = RelativeTimeResult | AbsoluteTimeResult;

/**
 * Days of the week abbreviations
 */
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Parse a relative time string like '2 hr 48 min' or '30 min'
 *
 * Supported formats:
 * - '2 hr 48 min'
 * - '2hr 48min'
 * - '30 min'
 * - '1 hr'
 * - '5 min ago'
 * - '2 hours 30 minutes'
 *
 * @param timeStr - The time string to parse
 * @returns RelativeTimeResult or null if parsing fails
 */
export function parseRelativeTime(timeStr: string): RelativeTimeResult | null {
  if (!timeStr || typeof timeStr !== 'string') {
    return null;
  }

  const normalizedStr = timeStr.trim().toLowerCase();

  // Remove trailing 'ago' if present
  const cleanedStr = normalizedStr.replace(/\s*ago\s*$/, '');

  let hours = 0;
  let minutes = 0;

  // Pattern for hours: matches '2 hr', '2hr', '2 hours', '2hours'
  const hourPattern = /(\d+)\s*(?:hr|hours?)/i;
  const hourMatch = cleanedStr.match(hourPattern);
  if (hourMatch) {
    hours = parseInt(hourMatch[1], 10);
  }

  // Pattern for minutes: matches '48 min', '48min', '48 minutes', '48minutes'
  const minutePattern = /(\d+)\s*(?:min|minutes?)/i;
  const minuteMatch = cleanedStr.match(minutePattern);
  if (minuteMatch) {
    minutes = parseInt(minuteMatch[1], 10);
  }

  // If neither hours nor minutes found, return null
  if (hours === 0 && minutes === 0) {
    return null;
  }

  const totalMinutes = hours * 60 + minutes;

  return {
    type: 'relative',
    totalMinutes,
    hours,
    minutes,
    originalString: timeStr,
  };
}

/**
 * Parse an absolute time string like 'Thu 7:59 AM' or '10:30 PM'
 *
 * Supported formats:
 * - 'Thu 7:59 AM'
 * - 'Mon 10:30 PM'
 * - '7:59 AM'
 * - '10:30 PM'
 * - '14:30' (24-hour format)
 *
 * @param timeStr - The time string to parse
 * @returns AbsoluteTimeResult or null if parsing fails
 */
export function parseAbsoluteTime(timeStr: string): AbsoluteTimeResult | null {
  if (!timeStr || typeof timeStr !== 'string') {
    return null;
  }

  const normalizedStr = timeStr.trim();

  // Try to extract day of week
  let dayOfWeek: string | null = null;
  let timePortionStr = normalizedStr;

  // Check for day of week prefix
  const dayPattern = new RegExp(`^(${DAYS_OF_WEEK.join('|')})\\s+`, 'i');
  const dayMatch = normalizedStr.match(dayPattern);
  if (dayMatch) {
    // Capitalize first letter, lowercase rest
    dayOfWeek = dayMatch[1].charAt(0).toUpperCase() + dayMatch[1].slice(1).toLowerCase();
    timePortionStr = normalizedStr.substring(dayMatch[0].length);
  }

  // Pattern for 12-hour time: '7:59 AM', '10:30 PM'
  const time12Pattern = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  const time12Match = timePortionStr.match(time12Pattern);

  if (time12Match) {
    let hours = parseInt(time12Match[1], 10);
    const minutes = parseInt(time12Match[2], 10);
    const period = time12Match[3].toUpperCase();

    // Validate hours and minutes
    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) {
      return null;
    }

    // Convert to 24-hour format
    if (period === 'AM') {
      hours = hours === 12 ? 0 : hours;
    } else {
      // PM
      hours = hours === 12 ? 12 : hours + 12;
    }

    return {
      type: 'absolute',
      hours,
      minutes,
      dayOfWeek,
      originalString: timeStr,
    };
  }

  // Pattern for 24-hour time: '14:30', '09:15'
  const time24Pattern = /^(\d{1,2}):(\d{2})$/;
  const time24Match = timePortionStr.match(time24Pattern);

  if (time24Match) {
    const hours = parseInt(time24Match[1], 10);
    const minutes = parseInt(time24Match[2], 10);

    // Validate hours and minutes
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null;
    }

    return {
      type: 'absolute',
      hours,
      minutes,
      dayOfWeek,
      originalString: timeStr,
    };
  }

  return null;
}

/**
 * Parse any time string - automatically detects if relative or absolute
 *
 * @param timeStr - The time string to parse
 * @returns ParsedTimeResult or null if parsing fails
 */
export function parseTimeString(timeStr: string): ParsedTimeResult | null {
  if (!timeStr || typeof timeStr !== 'string') {
    return null;
  }

  // Try absolute time first (more specific patterns)
  const absoluteResult = parseAbsoluteTime(timeStr);
  if (absoluteResult) {
    return absoluteResult;
  }

  // Try relative time
  const relativeResult = parseRelativeTime(timeStr);
  if (relativeResult) {
    return relativeResult;
  }

  return null;
}

/**
 * Convert a relative time to a Date object (time ago from now)
 *
 * @param relativeTime - The parsed relative time result
 * @param referenceDate - Optional reference date (defaults to now)
 * @returns Date object representing the time
 */
export function relativeTimeToDate(
  relativeTime: RelativeTimeResult,
  referenceDate: Date = new Date()
): Date {
  const result = new Date(referenceDate);
  result.setMinutes(result.getMinutes() - relativeTime.totalMinutes);
  return result;
}

/**
 * Convert an absolute time to a Date object for a given reference date
 *
 * @param absoluteTime - The parsed absolute time result
 * @param referenceDate - Optional reference date (defaults to today)
 * @returns Date object representing the time
 */
export function absoluteTimeToDate(
  absoluteTime: AbsoluteTimeResult,
  referenceDate: Date = new Date()
): Date {
  const result = new Date(referenceDate);
  result.setHours(absoluteTime.hours, absoluteTime.minutes, 0, 0);

  // If day of week is specified, find the most recent matching day
  if (absoluteTime.dayOfWeek) {
    const targetDayIndex = DAYS_OF_WEEK.indexOf(absoluteTime.dayOfWeek);
    if (targetDayIndex !== -1) {
      const currentDayIndex = result.getDay();
      let daysBack = currentDayIndex - targetDayIndex;

      // If the target day is in the future this week, go back a full week
      if (daysBack < 0) {
        daysBack += 7;
      }

      // If same day but time is in the future, go back a week
      if (daysBack === 0 && result > referenceDate) {
        daysBack = 7;
      }

      result.setDate(result.getDate() - daysBack);
    }
  }

  return result;
}

/**
 * Format minutes into a human-readable string
 *
 * @param totalMinutes - Total minutes to format
 * @returns Formatted string like '2 hr 30 min' or '45 min'
 */
export function formatMinutesToString(totalMinutes: number): string {
  if (totalMinutes < 0) {
    return '0 min';
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

/**
 * Check if a parsed result is a relative time
 */
export function isRelativeTime(result: ParsedTimeResult): result is RelativeTimeResult {
  return result.type === 'relative';
}

/**
 * Check if a parsed result is an absolute time
 */
export function isAbsoluteTime(result: ParsedTimeResult): result is AbsoluteTimeResult {
  return result.type === 'absolute';
}
