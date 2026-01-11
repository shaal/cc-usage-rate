---
tags: [architecture]
summary: architecture implementation decisions and patterns
relevantTo: [architecture]
importance: 0.7
relatedFiles: []
usageStats:
  loaded: 2
  referenced: 1
  successfulFeatures: 1
---
# architecture

### Vite chosen as build system for Chrome extension instead of webpack or rollup (2026-01-10)
- **Context:** Chrome extension requires bundling content scripts, managing manifest.json, and copying static assets to dist/
- **Why:** Vite provides: fast dev server with HMR, zero-config content script bundling via input array, straightforward asset copying via publicDir. Simpler configuration than webpack for extension-specific requirements.
- **Rejected:** Webpack (overly complex config for this scale), Rollup (requires manual manifest handling and asset copying)
- **Trade-offs:** Vite's built-in features reduce boilerplate but tie the project to Vite ecosystem. If specific bundling needs emerge (code splitting across multiple content scripts), may need webpack later.
- **Breaking if changed:** Switching build systems requires rewriting vite.config.ts and may break dev/build scripts. Content script bundling strategy (single entry point vs multiple) is now Vite-dependent.

#### [Pattern] Separate src/ for source files and public/ for static assets that get copied to dist/ (2026-01-10)
- **Problem solved:** Chrome extension needs both TypeScript sources (compiled to dist/) and static files like manifest.json, CSS, icons (copied as-is to dist/)
- **Why this works:** Clear separation of concerns: src/ = code to transform, public/ = assets to preserve. Vite's publicDir config automates the copy. Prevents accidental bundling of manifest.json.
- **Trade-offs:** Two folders require developers to understand which goes where, but prevents 'manifest gets bundled and breaks' class of bugs.

### Used Vite's emptyOutDir property instead of custom build cleanup for production builds (2026-01-10)
- **Context:** Initial config had typo emptyDirFirst which doesn't exist in Vite. Needed to clean dist directory before builds.
- **Why:** emptyOutDir is Vite's native property - leverages framework's built-in mechanisms rather than external scripts. Simpler, more reliable, and guaranteed to run at the right time in build lifecycle.
- **Rejected:** Manual npm clean script that removes dist before build - requires sequencing via shell operators or separate commands
- **Trade-offs:** Cleaner config vs losing explicit control over what gets deleted. Less flexible but more maintainable.
- **Breaking if changed:** Removing emptyOutDir: true would cause stale artifacts to accumulate in dist, potentially breaking extension loading in dev/test cycles

#### [Pattern] Separate npm scripts for dev (with sourcemaps) vs build (production minified) with explicit NODE_ENV setting (2026-01-10)
- **Problem solved:** Extension needs different bundling strategies - dev requires debugging capability, production requires size optimization
- **Why this works:** Explicit environment variables prevent accidental production builds during development. Different Vite configurations per mode optimize for their use case (sourcemaps are dev-only overhead).
- **Trade-offs:** More scripts to maintain vs clear intent and guaranteed correct behavior. Easier debugging vs slightly more complex package.json

### Separate parsing, conversion, and formatting as distinct concerns (parseAbsoluteTime → absoluteTimeToDate → output) rather than monolithic parse-to-date function (2026-01-10)
- **Context:** Need to extract time information, convert to dates relative to reference point, and format for display in different contexts
- **Why:** Composition allows reusing parsed time objects without re-parsing, enables formatting in multiple ways, and testable independently. parseAbsoluteTime returns data, absoluteTimeToDate handles context (reference date), formatMinutesToString handles display.
- **Rejected:** Single parseAndFormatTime() function - couples concerns, harder to test, impossible to use parsed result in multiple formats
- **Trade-offs:** More functions but higher reusability and testability. Caller must chain functions but gains flexibility in what to do with intermediate results.
- **Breaking if changed:** Removing conversion layer means callers must handle date math themselves. Changing parse output structure breaks all dependent conversions.

#### [Pattern] Separated data formatting (formatPercentage) from rendering (createCircularIndicator) and color logic (getColorFromPercentage) into pure functions (2026-01-10)
- **Problem solved:** Component had multiple concerns: determining color thresholds, formatting display text, and rendering SVG structure
- **Why this works:** Enables testability, reusability, and framework-agnostic design. Pure functions avoid side effects. Color logic can be used independently (e.g., in list filters). Formatting can be tested without rendering DOM
- **Trade-offs:** Slightly more function calls but significantly better composability. Allows auto-color variant to reuse color logic

