/**
 * Claude Usage Tracker - Components
 *
 * This file exports all reusable UI components for the extension.
 */

export {
  createCircularIndicator,
  createAutoColorIndicator,
  updateCircularIndicator,
  getColorFromPercentage,
  formatPercentage,
  type IndicatorColor,
  type CircularIndicatorOptions,
} from './CircularIndicator';

export {
  createWeeklyTracker,
  insertWeeklyTracker,
  createAndInsertWeeklyTracker,
  createWeeklySummary,
  type WeeklyTrackerOptions,
  type WeeklyTrackerResult,
} from './WeeklyTracker';
