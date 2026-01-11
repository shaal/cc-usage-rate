/**
 * Session Tracker - Main integration module for Claude Usage Tracker
 *
 * This module combines session time calculations, usage data extraction,
 * and indicator display to create the complete session usage tracking feature.
 * It wires up the data flow from DOM extraction to visual display.
 *
 * Includes comprehensive error handling for:
 * - Page not fully loaded
 * - Missing DOM elements
 * - Unexpected page structure changes
 * - Indicator rendering failures
 */

import {
  detectUsageElements,
  waitForUsageElements,
  extractTextFromElements,
  markDetectedElements,
  isUsagePage,
  type DOMDetectionResult,
  type ExtractedUsageData,
} from '../utils/domDetector';

import {
  extractAndAnalyzeUsage,
  type UsageAnalysisResult,
} from '../utils/usageDataExtractor';

import {
  createAutoColorIndicator,
  updateCircularIndicator,
} from '../components/CircularIndicator';

import {
  generateSessionTooltipContent,
  generateWeeklyTooltipContent,
} from '../utils/tooltipManager';

import {
  getErrorHandler,
  ErrorCodes,
  isElementInDOM,
  type TrackerError,
} from '../utils/errorHandler';

import {
  DebouncedMutationObserver,
  getBatchUpdater,
  resetPerformanceUtils,
} from '../utils/performanceUtils';

import {
  invalidateDOMCache,
} from '../utils/domDetector';


/**
 * Configuration options for SessionTracker
 */
export interface SessionTrackerConfig {
  /** Whether to auto-update on DOM changes (default: true) */
  autoUpdate: boolean;
  /** Update interval in milliseconds for polling (default: 30000 = 30s) */
  updateInterval: number;
  /** Size of the circular indicator in pixels (default: 48) */
  indicatorSize: number;
  /** Whether to show session indicator (default: true) */
  showSessionIndicator: boolean;
  /** Whether to show weekly indicator (default: true) */
  showWeeklyIndicator: boolean;
  /** Whether to inject CSS styles (default: true) */
  injectStyles: boolean;
  /** Whether to log debug information (default: true) */
  debug: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: SessionTrackerConfig = {
  autoUpdate: true,
  updateInterval: 30000,
  indicatorSize: 48,
  showSessionIndicator: true,
  showWeeklyIndicator: true,
  injectStyles: true,
  debug: true,
};

/**
 * Tracking state containing current detection and analysis
 */
export interface TrackerState {
  /** Whether the tracker has been initialized */
  initialized: boolean;
  /** Current DOM detection result */
  detection: DOMDetectionResult | null;
  /** Current usage analysis result */
  analysis: UsageAnalysisResult | null;
  /** Extracted raw data from DOM */
  extractedData: ExtractedUsageData | null;
  /** Session indicator element */
  sessionIndicator: HTMLDivElement | null;
  /** Weekly indicator element */
  weeklyIndicator: HTMLDivElement | null;
  /** Last update timestamp */
  lastUpdate: Date | null;
  /** Any errors encountered */
  errors: string[];
}

/**
 * CSS styles for the session tracker
 *
 * These styles ensure proper positioning and alignment of circular indicators
 * adjacent to the session and weekly usage statistics on Claude.ai.
 */
const TRACKER_STYLES = `
/* Session Tracker Indicator Wrapper - positioned adjacent to usage stats */
.claude-usage-tracker-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
  vertical-align: middle;
  flex-shrink: 0;
}

/* Session indicator specific positioning */
.claude-usage-session-indicator {
  position: relative;
}

/* Weekly indicator specific positioning */
.claude-usage-weekly-indicator {
  position: relative;
}

/* Status label below indicator */
.claude-usage-status-label {
  font-size: 10px;
  text-align: center;
  margin-top: 4px;
  opacity: 0.8;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  white-space: nowrap;
}

/* Indicator container in section - proper inline alignment */
.claude-usage-indicator-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  gap: 8px;
  flex-shrink: 0;
  vertical-align: middle;
}

/* Ensure indicator container plays nicely with flex layouts */
.claude-usage-indicator-container[data-indicator-type="session"],
.claude-usage-indicator-container[data-indicator-type="weekly"] {
  margin-left: 12px;
  margin-right: 4px;
}

/* Animation for indicator updates */
@keyframes claude-usage-indicator-update {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.claude-usage-indicator-updating {
  animation: claude-usage-indicator-update 0.3s ease-out;
}

/* Ensure indicators are visible and properly sized */
.claude-usage-circular-indicator {
  min-width: 48px;
  min-height: 48px;
}
`;

/**
 * SessionTracker - Main class for tracking and displaying usage
 */
export class SessionTracker {
  private config: SessionTrackerConfig;
  private state: TrackerState;
  private observer: DebouncedMutationObserver | null = null;
  private updateIntervalId: number | null = null;
  private styleElement: HTMLStyleElement | null = null;

