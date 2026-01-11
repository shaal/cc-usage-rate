/**
 * Efficiency Delta Calculator - Calculates the difference between actual usage
 * and expected time-based usage percentage.
 *
 * This module provides a standalone utility to determine whether a user is:
 * - Under-utilizing: Using less than expected based on elapsed time
 * - Optimally utilizing: Using resources at the expected rate
 * - Over-utilizing: Using more than expected based on elapsed time
 *
 * The calculation is based on a linear usage model where expected usage
 * equals elapsed time percentage.
 */

/**
 * Utilization status indicating usage relative to expected time-based usage
 */
export type UtilizationStatus = 'under-utilizing' | 'optimal' | 'over-utilizing';

/**
 * Configuration options for efficiency delta calculation
 */
export interface EfficiencyDeltaConfig {
  /**
   * Threshold for determining under-utilization (default: -10)
   * If delta <= this value, status is 'under-utilizing'
   */
  underThreshold?: number;

  /**
   * Threshold for determining over-utilization (default: 10)
   * If delta >= this value, status is 'over-utilizing'
   */
  overThreshold?: number;
}

/**
 * Result of the efficiency delta calculation
 */
export interface EfficiencyDeltaResult {
  /**
   * The actual usage percentage provided (0-100)
   */
  actualUsagePercentage: number;

  /**
   * The expected usage percentage based on elapsed time (0-100)
   */
  expectedUsagePercentage: number;

  /**
   * The difference between actual and expected usage
   * Positive value = over-utilizing (using more than expected)
   * Negative value = under-utilizing (using less than expected)
   * Near zero = optimal utilization
   */
  efficiencyDelta: number;

  /**
   * The absolute value of the efficiency delta
   */
  absoluteDelta: number;

  /**
   * The utilization status based on the delta and thresholds
   */
  status: UtilizationStatus;

  /**
   * Human-readable description of the utilization status
   */
  statusDescription: string;

  /**
   * Whether the user is within the optimal range
   */
  isOptimal: boolean;

  /**
   * The thresholds used for status determination
   */
  thresholds: {
    under: number;
    over: number;
  };
}

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<EfficiencyDeltaConfig> = {
  underThreshold: -10,
  overThreshold: 10,
};

/**
 * Calculates the efficiency delta between actual usage and expected time-based usage.
 *
 * This function compares the actual usage percentage against the expected usage
 * percentage (based on elapsed time) to determine if the user is under-utilizing,
 * optimally utilizing, or over-utilizing their quota.
 *
 * @param actualUsagePercentage - The actual usage percentage (0-100)
 * @param expectedUsagePercentage - The expected usage percentage based on elapsed time (0-100)
 * @param config - Optional configuration for thresholds
 * @returns EfficiencyDeltaResult with detailed efficiency information
 *
 * @example
 * // User has used 30% of quota, but 50% of time has elapsed
 * const result = calculateEfficiencyDelta(30, 50);
 * // result.efficiencyDelta = -20 (under-utilizing)
 * // result.status = 'under-utilizing'
 *
 * @example
 * // User has used 70% of quota, but only 50% of time has elapsed
 * const result = calculateEfficiencyDelta(70, 50);
 * // result.efficiencyDelta = 20 (over-utilizing)
 * // result.status = 'over-utilizing'
 *
 * @example
 * // User has used 52% of quota, and 50% of time has elapsed
 * const result = calculateEfficiencyDelta(52, 50);
 * // result.efficiencyDelta = 2 (optimal)
 * // result.status = 'optimal'
 */
export function calculateEfficiencyDelta(
  actualUsagePercentage: number,
  expectedUsagePercentage: number,
  config: EfficiencyDeltaConfig = {}
): EfficiencyDeltaResult {
  // Merge with default config
  const mergedConfig: Required<EfficiencyDeltaConfig> = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  // Validate inputs
  const clampedActual = Math.max(0, Math.min(100, actualUsagePercentage));
  const clampedExpected = Math.max(0, Math.min(100, expectedUsagePercentage));

  // Calculate the efficiency delta
  // Positive = over-utilizing (actual > expected)
  // Negative = under-utilizing (actual < expected)
  const efficiencyDelta = clampedActual - clampedExpected;
  const absoluteDelta = Math.abs(efficiencyDelta);

  // Determine utilization status based on thresholds
  let status: UtilizationStatus;
  let statusDescription: string;

  if (efficiencyDelta <= mergedConfig.underThreshold) {
    status = 'under-utilizing';
    statusDescription = `Usage is ${Math.round(absoluteDelta)}% below expected. You have capacity to use more.`;
  } else if (efficiencyDelta >= mergedConfig.overThreshold) {
    status = 'over-utilizing';
    statusDescription = `Usage is ${Math.round(absoluteDelta)}% above expected. Consider pacing your usage.`;
  } else {
    status = 'optimal';
    statusDescription = 'Usage is on track with expected rate.';
  }

  const isOptimal = status === 'optimal';

  return {
    actualUsagePercentage: clampedActual,
    expectedUsagePercentage: clampedExpected,
    efficiencyDelta,
    absoluteDelta,
    status,
    statusDescription,
    isOptimal,
    thresholds: {
      under: mergedConfig.underThreshold,
      over: mergedConfig.overThreshold,
    },
  };
}

