/**
 * Error Handler - Comprehensive error handling utilities for Claude Usage Tracker
 *
 * This module provides:
 * - Custom error types for different error categories
 * - Error logging with severity levels
 * - Graceful degradation helpers
 * - Page state validation
 * - Safe DOM operation wrappers
 */

/**
 * Error severity levels
 */
export type ErrorSeverity = 'debug' | 'info' | 'warning' | 'error' | 'critical';

/**
 * Error categories for different types of failures
 */
export type ErrorCategory =
  | 'page-load'
  | 'dom-element'
  | 'time-format'
  | 'page-structure'
  | 'parsing'
  | 'calculation'
  | 'rendering'
  | 'network'
  | 'unknown';

/**
 * Structured error information
 */
export interface TrackerError {
  /** Unique error code for identification */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Error category */
  category: ErrorCategory;
  /** Error severity level */
  severity: ErrorSeverity;
  /** Additional context data */
  context?: Record<string, unknown>;
  /** Original error if wrapping another error */
  originalError?: Error;
  /** Timestamp when error occurred */
  timestamp: Date;
  /** Whether this error was recovered from */
  recovered: boolean;
  /** Recovery action taken (if any) */
  recoveryAction?: string;
}

/**
 * Error codes for common error scenarios
 */
export const ErrorCodes = {
  // Page Load Errors (1xx)
  PAGE_NOT_READY: 'E101',
  PAGE_LOAD_TIMEOUT: 'E102',
  WRONG_PAGE: 'E103',
  DOCUMENT_NOT_AVAILABLE: 'E104',

  // DOM Element Errors (2xx)
  ELEMENT_NOT_FOUND: 'E201',
  ELEMENT_REMOVED: 'E202',
  CONTAINER_NOT_FOUND: 'E203',
  MULTIPLE_ELEMENTS_FOUND: 'E204',
  ELEMENT_ATTRIBUTE_MISSING: 'E205',

  // Time Format Errors (3xx)
  INVALID_TIME_FORMAT: 'E301',
  INVALID_RELATIVE_TIME: 'E302',
  INVALID_ABSOLUTE_TIME: 'E303',
  TIME_OUT_OF_RANGE: 'E304',
  INVALID_DAY_OF_WEEK: 'E305',

  // Page Structure Errors (4xx)
  STRUCTURE_CHANGED: 'E401',
  MISSING_PERCENTAGE: 'E402',
  MISSING_TIMER: 'E403',
  UNEXPECTED_CONTENT: 'E404',

  // Parsing Errors (5xx)
  PERCENTAGE_PARSE_FAILED: 'E501',
  TIMER_PARSE_FAILED: 'E502',
  RESET_TIME_PARSE_FAILED: 'E503',
  TEXT_EXTRACTION_FAILED: 'E504',

  // Calculation Errors (6xx)
  INVALID_SESSION_DATA: 'E601',
  INVALID_WEEKLY_DATA: 'E602',
  CALCULATION_OVERFLOW: 'E603',

  // Rendering Errors (7xx)
  INDICATOR_CREATE_FAILED: 'E701',
  INDICATOR_UPDATE_FAILED: 'E702',
  STYLE_INJECT_FAILED: 'E703',
  DOM_INSERT_FAILED: 'E704',

  // Unknown/General Errors (9xx)
  UNKNOWN_ERROR: 'E999',
} as const;

/**
 * Logger configuration
 */
export interface LoggerConfig {
  /** Whether to enable logging */
  enabled: boolean;
  /** Minimum severity level to log */
  minSeverity: ErrorSeverity;
  /** Whether to include timestamps */
  includeTimestamp: boolean;
  /** Whether to log to console */
  logToConsole: boolean;
  /** Custom log prefix */
  prefix: string;
  /** Maximum errors to store in memory */
  maxStoredErrors: number;
}

/**
 * Default logger configuration
 */
