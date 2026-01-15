/**
 * Usage Data Extractor - Extracts and parses usage data from Claude.ai usage page
 *
 * This module takes raw text content from DOM elements and converts them into
 * structured, usable data including:
 * - Usage percentages (session and weekly)
 * - Remaining time values
 * - Reset information
 *
 * It serves as the bridge between DOM detection and calculation modules.
 *
 * Includes comprehensive error handling for:
 * - Invalid time formats
 * - Out-of-range percentages
 * - Parsing failures with graceful degradation
 */

import {
  parseRelativeTime,
  parseAbsoluteTime,
  type RelativeTimeResult,
  type AbsoluteTimeResult,
  type ParsedTimeResult,
} from './timeStringParser';

import {
  analyzeSession,
  type SessionAnalysisResult,
} from './sessionTimeCalculator';

import {
  parseResetTimeString,
  calculateWeeklyTime,
  calculateUsageEfficiency,
  calculateWeeklyTimeFromRemaining,
  calculateUsageEfficiencyFromRemaining,
  type WeeklyResetConfig,
  type WeeklyTimeResult,
  type UsageEfficiencyResult,
} from './weeklyTimeCalculator';

import {
  type ExtractedUsageData,
} from './domDetector';

import {
  getErrorHandler,
  ErrorCodes,
  type TrackerError,
} from './errorHandler';

/**
 * Parsed percentage value
 */
export interface ParsedPercentage {
  /** The numeric percentage value (0-100) */
  value: number;
  /** The original string that was parsed */
  originalString: string;
  /** Whether the parsing was successful */
  isValid: boolean;
}

/**
 * Parsed session timer data
 */
export interface ParsedSessionTimer {
  /** The parsed time result (relative time) */
  timeResult: RelativeTimeResult | null;
  /** Total remaining minutes */
  remainingMinutes: number;
  /** Original string that was parsed */
  originalString: string;
  /** Whether the parsing was successful */
  isValid: boolean;
}

/**
 * Parsed weekly reset data
 */
export interface ParsedWeeklyReset {
  /** The parsed time result (absolute time with day) */
  timeResult: AbsoluteTimeResult | null;
  /** The reset configuration for calculations */
  resetConfig: WeeklyResetConfig | null;
  /** Day of week for reset */
  resetDay: string | null;
  /** Hour of reset (24-hour format) */
  resetHour: number | null;
  /** Minute of reset */
  resetMinute: number | null;
  /** Remaining minutes until reset (used when relative time format is shown) */
  remainingMinutes: number | null;
  /** Original string that was parsed */
  originalString: string;
  /** Whether the parsing was successful */
  isValid: boolean;
}

/**
 * Complete extracted usage data with all parsed values
 */
export interface ExtractedUsageResult {
  /** Session usage percentage */
  sessionPercentage: ParsedPercentage | null;
  /** Session timer/remaining time */
  sessionTimer: ParsedSessionTimer | null;
  /** Weekly usage percentage */
  weeklyPercentage: ParsedPercentage | null;
  /** Weekly reset time */
  weeklyReset: ParsedWeeklyReset | null;
  /** Whether session data was successfully extracted */
  hasSessionData: boolean;
  /** Whether weekly data was successfully extracted */
  hasWeeklyData: boolean;
  /** Overall extraction success */
  isValid: boolean;
  /** Any errors or warnings encountered */
  errors: string[];
}

/**
 * Complete usage analysis combining extraction and calculations
 */
export interface UsageAnalysisResult {
  /** Raw extracted data */
  extracted: ExtractedUsageResult;
  /** Session analysis (if session data available) */
  sessionAnalysis: SessionAnalysisResult | null;
  /** Weekly time analysis (if weekly reset data available) */
  weeklyTime: WeeklyTimeResult | null;
  /** Weekly usage efficiency (if both weekly percentage and reset data available) */
  weeklyEfficiency: UsageEfficiencyResult | null;
  /** Human-readable summary */
  summary: UsageSummary;
}