### Used color threshold ranges (-10% to +10% = yellow) instead of exact values, creating semantic 'zones' (negative/neutral/positive) (2026-01-10)
- **Context:** Component needs to visually communicate efficiency status across different magnitude ranges
- **Why:** Ranges are more forgiving for real-world data. Exact thresholds (e.g., exactly -10%) are brittle. Ranges map to user mental models: 'about the same' (yellow zone), 'much worse/better' (red/green). Allows tuning thresholds without refactoring
- **Rejected:** Single threshold values (e.g., any negative = red), exact bucket matches
- **Trade-offs:** Slightly more complex threshold logic vs significantly more semantic correctness and UX flexibility
- **Breaking if changed:** Removing range-based logic requires revisiting color semantics - single thresholds may not align with usage data distribution

### Clamping percentage calculations to [0, 100] range to prevent invalid states downstream (2026-01-10)
- **Context:** Session time calculations can receive various input edge cases (negative values, exceeding session duration) that would produce out-of-range percentages
- **Why:** Consumers of these utilities (UI components, status displays) assume percentages are always valid [0-100]. Clamping at the calculation layer prevents defensive programming scattered throughout the codebase and ensures consistent behavior
- **Rejected:** Allowing raw calculations and forcing consumers to validate/normalize - creates coupling and duplicated validation logic
- **Trade-offs:** Lost information about how far over/under bounds we went, but gained simplified consumer code and prevented silent bugs from invalid percentages flowing through the system
- **Breaking if changed:** Code that relies on detecting over-usage via values >100% or under-allocation via negative values would break; would need explicit delta fields instead

#### [Pattern] Composing simple utility functions with clear single responsibilities (calculateElapsedTimePercentage, calculateExpectedUsage) into higher-level analysis function (analyzeSession) (2026-01-10)
- **Problem solved:** Need both granular calculations for specific use cases and holistic analysis for common operations
- **Why this works:** Provides flexibility for different consumers - some need just elapsed time, others need full analysis - while maintaining DRY principle. Each function does one thing well and can be tested independently
- **Trade-offs:** More functions to maintain but each is simpler and reusable; consumers must compose or use the higher-level function based on needs

### Multi-strategy selector fallback system with data attributes > test IDs > heading-based > text pattern matching (2026-01-10)
- **Context:** DOM selectors on Claude.ai page are fragile and subject to change; need robust detection that survives minor UI refactors
- **Why:** Single selector approach breaks on any page structure change. Layered fallbacks ensure detection works across versions while maintaining specificity order (most reliable to least)
- **Rejected:** Single CSS selector approach; relying solely on React testing library selectors; hardcoding element positions
- **Trade-offs:** More code and complexity, but detection survives arbitrary page layout changes without code modification. Trade initial complexity for production stability
- **Breaking if changed:** Removing any fallback layer reduces coverage; if all layers fail, detection returns empty result but app continues (graceful degradation)

### Separate concerns: detector finds elements, extractor gets text, marker adds attributes. Three distinct functions with single responsibilities (2026-01-10)
- **Context:** Initial impulse was monolithic detection function doing all three tasks
- **Why:** Each concern has different failure modes and testability. Detector can fail gracefully if elements not found. Extractor depends on detector succeeding. Marker is side-effect-only
- **Rejected:** Single detectAndExtractAndMark() function; returning text content directly from detector
- **Trade-offs:** More function calls but easier to test each layer independently. Text extraction is null-safe with optional chaining fallback
- **Breaking if changed:** If extractor runs before detector, it returns all nulls. If marker runs before detector, nothing gets marked. Order matters and must be enforced in content script initialization

### Store detection results on window object (window.detectionResult, window.detectionComplete) rather than using message passing between content script and background (2026-01-10)
- **Context:** Content script needs to communicate detection results to injected page scripts; background script doesn't need this data
- **Why:** Window object sharing is simpler than message passing for same-origin communication. Detection is page-specific so no need for background coordination. Avoids IPC overhead
- **Rejected:** chrome.runtime.sendMessage to background script; localStorage; shared worker
- **Trade-offs:** Simpler code, but window object is vulnerable to page script overwriting. Detection results visible to any page script (minor security surface). No persistence across page reloads
- **Breaking if changed:** If page script clears window.detectionResult, dependent features lose element references. Must assume window object is read-only after detection phase

