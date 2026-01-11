/**
 * Claude Usage Tracker - Circular Indicator Component
 *
 * A reusable SVG-based circular indicator that displays efficiency delta
 * percentage inside a colored circle. The indicator uses a circular progress
 * ring to visually represent the percentage value.
 */

import {
  attachTooltip,
  type TooltipContent,
} from '../utils/tooltipManager';

export type IndicatorColor = 'green' | 'yellow' | 'red';

export interface CircularIndicatorOptions {
  /** The efficiency delta percentage to display (-100 to 100+) */
  percentage: number;
  /** The color variant of the indicator */
  color: IndicatorColor;
  /** The size of the indicator in pixels (default: 48) */
  size?: number;
  /** The stroke width of the progress ring (default: 4) */
  strokeWidth?: number;
  /** Optional tooltip text to show on hover (legacy - use tooltipContent for rich tooltips) */
  tooltipText?: string;
  /** Optional rich tooltip content for enhanced hover tooltips */
  tooltipContent?: TooltipContent;
  /** Optional CSS class name to add */
  className?: string;
}

/** Color configurations for each indicator variant */
const COLOR_CONFIG: Record<IndicatorColor, {
  primary: string;
  background: string;
  text: string;
  ring: string;
}> = {
  green: {
    primary: 'rgba(34, 197, 94, 0.3)',
    background: 'rgba(34, 197, 94, 0.15)',
    text: '#16a34a',
    ring: '#22c55e',
  },
  yellow: {
    primary: 'rgba(234, 179, 8, 0.3)',
    background: 'rgba(234, 179, 8, 0.15)',
    text: '#ca8a04',
    ring: '#eab308',
  },
  red: {
    primary: 'rgba(239, 68, 68, 0.3)',
    background: 'rgba(239, 68, 68, 0.15)',
    text: '#dc2626',
    ring: '#ef4444',
  },
};

/** Dark mode color overrides */
const DARK_MODE_TEXT_COLORS: Record<IndicatorColor, string> = {
  green: '#4ade80',
  yellow: '#facc15',
  red: '#f87171',
};

/**
 * Determines the appropriate color variant based on the efficiency delta percentage.
 * - Green: Usage below expected (negative delta, room to use more)
 * - Yellow: Usage near expected (around 0, on track)
 * - Red: Usage above expected (positive delta, over-consuming)
 *
 * @param percentage The efficiency delta percentage
 * @returns The appropriate color variant
 */
export function getColorFromPercentage(percentage: number): IndicatorColor {
  if (percentage <= -10) {
    return 'green';
  } else if (percentage >= 10) {
    return 'red';
  }
  return 'yellow';
}

/**
 * Formats the percentage value for display.
 * Adds a + prefix for positive values and % suffix.
 *
 * @param percentage The percentage value
 * @returns Formatted string (e.g., "+15%", "-8%", "0%")
 */
export function formatPercentage(percentage: number): string {
  const rounded = Math.round(percentage);
  const prefix = rounded > 0 ? '+' : '';
  return `${prefix}${rounded}%`;
}

/**
 * Checks if dark mode is preferred by the user.
 */