/**
 * Human-readable summary of usage status
 */
export interface UsageSummary {
  /** Session status message */
  sessionStatus: string;
  /** Weekly status message */
  weeklyStatus: string;
  /** Overall status: 'good', 'warning', 'critical', or 'unknown' */
  overallStatus: 'good' | 'warning' | 'critical' | 'unknown';
  /** Recommendations for the user */
  recommendations: string[];
}

/**
 * Parse a percentage string into a numeric value
 *
 * Supports formats:
 * - "75%"
 * - "75.5%"
 * - "75 %" (with space)
 * - Just numeric values like "75"
 *
 * @param percentageStr - The percentage string to parse
 * @param errors - Optional array to collect errors
 * @returns ParsedPercentage with the numeric value
 */
export function parsePercentage(
  percentageStr: string | null,
  errors?: TrackerError[]
): ParsedPercentage | null {
  const handler = getErrorHandler();

  if (!percentageStr || typeof percentageStr !== 'string') {
    return null;
  }

  try {
    const trimmed = percentageStr.trim();

    // Pattern to match percentages: "75%", "75.5%", "75 %"
    const percentPattern = /^(\d+(?:\.\d+)?)\s*%?$/;
    const match = trimmed.match(percentPattern);

    if (!match) {
      const error = handler.createError(
        ErrorCodes.PERCENTAGE_PARSE_FAILED,
        `Failed to parse percentage: "${percentageStr}" - invalid format`,
        'parsing',
        'debug',
        { input: percentageStr }
      );
      errors?.push(error);

      return {
        value: 0,
        originalString: percentageStr,
        isValid: false,
      };
    }

    const value = parseFloat(match[1]);

    // Validate the value is within reasonable range
    if (isNaN(value)) {
      const error = handler.createError(
        ErrorCodes.PERCENTAGE_PARSE_FAILED,
        `Failed to parse percentage: "${percentageStr}" - NaN value`,
        'parsing',
        'warning',
        { input: percentageStr }
      );
      errors?.push(error);
      handler.logError(error);

      return {
        value: 0,
        originalString: percentageStr,
        isValid: false,
      };
    }

    if (value < 0 || value > 100) {
      const clampedValue = Math.max(0, Math.min(100, value));
      const error = handler.createError(
        ErrorCodes.TIME_OUT_OF_RANGE,
        `Percentage out of range: ${value}%, clamped to ${clampedValue}%`,
        'parsing',
        'debug',
        { input: percentageStr, original: value, clamped: clampedValue }
      );
      errors?.push(error);

      return {
        value: clampedValue,
        originalString: percentageStr,
        isValid: true, // Still valid, just clamped
      };
    }

    return {
      value,
      originalString: percentageStr,
      isValid: true,
    };
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.PERCENTAGE_PARSE_FAILED,
      `Unexpected error parsing percentage: ${e instanceof Error ? e.message : String(e)}`,
      'parsing',
      'error',
      { input: percentageStr },
      e instanceof Error ? e : new Error(String(e))
    );
    errors?.push(error);
    handler.logError(error);

    return {
      value: 0,
      originalString: percentageStr,
      isValid: false,
    };
  }
}

/**
 * Parse a session timer string (relative time like "2 hr 48 min" or "Resets in 1 hr 44 min")
 *
 * @param timerStr - The timer string to parse
 * @param errors - Optional array to collect errors
 * @returns ParsedSessionTimer with the time data
 */