/**
 * Determines the utilization status from an efficiency delta value.
 *
 * This is a simpler function that just returns the status without
 * the full calculation details.
 *
 * @param efficiencyDelta - The difference between actual and expected usage
 * @param config - Optional configuration for thresholds
 * @returns The utilization status
 *
 * @example
 * getUtilizationStatus(-15); // 'under-utilizing'
 * getUtilizationStatus(5);   // 'optimal'
 * getUtilizationStatus(20);  // 'over-utilizing'
 */
export function getUtilizationStatus(
  efficiencyDelta: number,
  config: EfficiencyDeltaConfig = {}
): UtilizationStatus {
  const mergedConfig: Required<EfficiencyDeltaConfig> = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  if (efficiencyDelta <= mergedConfig.underThreshold) {
    return 'under-utilizing';
  } else if (efficiencyDelta >= mergedConfig.overThreshold) {
    return 'over-utilizing';
  }
  return 'optimal';
}

/**
 * Checks if the usage is within the optimal range.
 *
 * @param actualUsagePercentage - The actual usage percentage (0-100)
 * @param expectedUsagePercentage - The expected usage percentage (0-100)
 * @param config - Optional configuration for thresholds
 * @returns true if usage is within optimal range, false otherwise
 *
 * @example
 * isOptimalUtilization(45, 50); // true (delta = -5, within ±10)
 * isOptimalUtilization(30, 50); // false (delta = -20, under-utilizing)
 */
export function isOptimalUtilization(
  actualUsagePercentage: number,
  expectedUsagePercentage: number,
  config: EfficiencyDeltaConfig = {}
): boolean {
  const result = calculateEfficiencyDelta(
    actualUsagePercentage,
    expectedUsagePercentage,
    config
  );
  return result.isOptimal;
}

/**
 * Calculates the efficiency delta from elapsed time percentage.
 *
 * This is a convenience function that uses elapsed time as the expected usage
 * (linear usage model: if 50% time elapsed, expected usage is 50%).
 *
 * @param actualUsagePercentage - The actual usage percentage (0-100)
 * @param elapsedTimePercentage - The percentage of time elapsed in the period (0-100)
 * @param config - Optional configuration for thresholds
 * @returns EfficiencyDeltaResult with detailed efficiency information
 *
 * @example
 * // 40% used, 60% time elapsed
 * const result = calculateEfficiencyDeltaFromTime(40, 60);
 * // result.efficiencyDelta = -20 (under-utilizing)
 */
export function calculateEfficiencyDeltaFromTime(
  actualUsagePercentage: number,
  elapsedTimePercentage: number,
  config: EfficiencyDeltaConfig = {}
): EfficiencyDeltaResult {
  // In a linear usage model, expected usage equals elapsed time percentage
  return calculateEfficiencyDelta(
    actualUsagePercentage,
    elapsedTimePercentage,
    config
  );
}

/**
 * Gets a color indicator based on the utilization status.
 *
 * This maps the utilization status to semantic colors:
 * - under-utilizing: green (good - capacity available)
 * - optimal: yellow (neutral - on track)
 * - over-utilizing: red (warning - usage too fast)
 *
 * @param status - The utilization status
 * @returns Color string identifier
 */
export function getStatusColor(
  status: UtilizationStatus
): 'green' | 'yellow' | 'red' {
  switch (status) {
    case 'under-utilizing':
      return 'green';
    case 'over-utilizing':
      return 'red';
    case 'optimal':
    default:
      return 'yellow';
  }
}

/**
 * Calculates efficiency delta and returns the corresponding color.
 *
 * Convenience function that combines calculation and color mapping.
 *
 * @param actualUsagePercentage - The actual usage percentage (0-100)
 * @param expectedUsagePercentage - The expected usage percentage (0-100)
 * @param config - Optional configuration for thresholds
 * @returns Object with the result and color
 */
export function calculateEfficiencyDeltaWithColor(
  actualUsagePercentage: number,
  expectedUsagePercentage: number,
  config: EfficiencyDeltaConfig = {}
): EfficiencyDeltaResult & { color: 'green' | 'yellow' | 'red' } {
  const result = calculateEfficiencyDelta(
    actualUsagePercentage,
    expectedUsagePercentage,
    config
  );

  return {
    ...result,
    color: getStatusColor(result.status),
  };
}

// Default export for convenience
export default calculateEfficiencyDelta;