### Timezone offset stored as minutes from UTC, with positive values for west of UTC (matching JavaScript's getTimezoneOffset() semantics, not ISO 8601 convention) (2026-01-10)
- **Context:** Weekly reset calculations needed timezone awareness for accurate date boundary detection across user locations
- **Why:** JavaScript's native getTimezoneOffset() returns positive for west of UTC (opposite of ISO 8601). Using native semantics avoids conversion bugs and aligns with platform behavior already present in browser environment
- **Rejected:** ISO 8601 semantics (negative west) would require inverting all values and add mental overhead for maintainers; external timezone libraries add dependency weight
- **Trade-offs:** Easier integration with native Date API; harder for developers expecting ISO 8601 convention without documentation
- **Breaking if changed:** Any code depending on timezone offset semantics would invert calculations if implementation switched to ISO 8601 convention

#### [Pattern] Status determination uses ±10% efficiency delta threshold (on-track | under-track | over-track) matching CircularIndicator color logic, not stored separately (2026-01-10)
- **Problem solved:** Usage efficiency needs status categorization; CircularIndicator already defines color zones based on percentage deltas
- **Why this works:** Single source of truth for thresholds reduces inconsistency; calculateUsageEfficiency() returns delta, caller interprets status. Matches existing CircularIndicator pattern avoiding threshold duplication
- **Trade-offs:** Caller must know the ±10% threshold rule; more flexible if thresholds change per component; ensures UI and calculations always align

### MINUTES_PER_WEEK constant (10080) calculated at module load, not dynamically, despite being theoretically variable for different calendar systems (2026-01-10)
- **Context:** Utility functions need to normalize elapsed time to percentage of weekly window
- **Why:** JavaScript only supports Gregorian calendar; weeks are always 7*24*60 minutes in practice. Constant avoids repeated multiplication; trivially testable
- **Rejected:** Dynamic calculation (accepting dayCount parameter) adds parameter complexity; other calendar systems not supported by Date API anyway
- **Trade-offs:** Slightly more efficient; less flexible but matches reality; hard-coded constant surfaces the assumption explicitly in tests
- **Breaking if changed:** Would need significant refactoring if multi-calendar support became requirement (parameter changes to all calculation functions)

### Separated icon source (SVG) from distribution artifacts (PNG) with automated generation script (2026-01-10)
- **Context:** Need both scalable source icons and optimized PNG formats for different extension contexts (manifest, UI, store)
- **Why:** Single source of truth (SVG) prevents divergence between icon sizes and ensures consistency. Build-time PNG generation avoids manual maintenance burden
- **Rejected:** Manually maintaining PNG versions separately would create sync problems; committing pre-generated PNGs creates merge conflicts and bloat
- **Trade-offs:** Adds build step complexity but eliminates manual icon maintenance and version mismatches
- **Breaking if changed:** If generation script is removed or skipped, icon sizes may not match manifest expectations, causing extension load failures

#### [Pattern] Centralized promotional/metadata documentation separate from code, with version-controlled templates for store submissions (2026-01-10)
- **Problem solved:** Chrome Web Store materials (descriptions, guidelines, checklists) are configuration artifacts that need evolution tracking and multi-purpose reuse
- **Why this works:** Treating store materials as code (with version control) enables audit trail, prevents loss of submission history, and allows team collaboration on marketing copy
- **Trade-offs:** Requires discipline to keep sources synced with store when published, but gains immense operational value

#### [Pattern] Layered extraction pipeline: raw text parsing → structured data extraction → analysis/validation → formatting (2026-01-10)
- **Problem solved:** Complex usage data comes from unstructured DOM text in multiple formats and needs multiple consumers (percentage displays, time displays, calculations, recommendations)
- **Why this works:** Separates concerns so each parsing function is pure, testable, and reusable. Each layer can fail independently without cascading. Analysis layer can work with partial data.
- **Trade-offs:** More functions to maintain but each is simpler and more resilient. Additional abstraction layers but clearer failure modes.

