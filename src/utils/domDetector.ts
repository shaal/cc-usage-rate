/**
 * DOM Element Detector - Identifies and locates usage statistics sections
 *
 * This module provides robust selectors to find session and weekly usage
 * containers, timer elements, and percentage displays on the Claude.ai
 * usage settings page.
 *
 * Updated to match Claude.ai's actual page structure (January 2026):
 * - Session: "Current session" with "Resets in X hr Y min" and "XX% used"
 * - Weekly: "All models" with "Resets Thu 8:00 AM" and "XX% used"
 *
 * Includes comprehensive error handling for:
 * - Page not fully loaded
 * - Missing DOM elements
 * - Unexpected page structure changes
 */

import {
  getErrorHandler,
  ErrorCodes,

  isElementInDOM,
  validatePageState,
  type TrackerError,
} from './errorHandler';

import {
  getDOMCache,
  type DOMQueryCache,
} from './performanceUtils';

/**
 * Result of DOM element detection
 */
export interface DOMDetectionResult {
  /** Container element for session usage section */
  sessionContainer: HTMLElement | null;
  /** Container element for weekly usage section */
  weeklyContainer: HTMLElement | null;
  /** Element displaying session usage percentage */
  sessionPercentage: HTMLElement | null;
  /** Element displaying session timer/countdown */
  sessionTimer: HTMLElement | null;
  /** Element displaying weekly usage percentage */
  weeklyPercentage: HTMLElement | null;
  /** Element displaying weekly timer/reset time */
  weeklyTimer: HTMLElement | null;
  /** Flag indicating if detection was successful */
  isValid: boolean;
  /** Any errors encountered during detection */
  errors: TrackerError[];
  /** Whether detection was degraded (partial results) */
  degraded: boolean;
}

/**
 * Selector configuration for Claude.ai usage page elements
 * These selectors are based on the structure of the Claude.ai usage page
 * and may need to be updated if the page structure changes.
 */
export interface SelectorConfig {
  /** Selectors to try for session usage container */
  sessionContainerSelectors: string[];
  /** Selectors to try for weekly usage container */
  weeklyContainerSelectors: string[];
  /** Text patterns to identify session section */
  sessionTextPatterns: RegExp[];
  /** Text patterns to identify weekly section */
  weeklyTextPatterns: RegExp[];
  /** Patterns to identify percentage displays */
  percentagePatterns: RegExp[];
  /** Patterns to identify timer displays */
  timerPatterns: RegExp[];
}

/**
 * Default selector configuration for Claude.ai usage page
 */
const DEFAULT_SELECTOR_CONFIG: SelectorConfig = {
  sessionContainerSelectors: [
    '[data-testid="session-usage"]',
    '[data-testid="current-session"]',
    '.session-usage-container',
    '[class*="session"]',
    '[class*="Session"]',
  ],
  weeklyContainerSelectors: [
    '[data-testid="weekly-usage"]',
    '[data-testid="week-usage"]',
    '.weekly-usage-container',
    '[class*="weekly"]',
    '[class*="Weekly"]',
  ],
  sessionTextPatterns: [
    /current\s*session/i,
    /resets?\s+in\s+\d/i,
  ],
  weeklyTextPatterns: [
    /all\s*models/i,
    /resets?\s+(mon|tue|wed|thu|fri|sat|sun)/i,
  ],
  percentagePatterns: [
    /\d+%\s*used/i,
    /\d+(\.\d+)?%/,
  ],
  timerPatterns: [
    /resets?\s+in\s+\d+\s*(hr|hour|min|minute)/i,
    /resets?\s+(mon|tue|wed|thu|fri|sat|sun)/i,
    /\d+\s*(hr|hour|min|minute)/i,
  ],
};

/**
 * Logs a debug message with the extension prefix
 */
function debugLog(message: string, ...args: unknown[]): void {
  const handler = getErrorHandler();
  handler.debug(message, args.length > 0 ? { details: args } : undefined);
}

/**
 * Logs a warning message with the extension prefix
 */
function warnLog(message: string, ...args: unknown[]): void {
  const handler = getErrorHandler();
  handler.warn(message, args.length > 0 ? { details: args } : undefined);
}