const DEFAULT_LOGGER_CONFIG: LoggerConfig = {
  enabled: true,
  minSeverity: 'warning',
  includeTimestamp: true,
  logToConsole: true,
  prefix: '[Claude Usage Tracker]',
  maxStoredErrors: 100,
};

/**
 * Severity level numeric values for comparison
 */
const SEVERITY_LEVELS: Record<ErrorSeverity, number> = {
  debug: 0,
  info: 1,
  warning: 2,
  error: 3,
  critical: 4,
};

/**
 * Error Handler class for managing errors throughout the extension
 */
export class ErrorHandler {
  private config: LoggerConfig;
  private errors: TrackerError[] = [];
  private errorCallbacks: ((error: TrackerError) => void)[] = [];

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_LOGGER_CONFIG, ...config };
  }

  /**
   * Create a new TrackerError
   */
  createError(
    code: string,
    message: string,
    category: ErrorCategory,
    severity: ErrorSeverity,
    context?: Record<string, unknown>,
    originalError?: Error
  ): TrackerError {
    return {
      code,
      message,
      category,
      severity,
      context,
      originalError,
      timestamp: new Date(),
      recovered: false,
    };
  }

  /**
   * Log an error
   */
  logError(error: TrackerError): void {
    // Check if logging is enabled and severity meets threshold
    if (!this.config.enabled) return;
    if (SEVERITY_LEVELS[error.severity] < SEVERITY_LEVELS[this.config.minSeverity]) return;

    // Store error
    this.errors.push(error);
    if (this.errors.length > this.config.maxStoredErrors) {
      this.errors.shift();
    }

    // Log to console if enabled
    if (this.config.logToConsole) {
      this.logToConsole(error);
    }

    // Notify callbacks
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (e) {
        // Prevent callback errors from breaking the system
        console.error(`${this.config.prefix} Error callback failed:`, e);
      }
    });
  }

  /**
   * Log error to console with appropriate formatting
   */
  private logToConsole(error: TrackerError): void {
    const timestamp = this.config.includeTimestamp
      ? `[${error.timestamp.toISOString()}]`
      : '';
    const prefix = `${this.config.prefix} ${timestamp} [${error.code}]`;

    const consoleMethod = this.getConsoleMethod(error.severity);
    const args: unknown[] = [`${prefix} ${error.message}`];

    if (error.context) {
      args.push('\nContext:', error.context);
    }

    if (error.originalError) {
      args.push('\nOriginal Error:', error.originalError);
    }

    consoleMethod(...args);
  }

  /**
   * Get the appropriate console method for the severity level
   */
  private getConsoleMethod(severity: ErrorSeverity): (...args: unknown[]) => void {
    switch (severity) {
      case 'debug':
        return console.debug.bind(console);
      case 'info':
        return console.info.bind(console);
      case 'warning':
        return console.warn.bind(console);
      case 'error':
      case 'critical':
        return console.error.bind(console);
      default:
        return console.log.bind(console);
    }
  }

  /**
   * Log a quick error message without creating a full TrackerError
   */
  log(
    severity: ErrorSeverity,
    message: string,
    context?: Record<string, unknown>
  ): void {
    const error = this.createError(
      ErrorCodes.UNKNOWN_ERROR,
      message,
      'unknown',
      severity,
      context
    );
    this.logError(error);
  }

  /**
   * Convenience methods for different severity levels
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warning', message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  critical(message: string, context?: Record<string, unknown>): void {
    this.log('critical', message, context);
  }

  /**
   * Mark an error as recovered
   */
  markRecovered(error: TrackerError, recoveryAction: string): void {
    error.recovered = true;
    error.recoveryAction = recoveryAction;
    this.debug(`Error recovered: ${error.code} via ${recoveryAction}`, { error });
  }

  /**
   * Register an error callback
   */
  onError(callback: (error: TrackerError) => void): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Get all stored errors
   */
  getErrors(): readonly TrackerError[] {
    return [...this.errors];
  }

  /**
   * Get errors by category
   */
  getErrorsByCategory(category: ErrorCategory): TrackerError[] {
    return this.errors.filter(e => e.category === category);
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): TrackerError[] {
    return this.errors.filter(e => e.severity === severity);
  }

  /**
   * Get unrecovered errors
   */
  getUnrecoveredErrors(): TrackerError[] {
    return this.errors.filter(e => !e.recovered);
  }

  /**
   * Clear stored errors
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<LoggerConfig> {
    return { ...this.config };
  }
}

// Global error handler instance
let globalErrorHandler: ErrorHandler | null = null;

/**
 * Get or create the global error handler instance
 */
