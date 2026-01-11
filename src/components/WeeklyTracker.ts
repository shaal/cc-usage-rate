/**
 * Claude Usage Tracker - Weekly Tracker Component
 *
 * This component creates the complete weekly usage tracking feature by combining:
 * - Weekly time calculations (elapsed/remaining time in the weekly window)
 * - Usage data extraction (weekly percentage and reset time)
 * - Indicator display (circular indicator showing efficiency delta)
 *
 * Handles the more complex weekly reset timing logic with proper timezone support.
 */

import {
  createAutoColorIndicator,
} from './CircularIndicator';

import {
  generateWeeklyTooltipContent,
} from '../utils/tooltipManager';

import {
  type WeeklyResetConfig,
  type WeeklyTimeResult,
  type UsageEfficiencyResult,
} from '../utils/weeklyTimeCalculator';

import {
  type UsageAnalysisResult,
} from '../utils/usageDataExtractor';

/**
 * Configuration options for the weekly tracker
 */
export interface WeeklyTrackerOptions {
  /** The size of the indicator in pixels (default: 48) */
  indicatorSize?: number;
  /** Whether to show the tooltip with detailed info (default: true) */
  showTooltip?: boolean;
  /** Custom CSS class name to add to the tracker */
  className?: string;
  /** Position relative to the weekly percentage element */
  position?: 'left' | 'right' | 'top' | 'bottom';
  /** Whether to update automatically when data changes (default: true) */
  autoUpdate?: boolean;
}

/**
 * Result of weekly tracker creation
 */
export interface WeeklyTrackerResult {
  /** The tracker container element */
  container: HTMLDivElement;
  /** The indicator element */
  indicator: HTMLDivElement;
  /** Whether the tracker was successfully created */
  isValid: boolean;
  /** The weekly efficiency result if available */
  efficiency: UsageEfficiencyResult | null;
  /** The weekly time result if available */
  timeDetails: WeeklyTimeResult | null;
  /** Function to update the tracker with new data */
  update: (analysis: UsageAnalysisResult) => void;
  /** Function to remove the tracker from the DOM */
  destroy: () => void;
}

/**
 * Default options for the weekly tracker
 */
const DEFAULT_OPTIONS: Required<WeeklyTrackerOptions> = {
  indicatorSize: 200,
  showTooltip: true,
  className: '',
  position: 'right',
  autoUpdate: true,
};

/**
 * Generate tooltip text from weekly efficiency data
 */
function generateTooltipText(
  efficiency: UsageEfficiencyResult | null,
  timeDetails: WeeklyTimeResult | null
): string {
  const lines: string[] = [];

  lines.push('Weekly Usage Status');
  lines.push('─'.repeat(20));

  if (timeDetails) {
    lines.push(`Time Elapsed: ${Math.round(timeDetails.elapsedPercentage)}%`);
    lines.push(`Time Remaining: ${timeDetails.remainingFormatted}`);
    lines.push(`Next Reset: ${formatNextReset(timeDetails.nextReset)}`);
  }

  if (efficiency) {
    lines.push('');
    lines.push(`Actual Usage: ${Math.round(efficiency.actualUsagePercentage)}%`);
    lines.push(`Expected Usage: ${Math.round(efficiency.expectedUsagePercentage)}%`);

    const deltaSign = efficiency.efficiencyDelta >= 0 ? '+' : '';
    lines.push(`Delta: ${deltaSign}${Math.round(efficiency.efficiencyDelta)}%`);
    lines.push('');
    lines.push(getStatusMessage(efficiency.status));
  }

  return lines.join('\n');
}

/**
 * Format the next reset date for display
 */
function formatNextReset(nextReset: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return nextReset.toLocaleString(undefined, options);
}

/**
 * Get a human-readable status message based on efficiency status
 */
function getStatusMessage(status: 'under' | 'on-track' | 'over'): string {
  switch (status) {
    case 'under':
      return 'Using less than expected. You have room for more usage.';
    case 'over':
      return 'Using more than expected. Consider pacing your usage.';
    case 'on-track':
    default:
      return 'Usage is on track. Continue as normal.';
  }
}


/**
 * Create a weekly tracker element that displays usage efficiency
 *
 * @param analysis The usage analysis result containing weekly data
 * @param options Configuration options for the tracker
 * @returns WeeklyTrackerResult with the tracker elements and control functions
 */
