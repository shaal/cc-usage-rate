# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Usage Tracker is a Chrome extension (Manifest V3) that displays usage efficiency indicators on claude.ai/settings/usage. It compares actual usage percentages against expected time-based percentages, showing color-coded gauges (green/yellow/red) to help users pace their Claude usage.

## Build Commands

```bash
npm install          # Install dependencies
npm run dev          # Development build with watch mode
npm run build        # Production build to dist/
npm run type-check   # TypeScript type checking
npm test             # Run Playwright tests
npm run package      # Build and zip for Chrome Web Store
npm run generate-icons  # Convert SVG icons to PNG
```

## Loading the Extension

1. Build with `npm run build`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist` folder

## Architecture

### Data Flow Pipeline

```
DOM Detection → Text Extraction → Parsing → Analysis → Indicator Rendering
```

1. **DOM Detection** (`src/utils/domDetector.ts`): Finds session/weekly usage elements on claude.ai using text content matching and structural heuristics
2. **Usage Data Extractor** (`src/utils/usageDataExtractor.ts`): Parses percentages and time strings into structured data
3. **Time Calculators**: Convert parsed data to efficiency metrics
   - `sessionTimeCalculator.ts`: 5-hour session window calculations
   - `weeklyTimeCalculator.ts`: Weekly reset cycle calculations
4. **SessionTracker** (`src/content/sessionTracker.ts`): Main integration class that wires everything together, manages MutationObserver for live updates
5. **CircularIndicator** (`src/components/CircularIndicator.ts`): SVG gauge component with auto-coloring based on efficiency delta

### Entry Point

`src/content/index.ts` is the content script entry point. It initializes the `SessionTracker` singleton when the DOM is ready on claude.ai/settings/usage.

### Key Abstractions

- **DOMDetectionResult**: Contains references to detected DOM elements (containers, percentage elements, timer elements)
- **UsageAnalysisResult**: Complete analysis with session/weekly efficiency data and recommendations
- **TrackerState**: Current state of the SessionTracker including indicators and errors

### Performance Utilities

`src/utils/performanceUtils.ts` provides:
- `DebouncedMutationObserver`: Debounced DOM change handling to prevent update storms
- `BatchedDOMUpdater`: Batches DOM writes using requestAnimationFrame
- DOM query caching for expensive selectors

## Testing

Tests use Playwright. Run a single test:
```bash
npx playwright test tests/tooltip-verification.spec.ts
```

## Color Logic

The efficiency delta determines indicator color:
- **Green** (delta ≤ -10%): Usage below expected, room to use more
- **Yellow** (-10% < delta < 10%): On track
- **Red** (delta ≥ 10%): Usage above expected, consider pacing

## Error Handling

The extension uses graceful degradation. If some DOM elements aren't found, it operates in "degraded mode" with partial data rather than failing completely. All errors are collected in `TrackerState.errors` and logged via `ErrorHandler`.