export function getErrorHandler(config?: Partial<LoggerConfig>): ErrorHandler {
  if (!globalErrorHandler) {
    globalErrorHandler = new ErrorHandler(config);
  }
  return globalErrorHandler;
}

/**
 * Reset the global error handler
 */
export function resetErrorHandler(): void {
  globalErrorHandler = null;
}

/**
 * Page State Validation Utilities
 */

/**
 * Result of page state validation
 */
export interface PageStateResult {
  isReady: boolean;
  isUsagePage: boolean;
  documentState: DocumentReadyState;
  hasBody: boolean;
  hasHead: boolean;
  errors: TrackerError[];
}

/**
 * Validate the current page state
 */
export function validatePageState(): PageStateResult {
  const handler = getErrorHandler();
  const errors: TrackerError[] = [];

  let documentState: DocumentReadyState = 'loading';
  let hasBody = false;
  let hasHead = false;
  let isUsagePage = false;

  try {
    documentState = document.readyState;
  } catch (e) {
    errors.push(handler.createError(
      ErrorCodes.DOCUMENT_NOT_AVAILABLE,
      'Document object not available',
      'page-load',
      'critical',
      undefined,
      e instanceof Error ? e : new Error(String(e))
    ));
  }

  try {
    hasBody = !!document.body;
  } catch (e) {
    // Already handled above
  }

  try {
    hasHead = !!document.head;
  } catch (e) {
    // Already handled above
  }

  try {
    isUsagePage = window.location.href.includes('claude.ai/settings/usage');
  } catch (e) {
    errors.push(handler.createError(
      ErrorCodes.WRONG_PAGE,
      'Unable to determine current page URL',
      'page-load',
      'warning',
      undefined,
      e instanceof Error ? e : new Error(String(e))
    ));
  }

  const isReady = documentState === 'complete' || documentState === 'interactive';

  if (!isReady) {
    errors.push(handler.createError(
      ErrorCodes.PAGE_NOT_READY,
      `Page not ready. Current state: ${documentState}`,
      'page-load',
      'warning',
      { documentState }
    ));
  }

  if (!hasBody) {
    errors.push(handler.createError(
      ErrorCodes.PAGE_NOT_READY,
      'Document body not available',
      'page-load',
      'error'
    ));
  }

  // Log errors
  errors.forEach(error => handler.logError(error));

  return {
    isReady,
    isUsagePage,
    documentState,
    hasBody,
    hasHead,
    errors,
  };
}

/**
 * Wait for page to be ready with timeout
 */
export async function waitForPageReady(
  timeoutMs: number = 10000
): Promise<PageStateResult> {
  const handler = getErrorHandler();
  const startTime = Date.now();

  return new Promise((resolve) => {
    const checkState = () => {
      const state = validatePageState();

      if (state.isReady) {
        resolve(state);
        return;
      }

      if (Date.now() - startTime >= timeoutMs) {
        const error = handler.createError(
          ErrorCodes.PAGE_LOAD_TIMEOUT,
          `Page load timeout after ${timeoutMs}ms`,
          'page-load',
          'error',
          { elapsed: Date.now() - startTime }
        );
        handler.logError(error);
        state.errors.push(error);
        resolve(state);
        return;
      }

      setTimeout(checkState, 100);
    };

    checkState();
  });
}