export function createWeeklyTracker(
  analysis: UsageAnalysisResult,
  options: WeeklyTrackerOptions = {}
): WeeklyTrackerResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Create container
  const container = document.createElement('div');
  container.className = `claude-usage-weekly-tracker ${opts.className}`.trim();
  container.setAttribute('data-tracker-type', 'weekly');

  // Extract efficiency data from analysis
  const efficiency = analysis.weeklyEfficiency;
  const timeDetails = analysis.weeklyTime;

  // Create indicator (or placeholder if no data)
  let indicator: HTMLDivElement;
  let isValid = false;

  if (efficiency) {
    // Generate rich tooltip content for enhanced hover experience
    const tooltipContent = opts.showTooltip
      ? generateWeeklyTooltipContent(
          efficiency.actualUsagePercentage,
          efficiency.expectedUsagePercentage,
          efficiency.efficiencyDelta,
          timeDetails?.remainingFormatted ?? null,
          getStatusMessage(efficiency.status),
          efficiency.hoursToZeroDeltaFormatted
        )
      : undefined;

    // Create indicator with efficiency delta
    indicator = createAutoColorIndicator(efficiency.efficiencyDelta, {
      size: opts.indicatorSize,
      tooltipContent,
      className: 'claude-usage-weekly-indicator',
    });
    isValid = true;
  } else if (timeDetails) {
    // Create a neutral indicator showing time info only (fallback to legacy tooltip)
    indicator = createAutoColorIndicator(0, {
      size: opts.indicatorSize,
      tooltipText: opts.showTooltip ? generateTooltipText(null, timeDetails) : undefined,
      className: 'claude-usage-weekly-indicator',
    });
    isValid = true;
  } else {
    // Create a placeholder indicator
    indicator = document.createElement('div');
    indicator.className = 'claude-usage-weekly-indicator claude-usage-weekly-indicator--no-data';
    indicator.textContent = '?';
    indicator.style.cssText = `
      width: ${opts.indicatorSize}px;
      height: ${opts.indicatorSize}px;
      border-radius: 50%;
      background-color: rgba(128, 128, 128, 0.15);
      border: 2px solid rgba(128, 128, 128, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #888;
      font-weight: 600;
      font-size: ${opts.indicatorSize * 0.35}px;
    `;
    indicator.title = 'Weekly usage data not available';
  }

  container.appendChild(indicator);

  // Create update function
  const update = (newAnalysis: UsageAnalysisResult) => {
    const newEfficiency = newAnalysis.weeklyEfficiency;
    const newTimeDetails = newAnalysis.weeklyTime;

    if (newEfficiency) {
      // Generate rich tooltip content for enhanced hover experience
      const tooltipContent = opts.showTooltip
        ? generateWeeklyTooltipContent(
            newEfficiency.actualUsagePercentage,
            newEfficiency.expectedUsagePercentage,
            newEfficiency.efficiencyDelta,
            newTimeDetails?.remainingFormatted ?? null,
            getStatusMessage(newEfficiency.status),
            newEfficiency.hoursToZeroDeltaFormatted
          )
        : undefined;

      const newIndicator = createAutoColorIndicator(newEfficiency.efficiencyDelta, {
        size: opts.indicatorSize,
        tooltipContent,
        className: 'claude-usage-weekly-indicator',
      });

      // Replace old indicator
      container.innerHTML = '';
      container.appendChild(newIndicator);
    }
  };

  // Create destroy function
  const destroy = () => {
    container.remove();
  };

  return {
    container,
    indicator,
    isValid,
    efficiency,
    timeDetails,
    update,
    destroy,
  };
}

/**
 * Insert the weekly tracker next to a target element
 *
 * @param tracker The weekly tracker result
 * @param targetElement The element to insert next to
 * @param position Position relative to the target (default: 'right')
 */