export function parseSessionTimer(
  timerStr: string | null,
  errors?: TrackerError[]
): ParsedSessionTimer | null {
  const handler = getErrorHandler();

  if (!timerStr || typeof timerStr !== 'string') {
    return null;
  }

  try {
    let trimmed = timerStr.trim();

    // Strip "Resets in " prefix if present (Claude.ai format)
    trimmed = trimmed.replace(/^resets?\s+in\s+/i, '');

    const timeResult = parseRelativeTime(trimmed);

    if (!timeResult) {
      const error = handler.createError(
        ErrorCodes.TIMER_PARSE_FAILED,
        `Failed to parse session timer: "${timerStr}" - invalid relative time format`,
        'time-format',
        'debug',
        { input: timerStr, processed: trimmed }
      );
      errors?.push(error);

      return {
        timeResult: null,
        remainingMinutes: 0,
        originalString: timerStr,
        isValid: false,
      };
    }

    // Validate the parsed time makes sense (0-300 minutes for a 5-hour session)
    if (timeResult.totalMinutes > 300) {
      const error = handler.createError(
        ErrorCodes.TIME_OUT_OF_RANGE,
        `Session timer exceeds 5-hour session: ${timeResult.totalMinutes} minutes`,
        'parsing',
        'warning',
        { input: timerStr, minutes: timeResult.totalMinutes }
      );
      errors?.push(error);
      handler.logError(error);
      // Still valid, just unexpected
    }

    return {
      timeResult,
      remainingMinutes: timeResult.totalMinutes,
      originalString: timerStr,
      isValid: true,
    };
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.TIMER_PARSE_FAILED,
      `Unexpected error parsing session timer: ${e instanceof Error ? e.message : String(e)}`,
      'time-format',
      'error',
      { input: timerStr },
      e instanceof Error ? e : new Error(String(e))
    );
    errors?.push(error);
    handler.logError(error);

    return {
      timeResult: null,
      remainingMinutes: 0,
      originalString: timerStr,
      isValid: false,
    };
  }
}

/**
 * Parse a weekly reset time string
 * Supports both absolute time formats ("Thu 7:59 AM", "Resets Thu 8:00 AM")
 * and relative time formats ("Resets in 7 hr 31 min", "in 2 hr 45 min")
 *
 * @param resetStr - The reset time string to parse
 * @param errors - Optional array to collect errors
 * @returns ParsedWeeklyReset with the reset data
 */
export function parseWeeklyResetTime(
  resetStr: string | null,
  errors?: TrackerError[]
): ParsedWeeklyReset | null {
  const handler = getErrorHandler();

  if (!resetStr || typeof resetStr !== 'string') {
    return null;
  }

  try {
    let trimmed = resetStr.trim();

    // Check if this is a relative time format (e.g., "Resets in 7 hr 31 min")
    // This happens when Claude.ai shows the weekly reset as countdown
    const relativePattern = /^resets?\s+in\s+/i;
    if (relativePattern.test(trimmed)) {
      // Strip "Resets in " prefix and parse as relative time
      const timeStr = trimmed.replace(relativePattern, '');
      const relativeResult = parseRelativeTime(timeStr);

      if (relativeResult) {
        handler.debug(`Parsed weekly reset as relative time: ${relativeResult.totalMinutes} minutes remaining`);
        return {
          timeResult: null,
          resetConfig: null,
          resetDay: null,
          resetHour: null,
          resetMinute: null,
          remainingMinutes: relativeResult.totalMinutes,
          originalString: resetStr,
          isValid: true,
        };
      }
    }

    // Strip "Resets " prefix if present (Claude.ai format for absolute time)
    trimmed = trimmed.replace(/^resets?\s+/i, '');

    // Try parsing as absolute time (day of week format)
    const absoluteResult = parseAbsoluteTime(trimmed);

    // Also try the reset config parser for more structured data
    const resetConfig = parseResetTimeString(trimmed);

    if (!absoluteResult && !resetConfig) {
      const error = handler.createError(
        ErrorCodes.RESET_TIME_PARSE_FAILED,
        `Failed to parse weekly reset time: "${resetStr}" - invalid format`,
        'time-format',
        'debug',
        { input: resetStr, processed: trimmed }
      );
      errors?.push(error);

      return {
        timeResult: null,
        resetConfig: null,
        resetDay: null,
        resetHour: null,
        resetMinute: null,
        remainingMinutes: null,
        originalString: resetStr,
        isValid: false,
      };
    }

    // Validate day of week if present
    const dayOfWeek = absoluteResult?.dayOfWeek || resetConfig?.resetDay || null;
    if (dayOfWeek) {
      const validDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (!validDays.some(d => d.toLowerCase() === String(dayOfWeek).toLowerCase())) {
        const error = handler.createError(
          ErrorCodes.INVALID_DAY_OF_WEEK,
          `Invalid day of week in reset time: "${dayOfWeek}"`,
          'time-format',
          'warning',
          { input: resetStr, dayOfWeek }
        );
        errors?.push(error);
        handler.logError(error);
      }
    }

    return {
      timeResult: absoluteResult,
      resetConfig,
      resetDay: dayOfWeek,
      resetHour: absoluteResult?.hours ?? resetConfig?.resetHour ?? null,
      resetMinute: absoluteResult?.minutes ?? resetConfig?.resetMinute ?? null,
      remainingMinutes: null,
      originalString: resetStr,
      isValid: true,
    };
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.RESET_TIME_PARSE_FAILED,
      `Unexpected error parsing weekly reset time: ${e instanceof Error ? e.message : String(e)}`,
      'time-format',
      'error',
      { input: resetStr },
      e instanceof Error ? e : new Error(String(e))
    );
    errors?.push(error);
    handler.logError(error);

    return {
      timeResult: null,
      resetConfig: null,
      resetDay: null,
      resetHour: null,
      resetMinute: null,
      remainingMinutes: null,
      originalString: resetStr,
      isValid: false,
    };
  }
}