/**
 * Logs an error message with the extension prefix
 */

/**
 * Get the shared DOM cache instance for detector operations
 * Uses a shorter TTL for detection since the page may update frequently
 */
function getDetectorCache(): DOMQueryCache {
  return getDOMCache({ maxAge: 500, maxEntries: 50 });
}

/**
 * Find the row container element that contains both timer and percentage
 * Claude.ai uses flex-row containers with class pattern: "w-full flex flex-row"
 *
 * Performance optimization: Uses cached DOM queries to avoid redundant querySelectorAll calls
 */
function findUsageRowByText(labelPattern: RegExp, errors: TrackerError[]): HTMLElement | null {
  const handler = getErrorHandler();
  const cache = getDetectorCache();

  // Check if document is available
  if (typeof document === 'undefined' || !document.body) {
    const error = handler.createError(
      ErrorCodes.DOCUMENT_NOT_AVAILABLE,
      'Document or body not available for DOM queries',
      'page-load',
      'error'
    );
    errors.push(error);
    handler.logError(error);
    return null;
  }

  try {
    // Use cached query for all divs - this is a major performance win
    // as we may call this function multiple times in a single detection cycle
    const allDivs = cache.querySelectorAll<HTMLElement>('div');

    if (allDivs.length === 0) {
      const error = handler.createError(
        ErrorCodes.ELEMENT_NOT_FOUND,
        'No div elements found on page - page may not be fully loaded',
        'page-structure',
        'warning',
        { pattern: labelPattern.toString() }
      );
      errors.push(error);
      handler.logError(error);
      return null;
    }

    for (const div of allDivs) {
      const text = div.textContent || '';
      const classList = div.className || '';

      // Check if this div matches our label pattern AND contains percentage data
      if (labelPattern.test(text) && /\d+%/.test(text)) {
        // Prefer flex-row containers (Claude.ai's actual structure)
        if (classList.includes('flex') && classList.includes('flex-row')) {
          debugLog(`Found usage row via flex-row pattern: "${text.slice(0, 60)}..."`);
          return div;
        }
      }
    }

    // Fallback: find any container with the pattern (reuse cached results)
    for (const div of allDivs) {
      const text = div.textContent || '';
      if (labelPattern.test(text) && /\d+%/.test(text) && text.length < 200) {
        debugLog(`Found usage row via fallback: "${text.slice(0, 60)}..."`);
        return div;
      }
    }

    // Element not found - this may indicate page structure change
    debugLog(`No usage row found for pattern: ${labelPattern.toString()}`);
    return null;
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.ELEMENT_NOT_FOUND,
      `Error searching for usage row: ${e instanceof Error ? e.message : String(e)}`,
      'dom-element',
      'error',
      { pattern: labelPattern.toString() },
      e instanceof Error ? e : new Error(String(e))
    );
    errors.push(error);
    handler.logError(error);
    return null;
  }
}

/**
 * Find the percentage element within a container
 * Looks for elements with text like "44% used" or just "44%"
 */
function findPercentageElement(container: HTMLElement, errors: TrackerError[]): HTMLElement | null {
  const handler = getErrorHandler();

  if (!container || !isElementInDOM(container)) {
    const error = handler.createError(
      ErrorCodes.ELEMENT_REMOVED,
      'Container element is null or has been removed from DOM',
      'dom-element',
      'warning'
    );
    errors.push(error);
    handler.logError(error);
    return null;
  }

  try {
    // Look for P elements with percentage text (Claude.ai uses P tags)
    const paragraphs = container.querySelectorAll<HTMLElement>('p, span, div');

    for (const el of paragraphs) {
      const text = el.textContent?.trim() || '';

      // Match "XX% used" pattern (Claude.ai's format)
      if (/^\d+%\s*used$/i.test(text)) {
        debugLog(`Found percentage element: "${text}"`);
        return el;
      }
    }

    // Fallback: look for any element with just percentage
    for (const el of paragraphs) {
      const text = el.textContent?.trim() || '';
      if (/^\d+(\.\d+)?%$/.test(text)) {
        debugLog(`Found percentage element (fallback): "${text}"`);
        return el;
      }
    }

    // Not found - log but don't add to errors (expected in some cases)
    debugLog('No percentage element found in container');
    return null;
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.MISSING_PERCENTAGE,
      `Error finding percentage element: ${e instanceof Error ? e.message : String(e)}`,
      'dom-element',
      'warning',
      undefined,
      e instanceof Error ? e : new Error(String(e))
    );
    errors.push(error);
    handler.logError(error);
    return null;
  }
}