function isDarkMode(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

/**
 * Creates a circular SVG indicator element that displays an efficiency
 * delta percentage inside a colored circle with a progress ring.
 *
 * @param options Configuration options for the indicator
 * @returns The created SVG element wrapped in a container div
 */
export function createCircularIndicator(options: CircularIndicatorOptions): HTMLDivElement {
  const {
    percentage,
    color,
    size = 48,
    strokeWidth = 4,
    tooltipText,
    tooltipContent,
    className,
  } = options;

  const colors = COLOR_CONFIG[color];
  const darkMode = isDarkMode();
  const textColor = darkMode ? DARK_MODE_TEXT_COLORS[color] : colors.text;

  // Calculate SVG dimensions
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate progress (clamp between 0 and 100 for visual representation)
  // We use absolute value to show magnitude, regardless of direction
  const progressPercentage = Math.min(Math.abs(percentage), 100);
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  // Create container div
  const container = document.createElement('div');
  container.className = `claude-usage-circular-indicator ${className || ''}`.trim();
  container.setAttribute('data-color', color);
  container.setAttribute('data-percentage', String(percentage));

  // Handle tooltip: prefer rich tooltip content, fallback to simple text
  if (tooltipContent) {
    // Attach enhanced tooltip with rich content
    attachTooltip(container, tooltipContent, { position: 'top', offset: 8 });
    // Set aria-label for accessibility
    container.setAttribute('aria-label', tooltipContent.title);
  } else if (tooltipText) {
    // Fallback to legacy title attribute for simple text tooltips
    container.setAttribute('title', tooltipText);
    container.setAttribute('aria-label', tooltipText);
  }

  // Create SVG element
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Efficiency indicator: ${formatPercentage(percentage)}`);

  // Background circle (track)
  const bgCircle = document.createElementNS(svgNS, 'circle');
  bgCircle.setAttribute('cx', String(size / 2));
  bgCircle.setAttribute('cy', String(size / 2));
  bgCircle.setAttribute('r', String(radius));
  bgCircle.setAttribute('fill', colors.background);
  bgCircle.setAttribute('stroke', colors.primary);
  bgCircle.setAttribute('stroke-width', String(strokeWidth));

  // Progress circle (ring)
  const progressCircle = document.createElementNS(svgNS, 'circle');
  progressCircle.setAttribute('cx', String(size / 2));
  progressCircle.setAttribute('cy', String(size / 2));
  progressCircle.setAttribute('r', String(radius));
  progressCircle.setAttribute('fill', 'none');
  progressCircle.setAttribute('stroke', colors.ring);
  progressCircle.setAttribute('stroke-width', String(strokeWidth));
  progressCircle.setAttribute('stroke-linecap', 'round');
  progressCircle.setAttribute('stroke-dasharray', String(circumference));
  progressCircle.setAttribute('stroke-dashoffset', String(strokeDashoffset));
  progressCircle.setAttribute('transform', `rotate(-90 ${size / 2} ${size / 2})`);
  progressCircle.classList.add('claude-usage-circular-indicator__progress');

  // Text element for percentage
  const text = document.createElementNS(svgNS, 'text');
  text.setAttribute('x', '50%');
  text.setAttribute('y', '50%');
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dominant-baseline', 'central');
  text.setAttribute('fill', textColor);
  text.setAttribute('font-size', String(size * 0.22));
  text.setAttribute('font-weight', '600');
  text.setAttribute('font-family', "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif");
  text.textContent = formatPercentage(percentage);

  // Assemble SVG
  svg.appendChild(bgCircle);
  svg.appendChild(progressCircle);
  svg.appendChild(text);

  // Add SVG to container
  container.appendChild(svg);

  return container;
}

/**
 * Creates a circular indicator with automatic color selection based on the percentage.
 *
 * @param percentage The efficiency delta percentage
 * @param options Additional options (excluding color, which is auto-determined)
 * @returns The created indicator element
 */
export function createAutoColorIndicator(
  percentage: number,
  options?: Omit<CircularIndicatorOptions, 'percentage' | 'color'>
): HTMLDivElement {
  return createCircularIndicator({
    percentage,
    color: getColorFromPercentage(percentage),
    ...options,
  });
}

/**
 * Updates an existing circular indicator with new values.
 *
 * Performance optimized: Updates SVG attributes in-place rather than
 * replacing innerHTML, which avoids costly DOM reconstruction and reflows.
 *
 * @param container The indicator container element
 * @param options New options to apply
 */
export function updateCircularIndicator(
  container: HTMLDivElement,
  options: Partial<CircularIndicatorOptions>
): void {
  const currentPercentage = Number(container.getAttribute('data-percentage') || 0);
  const currentColor = (container.getAttribute('data-color') as IndicatorColor) || 'green';
  const size = options.size ?? 48;
  const strokeWidth = options.strokeWidth ?? 4;

  const newPercentage = options.percentage ?? currentPercentage;
  const newColor = options.color ?? getColorFromPercentage(newPercentage);

  // Check if we can do an in-place update (only percentage/color changed)
  const svg = container.querySelector('svg');
  const progressCircle = container.querySelector('.claude-usage-circular-indicator__progress') as SVGCircleElement | null;
  const textElement = container.querySelector('text') as SVGTextElement | null;
  const bgCircle = container.querySelector('circle:not(.claude-usage-circular-indicator__progress)') as SVGCircleElement | null;

  if (svg && progressCircle && textElement && bgCircle) {
    // In-place update for better performance (avoids reflow/repaint)
    const colors = COLOR_CONFIG[newColor];
    const darkMode = isDarkMode();
    const textColor = darkMode ? DARK_MODE_TEXT_COLORS[newColor] : colors.text;

    // Calculate new SVG values
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progressPercentage = Math.min(Math.abs(newPercentage), 100);
    const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

    // Batch updates using requestAnimationFrame to minimize reflows
    requestAnimationFrame(() => {
      // Update progress circle
      progressCircle.setAttribute('stroke', colors.ring);
      progressCircle.setAttribute('stroke-dashoffset', String(strokeDashoffset));

      // Update background circle
      bgCircle.setAttribute('fill', colors.background);
      bgCircle.setAttribute('stroke', colors.primary);

      // Update text
      textElement.setAttribute('fill', textColor);
      textElement.textContent = formatPercentage(newPercentage);

      // Update container attributes
      container.setAttribute('data-color', newColor);
      container.setAttribute('data-percentage', String(newPercentage));
    });

    // Update tooltip if provided
    if (options.tooltipText) {
      container.setAttribute('title', options.tooltipText);
      container.setAttribute('aria-label', options.tooltipText);
    }

    return;
  }

  // Fallback: full recreation if structure is unexpected
  // This should rarely happen but ensures robustness
  const newIndicator = createCircularIndicator({
    percentage: newPercentage,
    color: newColor,
    size: options.size,
    strokeWidth: options.strokeWidth,
    tooltipText: options.tooltipText,
    className: options.className,
  });

  // Replace the old content with new
  container.innerHTML = newIndicator.innerHTML;
  container.setAttribute('data-color', newColor);
  container.setAttribute('data-percentage', String(newPercentage));

  if (options.tooltipText) {
    container.setAttribute('title', options.tooltipText);
    container.setAttribute('aria-label', options.tooltipText);
  }
}

// Re-export tooltip types for convenience
export type { TooltipContent } from '../utils/tooltipManager';

// Default export for convenience
export default createCircularIndicator;