  constructor(config: Partial<SessionTrackerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = {
      initialized: false,
      detection: null,
      analysis: null,
      extractedData: null,
      sessionIndicator: null,
      weeklyIndicator: null,
      lastUpdate: null,
      errors: [],
    };
  }

  /**
   * Log a debug message
   */
  private log(message: string, ...args: unknown[]): void {
    if (this.config.debug) {
      const handler = getErrorHandler();
      handler.debug(message, args.length > 0 ? { details: args } : undefined);
    }
  }

  /**
   * Log a warning message
   */
  private warn(message: string, ...args: unknown[]): void {
    const handler = getErrorHandler();
    handler.warn(message, args.length > 0 ? { details: args } : undefined);
  }

  /**
   * Log an error and add to state errors
   */
  private logError(error: TrackerError): void {
    const handler = getErrorHandler();
    handler.logError(error);
    this.state.errors.push(error.message);
  }

  /**
   * Inject CSS styles into the page
   */
  private injectStyles(): void {
    const handler = getErrorHandler();

    if (!this.config.injectStyles || this.styleElement) {
      return;
    }

    try {
      if (!document.head) {
        const error = handler.createError(
          ErrorCodes.STYLE_INJECT_FAILED,
          'Cannot inject styles: document.head is not available',
          'rendering',
          'warning'
        );
        this.logError(error);
        return;
      }

      this.styleElement = document.createElement('style');
      this.styleElement.id = 'claude-usage-tracker-styles';
      this.styleElement.textContent = TRACKER_STYLES;
      document.head.appendChild(this.styleElement);
      this.log('Injected tracker styles');
    } catch (e) {
      const error = handler.createError(
        ErrorCodes.STYLE_INJECT_FAILED,
        `Failed to inject styles: ${e instanceof Error ? e.message : String(e)}`,
        'rendering',
        'error',
        undefined,
        e instanceof Error ? e : new Error(String(e))
      );
      this.logError(error);
    }
  }

  /**
   * Remove injected styles
   */
  private removeStyles(): void {
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
  }

  /**
   * Create the session efficiency indicator
   */
  private createSessionIndicator(): HTMLDivElement | null {
    const handler = getErrorHandler();
    const { analysis } = this.state;

    if (!analysis?.sessionAnalysis) {
      return null;
    }

    try {
      const { expectedUsage } = analysis.sessionAnalysis;
      const delta = expectedUsage.usageDelta ?? 0;
      const actualUsage = expectedUsage.actualUsagePercentage ?? 0;
      const expectedUsagePercent = expectedUsage.expectedUsagePercentage;

      // Generate rich tooltip content for enhanced hover experience
      const tooltipContent = generateSessionTooltipContent(
        actualUsage,
        expectedUsagePercent,
        delta,
        analysis.summary.sessionStatus
      );

      const indicator = createAutoColorIndicator(delta, {
        size: this.config.indicatorSize,
        tooltipContent,
        className: 'claude-usage-session-indicator claude-usage-circular-indicator--animated',
      });

      indicator.setAttribute('data-tracker-type', 'session');
      return indicator;
    } catch (e) {
      const error = handler.createError(
        ErrorCodes.INDICATOR_CREATE_FAILED,
        `Failed to create session indicator: ${e instanceof Error ? e.message : String(e)}`,
        'rendering',
        'error',
        undefined,
        e instanceof Error ? e : new Error(String(e))
      );
      this.logError(error);
      return null;
    }
  }