/**
 * Find the timer element within a container
 * Looks for elements with text like "Resets in 1 hr 44 min" or "Resets Thu 8:00 AM"
 */
function findTimerElement(container: HTMLElement, errors: TrackerError[]): HTMLElement | null {
  const handler = getErrorHandler();

  if (!container || !isElementInDOM(container)) {
    const error = handler.createError(
      ErrorCodes.ELEMENT_REMOVED,
      'Container element is null or has been removed from DOM',
      'dom-element',
      'warning'
    );
    errors.push(error);
    handler.logError(error);
    return null;
  }

  try {
    const paragraphs = container.querySelectorAll<HTMLElement>('p, span, div');

    for (const el of paragraphs) {
      const text = el.textContent?.trim() || '';

      // Match "Resets in X hr Y min" pattern (session timer)
      if (/^resets?\s+in\s+\d+/i.test(text)) {
        debugLog(`Found timer element (relative): "${text}"`);
        return el;
      }

      // Match "Resets Thu 8:00 AM" pattern (weekly reset)
      if (/^resets?\s+(mon|tue|wed|thu|fri|sat|sun)/i.test(text)) {
        debugLog(`Found timer element (absolute): "${text}"`);
        return el;
      }
    }

    // Not found - log but don't add to errors (expected in some cases)
    debugLog('No timer element found in container');
    return null;
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.MISSING_TIMER,
      `Error finding timer element: ${e instanceof Error ? e.message : String(e)}`,
      'dom-element',
      'warning',
      undefined,
      e instanceof Error ? e : new Error(String(e))
    );
    errors.push(error);
    handler.logError(error);
    return null;
  }
}

/**
 * Detect usage section containers using the actual Claude.ai page structure
 * @param errors Array to collect errors
 * @param silent If true, suppress warning logs (useful during retry loops)
 */
function detectUsageSections(errors: TrackerError[], silent: boolean = false): {
  sessionContainer: HTMLElement | null;
  weeklyContainer: HTMLElement | null;
} {
  const handler = getErrorHandler();
  let sessionContainer: HTMLElement | null = null;
  let weeklyContainer: HTMLElement | null = null;

  // Check page state first
  const pageState = validatePageState();
  if (!pageState.isReady) {
    const error = handler.createError(
      ErrorCodes.PAGE_NOT_READY,
      `Page not fully loaded. State: ${pageState.documentState}`,
      'page-load',
      'warning',
      { documentState: pageState.documentState }
    );
    errors.push(error);
    handler.logError(error);
    // Continue anyway - might still find elements
  }

  if (!pageState.isUsagePage) {
    const error = handler.createError(
      ErrorCodes.WRONG_PAGE,
      'Not on the Claude.ai usage settings page',
      'page-load',
      'info'
    );
    errors.push(error);
    // Don't log as error - this is expected behavior
  }

  try {
    // Strategy 1: Find session row by "Current session" + "Resets in" pattern
    sessionContainer = findUsageRowByText(/current\s*session/i, errors);

    // Strategy 2: Find weekly row by "All models" + "Resets [day]" pattern
    weeklyContainer = findUsageRowByText(/all\s*models/i, errors);

    // Fallback: Try finding by "Resets in" (session) vs "Resets [day]" (weekly)
    // Use cached query to avoid redundant DOM traversal
    const cache = getDetectorCache();
    const allDivs = cache.querySelectorAll<HTMLElement>('div');

    if (!sessionContainer) {
      // Look for container with relative time (session uses "Resets in X hr Y min")
      for (const div of allDivs) {
        const text = div.textContent || '';
        if (/resets?\s+in\s+\d+\s*(hr|min)/i.test(text) && /\d+%/.test(text)) {
          if (div.className.includes('flex-row') || text.length < 200) {
            sessionContainer = div;
            debugLog('Found session container via "Resets in" pattern');
            break;
          }
        }
      }
    }

    if (!weeklyContainer) {
      // Look for container with absolute time (weekly uses "Resets Thu 8:00 AM")
      for (const div of allDivs) {
        const text = div.textContent || '';
        // Match day of week pattern for weekly reset
        if (/resets?\s+(mon|tue|wed|thu|fri|sat|sun)/i.test(text) && /\d+%/.test(text)) {
          if (div.className.includes('flex-row') || text.length < 200) {
            weeklyContainer = div;
            debugLog('Found weekly container via "Resets [day]" pattern');
            break;
          }
        }
      }
    }

    // Log if both containers are missing - may indicate page structure change
    // Only log if not in silent mode (to avoid spam during retry loops)
    if (!sessionContainer && !weeklyContainer && !silent) {
      const error = handler.createError(
        ErrorCodes.STRUCTURE_CHANGED,
        'Neither session nor weekly usage containers found - page structure may have changed',
        'page-structure',
        'warning'
      );
      errors.push(error);
      handler.logError(error);
    }
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.STRUCTURE_CHANGED,
      `Error detecting usage sections: ${e instanceof Error ? e.message : String(e)}`,
      'page-structure',
      'error',
      undefined,
      e instanceof Error ? e : new Error(String(e))
    );
    errors.push(error);
    handler.logError(error);
  }

  return { sessionContainer, weeklyContainer };
}

