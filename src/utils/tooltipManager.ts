/**
 * Claude Usage Tracker - Tooltip Manager
 *
 * A utility module for creating and managing enhanced hover tooltips
 * that display rich information about usage efficiency indicators.
 *
 * Features:
 * - Rich HTML content with sections
 * - Smart positioning to avoid viewport edges
 * - Smooth fade in/out animations
 * - Dark mode support
 */

/**
 * Tooltip content sections for structured display
 */
export interface TooltipSection {
  /** Section title (optional) */
  title?: string;
  /** Content lines to display */
  lines: string[];
}

/**
 * Configuration for tooltip content
 */
export interface TooltipContent {
  /** Main title of the tooltip */
  title: string;
  /** Sections of content to display */
  sections: TooltipSection[];
  /** Status indicator (under, on-track, over) */
  status?: 'under' | 'on-track' | 'over';
  /** Guidance message for the user */
  guidance?: string;
}

/**
 * Options for tooltip positioning
 */
export interface TooltipOptions {
  /** Preferred position relative to target */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Offset from target in pixels */
  offset?: number;
}

// Global tooltip element (singleton)
let tooltipElement: HTMLDivElement | null = null;
let currentTarget: HTMLElement | null = null;
let hideTimeout: number | null = null;

/**
 * Create or get the global tooltip element
 */
function getTooltipElement(): HTMLDivElement {
  if (!tooltipElement) {
    tooltipElement = document.createElement('div');
    tooltipElement.className = 'claude-usage-tooltip claude-usage-tooltip--enhanced';
    tooltipElement.setAttribute('role', 'tooltip');
    tooltipElement.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tooltipElement);
  }
  return tooltipElement;
}

/**
 * Generate HTML content for the tooltip
 */
function generateTooltipHTML(content: TooltipContent): string {
  const lines: string[] = [];

  // Title
  lines.push(`<div class="claude-usage-tooltip__title">${escapeHTML(content.title)}</div>`);

  // Sections
  for (const section of content.sections) {
    lines.push('<div class="claude-usage-tooltip__section">');

    if (section.title) {
      lines.push(`<div class="claude-usage-tooltip__section-title">${escapeHTML(section.title)}</div>`);
    }

    for (const line of section.lines) {
      lines.push(`<div class="claude-usage-tooltip__line">${escapeHTML(line)}</div>`);
    }

    lines.push('</div>');
  }

  // Status badge
  if (content.status) {
    const statusText = content.status === 'under'
      ? 'Under Usage'
      : content.status === 'over'
        ? 'Over Usage'
        : 'On Track';
    lines.push(`<div class="claude-usage-tooltip__status claude-usage-tooltip__status--${content.status}">${statusText}</div>`);
  }

  // Guidance
  if (content.guidance) {
    lines.push(`<div class="claude-usage-tooltip__guidance">${escapeHTML(content.guidance)}</div>`);
  }

  return lines.join('');
}

/**
 * Escape HTML special characters
 */
function escapeHTML(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Calculate tooltip position relative to target element
 */
function calculatePosition(
  target: HTMLElement,
  tooltip: HTMLElement,
  options: TooltipOptions = {}
): { top: number; left: number } {
  const { position = 'top', offset = 8 } = options;
  const targetRect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let top = 0;
  let left = 0;

  // Calculate initial position based on preference
  switch (position) {
    case 'top':
      top = targetRect.top - tooltipRect.height - offset;
      left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
      break;
    case 'bottom':
      top = targetRect.bottom + offset;
      left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
      break;
    case 'left':
      top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      left = targetRect.left - tooltipRect.width - offset;
      break;
    case 'right':
      top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
      left = targetRect.right + offset;
      break;
  }

  // Adjust for scroll position
  top += window.scrollY;
  left += window.scrollX;

  // Prevent overflow: adjust if tooltip goes outside viewport
  const minMargin = 8;

  // Horizontal adjustments
  if (left < minMargin) {
    left = minMargin;
  } else if (left + tooltipRect.width > viewportWidth - minMargin) {
    left = viewportWidth - tooltipRect.width - minMargin;
  }

  // Vertical adjustments
  if (top < window.scrollY + minMargin) {
    // Flip to bottom if too close to top
    top = targetRect.bottom + offset + window.scrollY;
  } else if (top + tooltipRect.height > window.scrollY + viewportHeight - minMargin) {
    // Flip to top if too close to bottom
    top = targetRect.top - tooltipRect.height - offset + window.scrollY;
  }

  return { top, left };
}

/**
 * Show tooltip for a target element
 */
export function showTooltip(
  target: HTMLElement,
  content: TooltipContent,
  options: TooltipOptions = {}
): void {
  // Clear any pending hide timeout
  if (hideTimeout !== null) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }

  const tooltip = getTooltipElement();
  currentTarget = target;

  // Set content
  tooltip.innerHTML = generateTooltipHTML(content);

  // Position tooltip (initially invisible to measure size)
  tooltip.style.visibility = 'hidden';
  tooltip.style.display = 'block';
  tooltip.classList.add('claude-usage-tooltip--visible');

  // Calculate position after content is set
  requestAnimationFrame(() => {
    const { top, left } = calculatePosition(target, tooltip, options);
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
    tooltip.style.visibility = 'visible';
    tooltip.setAttribute('aria-hidden', 'false');
  });
}