/**
 * Extract and parse all usage data from raw DOM text content
 *
 * @param rawData - The raw extracted text data from DOM elements
 * @returns ExtractedUsageResult with all parsed values
 */
export function extractUsageData(rawData: ExtractedUsageData): ExtractedUsageResult {
  const handler = getErrorHandler();
  const errors: string[] = [];
  const trackerErrors: TrackerError[] = [];

  // Include any extraction errors from the raw data
  if (rawData.extractionErrors && rawData.extractionErrors.length > 0) {
    rawData.extractionErrors.forEach(err => {
      trackerErrors.push(err);
      errors.push(err.message);
    });
  }

  try {
    // Parse session percentage
    const sessionPercentage = parsePercentage(rawData.sessionPercentageText, trackerErrors);
    if (rawData.sessionPercentageText && (!sessionPercentage || !sessionPercentage.isValid)) {
      errors.push(`Failed to parse session percentage: "${rawData.sessionPercentageText}"`);
    }

    // Parse session timer
    const sessionTimer = parseSessionTimer(rawData.sessionTimerText, trackerErrors);
    if (rawData.sessionTimerText && (!sessionTimer || !sessionTimer.isValid)) {
      errors.push(`Failed to parse session timer: "${rawData.sessionTimerText}"`);
    }

    // Parse weekly percentage
    const weeklyPercentage = parsePercentage(rawData.weeklyPercentageText, trackerErrors);
    if (rawData.weeklyPercentageText && (!weeklyPercentage || !weeklyPercentage.isValid)) {
      errors.push(`Failed to parse weekly percentage: "${rawData.weeklyPercentageText}"`);
    }

    // Parse weekly reset
    const weeklyReset = parseWeeklyResetTime(rawData.weeklyTimerText, trackerErrors);
    if (rawData.weeklyTimerText && (!weeklyReset || !weeklyReset.isValid)) {
      errors.push(`Failed to parse weekly reset time: "${rawData.weeklyTimerText}"`);
    }

    // Determine data availability
    const hasSessionData = !!(
      (sessionPercentage?.isValid) ||
      (sessionTimer?.isValid)
    );

    const hasWeeklyData = !!(
      (weeklyPercentage?.isValid) ||
      (weeklyReset?.isValid)
    );

    const isValid = hasSessionData || hasWeeklyData;

    // Log summary if we had errors but still got valid data (graceful degradation)
    if (errors.length > 0 && isValid) {
      handler.info(`Extracted usage data with ${errors.length} warnings (degraded mode)`, {
        hasSessionData,
        hasWeeklyData,
        errorCount: errors.length,
      });
    }

    return {
      sessionPercentage,
      sessionTimer,
      weeklyPercentage,
      weeklyReset,
      hasSessionData,
      hasWeeklyData,
      isValid,
      errors,
    };
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.TEXT_EXTRACTION_FAILED,
      `Unexpected error extracting usage data: ${e instanceof Error ? e.message : String(e)}`,
      'parsing',
      'error',
      undefined,
      e instanceof Error ? e : new Error(String(e))
    );
    handler.logError(error);
    errors.push(error.message);

    // Return empty result with error
    return {
      sessionPercentage: null,
      sessionTimer: null,
      weeklyPercentage: null,
      weeklyReset: null,
      hasSessionData: false,
      hasWeeklyData: false,
      isValid: false,
      errors,
    };
  }
}

