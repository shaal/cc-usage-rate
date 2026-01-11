/**
 * Session Time Calculator - Calculates elapsed time percentage and expected usage
 * within a 5-hour session window based on remaining time displayed.
 *
 * Claude Pro sessions have a 5-hour (300 minute) usage window. This module
 * calculates:
 * - How much time has elapsed in the current session
 * - What percentage of the session has been used
 * - Expected usage percentage based on time elapsed
 */

import { parseRelativeTime } from './timeStringParser';

/**
 * Default session duration in minutes (5 hours)
 */
export const SESSION_DURATION_MINUTES = 300;

/**
 * Result of session time calculations
 */
export interface SessionTimeResult {
  /** The remaining time in minutes */
  remainingMinutes: number;
  /** The elapsed time in minutes */
  elapsedMinutes: number;
  /** The elapsed time as a percentage of the session (0-100) */
  elapsedPercentage: number;
  /** The remaining time as a percentage of the session (0-100) */
  remainingPercentage: number;
  /** The total session duration in minutes */
  sessionDurationMinutes: number;
}

/**
 * Result of expected usage calculation
 */
export interface ExpectedUsageResult {
  /** The expected usage percentage based on time elapsed */
  expectedUsagePercentage: number;
  /** The actual usage percentage (if provided) */
  actualUsagePercentage: number | null;
  /** The difference between actual and expected (positive = over-consuming) */
  usageDelta: number | null;
  /** The elapsed time percentage used for calculation */
  elapsedPercentage: number;
}

/**
 * Combined session analysis result
 */
export interface SessionAnalysisResult {
  /** Session time calculations */
  sessionTime: SessionTimeResult;
  /** Expected vs actual usage calculations (if actual usage provided) */
  expectedUsage: ExpectedUsageResult;
  /** Whether the user is on track with usage */
  isOnTrack: boolean | null;
  /** Human-readable status message */
  statusMessage: string;
}

/**
 * Calculate elapsed time percentage based on remaining time
 *
 * @param remainingMinutes - The remaining time in minutes
 * @param sessionDurationMinutes - Total session duration (default: 300 minutes / 5 hours)
 * @returns SessionTimeResult with all time-related calculations
 */
export function calculateElapsedTimePercentage(
  remainingMinutes: number,
  sessionDurationMinutes: number = SESSION_DURATION_MINUTES
): SessionTimeResult {
  // Clamp remaining minutes to valid range
  const clampedRemaining = Math.max(0, Math.min(remainingMinutes, sessionDurationMinutes));

  const elapsedMinutes = sessionDurationMinutes - clampedRemaining;
  const elapsedPercentage = (elapsedMinutes / sessionDurationMinutes) * 100;
  const remainingPercentage = (clampedRemaining / sessionDurationMinutes) * 100;

  return {
    remainingMinutes: clampedRemaining,
    elapsedMinutes,
    elapsedPercentage,
    remainingPercentage,
    sessionDurationMinutes,
  };
}

/**
 * Calculate elapsed time percentage from a time string
 *
 * @param remainingTimeStr - Time string like '2 hr 48 min' or '30 min'
 * @param sessionDurationMinutes - Total session duration (default: 300 minutes / 5 hours)
 * @returns SessionTimeResult or null if parsing fails
 */
export function calculateElapsedFromTimeString(
  remainingTimeStr: string,
  sessionDurationMinutes: number = SESSION_DURATION_MINUTES
): SessionTimeResult | null {
  const parsed = parseRelativeTime(remainingTimeStr);

  if (!parsed) {
    return null;
  }

  return calculateElapsedTimePercentage(parsed.totalMinutes, sessionDurationMinutes);
}

/**
 * Calculate expected usage percentage based on elapsed time
 *
 * The expected usage is linearly proportional to elapsed time.
 * If 50% of time has elapsed, expected usage is 50%.
 *
 * @param elapsedPercentage - The percentage of session time elapsed (0-100)
 * @param actualUsagePercentage - Optional actual usage percentage for comparison
 * @returns ExpectedUsageResult with expected usage and optional delta
 */
export function calculateExpectedUsage(
  elapsedPercentage: number,
  actualUsagePercentage: number | null = null
): ExpectedUsageResult {
  // Expected usage is linearly proportional to elapsed time
  const expectedUsagePercentage = elapsedPercentage;

  // Calculate delta if actual usage is provided
  const usageDelta = actualUsagePercentage !== null
    ? actualUsagePercentage - expectedUsagePercentage
    : null;

  return {
    expectedUsagePercentage,
    actualUsagePercentage,
    usageDelta,
    elapsedPercentage,
  };
}