### Dual-path data handling: hasSessionData/hasWeeklyData flags plus null-checked optional properties instead of required fields (2026-01-10)
- **Context:** Session usage (percentage + timer) and weekly usage (percentage + timer) may appear independently or together depending on Claude account type and session state
- **Why:** Flags indicate whether data collection succeeded. Null properties prevent false positives (e.g., treating undefined as 0%). Allows analysis to work with partial data and still provide value.
- **Rejected:** Using undefined/discriminated unions would require runtime type checking everywhere. Making all fields required would fail if only session data is available.
- **Trade-offs:** More verbose data structure but safer pattern matching. Consumers must check both flags and null values but get explicit signal about data availability.
- **Breaking if changed:** If optional fields become required, the extractor fails completely when only partial data is available (e.g., session but no weekly reset time)

#### [Pattern] Graceful degradation: missing data produces 'No X data available' in formatting layer rather than throwing or returning undefined (2026-01-10)
- **Problem solved:** Usage data may be unavailable or partially available depending on Claude account state, session timing, and page load timing
- **Why this works:** Extension remains functional even when data is missing. Users see clear message vs blank/broken display. Analysis can proceed with whatever data is available.
- **Trade-offs:** Formatting knows about missing data cases (slight coupling) but UI layer doesn't need null checks. Easier to add new data sources later.

#### [Pattern] Reuse existing utility modules (domDetector, timeStringParser, sessionTimeCalculator, weeklyTimeCalculator) rather than reimplementing their logic (2026-01-10)
- **Problem solved:** Extension already had parsing, calculation, and DOM detection utilities; new extractor needed to compose these
- **Why this works:** Prevents logic duplication, ensures consistency across extension, reduces testing burden, leverages existing battle-tested code. Single source of truth for each concern.
- **Trade-offs:** Depends on other modules being correct/stable but avoids duplicated bugs. Clearer to future maintainers that this is composition.

### Explicit validation flags (isValid, hasError) on parsed results rather than throwing exceptions or using status codes (2026-01-10)
- **Context:** Parsing may fail for many reasons (malformed text, missing DOM elements, unexpected format) and extension must not crash
- **Why:** Callers can detect failures without try/catch. Multiple validation failures can be collected and reported. Non-critical failures don't break entire analysis.
- **Rejected:** Exceptions would require defensive coding throughout calling code. Silent failures (returning default values) hide parsing problems.
- **Trade-offs:** Consumers must check flags before using values but get rich error info. Slightly verbose but safe.
- **Breaking if changed:** If validation flags are removed and exception throwing is added, any parsing failure crashes the extension

### Linear usage model: expected usage equals elapsed time percentage (5% time elapsed = 5% expected usage) (2026-01-10)
- **Context:** Determining if user is under/over-utilizing quota based on time progression
- **Why:** Simple, predictable baseline that works across different quota types (weekly, session-based, period-based). Allows user behavior to be evaluated relative to a neutral expectation rather than arbitrary thresholds
- **Rejected:** Exponential/backloaded models would require domain knowledge about user consumption patterns; fixed thresholds would ignore temporal context
- **Trade-offs:** Easy to reason about and implement but assumes uniform consumption is optimal - fails for bursty or front-loaded legitimate use cases
- **Breaking if changed:** If changed to non-linear model, all consumer code comparing actual vs expected usage would give different results; thresholds would need recalibration

### Separate color mapping function (getStatusColor) rather than embedding color logic in efficiency calculation (2026-01-10)
- **Context:** Status determination (under/optimal/over) is independent from UI representation (green/yellow/red)
- **Why:** Decouples domain logic from presentation; allows status to be used for non-visual purposes (logging, analytics); color mapping can change without touching calculation
- **Rejected:** Embedding color in EfficiencyDeltaResult would couple calculation to UI; hardcoding colors in consumers would duplicate logic
- **Trade-offs:** Extra function call overhead but dramatically simpler to test, reuse, and modify color scheme
- **Breaking if changed:** If color mapping function removed, callers must implement their own mapping; if mapping is wrong, it affects all uses of efficiency data