/**
 * Determine overall status based on session and weekly data
 */
function determineOverallStatus(
  sessionAnalysis: SessionAnalysisResult | null,
  weeklyEfficiency: UsageEfficiencyResult | null
): 'good' | 'warning' | 'critical' | 'unknown' {
  // Check session status first (more immediate concern)
  if (sessionAnalysis) {
    const { sessionTime, isOnTrack } = sessionAnalysis;

    // Critical if less than 10% time remaining and over-consuming
    if (sessionTime.remainingPercentage < 10 && isOnTrack === false) {
      return 'critical';
    }

    // Warning if less than 20% time remaining or over-consuming
    if (sessionTime.remainingPercentage < 20 || isOnTrack === false) {
      return 'warning';
    }
  }

  // Check weekly status
  if (weeklyEfficiency) {
    if (weeklyEfficiency.status === 'over') {
      return 'warning';
    }
  }

  // If we have any data and no warnings, we're good
  if (sessionAnalysis || weeklyEfficiency) {
    return 'good';
  }

  return 'unknown';
}

/**
 * Generate recommendations based on usage analysis
 */
function generateRecommendations(
  sessionAnalysis: SessionAnalysisResult | null,
  weeklyEfficiency: UsageEfficiencyResult | null
): string[] {
  const recommendations: string[] = [];

  if (sessionAnalysis) {
    const { sessionTime, isOnTrack } = sessionAnalysis;

    if (sessionTime.remainingPercentage < 10) {
      recommendations.push('Session limit nearly reached. Consider waiting for the reset.');
    } else if (sessionTime.remainingPercentage < 20) {
      recommendations.push('Session limit approaching. Pace your usage if possible.');
    }

    if (isOnTrack === false) {
      recommendations.push('Usage rate is higher than expected. Consider longer pauses between messages.');
    } else if (isOnTrack === true && sessionTime.elapsedPercentage > 50) {
      recommendations.push('Usage is on track. You have capacity for more interactions.');
    }
  }

  if (weeklyEfficiency) {
    if (weeklyEfficiency.status === 'over') {
      recommendations.push('Weekly usage is above expected rate. Consider pacing over remaining days.');
    } else if (weeklyEfficiency.status === 'under' && weeklyEfficiency.timeDetails.elapsedPercentage > 70) {
      recommendations.push('Weekly usage is below expected. You have room for more usage before reset.');
    }
  }

  // Default recommendation if nothing specific
  if (recommendations.length === 0 && (sessionAnalysis || weeklyEfficiency)) {
    recommendations.push('Usage is healthy. Continue as normal.');
  }

  return recommendations;
}

/**
 * Perform complete usage analysis from extracted data
 *
 * @param extracted - The extracted usage data
 * @param referenceDate - Optional reference date for calculations (defaults to now)
 * @returns UsageAnalysisResult with full analysis
 */