export function insertWeeklyTracker(
  tracker: WeeklyTrackerResult,
  targetElement: HTMLElement,
  position: 'left' | 'right' | 'top' | 'bottom' = 'right'
): void {
  const { container } = tracker;

  // Set positioning styles based on position
  container.style.display = 'inline-flex';
  container.style.alignItems = 'center';
  container.style.verticalAlign = 'middle';

  switch (position) {
    case 'left':
      container.style.marginRight = '8px';
      targetElement.parentElement?.insertBefore(container, targetElement);
      break;
    case 'right':
      container.style.marginLeft = '8px';
      if (targetElement.nextSibling) {
        targetElement.parentElement?.insertBefore(container, targetElement.nextSibling);
      } else {
        targetElement.parentElement?.appendChild(container);
      }
      break;
    case 'top':
      container.style.marginBottom = '8px';
      container.style.display = 'block';
      targetElement.parentElement?.insertBefore(container, targetElement);
      break;
    case 'bottom':
      container.style.marginTop = '8px';
      container.style.display = 'block';
      if (targetElement.nextSibling) {
        targetElement.parentElement?.insertBefore(container, targetElement.nextSibling);
      } else {
        targetElement.parentElement?.appendChild(container);
      }
      break;
  }
}

/**
 * Create and automatically insert a weekly tracker based on usage analysis
 *
 * @param analysis The usage analysis result
 * @param targetElement The element to insert the tracker next to
 * @param options Configuration options
 * @returns The created weekly tracker result
 */
export function createAndInsertWeeklyTracker(
  analysis: UsageAnalysisResult,
  targetElement: HTMLElement,
  options: WeeklyTrackerOptions = {}
): WeeklyTrackerResult {
  const tracker = createWeeklyTracker(analysis, options);
  insertWeeklyTracker(tracker, targetElement, options.position || 'right');
  return tracker;
}

/**
 * Create a detailed weekly summary element (larger display with more info)
 *
 * @param analysis The usage analysis result
 * @returns HTML element containing detailed weekly summary
 */
export function createWeeklySummary(analysis: UsageAnalysisResult): HTMLDivElement {
  const container = document.createElement('div');
  container.className = 'claude-usage-weekly-summary';

  const { weeklyEfficiency, weeklyTime, summary } = analysis;

  // Create summary content
  let html = '<div class="claude-usage-weekly-summary__content">';

  // Header
  html += '<div class="claude-usage-weekly-summary__header">';
  html += '<span class="claude-usage-weekly-summary__title">Weekly Usage</span>';

  if (weeklyEfficiency) {
    const statusClass = `claude-usage-weekly-summary__status--${weeklyEfficiency.status}`;
    html += `<span class="claude-usage-weekly-summary__status ${statusClass}">${weeklyEfficiency.status}</span>`;
  }
  html += '</div>';

  // Stats
  if (weeklyTime) {
    html += '<div class="claude-usage-weekly-summary__stats">';
    html += `<div class="claude-usage-weekly-summary__stat">`;
    html += `<span class="claude-usage-weekly-summary__stat-label">Time Elapsed</span>`;
    html += `<span class="claude-usage-weekly-summary__stat-value">${Math.round(weeklyTime.elapsedPercentage)}%</span>`;
    html += `</div>`;
    html += `<div class="claude-usage-weekly-summary__stat">`;
    html += `<span class="claude-usage-weekly-summary__stat-label">Remaining</span>`;
    html += `<span class="claude-usage-weekly-summary__stat-value">${weeklyTime.remainingFormatted}</span>`;
    html += `</div>`;
    html += '</div>';
  }

  if (weeklyEfficiency) {
    html += '<div class="claude-usage-weekly-summary__efficiency">';
    html += `<div class="claude-usage-weekly-summary__bar">`;
    html += `<div class="claude-usage-weekly-summary__bar-fill" style="width: ${Math.min(100, weeklyEfficiency.actualUsagePercentage)}%"></div>`;
    html += `<div class="claude-usage-weekly-summary__bar-expected" style="left: ${Math.min(100, weeklyEfficiency.expectedUsagePercentage)}%"></div>`;
    html += `</div>`;
    html += `<div class="claude-usage-weekly-summary__legend">`;
    html += `<span>Actual: ${Math.round(weeklyEfficiency.actualUsagePercentage)}%</span>`;
    html += `<span>Expected: ${Math.round(weeklyEfficiency.expectedUsagePercentage)}%</span>`;
    html += `</div>`;
    html += '</div>';
  }

  // Status message
  html += `<div class="claude-usage-weekly-summary__message">${summary.weeklyStatus}</div>`;

  html += '</div>';

  container.innerHTML = html;

  return container;
}

// Export types
export type { WeeklyResetConfig, WeeklyTimeResult, UsageEfficiencyResult };