  /**
   * Create the weekly efficiency indicator
   */
  private createWeeklyIndicator(): HTMLDivElement | null {
    const handler = getErrorHandler();
    const { analysis } = this.state;

    if (!analysis?.weeklyEfficiency) {
      return null;
    }

    try {
      const { weeklyEfficiency, weeklyTime } = analysis;
      const delta = weeklyEfficiency.efficiencyDelta;

      // Generate rich tooltip content for enhanced hover experience
      const tooltipContent = generateWeeklyTooltipContent(
        weeklyEfficiency.actualUsagePercentage,
        weeklyEfficiency.expectedUsagePercentage,
        delta,
        weeklyTime?.remainingFormatted ?? null,
        analysis.summary.weeklyStatus
      );

      const indicator = createAutoColorIndicator(delta, {
        size: this.config.indicatorSize,
        tooltipContent,
        className: 'claude-usage-weekly-indicator claude-usage-circular-indicator--animated',
      });

      indicator.setAttribute('data-tracker-type', 'weekly');
      return indicator;
    } catch (e) {
      const error = handler.createError(
        ErrorCodes.INDICATOR_CREATE_FAILED,
        `Failed to create weekly indicator: ${e instanceof Error ? e.message : String(e)}`,
        'rendering',
        'error',
        undefined,
        e instanceof Error ? e : new Error(String(e))
      );
      this.logError(error);
      return null;
    }
  }

  /**
   * Create a wrapper element for the indicator
   */
  private createIndicatorWrapper(indicator: HTMLDivElement, label: string): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'claude-usage-tracker-wrapper';
    wrapper.setAttribute('data-claude-tracker', 'true');

    // Create label
    const labelEl = document.createElement('div');
    labelEl.className = 'claude-usage-status-label';
    labelEl.textContent = label;

    // Add indicator and label to wrapper
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.appendChild(indicator);
    container.appendChild(labelEl);

    wrapper.appendChild(container);
    return wrapper;
  }

  /**
   * Insert indicators into the detected containers
   */
  private insertIndicators(): void {
    const { detection, analysis } = this.state;
    if (!detection || !analysis) {
      return;
    }

    // Remove existing indicators first
    this.removeIndicators();

    // Create and insert session indicator
    if (this.config.showSessionIndicator && detection.sessionContainer && analysis.sessionAnalysis) {
      this.state.sessionIndicator = this.createSessionIndicator();
      if (this.state.sessionIndicator) {
        const wrapper = this.createIndicatorWrapper(this.state.sessionIndicator, 'Efficiency');

        // Try to find a good insertion point in the session container
        const insertionPoint = this.findInsertionPoint(detection.sessionContainer, 'session');
        if (insertionPoint) {
          insertionPoint.appendChild(wrapper);
          this.log('Inserted session indicator');
        }
      }
    }

    // Create and insert weekly indicator
    if (this.config.showWeeklyIndicator && detection.weeklyContainer && analysis.weeklyEfficiency) {
      this.state.weeklyIndicator = this.createWeeklyIndicator();
      if (this.state.weeklyIndicator) {
        const wrapper = this.createIndicatorWrapper(this.state.weeklyIndicator, 'Efficiency');

        // Try to find a good insertion point in the weekly container
        const insertionPoint = this.findInsertionPoint(detection.weeklyContainer, 'weekly');
        if (insertionPoint) {
          insertionPoint.appendChild(wrapper);
          this.log('Inserted weekly indicator');
        }
      }
    }
  }

