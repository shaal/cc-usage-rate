/**
 * Claude Usage Tracker - Pace Indicator
 *
 * Compact pace display placed next to Claude's "XX% used" text:
 * - A small semicircle gauge whose zones match the ±10 color thresholds
 * - The delta in words ("+19 over pace")
 * - The expected usage and a projection ("Pace 40% · limit in ~1h 25m")
 *
 * A companion marker is drawn over Claude's own progress bar at the expected
 * usage, labeled "pace 40%", with a band showing how far actual usage is
 * ahead or behind.
 */

import { attachTooltip, type TooltipContent } from '../utils/tooltipManager';
import { getColorFromPercentage, type IndicatorColor } from './CircularIndicator';

export interface PaceData {
  /** Actual minus expected usage, in percentage points */
  delta: number;
  /** Actual usage percentage (0-100) */
  actual: number;
  /** Expected usage percentage at this point in the window (0-100) */
  expected: number;
  /** Minutes elapsed in the current window */
  elapsedMinutes: number;
  /** Minutes until the window resets */
  remainingMinutes: number;
  /** Word used in the projection text */
  period: 'session' | 'week';
  /** Rich tooltip content */
  tooltip?: TooltipContent;
  /** True when the bar marker shows the pace, so the detail line omits it */
  paceOnBar?: boolean;
}

export type PaceProjection =
  | { kind: 'reached' }
  | { kind: 'limit'; minutes: number }
  | { kind: 'end'; percentage: number };

/** Deltas beyond this many points pin the needle to the end of the gauge. */
const GAUGE_RANGE = 40;

const SVG_NS = 'http://www.w3.org/2000/svg';
const GAUGE_WIDTH = 56;
const GAUGE_HEIGHT = 34;
const CX = 28;
const CY = 30;
const RADIUS = 22;

const STATUS_TEXT: Record<IndicatorColor, string> = {
  green: 'under pace',
  yellow: 'on pace',
  red: 'over pace',
};

/**
 * Projects usage at the current average rate until the window resets.
 * Returns null early in a window, when the rate is not yet meaningful.
 */
export function projectUsage(
  actual: number,
  elapsedMinutes: number,
  remainingMinutes: number
): PaceProjection | null {
  if (actual >= 100) return { kind: 'reached' };
  const totalMinutes = elapsedMinutes + remainingMinutes;
  if (actual <= 0 || totalMinutes <= 0 || elapsedMinutes < totalMinutes * 0.05) return null;

  const ratePerMinute = actual / elapsedMinutes;
  const projected = actual + ratePerMinute * remainingMinutes;
  if (projected >= 100) {
    return { kind: 'limit', minutes: (100 - actual) / ratePerMinute };
  }
  return { kind: 'end', percentage: Math.round(projected) };
}