/**
 * Safe DOM Operation Wrappers
 */

/**
 * Result of a safe DOM operation
 */
export interface SafeOperationResult<T> {
  success: boolean;
  value: T | null;
  error: TrackerError | null;
}

/**
 * Safely query for a single element
 */
export function safeQuerySelector<T extends Element = HTMLElement>(
  selector: string,
  parent: Element | Document = document
): SafeOperationResult<T> {
  const handler = getErrorHandler();

  try {
    const element = parent.querySelector<T>(selector);

    if (!element) {
      return {
        success: false,
        value: null,
        error: handler.createError(
          ErrorCodes.ELEMENT_NOT_FOUND,
          `Element not found for selector: ${selector}`,
          'dom-element',
          'debug',
          { selector }
        ),
      };
    }

    return {
      success: true,
      value: element,
      error: null,
    };
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.ELEMENT_NOT_FOUND,
      `Error querying selector: ${selector}`,
      'dom-element',
      'error',
      { selector },
      e instanceof Error ? e : new Error(String(e))
    );
    handler.logError(error);

    return {
      success: false,
      value: null,
      error,
    };
  }
}

/**
 * Safely query for multiple elements
 */
export function safeQuerySelectorAll<T extends Element = HTMLElement>(
  selector: string,
  parent: Element | Document = document
): SafeOperationResult<NodeListOf<T>> {
  const handler = getErrorHandler();

  try {
    const elements = parent.querySelectorAll<T>(selector);

    return {
      success: true,
      value: elements,
      error: null,
    };
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.ELEMENT_NOT_FOUND,
      `Error querying selector: ${selector}`,
      'dom-element',
      'error',
      { selector },
      e instanceof Error ? e : new Error(String(e))
    );
    handler.logError(error);

    return {
      success: false,
      value: null,
      error,
    };
  }
}

/**
 * Safely get text content from an element
 */
export function safeGetTextContent(element: Element | null): SafeOperationResult<string> {
  const handler = getErrorHandler();

  if (!element) {
    return {
      success: false,
      value: null,
      error: handler.createError(
        ErrorCodes.ELEMENT_NOT_FOUND,
        'Cannot get text content from null element',
        'dom-element',
        'debug'
      ),
    };
  }

  try {
    const text = element.textContent?.trim() ?? '';
    return {
      success: true,
      value: text,
      error: null,
    };
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.TEXT_EXTRACTION_FAILED,
      'Error extracting text content',
      'dom-element',
      'warning',
      undefined,
      e instanceof Error ? e : new Error(String(e))
    );
    handler.logError(error);

    return {
      success: false,
      value: null,
      error,
    };
  }
}

/**
 * Safely set an attribute on an element
 */
export function safeSetAttribute(
  element: Element | null,
  name: string,
  value: string
): SafeOperationResult<void> {
  const handler = getErrorHandler();

  if (!element) {
    return {
      success: false,
      value: null,
      error: handler.createError(
        ErrorCodes.ELEMENT_NOT_FOUND,
        'Cannot set attribute on null element',
        'dom-element',
        'debug',
        { attribute: name }
      ),
    };
  }

  try {
    element.setAttribute(name, value);
    return {
      success: true,
      value: undefined,
      error: null,
    };
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.DOM_INSERT_FAILED,
      `Error setting attribute ${name}`,
      'dom-element',
      'warning',
      { attribute: name, value },
      e instanceof Error ? e : new Error(String(e))
    );
    handler.logError(error);

    return {
      success: false,
      value: null,
      error,
    };
  }
}

/**
 * Safely append a child element
 */