  /**
   * Find a suitable insertion point for the indicator within a container
   *
   * The injection strategy is designed to place indicators adjacent to the
   * session and weekly usage statistics, with proper alignment.
   *
   * Claude.ai usage page structure (observed January 2026):
   * - Session: "Current session" row with "XX% used" and "Resets in X hr Y min"
   * - Weekly: "All models" row with "XX% used" and "Resets Thu 8:00 AM"
   *
   * The indicators should appear inline with the usage percentage for clean alignment.
   */
  private findInsertionPoint(container: HTMLElement, type: 'session' | 'weekly'): HTMLElement | null {
    // First, check if there's already an indicator container for this type
    const existingContainer = container.querySelector(`.claude-usage-indicator-container[data-indicator-type="${type}"]`);
    if (existingContainer) {
      return existingContainer as HTMLElement;
    }

    // Try to find the percentage element and insert adjacent to it
    const percentageEl = type === 'session'
      ? this.state.detection?.sessionPercentage
      : this.state.detection?.weeklyPercentage;

    if (percentageEl) {
      // Create a container for the indicator
      const indicatorContainer = document.createElement('div');
      indicatorContainer.className = 'claude-usage-indicator-container';
      indicatorContainer.setAttribute('data-indicator-type', type);

      // Style for inline alignment with the percentage element
      indicatorContainer.style.display = 'inline-flex';
      indicatorContainer.style.alignItems = 'center';
      indicatorContainer.style.marginLeft = '12px';
      indicatorContainer.style.verticalAlign = 'middle';

      // Strategy 1: Insert as sibling right after the percentage element
      // This keeps the indicator adjacent to "XX% used" text
      if (percentageEl.parentElement) {
        // Check if percentage element is inside a flex container
        const parentStyle = window.getComputedStyle(percentageEl.parentElement);
        const isFlexContainer = parentStyle.display === 'flex' || parentStyle.display === 'inline-flex';

        if (isFlexContainer) {
          // For flex containers, append the indicator container as a new flex item
          percentageEl.parentElement.appendChild(indicatorContainer);
          this.log(`Injected ${type} indicator into flex container`);
          return indicatorContainer;
        }

        // For non-flex containers, insert after the percentage element
        percentageEl.insertAdjacentElement('afterend', indicatorContainer);
        this.log(`Injected ${type} indicator adjacent to percentage element`);
        return indicatorContainer;
      }

      // Strategy 2: If we can't find the parent, try inserting at container level
      // Look for a suitable spot within the container - prefer the end of the row
      const flexRow = container.querySelector('.flex-row, [class*="flex-row"]');
      if (flexRow) {
        flexRow.appendChild(indicatorContainer);
        this.log(`Injected ${type} indicator into flex row`);
        return indicatorContainer;
      }
    }

    // Fallback: append to the container itself as the last resort
    const indicatorContainer = document.createElement('div');
    indicatorContainer.className = 'claude-usage-indicator-container';
    indicatorContainer.setAttribute('data-indicator-type', type);
    indicatorContainer.style.display = 'inline-flex';
    indicatorContainer.style.alignItems = 'center';
    indicatorContainer.style.marginLeft = '12px';

    container.appendChild(indicatorContainer);
    this.log(`Injected ${type} indicator as fallback (appended to container)`);
    return indicatorContainer;
  }

  /**
   * Remove existing indicators from the page
   *
   * Performance optimized: Batches all removals into a single operation
   * using requestAnimationFrame to minimize reflows.
   */
  private removeIndicators(): void {
    const batchUpdater = getBatchUpdater();

    // Collect all elements to remove first (read phase)
    const trackerWrappers = document.querySelectorAll('[data-claude-tracker="true"]');
    const indicatorContainers = document.querySelectorAll('.claude-usage-indicator-container[data-indicator-type]');
    const orphanedContainers = document.querySelectorAll('.claude-usage-indicator-container');

    // Batch all removals into a single frame (write phase)
    batchUpdater.schedule(() => {
      // Remove all tracker wrappers
      trackerWrappers.forEach(el => el.remove());

      // Remove indicator containers we created
      indicatorContainers.forEach(el => el.remove());

      // Remove any orphaned indicator containers
      orphanedContainers.forEach(el => {
        if (el.children.length === 0) {
          el.remove();
        }
      });
    });

    this.state.sessionIndicator = null;
    this.state.weeklyIndicator = null;
    this.log('Removed existing indicators');
  }