/**
 * Invalidate the DOM cache - call when you know the DOM has changed
 * This is useful after mutations or before a fresh detection cycle
 */
export function invalidateDOMCache(): void {
  getDetectorCache().invalidate();
}

/**
 * Options for detecting usage elements
 */
export interface DetectUsageElementsOptions {
  /** Custom selector configuration */
  config?: Partial<SelectorConfig>;
  /** If true, suppress warning logs (useful during retry loops) */
  silent?: boolean;
}

/**
 * Main detection function - identifies and locates all usage statistics elements
 *
 * @param options Optional detection options (config and silent mode)
 * @returns DOMDetectionResult containing all detected elements
 */
export function detectUsageElements(options?: DetectUsageElementsOptions): DOMDetectionResult {
  const { silent = false } = options || {};
  const errors: TrackerError[] = [];
  const handler = getErrorHandler();

  // Invalidate cache at the start of each detection cycle
  // to ensure we get fresh results when explicitly detecting
  invalidateDOMCache();

  const result: DOMDetectionResult = {
    sessionContainer: null,
    weeklyContainer: null,
    sessionPercentage: null,
    sessionTimer: null,
    weeklyPercentage: null,
    weeklyTimer: null,
    isValid: false,
    errors: [],
    degraded: false,
  };

  debugLog('Starting DOM element detection...');

  try {
    // Detect main usage sections using new strategy
    const { sessionContainer, weeklyContainer } = detectUsageSections(errors, silent);
    result.sessionContainer = sessionContainer;
    result.weeklyContainer = weeklyContainer;

    // Find percentage and timer elements within session container
    if (sessionContainer) {
      debugLog('Session container found, searching for child elements...');
      result.sessionPercentage = findPercentageElement(sessionContainer, errors);
      result.sessionTimer = findTimerElement(sessionContainer, errors);
    } else {
      debugLog('No session container found');
    }

    // Find percentage and timer elements within weekly container
    if (weeklyContainer) {
      debugLog('Weekly container found, searching for child elements...');
      result.weeklyPercentage = findPercentageElement(weeklyContainer, errors);
      result.weeklyTimer = findTimerElement(weeklyContainer, errors);
    } else {
      debugLog('No weekly container found');
    }

    // Determine if detection was successful - require at least one percentage element
    result.isValid = !!(
      result.sessionPercentage ||
      result.weeklyPercentage
    );

    // Determine if results are degraded (partial success)
    const hasSession = !!(result.sessionPercentage && result.sessionTimer);
    const hasWeekly = !!(result.weeklyPercentage && result.weeklyTimer);
    result.degraded = result.isValid && (!hasSession || !hasWeekly);

    if (result.isValid) {
      debugLog('DOM detection completed successfully');
      debugLog('Detection results:', {
        sessionContainer: !!result.sessionContainer,
        weeklyContainer: !!result.weeklyContainer,
        sessionPercentage: result.sessionPercentage?.textContent?.trim(),
        sessionTimer: result.sessionTimer?.textContent?.trim(),
        weeklyPercentage: result.weeklyPercentage?.textContent?.trim(),
        weeklyTimer: result.weeklyTimer?.textContent?.trim(),
        degraded: result.degraded,
        errorCount: errors.length,
      });
    } else if (!silent) {
      // Only warn if not in silent mode (to avoid spam during retry loops)
      warnLog('DOM detection failed - no usage elements found');
    }
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.STRUCTURE_CHANGED,
      `Unexpected error during DOM detection: ${e instanceof Error ? e.message : String(e)}`,
      'dom-element',
      'error',
      undefined,
      e instanceof Error ? e : new Error(String(e))
    );
    errors.push(error);
    handler.logError(error);
  }

  // Attach collected errors to result
  result.errors = errors;

  return result;
}