/**
 * Hide the tooltip
 */
export function hideTooltip(delay = 100): void {
  if (hideTimeout !== null) {
    clearTimeout(hideTimeout);
  }

  hideTimeout = window.setTimeout(() => {
    if (tooltipElement) {
      tooltipElement.classList.remove('claude-usage-tooltip--visible');
      tooltipElement.setAttribute('aria-hidden', 'true');

      // Wait for animation to complete before hiding
      setTimeout(() => {
        if (tooltipElement) {
          tooltipElement.style.display = 'none';
        }
      }, 200);
    }
    currentTarget = null;
    hideTimeout = null;
  }, delay);
}

/**
 * Attach tooltip behavior to an element
 */
export function attachTooltip(
  element: HTMLElement,
  content: TooltipContent,
  options: TooltipOptions = {}
): () => void {
  const handleMouseEnter = () => {
    showTooltip(element, content, options);
  };

  const handleMouseLeave = () => {
    hideTooltip();
  };

  const handleFocus = () => {
    showTooltip(element, content, options);
  };

  const handleBlur = () => {
    hideTooltip();
  };

  // Attach event listeners
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
  element.addEventListener('focus', handleFocus);
  element.addEventListener('blur', handleBlur);

  // Make element focusable for keyboard accessibility
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '0');
  }

  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter);
    element.removeEventListener('mouseleave', handleMouseLeave);
    element.removeEventListener('focus', handleFocus);
    element.removeEventListener('blur', handleBlur);
  };
}

/**
 * Update tooltip content for an element (if it's currently showing)
 */
export function updateTooltipContent(
  element: HTMLElement,
  content: TooltipContent
): void {
  if (currentTarget === element && tooltipElement) {
    tooltipElement.innerHTML = generateTooltipHTML(content);
  }
}

/**
 * Cleanup global tooltip element
 */
export function destroyTooltip(): void {
  if (tooltipElement) {
    tooltipElement.remove();
    tooltipElement = null;
  }
  if (hideTimeout !== null) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  currentTarget = null;
}

/**
 * Generate tooltip content for session efficiency indicator
 */
export function generateSessionTooltipContent(
  actualUsage: number,
  expectedUsage: number,
  delta: number,
  _statusMessage: string
): TooltipContent {
  const status: 'under' | 'on-track' | 'over' =
    delta <= -10 ? 'under' : delta >= 10 ? 'over' : 'on-track';

  // Determine guidance based on status
  let guidance: string;
  if (status === 'under') {
    guidance = 'You have room to use Claude more in this session.';
  } else if (status === 'over') {
    guidance = 'Consider pacing your usage to last the full session.';
  } else {
    guidance = 'Your usage is well-balanced. Keep up the good work!';
  }

  return {
    title: 'Session Efficiency',
    sections: [
      {
        title: 'What does this mean?',
        lines: [
          'This shows how your current usage compares',
          'to the expected usage at this point in your session.',
        ],
      },
      {
        title: 'Current Status',
        lines: [
          `Actual usage: ${Math.round(actualUsage)}%`,
          `Expected usage: ${Math.round(expectedUsage)}%`,
          `Difference: ${delta >= 0 ? '+' : ''}${Math.round(delta)}%`,
        ],
      },
    ],
    status,
    guidance,
  };
}

/**
 * Generate tooltip content for weekly efficiency indicator
 */
export function generateWeeklyTooltipContent(
  actualUsage: number,
  expectedUsage: number,
  delta: number,
  timeRemaining: string | null,
  _statusMessage: string
): TooltipContent {
  const status: 'under' | 'on-track' | 'over' =
    delta <= -10 ? 'under' : delta >= 10 ? 'over' : 'on-track';

  // Determine guidance based on status
  let guidance: string;
  if (status === 'under') {
    guidance = 'You have unused capacity this week. Feel free to use Claude more!';
  } else if (status === 'over') {
    guidance = 'You\'re using more than expected. Consider spreading usage evenly throughout the week.';
  } else {
    guidance = 'Your weekly usage is on track. You\'re pacing well!';
  }

  const statusLines = [
    `Actual usage: ${Math.round(actualUsage)}%`,
    `Expected usage: ${Math.round(expectedUsage)}%`,
    `Difference: ${delta >= 0 ? '+' : ''}${Math.round(delta)}%`,
  ];

  if (timeRemaining) {
    statusLines.push(`Time until reset: ${timeRemaining}`);
  }

  return {
    title: 'Weekly Efficiency',
    sections: [
      {
        title: 'What does this mean?',
        lines: [
          'This shows your weekly usage compared to',
          'where you should be based on time elapsed.',
        ],
      },
      {
        title: 'Current Status',
        lines: statusLines,
      },
    ],
    status,
    guidance,
  };
}

export default {
  showTooltip,
  hideTooltip,
  attachTooltip,
  updateTooltipContent,
  destroyTooltip,
  generateSessionTooltipContent,
  generateWeeklyTooltipContent,
};
