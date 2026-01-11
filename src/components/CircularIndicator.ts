/**
 * Claude Usage Tracker - Heat-Scale Gauge Indicator Component
 *
 * A sport-car style gauge with a heat-scale gradient (green → yellow → red).
 * The gauge spans 270° with the opening at the bottom.
 * - Negative values (under budget): Green zone (left side)
 * - Zero (on track): Yellow zone (top/middle)
 * - Positive values (over budget): Red zone (right side)
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
  /** The size of the indicator in pixels (default: 200) */
  size?: number;
  /** The stroke width of the arc track (default: 12) */
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
  needle: string;
}> = {
  green: {
    primary: 'rgba(34, 197, 94, 0.3)',
    background: 'rgba(34, 197, 94, 0.15)',
    text: '#16a34a',
    needle: '#1f2937',
  },
  yellow: {
    primary: 'rgba(234, 179, 8, 0.3)',
    background: 'rgba(234, 179, 8, 0.15)',
    text: '#ca8a04',
    needle: '#1f2937',
  },
  red: {
    primary: 'rgba(239, 68, 68, 0.3)',
    background: 'rgba(239, 68, 68, 0.15)',
    text: '#dc2626',
    needle: '#1f2937',
  },
};

/** Dark mode color overrides */
const DARK_MODE_COLORS: Record<IndicatorColor, { text: string; needle: string }> = {
  green: { text: '#4ade80', needle: '#e5e7eb' },
  yellow: { text: '#facc15', needle: '#e5e7eb' },
  red: { text: '#f87171', needle: '#e5e7eb' },
};

/** Heat scale gradient colors */
const HEAT_SCALE_COLORS = {
  green: '#22c55e',
  yellowGreen: '#84cc16',
  yellow: '#eab308',
  orange: '#f97316',
  red: '#ef4444',
};

/**
 * Determines the appropriate color variant based on the efficiency delta percentage.
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
 * Creates an SVG arc path.
 * Angles are in standard SVG coordinates: 0° = right (3 o'clock), 90° = bottom, etc.
 */
function describeArc(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  // Normalize angles
  const start = startAngle % 360;
  let end = endAngle % 360;
  if (end < start) end += 360;

  const startRad = (start * Math.PI) / 180;
  const endRad = (end * Math.PI) / 180;

  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);

  const largeArcFlag = (end - start) > 180 ? 1 : 0;

  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
}

/**
 * Calculates the needle angle based on percentage.
 * Maps -100% to +100% onto the 270° arc.
 * -100% = 135° (bottom-left, green)
 * 0% = 270° (top, yellow)
 * +100% = 405° = 45° (bottom-right, red)
 */
function calculateNeedleAngle(percentage: number): number {
  const clampedPercentage = Math.max(-100, Math.min(100, percentage));
  // Map: -100 → 135°, 0 → 270°, +100 → 405° (same as 45°)
  return 270 + (clampedPercentage * 1.35);
}

/**
 * Creates a heat-scale gauge SVG indicator element.
 */