### Dual-layer color mapping with consistency verification between calculation layer (efficiencyDeltaCalculator.ts) and presentation layer (CircularIndicator.ts) (2026-01-10)
- **Context:** System needed to map efficiency deltas to visual indicators while ensuring both programmatic and UI layers stay synchronized
- **Why:** Separation of concerns allows business logic to be independent of UI rendering, but introduces risk of divergence. Explicit consistency tests prevent silent failures where calculation layer and UI layer disagree on color mapping.
- **Rejected:** Single centralized color mapping function - would create tight coupling between business logic and UI; refactoring UI components would require touching calculation logic
- **Trade-offs:** Added complexity of maintaining two separate mapping functions (getStatusColor + getColorFromPercentage), but gained ability to unit test business logic independently and provides explicit contracts for UI implementations
- **Breaking if changed:** If either mapping function is modified without updating corresponding tests, color inconsistencies will occur silently in production until consistency tests are run

### Singleton pattern with lazy initialization for SessionTracker class via getSessionTracker() and destroySessionTracker() functions (2026-01-10)
- **Context:** Multiple DOM mutations and page loads could trigger multiple tracker instances, causing memory leaks and duplicate DOM injection
- **Why:** Ensures single instance controls the entire tracker lifecycle. Prevents race conditions when MutationObserver fires multiple times during page initialization. Cleanup via destroySessionTracker() prevents memory leaks on page unload
- **Rejected:** Direct instantiation on every import would create multiple listeners and duplicate DOM elements. Global variable without cleanup would persist across page navigations
- **Trade-offs:** Adds slight complexity with state management but eliminates duplicate updates. Requires explicit cleanup vs automatic garbage collection of direct instances
- **Breaking if changed:** Removing singleton pattern would cause multiple MutationObservers and CircularIndicators to be created, consuming memory and causing duplicate DOM injections that interfere with each other

#### [Pattern] Data flow pipeline: DOM detection → text extraction → parsing → calculations → visual injection with intermediate storage of state (2026-01-10)
- **Problem solved:** Need to coordinate between 5 different modules that each extract/transform data at different abstraction levels
- **Why this works:** Creates clear separation of concerns where each module has single responsibility. State storage prevents recalculation on every DOM change. Allows easy testing at each stage without mocking entire chain
- **Trade-offs:** Adds more lines of code for state tracking but creates resilience to internal changes. Easy to debug specific stage but requires understanding flow direction

### MutationObserver configured to watch entire document instead of specific container, triggering recalculation on any DOM change within target section (2026-01-10)
- **Context:** Session usage percentage and timer values change when user navigates or page refreshes, requiring real-time indicator updates
- **Why:** Broad observer ensures catch all mutations including attribute changes, text content updates, and re-renders. Alternative specific container watching would miss changes outside container
- **Rejected:** Polling with setInterval would be less efficient than event-driven updates. Watching only #session-container would miss updates if DOM restructures
- **Trade-offs:** Broader observer catches all changes but fires more frequently, requiring debouncing. Per-container observer is more efficient but fragile if page structure changes
- **Breaking if changed:** If observer is removed and polling replaces it, missed updates between poll intervals. If observer scope is narrowed to specific container, page restructuring breaks tracking. If MutationObserver callback doesn't debounce, excessive recalculations tax CPU

### CSS injection directly into page head via style element instead of relying on pre-compiled CSS assets (2026-01-10)
- **Context:** Circular indicator and tracker wrapper styles need to exist in DOM but extension may load after page initialization
- **Why:** Runtime injection guarantees styles exist when indicator is created, regardless of script load order. Pre-compiled approach requires bundler configuration and asset hosting
- **Rejected:** External CSS file would require manifest permissions and host configuration. Relying on shared stylesheet risks style conflicts with page styles
- **Trade-offs:** Runtime injection adds code complexity but no asset management overhead. Styles are guaranteed to load but harder to debug in DevTools. Increases initial script size
- **Breaking if changed:** If CSS injection removed and styles expected to be pre-loaded, indicators render without styling (broken appearance). If styles moved to separate file, requires manifest.json changes and content_security_policy updates

#### [Gotcha] Efficiency delta calculation assumes linear relationship between elapsed time percentage and expected usage percentage, but actual usage may be non-linear (2026-01-10)
- **Situation:** System calculates delta as (actual usage % - elapsed time %). Assumes if 50% of session elapsed, user should have consumed 50% of quota
- **Root cause:** Linear model is simple to compute and reasonable average case. Users with consistent usage pattern fit this model well
- **How to avoid:** Simplicity vs accuracy. Linear model easy to understand but flags power users with front-loaded usage as 'inefficient'. Matches average user but outliers look wrong