export function analyzeUsageData(
  extracted: ExtractedUsageResult,
  referenceDate: Date = new Date()
): UsageAnalysisResult {
  const handler = getErrorHandler();
  let sessionAnalysis: SessionAnalysisResult | null = null;
  let weeklyTime: WeeklyTimeResult | null = null;
  let weeklyEfficiency: UsageEfficiencyResult | null = null;

  // Analyze session data
  if (extracted.sessionTimer?.isValid) {
    try {
      const actualUsagePercentage = extracted.sessionPercentage?.isValid
        ? extracted.sessionPercentage.value
        : null;

      sessionAnalysis = analyzeSession(
        extracted.sessionTimer.remainingMinutes,
        actualUsagePercentage
      );
    } catch (e) {
      const error = handler.createError(
        ErrorCodes.INVALID_SESSION_DATA,
        `Failed to analyze session data: ${e instanceof Error ? e.message : String(e)}`,
        'calculation',
        'warning',
        { remainingMinutes: extracted.sessionTimer?.remainingMinutes },
        e instanceof Error ? e : new Error(String(e))
      );
      handler.logError(error);
      extracted.errors.push(error.message);
    }
  }

  // Analyze weekly data
  if (extracted.weeklyReset?.isValid) {
    try {
      // Check if we have a reset config (absolute time format like "Resets Thu 8:00 AM")
      if (extracted.weeklyReset.resetConfig) {
        weeklyTime = calculateWeeklyTime(extracted.weeklyReset.resetConfig, referenceDate);

        if (extracted.weeklyPercentage?.isValid) {
          weeklyEfficiency = calculateUsageEfficiency(
            extracted.weeklyPercentage.value,
            extracted.weeklyReset.resetConfig,
            referenceDate
          );
        }
      }
      // Otherwise check if we have remaining minutes (relative time format like "Resets in 7 hr 31 min")
      else if (extracted.weeklyReset.remainingMinutes !== null) {
        weeklyTime = calculateWeeklyTimeFromRemaining(
          extracted.weeklyReset.remainingMinutes,
          referenceDate
        );

        if (extracted.weeklyPercentage?.isValid) {
          weeklyEfficiency = calculateUsageEfficiencyFromRemaining(
            extracted.weeklyPercentage.value,
            extracted.weeklyReset.remainingMinutes,
            referenceDate
          );
        }
      }
    } catch (e) {
      const error = handler.createError(
        ErrorCodes.INVALID_WEEKLY_DATA,
        `Failed to calculate weekly time: ${e instanceof Error ? e.message : String(e)}`,
        'calculation',
        'warning',
        { resetConfig: extracted.weeklyReset?.resetConfig, remainingMinutes: extracted.weeklyReset?.remainingMinutes },
        e instanceof Error ? e : new Error(String(e))
      );
      handler.logError(error);
      extracted.errors.push(error.message);
    }
  }

  // Generate summary with error handling
  let sessionStatus: string;
  let weeklyStatus: string;
  let overallStatus: 'good' | 'warning' | 'critical' | 'unknown';
  let recommendations: string[];

  try {
    sessionStatus = sessionAnalysis
      ? sessionAnalysis.statusMessage
      : 'Session data not available';

    weeklyStatus = weeklyEfficiency
      ? `Weekly usage ${weeklyEfficiency.status === 'on-track' ? 'is on track' : `is ${weeklyEfficiency.status} expected rate`}. ${weeklyTime?.remainingFormatted || ''} until reset.`
      : weeklyTime
        ? `${weeklyTime.remainingFormatted} until weekly reset.`
        : 'Weekly data not available';

    overallStatus = determineOverallStatus(sessionAnalysis, weeklyEfficiency);
    recommendations = generateRecommendations(sessionAnalysis, weeklyEfficiency);
  } catch (e) {
    handler.warn(`Error generating usage summary: ${e instanceof Error ? e.message : String(e)}`);
    sessionStatus = 'Unable to determine session status';
    weeklyStatus = 'Unable to determine weekly status';
    overallStatus = 'unknown';
    recommendations = ['Unable to generate recommendations due to an error.'];
  }

  const summary: UsageSummary = {
    sessionStatus,
    weeklyStatus,
    overallStatus,
    recommendations,
  };

  return {
    extracted,
    sessionAnalysis,
    weeklyTime,
    weeklyEfficiency,
    summary,
  };
}