  /**
   * Update existing indicators with new data
   */
  private updateIndicators(): void {
    const handler = getErrorHandler();
    const { analysis, sessionIndicator, weeklyIndicator } = this.state;

    // Update session indicator if it exists and is still in DOM
    if (sessionIndicator && analysis?.sessionAnalysis) {
      try {
        // Check if indicator is still in DOM
        if (!isElementInDOM(sessionIndicator)) {
          this.log('Session indicator removed from DOM, clearing reference');
          this.state.sessionIndicator = null;
        } else {
          const delta = analysis.sessionAnalysis.expectedUsage.usageDelta ?? 0;
          updateCircularIndicator(sessionIndicator, {
            percentage: delta,
          });
          sessionIndicator.classList.add('claude-usage-indicator-updating');
          setTimeout(() => sessionIndicator.classList.remove('claude-usage-indicator-updating'), 300);
        }
      } catch (e) {
        const error = handler.createError(
          ErrorCodes.INDICATOR_UPDATE_FAILED,
          `Failed to update session indicator: ${e instanceof Error ? e.message : String(e)}`,
          'rendering',
          'warning',
          undefined,
          e instanceof Error ? e : new Error(String(e))
        );
        this.logError(error);
        // Clear the reference so we can try to recreate it
        this.state.sessionIndicator = null;
      }
    }

    // Update weekly indicator if it exists and is still in DOM
    if (weeklyIndicator && analysis?.weeklyEfficiency) {
      try {
        // Check if indicator is still in DOM
        if (!isElementInDOM(weeklyIndicator)) {
          this.log('Weekly indicator removed from DOM, clearing reference');
          this.state.weeklyIndicator = null;
        } else {
          const delta = analysis.weeklyEfficiency.efficiencyDelta;
          updateCircularIndicator(weeklyIndicator, {
            percentage: delta,
          });
          weeklyIndicator.classList.add('claude-usage-indicator-updating');
          setTimeout(() => weeklyIndicator.classList.remove('claude-usage-indicator-updating'), 300);
        }
      } catch (e) {
        const error = handler.createError(
          ErrorCodes.INDICATOR_UPDATE_FAILED,
          `Failed to update weekly indicator: ${e instanceof Error ? e.message : String(e)}`,
          'rendering',
          'warning',
          undefined,
          e instanceof Error ? e : new Error(String(e))
        );
        this.logError(error);
        // Clear the reference so we can try to recreate it
        this.state.weeklyIndicator = null;
      }
    }
  }

  /**
   * Refresh detection and analysis from DOM
   */
  public async refresh(): Promise<void> {
    const handler = getErrorHandler();
    this.log('Refreshing usage data...');

    try {
      // Detect DOM elements
      const detection = detectUsageElements();
      this.state.detection = detection;

      // Add any detection errors to state
      if (detection.errors && detection.errors.length > 0) {
        detection.errors.forEach(err => {
          this.state.errors.push(err.message);
        });
      }

      if (!detection.isValid) {
        this.warn('Failed to detect usage elements');
        return;
      }

      // Log if running in degraded mode
      if (detection.degraded) {
        this.log('Running in degraded mode - partial data available');
      }

      // Mark elements for debugging
      try {
        markDetectedElements(detection);
      } catch (e) {
        this.warn(`Failed to mark detected elements: ${e instanceof Error ? e.message : String(e)}`);
      }

      // Extract text from elements
      const extractedData = extractTextFromElements(detection);
      this.state.extractedData = extractedData;
      this.log('Extracted data:', extractedData);

      // Analyze the extracted data
      const analysis = extractAndAnalyzeUsage(extractedData);
      this.state.analysis = analysis;
      this.state.lastUpdate = new Date();

      // Add any extraction/analysis errors to state
      if (analysis.extracted.errors && analysis.extracted.errors.length > 0) {
        analysis.extracted.errors.forEach(err => {
          if (!this.state.errors.includes(err)) {
            this.state.errors.push(err);
          }
        });
      }

      this.log('Analysis complete:', analysis.summary);

      // Update or insert indicators
      if (this.state.sessionIndicator || this.state.weeklyIndicator) {
        this.updateIndicators();
      } else {
        this.insertIndicators();
      }
    } catch (e) {
      const error = handler.createError(
        ErrorCodes.UNKNOWN_ERROR,
        `Unexpected error during refresh: ${e instanceof Error ? e.message : String(e)}`,
        'unknown',
        'error',
        undefined,
        e instanceof Error ? e : new Error(String(e))
      );
      this.logError(error);
    }
  }