export function safeAppendChild(
  parent: Element | null,
  child: Element | null
): SafeOperationResult<void> {
  const handler = getErrorHandler();

  if (!parent) {
    return {
      success: false,
      value: null,
      error: handler.createError(
        ErrorCodes.CONTAINER_NOT_FOUND,
        'Cannot append to null parent',
        'dom-element',
        'warning'
      ),
    };
  }

  if (!child) {
    return {
      success: false,
      value: null,
      error: handler.createError(
        ErrorCodes.ELEMENT_NOT_FOUND,
        'Cannot append null child',
        'dom-element',
        'warning'
      ),
    };
  }

  try {
    parent.appendChild(child);
    return {
      success: true,
      value: undefined,
      error: null,
    };
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.DOM_INSERT_FAILED,
      'Error appending child element',
      'rendering',
      'error',
      undefined,
      e instanceof Error ? e : new Error(String(e))
    );
    handler.logError(error);

    return {
      success: false,
      value: null,
      error,
    };
  }
}

/**
 * Safely remove an element
 */
export function safeRemoveElement(element: Element | null): SafeOperationResult<void> {
  const handler = getErrorHandler();

  if (!element) {
    // Not an error - element doesn't exist, nothing to remove
    return {
      success: true,
      value: undefined,
      error: null,
    };
  }

  try {
    element.remove();
    return {
      success: true,
      value: undefined,
      error: null,
    };
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.DOM_INSERT_FAILED,
      'Error removing element',
      'rendering',
      'warning',
      undefined,
      e instanceof Error ? e : new Error(String(e))
    );
    handler.logError(error);

    return {
      success: false,
      value: null,
      error,
    };
  }
}

/**
 * Check if an element is still in the DOM
 */
export function isElementInDOM(element: Element | null): boolean {
  if (!element) return false;

  try {
    return document.body.contains(element);
  } catch {
    return false;
  }
}

/**
 * Time Format Validation Utilities
 */

/**
 * Validate a relative time string format
 */
export function validateRelativeTimeFormat(timeStr: string): SafeOperationResult<boolean> {
  const handler = getErrorHandler();

  if (!timeStr || typeof timeStr !== 'string') {
    return {
      success: false,
      value: false,
      error: handler.createError(
        ErrorCodes.INVALID_TIME_FORMAT,
        'Invalid time string: empty or not a string',
        'time-format',
        'debug',
        { input: timeStr }
      ),
    };
  }

  const trimmed = timeStr.trim().toLowerCase();

  // Check for relative time patterns
  const hasHours = /\d+\s*(?:hr|hours?)/i.test(trimmed);
  const hasMinutes = /\d+\s*(?:min|minutes?)/i.test(trimmed);

  if (!hasHours && !hasMinutes) {
    return {
      success: false,
      value: false,
      error: handler.createError(
        ErrorCodes.INVALID_RELATIVE_TIME,
        `Invalid relative time format: ${timeStr}`,
        'time-format',
        'debug',
        { input: timeStr }
      ),
    };
  }

  return {
    success: true,
    value: true,
    error: null,
  };
}

/**
 * Validate an absolute time string format
 */