### Created standalone WeeklyTracker component separate from SessionTracker despite SessionTracker already having showWeeklyIndicator: true capability (2026-01-10)
- **Context:** SessionTracker class already handled weekly tracking, but new WeeklyTracker component was created as a modular alternative
- **Why:** Decouples weekly tracking from session tracking lifecycle, allowing independent instantiation and lifecycle management (update/destroy methods). Enables consumers to use weekly tracking without full SessionTracker initialization overhead.
- **Rejected:** Could have extended SessionTracker or added factory methods to it, but would have increased coupling and made it harder to use weekly tracking in isolation
- **Trade-offs:** Code duplication of some logic (time calculation, color determination) vs. independence and simpler API. Creates two paths to weekly data instead of single source of truth.
- **Breaking if changed:** If SessionTracker behavior changes, WeeklyTracker won't inherit those changes. Maintenance burden doubles when weekly logic needs updates.

#### [Gotcha] CSS styling for weekly tracker added directly to content.css (170+ lines) rather than scoped/modularized, creating side effect in global stylesheet (2026-01-10)
- **Situation:** WeeklyTracker component styling spans many selectors with deep nesting like 'claude-usage-weekly-summary__status--under'
- **Root cause:** Extension content script injects into arbitrary pages, so component styling must be in single bundled CSS file that injects with content. Can't use CSS-in-JS or modular imports.
- **How to avoid:** Centralized styling easier to manage vs. pollutes global namespace and risks conflicts with page styling. All CSS selectors must use very specific naming (claude-usage-* prefix) to avoid collisions

#### [Gotcha] TypeScript compilation failed due to incompatible error handler interface changes in domDetector.ts - functions required `errors` array parameter that wasn't being passed (2026-01-10)
- **Situation:** Another process/linter updated errorHandler interface but didn't update all callers in domDetector.ts, causing type mismatch
- **Root cause:** Interface changes in centralized errorHandler weren't propagated to all call sites. This is integration risk when multiple files share error handling logic
- **How to avoid:** Had to manually fix all call sites (findUsageRowByText, findPercentageElement, findTimerElement) to pass errors array. Revealed need for interface version management

#### [Pattern] Accessibility-first design with @media queries for prefers-reduced-motion, prefers-contrast, and :focus-visible states embedded throughout CSS rather than in separate stylesheet (2026-01-10)
- **Problem solved:** Need to ensure animations and high-contrast modes work correctly without forcing users to manage separate stylesheets
- **Why this works:** Co-locating accessibility variants with base styles ensures they're maintained together and don't get lost in refactoring. Prevents accidental removal. @media queries are performant (no JS overhead) and native browser feature
- **Trade-offs:** Slightly larger CSS but all variants for a feature stay together; reduces file organization but improves maintainability; users with accessibility needs get instant protection without configuration

### Synchronizing design tokens across multiple CSS files (indicator.css and content.css) rather than having single source of truth, with test verification ensuring consistency (2026-01-10)
- **Context:** Different CSS files serve different contexts (indicator component vs content script) but need identical design tokens
- **Why:** Avoids CSS variable cascading issues between different execution contexts/scopes. Single @import could create specificity conflicts or load order issues. Test verification ensures synchronization is maintained during future edits
- **Rejected:** CSS @import could cause cascading issues; CSS variables in shared file might not cascade correctly across content script boundaries; build-time generation would add complexity
- **Trade-offs:** Duplication of token definitions but isolation guarantees correctness; increased maintenance burden but mitigated by tests; larger total CSS payload
- **Breaking if changed:** Removing duplicate definitions would cause design inconsistencies if variables don't cascade properly between contexts; losing test verification would allow silent desynchronization