/**
 * Perform a full session analysis combining time and usage calculations
 *
 * @param remainingMinutes - The remaining time in minutes
 * @param actualUsagePercentage - Optional actual usage percentage
 * @param sessionDurationMinutes - Total session duration (default: 300 minutes / 5 hours)
 * @returns Complete SessionAnalysisResult
 */
export function analyzeSession(
  remainingMinutes: number,
  actualUsagePercentage: number | null = null,
  sessionDurationMinutes: number = SESSION_DURATION_MINUTES
): SessionAnalysisResult {
  const sessionTime = calculateElapsedTimePercentage(remainingMinutes, sessionDurationMinutes);
  const expectedUsage = calculateExpectedUsage(sessionTime.elapsedPercentage, actualUsagePercentage);

  // Determine if user is on track (within ±10% of expected)
  let isOnTrack: boolean | null = null;
  let statusMessage: string;

  if (expectedUsage.usageDelta !== null) {
    const delta = expectedUsage.usageDelta;

    if (delta <= -10) {
      isOnTrack = true;
      statusMessage = `Usage is ${Math.abs(Math.round(delta))}% below expected. You have capacity to use more.`;
    } else if (delta >= 10) {
      isOnTrack = false;
      statusMessage = `Usage is ${Math.round(delta)}% above expected. Consider pacing your usage.`;
    } else {
      isOnTrack = true;
      statusMessage = 'Usage is on track with expected rate.';
    }
  } else {
    statusMessage = `${Math.round(sessionTime.elapsedPercentage)}% of session time elapsed, ${Math.round(sessionTime.remainingPercentage)}% remaining.`;
  }

  return {
    sessionTime,
    expectedUsage,
    isOnTrack,
    statusMessage,
  };
}

/**
 * Analyze session from a remaining time string
 *
 * @param remainingTimeStr - Time string like '2 hr 48 min'
 * @param actualUsagePercentage - Optional actual usage percentage
 * @param sessionDurationMinutes - Total session duration (default: 300 minutes / 5 hours)
 * @returns SessionAnalysisResult or null if parsing fails
 */
export function analyzeSessionFromTimeString(
  remainingTimeStr: string,
  actualUsagePercentage: number | null = null,
  sessionDurationMinutes: number = SESSION_DURATION_MINUTES
): SessionAnalysisResult | null {
  const parsed = parseRelativeTime(remainingTimeStr);

  if (!parsed) {
    return null;
  }

  return analyzeSession(parsed.totalMinutes, actualUsagePercentage, sessionDurationMinutes);
}

/**
 * Format session time result as a human-readable string
 *
 * @param result - SessionTimeResult to format
 * @returns Formatted string describing the session state
 */
export function formatSessionTime(result: SessionTimeResult): string {
  const elapsedHours = Math.floor(result.elapsedMinutes / 60);
  const elapsedMins = Math.round(result.elapsedMinutes % 60);
  const remainingHours = Math.floor(result.remainingMinutes / 60);
  const remainingMins = Math.round(result.remainingMinutes % 60);

  const elapsedStr = elapsedHours > 0
    ? `${elapsedHours}h ${elapsedMins}m`
    : `${elapsedMins}m`;

  const remainingStr = remainingHours > 0
    ? `${remainingHours}h ${remainingMins}m`
    : `${remainingMins}m`;

  return `Elapsed: ${elapsedStr} (${Math.round(result.elapsedPercentage)}%) | Remaining: ${remainingStr} (${Math.round(result.remainingPercentage)}%)`;
}

/**
 * Check if session is near expiration (less than 20% remaining)
 *
 * @param sessionTime - SessionTimeResult to check
 * @returns true if session is near expiration
 */
export function isSessionNearExpiration(sessionTime: SessionTimeResult): boolean {
  return sessionTime.remainingPercentage < 20;
}

/**
 * Check if session is critically low (less than 10% remaining)
 *
 * @param sessionTime - SessionTimeResult to check
 * @returns true if session is critically low
 */
export function isSessionCriticallyLow(sessionTime: SessionTimeResult): boolean {
  return sessionTime.remainingPercentage < 10;
}

// Default export for convenience
export default analyzeSession;