/** Formats a duration as "45m", "1h 25m", or "2d 3h". */
export function formatDuration(minutes: number): string {
  const total = Math.max(1, Math.round(minutes));
  if (total < 60) return `${total}m`;
  if (total < 48 * 60) {
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    return mins ? `${hours}h ${mins}m` : `${hours}h`;
  }
  // Round to whole hours first, so 2d 23.6h carries into "3d", not "2d 24h".
  const totalHours = Math.round(total / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  return hours ? `${days}d ${hours}h` : `${days}d`;
}

/**
 * Builds the secondary line, such as "Limit in ~1h 25m".
 * Without a bar marker, the line also carries the pace: "Pace 40% · ...".
 */
export function formatPaceDetail(data: PaceData): string {
  const projection = projectUsage(data.actual, data.elapsedMinutes, data.remainingMinutes);
  let text = '';
  if (projection?.kind === 'reached') text = 'Limit reached';
  else if (projection?.kind === 'limit') text = `Limit in ~${formatDuration(projection.minutes)}`;
  else if (projection?.kind === 'end') text = `Ends ${data.period} near ${projection.percentage}%`;

  if (data.paceOnBar) return text;
  const pace = `Pace ${Math.round(data.expected)}%`;
  return text ? `${pace} · ${text.charAt(0).toLowerCase()}${text.slice(1)}` : pace;
}

function formatDelta(delta: number): string {
  const rounded = Math.round(delta);
  if (rounded > 0) return `+${rounded}`;
  if (rounded < 0) return `−${Math.abs(rounded)}`;
  return '0';
}

/** Point on the gauge arc for a delta; -GAUGE_RANGE is left, +GAUGE_RANGE is right. */
function gaugePoint(delta: number, radius = RADIUS): [number, number] {
  const clamped = Math.max(-GAUGE_RANGE, Math.min(GAUGE_RANGE, delta));
  const angle = Math.PI * (1 - (clamped + GAUGE_RANGE) / (2 * GAUGE_RANGE));
  return [CX + radius * Math.cos(angle), CY - radius * Math.sin(angle)];
}

/** Needle rotation in degrees; 0 points straight up. */
function needleRotation(delta: number): number {
  const clamped = Math.max(-GAUGE_RANGE, Math.min(GAUGE_RANGE, delta));
  return (clamped / GAUGE_RANGE) * 90;
}

function createGauge(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('width', String(GAUGE_WIDTH));
  svg.setAttribute('height', String(GAUGE_HEIGHT));
  svg.setAttribute('viewBox', `0 0 ${GAUGE_WIDTH} ${GAUGE_HEIGHT}`);
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('claude-usage-pace__gauge');

  // Zones match getColorFromPercentage; small gaps separate them visually.
  const zones: [number, number, IndicatorColor][] = [
    [-GAUGE_RANGE, -10.8, 'green'],
    [-9.2, 9.2, 'yellow'],
    [10.8, GAUGE_RANGE, 'red'],
  ];
  for (const [from, to, color] of zones) {
    const [x1, y1] = gaugePoint(from);
    const [x2, y2] = gaugePoint(to);
    const zone = document.createElementNS(SVG_NS, 'path');
    zone.setAttribute('d', `M ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2}`);
    zone.classList.add('claude-usage-pace__zone', `claude-usage-pace__zone--${color}`);
    svg.appendChild(zone);
  }

  const needle = document.createElementNS(SVG_NS, 'line');
  needle.setAttribute('x1', String(CX));
  needle.setAttribute('y1', String(CY));
  needle.setAttribute('x2', String(CX));
  needle.setAttribute('y2', String(CY - RADIUS + 3));
  needle.classList.add('claude-usage-pace__needle');
  svg.appendChild(needle);

  const hub = document.createElementNS(SVG_NS, 'circle');
  hub.setAttribute('cx', String(CX));
  hub.setAttribute('cy', String(CY));
  hub.setAttribute('r', '3');
  hub.classList.add('claude-usage-pace__hub');
  svg.appendChild(hub);

  return svg;
}

/** Sets an attribute only when it changes, so refreshes do not churn the DOM. */
function setAttr(element: Element, name: string, value: string): void {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
}

/**
 * Creates the compact pace indicator.
 */
export function createPaceIndicator(data: PaceData, className = ''): HTMLDivElement {
  const container = document.createElement('div');
  container.className = `claude-usage-pace ${className}`.trim();
  container.setAttribute('role', 'img');
  container.tabIndex = 0;

  container.appendChild(createGauge());

  const text = document.createElement('div');
  text.className = 'claude-usage-pace__text';
  const headline = document.createElement('div');
  headline.className = 'claude-usage-pace__headline';
  const value = document.createElement('span');
  value.className = 'claude-usage-pace__value';
  const status = document.createElement('span');
  status.className = 'claude-usage-pace__status';
  headline.append(value, ' ', status);
  const detail = document.createElement('div');
  detail.className = 'claude-usage-pace__detail';
  text.append(headline, detail);
  container.appendChild(text);

  if (data.tooltip) {
    // The tooltip reads this object on every hover, so updates mutate it in place.
    const tooltip = { ...data.tooltip };
    (container as PaceIndicatorElement).paceTooltip = tooltip;
    attachTooltip(container, tooltip, { position: 'top', offset: 8 });
  }

  updatePaceIndicator(container, data);
  return container;
}

type PaceIndicatorElement = HTMLDivElement & { paceTooltip?: TooltipContent };

/**
 * Updates an existing pace indicator in place.
 */
export function updatePaceIndicator(container: HTMLDivElement, data: PaceData): void {
  const color = getColorFromPercentage(data.delta);
  const statusText = STATUS_TEXT[color];
  const detailText = formatPaceDetail(data);
  const valueText = formatDelta(data.delta);

  setAttr(container, 'data-color', color);
  setAttr(container, 'data-percentage', String(data.delta));
  setAttr(
    container,
    'aria-label',
    `${Math.round(data.actual)}% used, expected ${Math.round(data.expected)}% by now, ` +
      `${valueText} points ${statusText}.${detailText ? ` ${detailText}.` : ''}`
  );

  const needle = container.querySelector<SVGLineElement>('.claude-usage-pace__needle');
  if (needle) needle.style.transform = `rotate(${needleRotation(data.delta)}deg)`;

  const setText = (selector: string, text: string) => {
    const element = container.querySelector(selector);
    // Skip identical writes so periodic refreshes do not create mutations.
    if (element && element.textContent !== text) element.textContent = text;
  };
  setText('.claude-usage-pace__value', valueText);
  setText('.claude-usage-pace__status', statusText);
  setText('.claude-usage-pace__detail', detailText);

  const tooltip = (container as PaceIndicatorElement).paceTooltip;
  if (tooltip && data.tooltip) Object.assign(tooltip, data.tooltip);
}

/**
 * Finds Claude's usage bar for a row. Claude renders it as role="meter".
 */
export function findProgressBar(row: HTMLElement): HTMLElement | null {
  const bars = row.querySelectorAll<HTMLElement>('[role="meter"], [role="progressbar"], meter, progress');
  for (const bar of bars) {
    if (!bar.closest('[data-claude-tracker="true"]') && bar.getClientRects().length > 0) {
      return bar;
    }
  }
  return null;
}

const observedOverlays = new WeakSet<HTMLElement>();

/** Places the overlay exactly over the bar, in the coordinates of the bar's parent. */
function positionOverlay(bar: HTMLElement, overlay: HTMLElement): void {
  overlay.style.left = `${bar.offsetLeft}px`;
  overlay.style.top = `${bar.offsetTop}px`;
  overlay.style.width = `${bar.offsetWidth}px`;
  overlay.style.height = `${bar.offsetHeight}px`;
  const clip = overlay.querySelector<HTMLElement>('.claude-usage-pace-overlay__clip');
  if (clip) clip.style.borderRadius = window.getComputedStyle(bar).borderRadius;
}

/**
 * Draws or updates the expected-usage marker over Claude's progress bar.
 *
 * The overlay is a sibling of the bar, not a child, so a bar that clips its
 * overflow does not cut off the marker or its "pace" label.
 */
export function syncPaceMarker(bar: HTMLElement, data: PaceData): void {
  const host = bar.parentElement;
  if (!host) return;

  let overlay = host.querySelector<HTMLDivElement>(':scope > .claude-usage-pace-overlay');
  if (!overlay) {
    if (window.getComputedStyle(host).position === 'static') {
      host.style.position = 'relative';
    }
    overlay = document.createElement('div');
    overlay.className = 'claude-usage-pace-overlay';
    overlay.setAttribute('data-claude-tracker', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    const clip = document.createElement('div');
    clip.className = 'claude-usage-pace-overlay__clip';
    const band = document.createElement('div');
    band.className = 'claude-usage-pace-overlay__band';
    clip.appendChild(band);
    const marker = document.createElement('div');
    marker.className = 'claude-usage-pace-overlay__marker';
    const label = document.createElement('span');
    label.className = 'claude-usage-pace-overlay__label';
    marker.appendChild(label);
    overlay.append(clip, marker);
    host.appendChild(overlay);
  }

  // Follow the bar when the dialog resizes; stop once the overlay is gone.
  if (!observedOverlays.has(overlay)) {
    const target = overlay;
    const observer = new ResizeObserver(() => {
      if (target.isConnected) positionOverlay(bar, target);
      else observer.disconnect();
    });
    observer.observe(bar);
    observedOverlays.add(overlay);
  }
  positionOverlay(bar, overlay);

  const clamp = (value: number) => Math.max(0, Math.min(100, value));
  const actual = clamp(data.actual);
  const expected = clamp(data.expected);
  const color = getColorFromPercentage(data.delta);

  setAttr(overlay, 'data-color', color);
  setAttr(overlay, 'data-direction', actual >= expected ? 'over' : 'under');

  const band = overlay.querySelector<HTMLDivElement>('.claude-usage-pace-overlay__band')!;
  band.style.left = `${Math.min(actual, expected)}%`;
  band.style.width = `${Math.abs(actual - expected)}%`;

  const marker = overlay.querySelector<HTMLDivElement>('.claude-usage-pace-overlay__marker')!;
  marker.style.left = `${expected}%`;
  // Keep the label inside the bar's width near either end.
  setAttr(marker, 'data-align', expected < 8 ? 'start' : expected > 92 ? 'end' : 'center');

  const label = marker.querySelector<HTMLSpanElement>('.claude-usage-pace-overlay__label')!;
  const labelText = `pace ${Math.round(expected)}%`;
  if (label.textContent !== labelText) label.textContent = labelText;
}

/** Styles for the pace indicator and bar marker. */
export const PACE_STYLES = `
.claude-usage-pace {
  --pace-green: #1f9d55;
  --pace-yellow: #c98a04;
  --pace-red: #dc3545;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;
  line-height: 1.25;
  white-space: nowrap;
  border-radius: 6px;
  cursor: default;
}
.claude-usage-pace:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
.claude-usage-pace__gauge { flex-shrink: 0; overflow: visible; }
.claude-usage-pace__zone { fill: none; stroke-width: 6; }
.claude-usage-pace__zone--green { stroke: var(--pace-green); }
.claude-usage-pace__zone--yellow { stroke: var(--pace-yellow); }
.claude-usage-pace__zone--red { stroke: var(--pace-red); }
.claude-usage-pace__needle {
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: round;
  transform-box: view-box;
  transform-origin: ${CX}px ${CY}px;
  transition: transform 0.6s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.claude-usage-pace__hub { fill: currentColor; }
.claude-usage-pace__text { min-width: 0; }
.claude-usage-pace__headline { font-size: 13px; overflow: hidden; text-overflow: ellipsis; }
.claude-usage-pace__value { font-weight: 700; font-variant-numeric: tabular-nums; }
.claude-usage-pace[data-color="green"] .claude-usage-pace__value { color: var(--pace-green); }
.claude-usage-pace[data-color="yellow"] .claude-usage-pace__value { color: var(--pace-yellow); }
.claude-usage-pace[data-color="red"] .claude-usage-pace__value { color: var(--pace-red); }
.claude-usage-pace__status { font-weight: 500; }
.claude-usage-pace__detail {
  font-size: 11.5px;
  opacity: 0.65;
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  text-overflow: ellipsis;
}

.claude-usage-pace__detail:empty { display: none; }

.claude-usage-pace-overlay {
  --pace-green: #1f9d55;
  --pace-yellow: #c98a04;
  --pace-red: #dc3545;
  position: absolute;
  pointer-events: none;
  z-index: 1;
}
.claude-usage-pace-overlay__clip {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.claude-usage-pace-overlay__band {
  position: absolute;
  top: 0;
  bottom: 0;
  transition: left 0.4s ease, width 0.4s ease;
}
.claude-usage-pace-overlay[data-direction="over"] .claude-usage-pace-overlay__band {
  background: repeating-linear-gradient(135deg, var(--pace-band) 0 3px, color-mix(in srgb, var(--pace-band) 55%, transparent) 3px 6px);
}
.claude-usage-pace-overlay[data-direction="under"] .claude-usage-pace-overlay__band {
  background: color-mix(in srgb, var(--pace-band) 28%, transparent);
  outline: 1px dashed var(--pace-band);
  outline-offset: -1px;
}
.claude-usage-pace-overlay[data-color="green"] { --pace-band: var(--pace-green); }
.claude-usage-pace-overlay[data-color="yellow"] { --pace-band: var(--pace-yellow); }
.claude-usage-pace-overlay[data-color="red"] { --pace-band: var(--pace-red); }
.claude-usage-pace-overlay__marker {
  position: absolute;
  top: -5px;
  bottom: -5px;
  width: 2px;
  margin-left: -1px;
  border-radius: 1px;
  background: currentColor;
  transition: left 0.4s ease;
}
.claude-usage-pace-overlay__label {
  position: absolute;
  bottom: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
}
.claude-usage-pace-overlay__marker[data-align="start"] .claude-usage-pace-overlay__label { left: 0; transform: none; }
.claude-usage-pace-overlay__marker[data-align="end"] .claude-usage-pace-overlay__label { left: auto; right: 0; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .claude-usage-pace__needle,
  .claude-usage-pace-overlay__band,
  .claude-usage-pace-overlay__marker { transition: none; }
}
`;
