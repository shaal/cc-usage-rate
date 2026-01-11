/**
 * Utility modules for Claude Usage Tracker
 */

// Error Handler
export {
  ErrorHandler,
  getErrorHandler,
  resetErrorHandler,
  ErrorCodes,
  validatePageState,
  waitForPageReady,
  safeQuerySelector,
  safeQuerySelectorAll,
  safeGetTextContent,
  safeSetAttribute,
  safeAppendChild,
  safeRemoveElement,
  isElementInDOM,
  validateRelativeTimeFormat,
  validateAbsoluteTimeFormat,
  validatePercentage,
  withGracefulDegradation,
  executeWithPartialResults,
  type ErrorSeverity,
  type ErrorCategory,
  type TrackerError,
  type LoggerConfig,
  type PageStateResult,
  type SafeOperationResult,
  type DegradationConfig,
} from './errorHandler';

// Efficiency Delta Calculator
export {
  calculateEfficiencyDelta,
  getUtilizationStatus,
  isOptimalUtilization,
  calculateEfficiencyDeltaFromTime,
  getStatusColor,
  calculateEfficiencyDeltaWithColor,
  type UtilizationStatus,
  type EfficiencyDeltaConfig,
  type EfficiencyDeltaResult,
} from './efficiencyDeltaCalculator';

// Time String Parser
export {
  parseRelativeTime,
  parseAbsoluteTime,
  parseTimeString,
  relativeTimeToDate,
  absoluteTimeToDate,
  formatMinutesToString,
  isRelativeTime,
  isAbsoluteTime,
  type RelativeTimeResult,
  type AbsoluteTimeResult,
  type ParsedTimeResult,
} from './timeStringParser';

// Session Time Calculator
export {
  SESSION_DURATION_MINUTES,
  calculateElapsedTimePercentage,
  calculateElapsedFromTimeString,
  calculateExpectedUsage,
  analyzeSession,
  analyzeSessionFromTimeString,
  formatSessionTime,
  isSessionNearExpiration,
  isSessionCriticallyLow,
  type SessionTimeResult,
  type ExpectedUsageResult,
  type SessionAnalysisResult,
} from './sessionTimeCalculator';

// Weekly Time Calculator
export {
  MINUTES_PER_WEEK,
  DAY_NAME_MAP,
  DAY_INDEX_MAP,
  normalizeDay,
  getDayIndex,
  isValidResetConfig,
  getLastResetDate,
  getNextResetDate,
  calculateWeeklyTime,
  formatRemainingTime,
  calculateUsageEfficiency,
  parseResetTimeString,
  createResetConfig,
  getLocalTimezoneOffset,
  formatTimezoneOffset,
  type DayOfWeek,
  type DayOfWeekShort,
  type WeeklyResetConfig,
  type WeeklyTimeResult,
  type UsageEfficiencyResult,
} from './weeklyTimeCalculator';

// Usage Data Extractor
export {
  parsePercentage,
  parseSessionTimer,
  parseWeeklyResetTime,
  extractUsageData,
  analyzeUsageData,
  extractAndAnalyzeUsage,
  formatUsageAnalysis,
  type ParsedPercentage,
  type ParsedSessionTimer,
  type ParsedWeeklyReset,
  type ExtractedUsageResult,
  type UsageAnalysisResult,
  type UsageSummary,
} from './usageDataExtractor';

// Performance Utilities
export {
  DOMQueryCache,
  BatchedDOMUpdater,
  ReadWriteBatcher,
  DebouncedMutationObserver,
  debounce,
  throttle,
  deferToNextFrame,
  afterPaint,
  getDOMCache,
  getBatchUpdater,
  getReadWriteBatcher,
  resetPerformanceUtils,
  type DOMCacheConfig,
  type DebouncedMutationObserverOptions,
} from './performanceUtils';
