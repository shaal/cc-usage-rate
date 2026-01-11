/**
 * Weekly Time Calculator - Calculates elapsed time percentage within a weekly usage window
 *
 * This module provides utilities for calculating how much of a weekly usage window
 * has elapsed based on the reset day and time. It handles timezone considerations
 * and calculates expected weekly usage percentages.
 */

/**
 * Days of the week for reset configuration
 */
export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

/**
 * Short form of days (used for parsing)
 */
export type DayOfWeekShort = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

/**
 * Configuration for the weekly reset window
 */
export interface WeeklyResetConfig {
  /** Day of the week when the usage resets */
  resetDay: DayOfWeek | DayOfWeekShort;
  /** Hour of the reset (0-23 in 24-hour format) */
  resetHour: number;
  /** Minute of the reset (0-59) */
  resetMinute: number;
  /** Optional timezone offset in minutes from UTC (defaults to local timezone) */
  timezoneOffsetMinutes?: number;
}

/**
 * Result of weekly time calculation
 */
export interface WeeklyTimeResult {
  /** Percentage of the week that has elapsed (0-100) */
  elapsedPercentage: number;
  /** Minutes elapsed since the last reset */
  elapsedMinutes: number;
  /** Total minutes in the weekly window */
  totalWeekMinutes: number;
  /** Date/time of the most recent reset */
  lastReset: Date;
  /** Date/time of the next upcoming reset */
  nextReset: Date;
  /** Minutes remaining until the next reset */
  remainingMinutes: number;
  /** Human-readable string of time remaining (e.g., "2 days 5 hr 30 min") */
  remainingFormatted: string;
}

/**
 * Result of usage efficiency calculation
 */
export interface UsageEfficiencyResult {
  /** Actual usage percentage (from the UI or API) */
  actualUsagePercentage: number;
  /** Expected usage percentage based on elapsed time */
  expectedUsagePercentage: number;
  /** Delta between actual and expected (positive = over-consuming) */
  efficiencyDelta: number;
  /** Interpretation of the efficiency status */
  status: 'under' | 'on-track' | 'over';
  /** Weekly time calculation details */
  timeDetails: WeeklyTimeResult;
}

/**
 * Mapping from short day names to full day names
 */
const DAY_NAME_MAP: Record<DayOfWeekShort, DayOfWeek> = {
  Sun: 'Sunday',
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
};

/**
 * Mapping from day names to JavaScript day index (0 = Sunday, 6 = Saturday)
 */
const DAY_INDEX_MAP: Record<DayOfWeek, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

/**
 * Total minutes in a week (7 days * 24 hours * 60 minutes)
 */
const MINUTES_PER_WEEK = 7 * 24 * 60;

/**
 * Normalizes a day name to its full form
 *
 * @param day - The day name (short or full)
 * @returns The full day name
 */
export function normalizeDay(day: DayOfWeek | DayOfWeekShort): DayOfWeek {
  if (day in DAY_NAME_MAP) {
    return DAY_NAME_MAP[day as DayOfWeekShort];
  }
  return day as DayOfWeek;
}

/**
 * Gets the JavaScript day index for a given day name
 *
 * @param day - The day name (short or full)
 * @returns The day index (0 = Sunday, 6 = Saturday)
 */
export function getDayIndex(day: DayOfWeek | DayOfWeekShort): number {
  const normalizedDay = normalizeDay(day);
  return DAY_INDEX_MAP[normalizedDay];
}

/**
 * Validates a weekly reset configuration
 *
 * @param config - The configuration to validate
 * @returns True if the configuration is valid, false otherwise
 */