### Implemented error handler as centralized utility with error code enumeration rather than scattered try-catch blocks throughout modules (2026-01-10)
- **Context:** Extension code executes in unpredictable browser environment with DOM mutations, network issues, and timing problems. Each module (DOM detector, data extractor, time parser) needed consistent error handling.
- **Why:** Centralized error handler allows: (1) consistent error categorization across all modules, (2) severity-based filtering for debugging, (3) single point to add new error types, (4) aggregation of errors across the extraction pipeline for comprehensive failure reporting
- **Rejected:** Alternative of passing error callbacks to each function would create coupling and make error aggregation harder; inline error handling would cause inconsistent error formats and make testing brittle
- **Trade-offs:** Easier: uniform error classification, testability, debugging. Harder: must import error handler everywhere, more indirection
- **Breaking if changed:** If centralized handler removed, modules lose error categorization ability and can't aggregate/filter errors. Error recovery logic tied to error codes would fail.

#### [Pattern] Error codes are organized by category (PAGE_LOAD, DOM_ELEMENT, TIME_FORMAT, etc.) with uniqueness enforced by tests rather than by code structure (2026-01-10)
- **Problem solved:** Different failure domains (page loading, DOM queries, time parsing) each need specific error codes for debugging. Initially could have used enums or separate constants per module.
- **Why this works:** Categorical organization makes error filtering predictable (`errors.filter(e => e.code.startsWith('PAGE'))`). Test-based uniqueness validation catches accidental code collisions at test time rather than runtime. Avoids over-engineering with namespaced enums.
- **Trade-offs:** Easier: readable code, single error namespace. Harder: must remember tests verify uniqueness, collision errors only caught in CI

#### [Gotcha] Extraction errors can originate from two places: parsing errors (current function) and propagated errors from rawData.extractionErrors (prior extraction step). Both must be collected and returned. (2026-01-10)
- **Situation:** DOM detection happens in one context, data extraction in another. Errors from DOM detection (ELEMENT_REMOVED, ELEMENT_NOT_FOUND) must survive through to final result so UI can understand why data is missing.
- **Root cause:** DOM extraction can fail (element query fails), then data extraction happens on partial results with its own errors. Losing DOM errors means UI can't distinguish 'data was unparseable' from 'data never existed on page'. Test explicitly validates error propagation chain.
- **How to avoid:** Easier: comprehensive error trace. Harder: must remember to propagate errors through pipeline, tests must verify multi-stage propagation

#### [Pattern] Graceful degradation implemented as reusable wrapper function (withGracefulDegradation) with configurable retry policy, not hardcoded into each call site (2026-01-10)
- **Problem solved:** Transient failures (network hiccup, DOM mutation during read) should sometimes retry, sometimes fallback. Different call sites have different retry requirements.
- **Why this works:** Wrapping caller rather than modifying callee keeps concern separation: caller decides recovery strategy, callee just does its job. Configuration (maxRetries, retryDelayMs) lives at call site where decision is made. Function remains testable with or without retry.
- **Trade-offs:** Easier: composable, reusable, testable. Harder: indirection adds complexity, call sites must understand degradation is happening

### Safe DOM operation wrappers (safeQuerySelector, safeGetTextContent) check element existence AFTER query succeeds, not before (2026-01-10)
- **Context:** DOM is mutable. Element can exist during query but be removed/replaced by event handler immediately after. Multiple approaches: (1) check before/after, (2) use try-catch, (3) verify after every operation
- **Why:** Post-operation verification catches actual mutations that matter; pre-checks create false security. Content.textContent can fail if element was replaced, so wrapper checks state after property access. This matches reality: element existence changes during script execution.
- **Rejected:** Pre-checks would miss mutations that happen between check and use; only checking at query time would miss removal during attribute/property access
- **Trade-offs:** Easier: catches real problems. Harder: must check after each risky operation, not just at element retrieval
- **Breaking if changed:** If post-checks removed, mutations during property access would cause uncaught exceptions; pre-checks alone would give false confidence of safety.

#### [Gotcha] Percentage values are clamped (0-100) with WARNING severity, not treated as parsing errors, to allow system to function with out-of-range but parseable values (2026-01-10)
- **Situation:** Website DOM contains '150%' or '-5%' text. Parser successfully extracts number but it's invalid for usage percentage domain. Question: hard error or graceful degradation?
- **Root cause:** Hard error (throw) would crash feature. Clamping with warning allows: (1) feature continues working with reasonable value, (2) error is logged for debugging, (3) developers see 'something went weird' in logs but UI doesn't break
- **How to avoid:** Easier: system stays up. Harder: observers must check severity levels to find these issues; could mask real problems if not monitored