/**
 * Wait for usage elements to appear in the DOM
 * Useful for dynamically loaded content
 *
 * @param timeout Maximum time to wait in milliseconds
 * @param pollInterval How often to check for elements
 * @returns Promise resolving to DOMDetectionResult
 */
export async function waitForUsageElements(
  timeout: number = 10000,
  pollInterval: number = 500
): Promise<DOMDetectionResult> {
  const handler = getErrorHandler();
  const startTime = Date.now();

  return new Promise((resolve) => {
    const checkElements = () => {
      try {
        const elapsed = Date.now() - startTime;
        const isLastAttempt = elapsed + pollInterval >= timeout;

        // Use silent mode during retries, only log on final attempt
        const result = detectUsageElements({ silent: !isLastAttempt });

        if (result.isValid) {
          debugLog('Found usage elements after waiting');
          resolve(result);
          return;
        }

        if (elapsed >= timeout) {
          // Final attempt failed - log the timeout
          const error = handler.createError(
            ErrorCodes.PAGE_LOAD_TIMEOUT,
            `Timeout waiting for usage elements after ${timeout}ms`,
            'page-load',
            'warning',
            { elapsed, timeout }
          );
          handler.logError(error);
          result.errors.push(error);
          resolve(result);
          return;
        }

        setTimeout(checkElements, pollInterval);
      } catch (e) {
        // In case of unexpected error, return empty result with error
        const error = handler.createError(
          ErrorCodes.STRUCTURE_CHANGED,
          `Unexpected error while waiting for elements: ${e instanceof Error ? e.message : String(e)}`,
          'dom-element',
          'error',
          undefined,
          e instanceof Error ? e : new Error(String(e))
        );
        handler.logError(error);

        resolve({
          sessionContainer: null,
          weeklyContainer: null,
          sessionPercentage: null,
          sessionTimer: null,
          weeklyPercentage: null,
          weeklyTimer: null,
          isValid: false,
          errors: [error],
          degraded: false,
        });
      }
    };

    checkElements();
  });
}

/**
 * Extract text content from detected elements
 */
export interface ExtractedUsageData {
  sessionPercentageText: string | null;
  sessionTimerText: string | null;
  weeklyPercentageText: string | null;
  weeklyTimerText: string | null;
  /** Any errors encountered during text extraction */
  extractionErrors: TrackerError[];
}

/**
 * Extract and normalize text content from all detected elements
 *
 * @param detection The detection result to extract from
 * @returns Extracted text content
 */
