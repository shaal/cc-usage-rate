/**
 * Claude Usage Tracker - Content Script Entry Point
 *
 * This content script runs on the claude.ai/settings/usage page and provides
 * visual feedback on usage efficiency through color-coded indicators.
 *
 * Includes comprehensive error handling for:
 * - Page not fully loaded
 * - Missing DOM elements
 * - Invalid time formats
 * - Unexpected page structure changes
 */

import {
  isUsagePage,
  type DOMDetectionResult,
} from '../utils/domDetector';

import {
  type UsageAnalysisResult,
} from '../utils/usageDataExtractor';

import {
  SessionTracker,
  getSessionTracker,
  destroySessionTracker,
  type TrackerState,
} from './sessionTracker';

import {
  getErrorHandler,
  ErrorCodes,
  validatePageState,
} from '../utils/errorHandler';

// Re-export detectUsageElements for external use
export { detectUsageElements } from '../utils/domDetector';

// Re-export usage data extractor functions
export {
  extractUsageData,
  analyzeUsageData,
  extractAndAnalyzeUsage,
  formatUsageAnalysis,
} from '../utils/usageDataExtractor';

// Re-export SessionTracker for external use
export {
  SessionTracker,
  getSessionTracker,
  destroySessionTracker,
  type TrackerState,
} from './sessionTracker';

// Re-export SessionTrackerConfig for external use
export type { SessionTrackerConfig } from './sessionTracker';

// Re-export WeeklyTracker components for standalone weekly tracking
export {
  createWeeklyTracker,
  insertWeeklyTracker,
  createAndInsertWeeklyTracker,
  createWeeklySummary,
  type WeeklyTrackerOptions,
  type WeeklyTrackerResult,
} from '../components/WeeklyTracker';

// Store the tracker instance for external access
let tracker: SessionTracker | null = null;

/**
 * Get the current DOM detection result
 */
export function getCurrentDetection(): DOMDetectionResult | null {
  return tracker?.getDetection() ?? null;
}

/**
 * Get the current usage analysis result
 */
export function getCurrentUsageAnalysis(): UsageAnalysisResult | null {
  return tracker?.getAnalysis() ?? null;
}

/**
 * Get the current tracker state
 */
export function getTrackerState(): TrackerState | null {
  return tracker?.getState() ?? null;
}

/**
 * Refresh the tracker data
 */
export async function refreshTracker(): Promise<void> {
  if (tracker) {
    await tracker.refresh();
  }
}

// Initialize the usage tracker when the DOM is ready
async function initialize(): Promise<void> {
  const handler = getErrorHandler();
  handler.info('Extension initialized');

  try {
    // Validate page state first
    const pageState = validatePageState();

    if (!pageState.isReady) {
      handler.warn(`Page not fully loaded. State: ${pageState.documentState}`, {
        hasBody: pageState.hasBody,
        hasHead: pageState.hasHead,
      });
      // Continue anyway - elements might still be accessible
    }

    // Check if we're on the correct page
    if (!isUsagePage()) {
      handler.debug('Not on usage page, skipping initialization');
      return;
    }

    handler.info('Running on usage page');

    // Create and initialize the session tracker
    tracker = getSessionTracker({
      autoUpdate: true,
      updateInterval: 30000, // 30 seconds
      indicatorSize: 48,
      showSessionIndicator: true,
      showWeeklyIndicator: true,
      injectStyles: true,
      debug: true,
    });

    const success = await tracker.initialize();

    if (success) {
      const state = tracker.getState();
      const analysis = tracker.getAnalysis();

      // Log detection summary
      handler.info('Detection summary', {
        sessionContainer: !!state.detection?.sessionContainer,
        weeklyContainer: !!state.detection?.weeklyContainer,
        sessionPercentage: !!state.detection?.sessionPercentage,
        sessionTimer: !!state.detection?.sessionTimer,
        weeklyPercentage: !!state.detection?.weeklyPercentage,
        weeklyTimer: !!state.detection?.weeklyTimer,
        degraded: state.detection?.degraded || false,
      });

      // Log usage summary
      if (analysis) {
        handler.info('Usage summary', {
          hasSessionData: analysis.extracted.hasSessionData,
          hasWeeklyData: analysis.extracted.hasWeeklyData,
          overallStatus: analysis.summary.overallStatus,
          sessionStatus: analysis.summary.sessionStatus,
          weeklyStatus: analysis.summary.weeklyStatus,
          recommendations: analysis.summary.recommendations,
        });

        // Log session efficiency if available
        if (analysis.sessionAnalysis) {
          const delta = analysis.sessionAnalysis.expectedUsage.usageDelta;
          handler.info(`Session efficiency delta: ${delta !== null ? `${delta >= 0 ? '+' : ''}${Math.round(delta)}%` : 'N/A'}`);
        }

        // Log weekly efficiency if available
        if (analysis.weeklyEfficiency) {
          const delta = analysis.weeklyEfficiency.efficiencyDelta;
          handler.info(`Weekly efficiency delta: ${delta >= 0 ? '+' : ''}${Math.round(delta)}%`);
        }

        // Log any parsing errors
        if (analysis.extracted.errors.length > 0) {
          handler.warn(`Parsing errors encountered: ${analysis.extracted.errors.length}`, {
            errors: analysis.extracted.errors,
          });
        }
      }

      // Log any state errors
      if (state.errors.length > 0) {
        handler.warn(`State errors: ${state.errors.length}`, {
          errors: state.errors,
        });
      }
    } else {
      const error = handler.createError(
        ErrorCodes.ELEMENT_NOT_FOUND,
        'Failed to initialize SessionTracker - usage elements not found or page structure changed',
        'page-structure',
        'warning'
      );
      handler.logError(error);
    }
  } catch (e) {
    const error = handler.createError(
      ErrorCodes.UNKNOWN_ERROR,
      `Unexpected error during initialization: ${e instanceof Error ? e.message : String(e)}`,
      'unknown',
      'critical',
      undefined,
      e instanceof Error ? e : new Error(String(e))
    );
    handler.logError(error);
  }
}

// Clean up on page unload
function cleanup(): void {
  const handler = getErrorHandler();
  try {
    handler.debug('Cleaning up SessionTracker...');
    destroySessionTracker();
    tracker = null;
    handler.debug('SessionTracker cleanup complete');
  } catch (e) {
    handler.warn(`Error during cleanup: ${e instanceof Error ? e.message : String(e)}`);
    tracker = null; // Still clear the reference
  }
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

// Clean up on unload
window.addEventListener('beforeunload', cleanup);

// Export for testing purposes
export { initialize, cleanup };