export function createCircularIndicator(options: CircularIndicatorOptions): HTMLDivElement {
  const {
    percentage,
    color,
    size = 200,
    strokeWidth = 12,
    tooltipText,
    tooltipContent,
    className,
  } = options;

  const darkMode = isDarkMode();
  const textColor = darkMode ? DARK_MODE_COLORS[color].text : COLOR_CONFIG[color].text;

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - strokeWidth) / 2 - 2;

  // Calculate needle angle
  const needleAngle = calculateNeedleAngle(percentage);
  const needleLength = radius - 4;

  // Create container div
  const container = document.createElement('div');
  container.className = `claude-usage-circular-indicator claude-usage-gauge claude-usage-gauge--heat-scale ${className || ''}`.trim();
  container.setAttribute('data-color', color);
  container.setAttribute('data-percentage', String(percentage));

  // Handle tooltip
  if (tooltipContent) {
    attachTooltip(container, tooltipContent, { position: 'top', offset: 8 });
    container.setAttribute('aria-label', tooltipContent.title);
  } else if (tooltipText) {
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
  svg.setAttribute('aria-label', `Efficiency gauge: ${formatPercentage(percentage)}`);

  // Create gradient definition for the arc
  const defs = document.createElementNS(svgNS, 'defs');

  // We'll create the heat scale using multiple arc segments
  // Arc spans from 135° to 405° (45°), going clockwise through 270°

  // Background arc (gray track)
  const bgArcPath = describeArc(cx, cy, radius, 135, 405);
  const bgArc = document.createElementNS(svgNS, 'path');
  bgArc.setAttribute('d', bgArcPath);
  bgArc.setAttribute('fill', 'none');
  bgArc.setAttribute('stroke', darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');
  bgArc.setAttribute('stroke-width', String(strokeWidth));
  bgArc.setAttribute('stroke-linecap', 'round');
  bgArc.classList.add('claude-usage-gauge__track');

  // Heat scale arc segments (green → yellow → red)
  // Segment 1: Green (135° to 180°) - deep negative
  const greenArc = document.createElementNS(svgNS, 'path');
  greenArc.setAttribute('d', describeArc(cx, cy, radius, 135, 180));
  greenArc.setAttribute('fill', 'none');
  greenArc.setAttribute('stroke', HEAT_SCALE_COLORS.green);
  greenArc.setAttribute('stroke-width', String(strokeWidth));
  greenArc.setAttribute('stroke-linecap', 'round');
  greenArc.classList.add('claude-usage-gauge__segment', 'claude-usage-gauge__segment--green');

  // Segment 2: Yellow-Green (180° to 225°) - moderate negative
  const yellowGreenArc = document.createElementNS(svgNS, 'path');
  yellowGreenArc.setAttribute('d', describeArc(cx, cy, radius, 180, 225));
  yellowGreenArc.setAttribute('fill', 'none');
  yellowGreenArc.setAttribute('stroke', HEAT_SCALE_COLORS.yellowGreen);
  yellowGreenArc.setAttribute('stroke-width', String(strokeWidth));
  yellowGreenArc.classList.add('claude-usage-gauge__segment', 'claude-usage-gauge__segment--yellow-green');

  // Segment 3: Yellow (225° to 315°) - around zero
  const yellowArc = document.createElementNS(svgNS, 'path');
  yellowArc.setAttribute('d', describeArc(cx, cy, radius, 225, 315));
  yellowArc.setAttribute('fill', 'none');
  yellowArc.setAttribute('stroke', HEAT_SCALE_COLORS.yellow);
  yellowArc.setAttribute('stroke-width', String(strokeWidth));
  yellowArc.classList.add('claude-usage-gauge__segment', 'claude-usage-gauge__segment--yellow');

  // Segment 4: Orange (315° to 360°) - moderate positive
  const orangeArc = document.createElementNS(svgNS, 'path');
  orangeArc.setAttribute('d', describeArc(cx, cy, radius, 315, 360));
  orangeArc.setAttribute('fill', 'none');
  orangeArc.setAttribute('stroke', HEAT_SCALE_COLORS.orange);
  orangeArc.setAttribute('stroke-width', String(strokeWidth));
  orangeArc.classList.add('claude-usage-gauge__segment', 'claude-usage-gauge__segment--orange');

  // Segment 5: Red (0° to 45°) - deep positive
  const redArc = document.createElementNS(svgNS, 'path');
  redArc.setAttribute('d', describeArc(cx, cy, radius, 0, 45));
  redArc.setAttribute('fill', 'none');
  redArc.setAttribute('stroke', HEAT_SCALE_COLORS.red);
  redArc.setAttribute('stroke-width', String(strokeWidth));
  redArc.setAttribute('stroke-linecap', 'round');
  redArc.classList.add('claude-usage-gauge__segment', 'claude-usage-gauge__segment--red');

  // Add tick marks
  const tickGroup = document.createElementNS(svgNS, 'g');
  tickGroup.classList.add('claude-usage-gauge__ticks');

  const numTicks = 11; // -100%, -80%, ..., 0%, ..., +80%, +100%
  const tickLength = size * 0.05; // Scale with size
  const tickRadius = radius + strokeWidth / 2 + 4;

  for (let i = 0; i < numTicks; i++) {
    // Map tick index to angle: 0 → 135° (-100%), 5 → 270° (0%), 10 → 405° (+100%)
    const tickAngle = 135 + (i * 270) / (numTicks - 1);
    const tickRad = (tickAngle * Math.PI) / 180;

    const x1 = cx + tickRadius * Math.cos(tickRad);
    const y1 = cy + tickRadius * Math.sin(tickRad);
    const isMajorTick = (i === 0 || i === 5 || i === 10);
    const actualTickLength = isMajorTick ? tickLength * 1.5 : tickLength;
    const x2 = cx + (tickRadius + actualTickLength) * Math.cos(tickRad);
    const y2 = cy + (tickRadius + actualTickLength) * Math.sin(tickRad);

    const tick = document.createElementNS(svgNS, 'line');
    tick.setAttribute('x1', String(x1));
    tick.setAttribute('y1', String(y1));
    tick.setAttribute('x2', String(x2));
    tick.setAttribute('y2', String(y2));
    tick.setAttribute('stroke', darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)');
    tick.setAttribute('stroke-width', isMajorTick ? '3' : '2');
    tickGroup.appendChild(tick);
  }

  // Needle group
  const needleGroup = document.createElementNS(svgNS, 'g');
  needleGroup.classList.add('claude-usage-gauge__needle-group');
  needleGroup.setAttribute('transform', `rotate(${needleAngle} ${cx} ${cy})`);

  // Needle shadow (for depth)
  const needleShadow = document.createElementNS(svgNS, 'polygon');
  const needleWidth = size * 0.04; // Scale with size
  const needleShadowPoints = [
    `${cx + needleLength + 2},${cy + 2}`,
    `${cx + 12},${cy - needleWidth + 2}`,
    `${cx + 12},${cy + needleWidth + 2}`,
  ].join(' ');
  needleShadow.setAttribute('points', needleShadowPoints);
  needleShadow.setAttribute('fill', 'rgba(0,0,0,0.3)');
  needleShadow.classList.add('claude-usage-gauge__needle-shadow');

  // Needle outline (white border for contrast)
  const needleOutline = document.createElementNS(svgNS, 'polygon');
  const outlineWidth = needleWidth + 3;
  const needleOutlinePoints = [
    `${cx + needleLength + 1},${cy}`,
    `${cx + 10},${cy - outlineWidth}`,
    `${cx + 10},${cy + outlineWidth}`,
  ].join(' ');
  needleOutline.setAttribute('points', needleOutlinePoints);
  needleOutline.setAttribute('fill', darkMode ? '#1f2937' : '#ffffff');
  needleOutline.classList.add('claude-usage-gauge__needle-outline');

  // Main needle (red/orange for visibility)
  const needle = document.createElementNS(svgNS, 'polygon');
  const needlePoints = [
    `${cx + needleLength},${cy}`,           // Tip
    `${cx + 12},${cy - needleWidth}`,       // Base top
    `${cx + 12},${cy + needleWidth}`,       // Base bottom
  ].join(' ');
  needle.setAttribute('points', needlePoints);
  needle.setAttribute('fill', '#dc2626'); // Red needle for high visibility
  needle.classList.add('claude-usage-gauge__needle');

  needleGroup.appendChild(needleShadow);
  needleGroup.appendChild(needleOutline);
  needleGroup.appendChild(needle);

  // Center cap (covers needle base) - larger for bigger gauge
  const centerCapSize = size * 0.1;
  const centerCap = document.createElementNS(svgNS, 'circle');
  centerCap.setAttribute('cx', String(cx));
  centerCap.setAttribute('cy', String(cy));
  centerCap.setAttribute('r', String(centerCapSize));
  centerCap.setAttribute('fill', darkMode ? '#374151' : '#f3f4f6');
  centerCap.setAttribute('stroke', darkMode ? '#4b5563' : '#d1d5db');
  centerCap.setAttribute('stroke-width', '3');
  centerCap.classList.add('claude-usage-gauge__center');

  // Inner center dot - red to match needle
  const centerDot = document.createElementNS(svgNS, 'circle');
  centerDot.setAttribute('cx', String(cx));
  centerDot.setAttribute('cy', String(cy));
  centerDot.setAttribute('r', String(centerCapSize * 0.5));
  centerDot.setAttribute('fill', '#dc2626');
  centerDot.classList.add('claude-usage-gauge__center-dot');

  // Value text - positioned at center bottom
  const valueText = document.createElementNS(svgNS, 'text');
  valueText.setAttribute('x', String(cx));
  valueText.setAttribute('y', String(cy + radius * 0.45));
  valueText.setAttribute('text-anchor', 'middle');
  valueText.setAttribute('dominant-baseline', 'middle');
  valueText.setAttribute('fill', textColor);
  valueText.setAttribute('font-size', String(size * 0.18));
  valueText.setAttribute('font-weight', '700');
  valueText.setAttribute('font-family', "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif");
  valueText.textContent = formatPercentage(percentage);
  valueText.classList.add('claude-usage-gauge__text');

  // Assemble SVG
  svg.appendChild(defs);
  svg.appendChild(bgArc);
  svg.appendChild(greenArc);
  svg.appendChild(yellowGreenArc);
  svg.appendChild(yellowArc);
  svg.appendChild(orangeArc);
  svg.appendChild(redArc);
  svg.appendChild(tickGroup);
  svg.appendChild(needleGroup);
  svg.appendChild(centerCap);
  svg.appendChild(centerDot);
  svg.appendChild(valueText);

  container.appendChild(svg);

  return container;
}

/**
 * Creates a circular indicator with automatic color selection based on the percentage.
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
 * Updates an existing gauge indicator with new values.
 */
export function updateCircularIndicator(
  container: HTMLDivElement,
  options: Partial<CircularIndicatorOptions>
): void {
  const currentPercentage = Number(container.getAttribute('data-percentage') || 0);
  const size = options.size ?? 200;

  const newPercentage = options.percentage ?? currentPercentage;
  const newColor = options.color ?? getColorFromPercentage(newPercentage);

  const svg = container.querySelector('svg');
  const needleGroup = container.querySelector('.claude-usage-gauge__needle-group') as SVGGElement | null;
  const needle = container.querySelector('.claude-usage-gauge__needle') as SVGPolygonElement | null;
  const textElement = container.querySelector('.claude-usage-gauge__text') as SVGTextElement | null;
  const centerDot = container.querySelector('.claude-usage-gauge__center-dot') as SVGCircleElement | null;

  if (svg && needleGroup && needle && textElement) {
    const darkMode = isDarkMode();
    const textColor = darkMode ? DARK_MODE_COLORS[newColor].text : COLOR_CONFIG[newColor].text;

    const cx = size / 2;
    const cy = size / 2;
    const needleAngle = calculateNeedleAngle(newPercentage);

    requestAnimationFrame(() => {
      needleGroup.setAttribute('transform', `rotate(${needleAngle} ${cx} ${cy})`);
      // Needle stays red for visibility
      needle.setAttribute('fill', '#dc2626');

      if (centerDot) {
        centerDot.setAttribute('fill', '#dc2626');
      }

      textElement.setAttribute('fill', textColor);
      textElement.textContent = formatPercentage(newPercentage);

      container.setAttribute('data-color', newColor);
      container.setAttribute('data-percentage', String(newPercentage));
    });

    if (options.tooltipText) {
      container.setAttribute('title', options.tooltipText);
      container.setAttribute('aria-label', options.tooltipText);
    }

    return;
  }

  // Fallback: full recreation
  const newIndicator = createCircularIndicator({
    percentage: newPercentage,
    color: newColor,
    size: options.size,
    strokeWidth: options.strokeWidth,
    tooltipText: options.tooltipText,
    className: options.className,
  });

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