### Error handler stores errors in array with manual limit (maxStoredErrors) rather than using circular buffer or ring buffer (2026-01-10)
- **Context:** Browser extension runs indefinitely. Error accumulation could cause memory leak if not bounded. Need to decide: circular buffer, size limit + FIFO eviction, or unlimited.
- **Why:** Explicit limit with configuration (maxStoredErrors: 1000) makes memory usage predictable and auditable. Developers can see the bound in code. Simpler than circular buffer implementation. FIFO eviction keeps recent errors (more useful for debugging than oldest errors).
- **Rejected:** Circular buffer adds complexity with index management and wrap-around logic. Unlimited storage risks memory exhaustion after days of running.
- **Trade-offs:** Easier: obvious memory bound, simple implementation. Harder: old errors lost after limit (but usually not needed)
- **Breaking if changed:** If limit removed, extension could consume unbounded memory and crash after extended use. If changed to LIFO, developers would see oldest errors instead of recent ones when debugging.

#### [Pattern] Severity levels (debug, info, warning, error, critical) used for filtering during retrieval (getErrors with minSeverity) rather than filtering during storage (2026-01-10)
- **Problem solved:** System logs debug details but shouldn't flood log output. Need to balance: store everything for detailed debugging, but selectively expose to callers.
- **Why this works:** Store-all + filter-on-retrieval allows callers to get details they need (debugging might set minSeverity=debug, production monitoring might use minSeverity=error). Doesn't lose data during collection. Callers control verbosity, not centralized policy.
- **Trade-offs:** Easier: flexible, complete audit trail. Harder: must store more errors, filtering must happen on every retrieval

### Hybrid mutation detection with pattern fallback: Combine data-attribute checking with regex pattern matching for robustness (2026-01-10)
- **Context:** MutationObserver needed to detect usage updates but DOM structure may vary or elements could be recreated dynamically
- **Why:** Single detection method is fragile - if DOM detection fails (element not found, attributes missing), pattern matching catches the text change anyway. Redundancy prevents false negatives.
- **Rejected:** Single detection method (either attribute-based OR pattern-based) would miss updates if DOM structure unexpectedly changed or wasn't initialized yet
- **Trade-offs:** More code complexity and multiple pattern evaluations per mutation vs guaranteed detection across varying DOM implementations
- **Breaking if changed:** Removing pattern fallback would cause silent failures when DOM structure doesn't match expected data attributes

### Use characterDataOldValue flag to skip identity-equal mutations and reduce false positives (2026-01-10)
- **Context:** Observer was triggering on all characterData mutations, including ones where text didn't actually change
- **Why:** DOM frameworks and virtual DOM libraries may update nodes without changing their content. Comparing oldValue === newValue prevents spurious refreshes from framework re-renders.
- **Rejected:** Process all mutations without value comparison would lead to flaky observer firing on non-changes
- **Trade-offs:** Adds comparison overhead per mutation vs prevents debugging nightmare of phantom refresh triggers
- **Breaking if changed:** Removing oldValue check would cause observer to trigger on no-op DOM updates, creating hard-to-trace performance issues and test flakiness

#### [Pattern] Singleton global tooltip element with content swapping vs creating/destroying tooltips per indicator (2026-01-10)
- **Problem solved:** Multiple circular indicators on page each needed hover tooltips without performance degradation
- **Why this works:** Singleton pattern minimizes DOM churn and reflows. Single element repositioned and restyled is more efficient than creating/destroying DOM nodes on each hover. Reduces memory footprint and garbage collection pressure
- **Trade-offs:** Simpler performance characteristics but requires more careful state management to ensure content/position sync with current indicator

#### [Pattern] Dual tooltip content system - rich HTML tooltips vs legacy text-only tooltips with backward compatibility (2026-01-10)
- **Problem solved:** Needed enhanced tooltips with structured sections while maintaining existing code that uses simple text tooltips
- **Why this works:** Two-tier system allows gradual migration. CircularIndicator accepts both `tooltipText` (legacy) and `tooltipContent` (new object format). Router prioritizes rich content when available
- **Trade-offs:** Extra branching logic but enables incremental adoption. Legacy code continues working while new indicators use enhanced tooltips