export function validateAbsoluteTimeFormat(timeStr: string): SafeOperationResult<boolean> {
  const handler = getErrorHandler();

  if (!timeStr || typeof timeStr !== 'string') {
    return {
      success: false,
      value: false,
      error: handler.createError(
        ErrorCodes.INVALID_TIME_FORMAT,
        'Invalid time string: empty or not a string',
        'time-format',
        'debug',
        { input: timeStr }
      ),
    };
  }

  const trimmed = timeStr.trim();

  // 12-hour format with optional day
  const time12Pattern = /^(?:(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s+)?(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  // 24-hour format with optional day
  const time24Pattern = /^(?:(?:Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s+)?(\d{1,2}):(\d{2})$/i;

  if (!time12Pattern.test(trimmed) && !time24Pattern.test(trimmed)) {
    return {
      success: false,
      value: false,
      error: handler.createError(
        ErrorCodes.INVALID_ABSOLUTE_TIME,
        `Invalid absolute time format: ${timeStr}`,
        'time-format',
        'debug',
        { input: timeStr }
      ),
    };
  }

  return {
    success: true,
    value: true,
    error: null,
  };
}

/**
 * Validate a percentage value
 */
export function validatePercentage(value: number): SafeOperationResult<number> {
  const handler = getErrorHandler();

  if (typeof value !== 'number' || isNaN(value)) {
    return {
      success: false,
      value: null,
      error: handler.createError(
        ErrorCodes.PERCENTAGE_PARSE_FAILED,
        'Invalid percentage: not a number',
        'parsing',
        'warning',
        { input: value }
      ),
    };
  }

  // Clamp to valid range
  const clamped = Math.max(0, Math.min(100, value));

  if (value < 0 || value > 100) {
    const error = handler.createError(
      ErrorCodes.TIME_OUT_OF_RANGE,
      `Percentage out of range: ${value}, clamped to ${clamped}`,
      'parsing',
      'debug',
      { input: value, clamped }
    );
    handler.logError(error);

    return {
      success: true,
      value: clamped,
      error,
    };
  }

  return {
    success: true,
    value: value,
    error: null,
  };
}

/**
 * Graceful Degradation Helper
 */

/**
 * Configuration for graceful degradation
 */
export interface DegradationConfig {
  /** Whether to continue with partial data */
  allowPartialData: boolean;
  /** Whether to show fallback UI */
  showFallbackUI: boolean;
  /** Whether to retry failed operations */
  retryOnFailure: boolean;
  /** Maximum retry attempts */
  maxRetries: number;
  /** Retry delay in milliseconds */
  retryDelayMs: number;
}

const DEFAULT_DEGRADATION_CONFIG: DegradationConfig = {
  allowPartialData: true,
  showFallbackUI: true,
  retryOnFailure: true,
  maxRetries: 3,
  retryDelayMs: 1000,
};

/**
 * Execute an operation with graceful degradation
 */
export async function withGracefulDegradation<T>(
  operation: () => T | Promise<T>,
  fallbackValue: T,
  options: Partial<DegradationConfig> = {}
): Promise<{ value: T; degraded: boolean; errors: TrackerError[] }> {
  const config = { ...DEFAULT_DEGRADATION_CONFIG, ...options };
  const handler = getErrorHandler();
  const errors: TrackerError[] = [];
  let attempts = 0;

  while (attempts < config.maxRetries) {
    try {
      const result = await operation();
      return {
        value: result,
        degraded: false,
        errors,
      };
    } catch (e) {
      attempts++;
      const error = handler.createError(
        ErrorCodes.UNKNOWN_ERROR,
        `Operation failed (attempt ${attempts}/${config.maxRetries})`,
        'unknown',
        attempts >= config.maxRetries ? 'error' : 'warning',
        { attempt: attempts },
        e instanceof Error ? e : new Error(String(e))
      );
      handler.logError(error);
      errors.push(error);

      if (!config.retryOnFailure || attempts >= config.maxRetries) {
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, config.retryDelayMs));
    }
  }

  handler.warn(`Degrading gracefully with fallback value after ${attempts} attempts`);

  return {
    value: fallbackValue,
    degraded: true,
    errors,
  };
}

/**
 * Execute multiple operations and collect results
 */
export async function executeWithPartialResults<T>(
  operations: (() => T | Promise<T>)[],
  config: Partial<DegradationConfig> = {}
): Promise<{
  results: (T | null)[];
  successCount: number;
  errors: TrackerError[];
}> {
  const results: (T | null)[] = [];
  const allErrors: TrackerError[] = [];
  let successCount = 0;

  for (const operation of operations) {
    const { value, errors, degraded } = await withGracefulDegradation(
      operation,
      null as T | null,
      config
    );

    results.push(value);
    allErrors.push(...errors);

    if (!degraded && value !== null) {
      successCount++;
    }
  }

  return {
    results,
    successCount,
    errors: allErrors,
  };
}

// Export default handler for convenience
export default getErrorHandler;