export function extractTextFromElements(detection: DOMDetectionResult): ExtractedUsageData {
  const handler = getErrorHandler();
  const extractionErrors: TrackerError[] = [];

  // Helper to safely extract text from an element
  const safeGetText = (element: HTMLElement | null, fieldName: string): string | null => {
    if (!element) return null;

    try {
      // Check if element is still in DOM
      if (!isElementInDOM(element)) {
        const error = handler.createError(
          ErrorCodes.ELEMENT_REMOVED,
          `Element for ${fieldName} was removed from DOM`,
          'dom-element',
          'warning',
          { field: fieldName }
        );
        extractionErrors.push(error);
        handler.logError(error);
        return null;
      }

      return element.textContent ?? null;
    } catch (e) {
      const error = handler.createError(
        ErrorCodes.TEXT_EXTRACTION_FAILED,
        `Failed to extract text for ${fieldName}: ${e instanceof Error ? e.message : String(e)}`,
        'dom-element',
        'warning',
        { field: fieldName },
        e instanceof Error ? e : new Error(String(e))
      );
      extractionErrors.push(error);
      handler.logError(error);
      return null;
    }
  };

  // Helper to extract just the percentage number from "XX% used" format
  const extractPercentage = (text: string | null, fieldName: string): string | null => {
    if (!text) return null;
    try {
      const match = text.match(/(\d+(?:\.\d+)?)\s*%/);
      if (!match) {
        // Just log at debug level - may be expected in some cases
        debugLog(`No percentage found in text for ${fieldName}: "${text}"`);
        return text.trim();
      }
      return `${match[1]}%`;
    } catch (e) {
      const error = handler.createError(
        ErrorCodes.PERCENTAGE_PARSE_FAILED,
        `Error parsing percentage for ${fieldName}`,
        'parsing',
        'warning',
        { field: fieldName, text },
        e instanceof Error ? e : new Error(String(e))
      );
      extractionErrors.push(error);
      handler.logError(error);
      return null;
    }
  };

  // Helper to extract timer text, removing "Resets " prefix if present
  const extractTimer = (text: string | null): string | null => {
    if (!text) return null;
    // Keep the full text for parsing - the parser handles "Resets in X hr Y min"
    return text.trim();
  };

  return {
    sessionPercentageText: extractPercentage(
      safeGetText(detection.sessionPercentage, 'sessionPercentage'),
      'sessionPercentage'
    ),
    sessionTimerText: extractTimer(
      safeGetText(detection.sessionTimer, 'sessionTimer')
    ),
    weeklyPercentageText: extractPercentage(
      safeGetText(detection.weeklyPercentage, 'weeklyPercentage'),
      'weeklyPercentage'
    ),
    weeklyTimerText: extractTimer(
      safeGetText(detection.weeklyTimer, 'weeklyTimer')
    ),
    extractionErrors,
  };
}

/**
 * Check if the current page is the Claude.ai usage settings page
 */
export function isUsagePage(): boolean {
  try {
    return window.location.href.includes('claude.ai/settings/usage');
  } catch {
    // Window or location may not be available
    return false;
  }
}

/**
 * Mark detected elements with data attributes for easier identification
 * Useful for styling and debugging
 *
 * @param detection The detection result to mark
 */
export function markDetectedElements(detection: DOMDetectionResult): void {
  const handler = getErrorHandler();

  const safeSetAttr = (element: HTMLElement | null, attr: string, value: string): void => {
    if (!element) return;

    try {
      if (isElementInDOM(element)) {
        element.setAttribute(attr, value);
      }
    } catch (e) {
      handler.warn(`Failed to set attribute ${attr} on element`, {
        error: e instanceof Error ? e.message : String(e),
      });
    }
  };

  safeSetAttr(detection.sessionContainer, 'data-claude-usage-section', 'session');
  safeSetAttr(detection.weeklyContainer, 'data-claude-usage-section', 'weekly');
  safeSetAttr(detection.sessionPercentage, 'data-claude-usage-type', 'session-percentage');
  safeSetAttr(detection.sessionTimer, 'data-claude-usage-type', 'session-timer');
  safeSetAttr(detection.weeklyPercentage, 'data-claude-usage-type', 'weekly-percentage');
  safeSetAttr(detection.weeklyTimer, 'data-claude-usage-type', 'weekly-timer');

  debugLog('Marked detected elements with data attributes');
}

// Export configuration for testing and customization
export { DEFAULT_SELECTOR_CONFIG };