/**
 * Convenience function to extract and analyze usage data in one call
 *
 * @param rawData - The raw extracted text data from DOM elements
 * @param referenceDate - Optional reference date for calculations
 * @returns UsageAnalysisResult with full analysis
 */
export function extractAndAnalyzeUsage(
  rawData: ExtractedUsageData,
  referenceDate: Date = new Date()
): UsageAnalysisResult {
  const extracted = extractUsageData(rawData);
  return analyzeUsageData(extracted, referenceDate);
}

/**
 * Format a usage analysis result as a human-readable string
 *
 * @param analysis - The usage analysis result
 * @returns Formatted string for display or logging
 */
export function formatUsageAnalysis(analysis: UsageAnalysisResult): string {
  const lines: string[] = [];

  lines.push('=== Claude Usage Analysis ===');
  lines.push('');

  // Session section
  lines.push('--- Session ---');
  if (analysis.sessionAnalysis) {
    const { sessionTime, expectedUsage } = analysis.sessionAnalysis;
    lines.push(`Time Elapsed: ${Math.round(sessionTime.elapsedPercentage)}% (${Math.round(sessionTime.elapsedMinutes)} min)`);
    lines.push(`Time Remaining: ${Math.round(sessionTime.remainingPercentage)}% (${Math.round(sessionTime.remainingMinutes)} min)`);

    if (expectedUsage.actualUsagePercentage !== null) {
      lines.push(`Actual Usage: ${Math.round(expectedUsage.actualUsagePercentage)}%`);
      lines.push(`Expected Usage: ${Math.round(expectedUsage.expectedUsagePercentage)}%`);

      if (expectedUsage.usageDelta !== null) {
        const deltaSign = expectedUsage.usageDelta >= 0 ? '+' : '';
        lines.push(`Delta: ${deltaSign}${Math.round(expectedUsage.usageDelta)}%`);
      }
    }

    lines.push(`Status: ${analysis.summary.sessionStatus}`);
  } else {
    lines.push('No session data available');
  }

  lines.push('');

  // Weekly section
  lines.push('--- Weekly ---');
  if (analysis.weeklyTime) {
    lines.push(`Time Elapsed: ${Math.round(analysis.weeklyTime.elapsedPercentage)}%`);
    lines.push(`Time Remaining: ${analysis.weeklyTime.remainingFormatted}`);
    lines.push(`Next Reset: ${analysis.weeklyTime.nextReset.toLocaleString()}`);

    if (analysis.weeklyEfficiency) {
      lines.push(`Actual Usage: ${Math.round(analysis.weeklyEfficiency.actualUsagePercentage)}%`);
      lines.push(`Expected Usage: ${Math.round(analysis.weeklyEfficiency.expectedUsagePercentage)}%`);
      const deltaSign = analysis.weeklyEfficiency.efficiencyDelta >= 0 ? '+' : '';
      lines.push(`Delta: ${deltaSign}${Math.round(analysis.weeklyEfficiency.efficiencyDelta)}%`);
    }

    lines.push(`Status: ${analysis.summary.weeklyStatus}`);
  } else {
    lines.push('No weekly data available');
  }

  lines.push('');

  // Overall section
  lines.push('--- Overall ---');
  lines.push(`Status: ${analysis.summary.overallStatus.toUpperCase()}`);

  if (analysis.summary.recommendations.length > 0) {
    lines.push('Recommendations:');
    analysis.summary.recommendations.forEach((rec, i) => {
      lines.push(`  ${i + 1}. ${rec}`);
    });
  }

  return lines.join('\n');
}

// Export types for external use
export type {
  RelativeTimeResult,
  AbsoluteTimeResult,
  ParsedTimeResult,
  SessionAnalysisResult,
  WeeklyResetConfig,
  WeeklyTimeResult,
  UsageEfficiencyResult,
  ExtractedUsageData,
};