  /**
   * Check if a mutation target contains usage-related text patterns
   * This helps detect timer countdown changes and percentage updates
   */
  private isUsageRelatedMutation(target: Node): boolean {
    // Get the text content of the target or its parent
    const text = (target.textContent || '').trim();

    // Patterns that indicate usage-related content
    const usagePatterns = [
      /\d+%\s*used/i,                           // "44% used"
      /resets?\s+in\s+\d+/i,                    // "Resets in 2 hr 45 min"
      /resets?\s+(mon|tue|wed|thu|fri|sat|sun)/i, // "Resets Thu 8:00 AM"
      /current\s*session/i,                     // "Current session"
      /all\s*models/i,                          // "All models"
    ];

    return usagePatterns.some(pattern => pattern.test(text));
  }

  /**
   * Set up MutationObserver to watch for DOM changes
   *
   * This observer watches for:
   * - Timer countdown updates (e.g., "Resets in 2 hr 45 min" -> "Resets in 2 hr 44 min")
   * - Usage percentage changes (e.g., "44% used" -> "45% used")
   * - DOM structure changes that might affect usage sections
   *
   * Performance optimizations:
   * - Uses DebouncedMutationObserver with built-in debouncing (100ms) and maxWait (500ms)
   * - Filters mutations to only process usage-related changes
   * - Observes specific containers when possible instead of entire body
   * - Invalidates DOM cache on relevant mutations
   */
  private setupObserver(): void {
    if (!this.config.autoUpdate || this.observer) {
      return;
    }

    // Create a filter function to only process relevant mutations
    const filterMutations = (mutations: MutationRecord[]): MutationRecord[] => {
      return mutations.filter(mutation => {
        const target = mutation.target as Node;
        if (!target) return false;

        // For characterData mutations, check if the text actually changed
        // and contains usage-related content
        if (mutation.type === 'characterData') {
          const newValue = target.textContent || '';
          const oldValue = mutation.oldValue || '';

          // Skip if text didn't actually change
          if (newValue === oldValue) return false;

          // Check if this is usage-related text (timer/percentage)
          if (this.isUsageRelatedMutation(target)) {
            return true;
          }
          return false;
        }

        // For childList mutations, check the target element
        const targetElement = target as HTMLElement;

        // Skip mutations from our own indicator elements
        if (targetElement.closest?.('[data-claude-tracker="true"]') ||
            targetElement.closest?.('.claude-usage-indicator-container')) {
          return false;
        }

        // Check if mutation is in our detected containers
        const { detection } = this.state;
        if (detection) {
          const isInSessionContainer = detection.sessionContainer?.contains(target);
          const isInWeeklyContainer = detection.weeklyContainer?.contains(target);

          if (isInSessionContainer || isInWeeklyContainer) {
            return true;
          }
        }

        // Check for data attributes we've set on detected elements
        if (targetElement.hasAttribute?.('data-claude-usage-section') ||
            targetElement.hasAttribute?.('data-claude-usage-type')) {
          return true;
        }

        // Also check parent elements for data attributes (for nested text nodes)
        const parentElement = target.parentElement;
        if (parentElement) {
          if (parentElement.hasAttribute?.('data-claude-usage-section') ||
              parentElement.hasAttribute?.('data-claude-usage-type') ||
              parentElement.closest?.('[data-claude-usage-section]') ||
              parentElement.closest?.('[data-claude-usage-type]')) {
            return true;
          }
        }

        // Fallback: Check if the mutation contains usage-related text patterns
        // This helps catch mutations even if detection hasn't happened yet
        if (this.isUsageRelatedMutation(target)) {
          return true;
        }

        return false;
      });
    };

    // Create debounced mutation observer with optimized settings
    this.observer = new DebouncedMutationObserver(
      (mutations) => {
        if (mutations.length > 0) {
          this.log(`MutationObserver triggered refresh (${mutations.length} relevant mutations)`);
          // Invalidate DOM cache since the page has changed
          invalidateDOMCache();
          this.refresh();
        }
      },
      {
        debounceMs: 100,  // Quick initial debounce
        maxWait: 500,     // But don't wait too long
        filter: filterMutations,
      }
    );

    // Observe configuration - optimized for performance
    const config: MutationObserverInit = {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true, // Needed to detect actual text changes
    };

    // Try to observe specific containers if we have them, otherwise observe body
    const { detection } = this.state;
    if (detection?.sessionContainer || detection?.weeklyContainer) {
      // Observe specific containers for better performance
      if (detection.sessionContainer) {
        this.observer.observe(detection.sessionContainer, config);
        this.log('MutationObserver observing session container');
      }
      if (detection.weeklyContainer) {
        this.observer.observe(detection.weeklyContainer, config);
        this.log('MutationObserver observing weekly container');
      }
      // Also observe body with less aggressive settings for structural changes
      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: false, // Don't track text changes at body level
      });
    } else {
      // Fallback to observing entire body
      this.observer.observe(document.body, config);
    }

    this.log('MutationObserver set up with performance-optimized debouncing');
  }

  /**
   * Set up periodic update interval
   */
  private setupUpdateInterval(): void {
    if (!this.config.autoUpdate || this.updateIntervalId) {
      return;
    }

    this.updateIntervalId = window.setInterval(() => {
      this.refresh();
    }, this.config.updateInterval);

    this.log(`Update interval set: ${this.config.updateInterval}ms`);
  }

  /**
   * Initialize the session tracker
   */
  public async initialize(): Promise<boolean> {
    const handler = getErrorHandler();

    if (this.state.initialized) {
      this.warn('SessionTracker already initialized');
      return true;
    }

    this.log('Initializing SessionTracker...');

    try {
      // Check if we're on the correct page
      if (!isUsagePage()) {
        this.log('Not on usage page, skipping initialization');
        return false;
      }

      // Inject styles
      this.injectStyles();

      // Wait for usage elements to appear
      const detection = await waitForUsageElements();
      this.state.detection = detection;

      // Collect any errors from detection
      if (detection.errors && detection.errors.length > 0) {
        detection.errors.forEach(err => {
          this.state.errors.push(err.message);
        });
      }

      if (!detection.isValid) {
        const error = handler.createError(
          ErrorCodes.ELEMENT_NOT_FOUND,
          'Failed to detect usage elements on page during initialization',
          'page-structure',
          'warning'
        );
        this.logError(error);
        return false;
      }

      // Log if running in degraded mode
      if (detection.degraded) {
        this.log('Initializing in degraded mode - partial data available');
      }

      // Mark detected elements
      try {
        markDetectedElements(detection);
      } catch (e) {
        this.warn(`Failed to mark detected elements: ${e instanceof Error ? e.message : String(e)}`);
      }

      // Extract and analyze data
      const extractedData = extractTextFromElements(detection);
      this.state.extractedData = extractedData;

      const analysis = extractAndAnalyzeUsage(extractedData);
      this.state.analysis = analysis;
      this.state.lastUpdate = new Date();

      // Collect any extraction/analysis errors
      if (analysis.extracted.errors && analysis.extracted.errors.length > 0) {
        analysis.extracted.errors.forEach(err => {
          if (!this.state.errors.includes(err)) {
            this.state.errors.push(err);
          }
        });
      }

      this.log('Initial analysis complete:', analysis.summary);

      // Insert indicators
      try {
        this.insertIndicators();
      } catch (e) {
        const error = handler.createError(
          ErrorCodes.INDICATOR_CREATE_FAILED,
          `Failed to insert indicators: ${e instanceof Error ? e.message : String(e)}`,
          'rendering',
          'error',
          undefined,
          e instanceof Error ? e : new Error(String(e))
        );
        this.logError(error);
        // Continue anyway - tracker is partially functional
      }

      // Set up auto-update
      try {
        this.setupObserver();
        this.setupUpdateInterval();
      } catch (e) {
        this.warn(`Failed to set up auto-update: ${e instanceof Error ? e.message : String(e)}`);
        // Continue anyway - manual refresh still works
      }

      this.state.initialized = true;
      this.log('SessionTracker initialized successfully');

      return true;
    } catch (e) {
      const error = handler.createError(
        ErrorCodes.UNKNOWN_ERROR,
        `Unexpected error during initialization: ${e instanceof Error ? e.message : String(e)}`,
        'unknown',
        'critical',
        undefined,
        e instanceof Error ? e : new Error(String(e))
      );
      this.logError(error);
      return false;
    }
  }

  /**
   * Destroy the session tracker and clean up
   */
  public destroy(): void {
    this.log('Destroying SessionTracker...');

    // Stop observer (DebouncedMutationObserver handles cleanup of debounce timers)
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Clear update interval
    if (this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
      this.updateIntervalId = null;
    }

    // Remove indicators
    this.removeIndicators();

    // Remove styles
    this.removeStyles();

    // Reset performance utilities (clears caches, cancels pending operations)
    resetPerformanceUtils();

    // Reset state
    this.state = {
      initialized: false,
      detection: null,
      analysis: null,
      extractedData: null,
      sessionIndicator: null,
      weeklyIndicator: null,
      lastUpdate: null,
      errors: [],
    };

    this.log('SessionTracker destroyed');
  }

  /**
   * Get current state
   */
  public getState(): Readonly<TrackerState> {
    return { ...this.state };
  }

  /**
   * Get current detection result
   */
  public getDetection(): DOMDetectionResult | null {
    return this.state.detection;
  }

  /**
   * Get current analysis result
   */
  public getAnalysis(): UsageAnalysisResult | null {
    return this.state.analysis;
  }

  /**
   * Check if tracker is initialized
   */
  public isInitialized(): boolean {
    return this.state.initialized;
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<SessionTrackerConfig>): void {
    this.config = { ...this.config, ...config };

    // Reapply styles if needed
    if (config.injectStyles !== undefined) {
      if (config.injectStyles) {
        this.injectStyles();
      } else {
        this.removeStyles();
      }
    }

    // Update interval if changed
    if (config.updateInterval !== undefined && this.updateIntervalId) {
      clearInterval(this.updateIntervalId);
      this.updateIntervalId = null;
      this.setupUpdateInterval();
    }
  }
}

// Export singleton instance creator
let trackerInstance: SessionTracker | null = null;

/**
 * Get or create the singleton SessionTracker instance
 */
export function getSessionTracker(config?: Partial<SessionTrackerConfig>): SessionTracker {
  if (!trackerInstance) {
    trackerInstance = new SessionTracker(config);
  }
  return trackerInstance;
}

/**
 * Destroy the singleton instance
 */
export function destroySessionTracker(): void {
  if (trackerInstance) {
    trackerInstance.destroy();
    trackerInstance = null;
  }
}

// Default export
export default SessionTracker;