export function isValidResetConfig(config: WeeklyResetConfig): boolean {
  if (!config) return false;

  // Validate reset day
  const validDays = [
    ...Object.keys(DAY_NAME_MAP),
    ...Object.values(DAY_NAME_MAP),
  ];
  if (!validDays.includes(config.resetDay)) return false;

  // Validate hour (0-23)
  if (
    typeof config.resetHour !== 'number' ||
    config.resetHour < 0 ||
    config.resetHour > 23
  ) {
    return false;
  }

  // Validate minute (0-59)
  if (
    typeof config.resetMinute !== 'number' ||
    config.resetMinute < 0 ||
    config.resetMinute > 59
  ) {
    return false;
  }

  // Validate timezone offset if provided
  if (config.timezoneOffsetMinutes !== undefined) {
    if (
      typeof config.timezoneOffsetMinutes !== 'number' ||
      config.timezoneOffsetMinutes < -720 || // UTC-12
      config.timezoneOffsetMinutes > 840 // UTC+14
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Creates a Date object for the last reset time before the reference date
 *
 * @param config - The weekly reset configuration
 * @param referenceDate - The reference date (defaults to now)
 * @returns Date object representing the most recent reset time
 */
export function getLastResetDate(
  config: WeeklyResetConfig,
  referenceDate: Date = new Date()
): Date {
  const targetDayIndex = getDayIndex(config.resetDay);

  // Create a new Date object to avoid mutating the reference
  const result = new Date(referenceDate);

  // Set the time to the reset time
  result.setHours(config.resetHour, config.resetMinute, 0, 0);

  // Get the current day index
  const currentDayIndex = result.getDay();

  // Calculate days since the target day
  let daysSinceReset = currentDayIndex - targetDayIndex;

  // If days is negative, the target day is later in the week
  if (daysSinceReset < 0) {
    daysSinceReset += 7;
  }

  // If same day but reset time is in the future, go back a week
  if (daysSinceReset === 0 && result > referenceDate) {
    daysSinceReset = 7;
  }

  // Move to the last reset day
  result.setDate(result.getDate() - daysSinceReset);

  // Handle timezone offset if specified (different from local timezone)
  if (config.timezoneOffsetMinutes !== undefined) {
    const localOffset = referenceDate.getTimezoneOffset();
    const offsetDiff = config.timezoneOffsetMinutes + localOffset;
    result.setMinutes(result.getMinutes() - offsetDiff);
  }

  return result;
}

/**
 * Creates a Date object for the next reset time after the reference date
 *
 * @param config - The weekly reset configuration
 * @param referenceDate - The reference date (defaults to now)
 * @returns Date object representing the next reset time
 */
export function getNextResetDate(
  config: WeeklyResetConfig,
  referenceDate: Date = new Date()
): Date {
  const lastReset = getLastResetDate(config, referenceDate);

  // Add 7 days (one week) to get the next reset
  const nextReset = new Date(lastReset);
  nextReset.setDate(nextReset.getDate() + 7);

  return nextReset;
}

/**
 * Calculates the elapsed time within the current weekly window
 *
 * @param config - The weekly reset configuration
 * @param referenceDate - The reference date (defaults to now)
 * @returns WeeklyTimeResult with elapsed time details
 */
export function calculateWeeklyTime(
  config: WeeklyResetConfig,
  referenceDate: Date = new Date()
): WeeklyTimeResult {
  if (!isValidResetConfig(config)) {
    throw new Error('Invalid weekly reset configuration');
  }

  const lastReset = getLastResetDate(config, referenceDate);
  const nextReset = getNextResetDate(config, referenceDate);

  // Calculate elapsed time in milliseconds
  const elapsedMs = referenceDate.getTime() - lastReset.getTime();
  const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));

  // Calculate remaining time
  const remainingMs = nextReset.getTime() - referenceDate.getTime();
  const remainingMinutes = Math.max(0, Math.ceil(remainingMs / (1000 * 60)));

  // Calculate percentage
  const elapsedPercentage = Math.min(
    100,
    Math.max(0, (elapsedMinutes / MINUTES_PER_WEEK) * 100)
  );

  return {
    elapsedPercentage,
    elapsedMinutes,
    totalWeekMinutes: MINUTES_PER_WEEK,
    lastReset,
    nextReset,
    remainingMinutes,
    remainingFormatted: formatRemainingTime(remainingMinutes),
  };
}

/**
 * Formats remaining time in a human-readable format
 *
 * @param totalMinutes - Total minutes remaining
 * @returns Formatted string like "2 days 5 hr 30 min"
 */
export function formatRemainingTime(totalMinutes: number): string {
  if (totalMinutes <= 0) {
    return '0 min';
  }

  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = Math.floor(totalMinutes % 60);

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} day${days === 1 ? '' : 's'}`);
  }

  if (hours > 0) {
    parts.push(`${hours} hr`);
  }

  if (minutes > 0 || parts.length === 0) {
    parts.push(`${minutes} min`);
  }

  return parts.join(' ');
}

/**
 * Calculates usage efficiency by comparing actual usage to expected usage
 * based on elapsed time in the weekly window.
 *
 * @param actualUsagePercentage - The actual usage percentage (0-100)
 * @param config - The weekly reset configuration
 * @param referenceDate - The reference date (defaults to now)
 * @returns UsageEfficiencyResult with efficiency details
 */
export function calculateUsageEfficiency(
  actualUsagePercentage: number,
  config: WeeklyResetConfig,
  referenceDate: Date = new Date()
): UsageEfficiencyResult {
  const timeDetails = calculateWeeklyTime(config, referenceDate);
  const expectedUsagePercentage = timeDetails.elapsedPercentage;

  // Calculate the delta (positive = over-consuming)
  const efficiencyDelta = actualUsagePercentage - expectedUsagePercentage;

  // Determine status
  let status: 'under' | 'on-track' | 'over';
  if (efficiencyDelta <= -10) {
    status = 'under';
  } else if (efficiencyDelta >= 10) {
    status = 'over';
  } else {
    status = 'on-track';
  }

  return {
    actualUsagePercentage,
    expectedUsagePercentage,
    efficiencyDelta,
    status,
    timeDetails,
  };
}

/**
 * Parses a reset time string from the Claude UI into a configuration
 *
 * Supports formats like:
 * - "Thu 7:59 AM"
 * - "Mon 10:30 PM"
 * - "Wednesday 14:30"
 *
 * @param resetTimeString - The reset time string to parse
 * @returns WeeklyResetConfig or null if parsing fails
 */
export function parseResetTimeString(resetTimeString: string): WeeklyResetConfig | null {
  if (!resetTimeString || typeof resetTimeString !== 'string') {
    return null;
  }

  const normalizedStr = resetTimeString.trim();

  // Pattern for day of week (short or full)
  const dayPatterns = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ];

  const dayPattern = new RegExp(`^(${dayPatterns.join('|')})\\s+`, 'i');
  const dayMatch = normalizedStr.match(dayPattern);

  if (!dayMatch) {
    return null;
  }

  // Extract and normalize the day
  const matchedDay = dayMatch[1];
  let resetDay: DayOfWeek;

  // Check if it's a short form
  if (matchedDay.length === 3) {
    const shortDay = (matchedDay.charAt(0).toUpperCase() +
      matchedDay.slice(1).toLowerCase()) as DayOfWeekShort;
    if (shortDay in DAY_NAME_MAP) {
      resetDay = DAY_NAME_MAP[shortDay];
    } else {
      return null;
    }
  } else {
    // Full day name
    resetDay =
      (matchedDay.charAt(0).toUpperCase() +
        matchedDay.slice(1).toLowerCase()) as DayOfWeek;
    if (!(resetDay in DAY_INDEX_MAP)) {
      return null;
    }
  }

  // Extract time portion
  const timePortion = normalizedStr.substring(dayMatch[0].length);

  // Pattern for 12-hour time: '7:59 AM', '10:30 PM'
  const time12Pattern = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  const time12Match = timePortion.match(time12Pattern);

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
      hours = hours === 12 ? 12 : hours + 12;
    }

    return {
      resetDay,
      resetHour: hours,
      resetMinute: minutes,
    };
  }

  // Pattern for 24-hour time: '14:30', '09:15'
  const time24Pattern = /^(\d{1,2}):(\d{2})$/;
  const time24Match = timePortion.match(time24Pattern);

  if (time24Match) {
    const hours = parseInt(time24Match[1], 10);
    const minutes = parseInt(time24Match[2], 10);

    // Validate hours and minutes
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null;
    }

    return {
      resetDay,
      resetHour: hours,
      resetMinute: minutes,
    };
  }

  return null;
}

/**
 * Creates a default configuration based on a given day and time
 *
 * @param day - The day of the week
 * @param hour - The hour (0-23)
 * @param minute - The minute (0-59)
 * @returns WeeklyResetConfig
 */
export function createResetConfig(
  day: DayOfWeek | DayOfWeekShort,
  hour: number,
  minute: number = 0
): WeeklyResetConfig {
  return {
    resetDay: normalizeDay(day),
    resetHour: hour,
    resetMinute: minute,
  };
}

/**
 * Gets the current timezone offset in minutes from UTC
 * Positive values are west of UTC, negative values are east
 *
 * @returns Timezone offset in minutes
 */
export function getLocalTimezoneOffset(): number {
  // Note: JavaScript's getTimezoneOffset() returns the opposite sign
  // It returns positive for west of UTC, which matches our convention
  return new Date().getTimezoneOffset();
}

/**
 * Converts a timezone offset to a human-readable string
 *
 * @param offsetMinutes - Offset in minutes from UTC
 * @returns String like "UTC-5:00" or "UTC+8:00"
 */
export function formatTimezoneOffset(offsetMinutes: number): string {
  // JavaScript's getTimezoneOffset returns positive for west of UTC
  // We want to show UTC-5 for eastern time, so we negate it
  const sign = offsetMinutes <= 0 ? '+' : '-';
  const absMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;

  const minuteStr = minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ':00';
  return `UTC${sign}${hours}${minuteStr}`;
}

// Export constants for external use
export { MINUTES_PER_WEEK, DAY_NAME_MAP, DAY_INDEX_MAP };
