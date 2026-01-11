---
tags: [testing]
summary: testing implementation decisions and patterns
relevantTo: [testing]
importance: 0.7
relatedFiles: []
usageStats:
  loaded: 2
  referenced: 1
  successfulFeatures: 1
---
# testing

#### [Gotcha] tsconfig.json with JSON comments fails when parsed with strict JSON parser (2026-01-10)
- **Situation:** Test attempted to parse tsconfig.json using JSON.parse() which doesn't support JSON5 comments (/* */)
- **Root cause:** TypeScript allows comments in tsconfig.json as a convenience feature, but standard JSON parsers reject them. This is a semantic vs syntactic mismatch.
- **How to avoid:** Switched to text content matching instead of structured parsing. Loses validation of actual JSON structure but gains robustness and avoids external dependencies in test.

#### [Pattern] File existence and content verification tests instead of type-checking or runtime validation (2026-01-10)
- **Problem solved:** Verifying project scaffold is complete and properly configured (manifest, tsconfig, vite.config, package.json)
- **Why this works:** Catches structural setup errors early: missing files, misconfigured paths, wrong dependencies. These errors would otherwise only surface at build or runtime. Faster feedback than waiting for full build.
- **Trade-offs:** Added test infrastructure (Playwright, build verification tests) increases setup complexity but prevents 'half-working' project state where build succeeds but extension won't load.

#### [Gotcha] tsconfig.json cannot be parsed as pure JSON when it contains comments, requiring content regex matching instead (2026-01-10)
- **Situation:** Initial test used JSON.parse() which failed silently on tsconfig.json with comments (a common TypeScript convention)
- **Root cause:** TypeScript allows comments in tsconfig.json but JSON.parse() does not. The project uses this feature, so tests must account for it.
- **How to avoid:** Less precise validation (string matching vs structured parsing) but avoids additional dependencies and works with TypeScript conventions

#### [Pattern] Playwright-based build system verification that executes actual npm scripts and validates filesystem output (2026-01-10)
- **Problem solved:** Needed confidence that vite config changes didn't break the build pipeline for Chrome extension
- **Why this works:** Integration testing catches config issues that unit tests miss. Tests actual output (manifest structure, file existence) rather than config syntax. Verifies the complete build-to-extension-ready pipeline.
- **Trade-offs:** Slower test execution but catches real runtime issues. Requires Playwright dependency but provides high confidence

#### [Pattern] Explicit test coverage of edge cases (midnight/noon, case sensitivity, invalid ranges like 25:00 or 10:60) alongside happy paths (2026-01-10)
- **Problem solved:** Parsing user-provided time strings with multiple formats and natural language variations
- **Why this works:** Edge cases in time handling are common source of bugs (off-by-one hours, AM/PM confusion). Invalid input testing ensures graceful degradation (null return) rather than crashes or silent corruption.
- **Trade-offs:** More test cases (29 total) but much higher confidence. Boundary testing costs little in test execution time but prevents expensive runtime bugs.

#### [Pattern] Created comprehensive Playwright tests that verify SVG structure (circle count, text presence) rather than just visual regression or computed styles (2026-01-10)
- **Problem solved:** Testing a visual component with complex SVG internals
- **Why this works:** Tests the actual DOM contract rather than implementation details. Verifies accessibility structure (role, aria-label). Catches breaking changes (e.g., if circles removed). More robust than visual tests
- **Trade-offs:** More verbose but catches actual functional breaks. Tests HTML structure not visual appearance - appropriate for component verification

### Using fixed session duration (300 min) as default constant with optional override parameter rather than injection pattern (2026-01-10)
- **Context:** Functions needed flexible session duration support for testing different scenarios, but also needed sensible production default
- **Why:** Optional parameter with constant default balances testability with simplicity - most production code uses the constant, tests can override when needed. Avoids dependency injection complexity for a simple constant value
- **Rejected:** Full DI/provider pattern - over-engineered for this use case; storing duration in shared state - would create testing coupling issues
- **Trade-offs:** Easier to use in simple cases but requires understanding the optional parameter exists for non-standard sessions. Cannot easily swap duration globally at runtime
- **Breaking if changed:** Code calling these functions without optional params depends on 300-minute assumption; changing the constant breaks all dependent calculations

#### [Gotcha] Test assertions use specific calculated minutes (like 168) from time string parsing rather than just validating the structure exists (2026-01-10)
- **Situation:** Tests needed to verify end-to-end integration between timeStringParser and sessionTimeCalculator works correctly
- **Root cause:** Catches bugs in string parsing that might not be obvious from higher-level assertions. Verifies the contract between modules is correct - e.g., '2 hr 48 min' truly means 168 remaining minutes
- **How to avoid:** Tests are more brittle (must know exact parsed values) but catch real integration bugs; easier to debug when tests fail because specific values don't match

#### [Pattern] Data attribute marking system (data-claude-usage-*) for element identity rather than relying on element position or content matching (2026-01-10)
- **Problem solved:** Need to track which DOM elements were detected and coordinate between detector, extractor, and UI injection modules
- **Why this works:** Avoids coupling between modules via shared queries. Each module can independently mark elements it cares about. Easy to debug in DevTools with element inspector
- **Trade-offs:** Small performance cost of setAttribute() calls, but eliminates redundant querying. Makes module boundaries explicit and debuggable

#### [Gotcha] Week boundary tests use hardcoded dates (2024-01-06 for Saturday 23:59, 2024-01-08 for Monday) - these dates must correspond to correct days of week or elapsed percentage calculations silently fail (2026-01-10)
- **Situation:** Edge case testing revealed that JavaScript Date calculations depend on actual calendar alignment; off-by-one day errors pass because no day-of-week validation occurs until calculation
- **Root cause:** Date validation is implicit (no asserting 2024-01-06 IS Saturday before test runs); test passed despite potential date selection errors. Root cause: no defensive check that reference date matches expected day
- **How to avoid:** Tests are concise but fragile to date changes; maintainers must manually verify dates remain calendar-accurate during test updates

#### [Gotcha] ES module compatibility issue with __dirname in Playwright tests running as ES modules (2026-01-10)
- **Situation:** Test file failed because __dirname is not available in ES module context, but was needed for path resolution
- **Root cause:** ES modules don't have __dirname/__filename globals like CommonJS. Must use fileURLToPath(import.meta.url) to derive it
- **How to avoid:** Extra import statements required but maintains project's ES module architecture

#### [Pattern] Comprehensive metadata validation tests verify not just file existence but semantic correctness (icon sizes, description limits, policy completeness) (2026-01-10)
- **Problem solved:** Simple existence checks miss configuration errors: wrong icon paths in manifest, descriptions over limits, missing policy sections
- **Why this works:** Extension distribution depends on metadata conformance. Early validation prevents failed submissions. Tests document what 'correct' means
- **Trade-offs:** More tests to write and maintain, but catches subtle configuration bugs impossible to spot manually

#### [Pattern] Comprehensive edge case testing before integration: 0%, 100%, missing data, partial data, all day abbreviations, all time formats (2026-01-10)
- **Problem solved:** Usage data extractor must handle real-world DOM variations without crashing or silently producing wrong results
- **Why this works:** DOM content from external sites is unpredictable. Testing before integration prevents silent failures in production. Verification test created then deleted ensures no debt.
- **Trade-offs:** 41 temporary test cases added development time but caught potential runtime issues. Test deleted after verification prevents test maintenance burden.

#### [Gotcha] Percentage parsing must handle multiple formats: '50%', '50', '50.5%' - not just the most common format (2026-01-10)
- **Situation:** DOM text content varies by which Claude page/account is viewed; extension must not assume consistent format
- **Root cause:** Real user data will include all variants. Testing all formats during development prevents silent failures when users hit different account types
- **How to avoid:** Parser is slightly more complex (handles % and decimal optionally) but handles real-world variation. No performance impact.

#### [Gotcha] Test includes boundary conditions at exactly ±10% deltas (e.g., -10 and +10) where thresholds transition between states (2026-01-10)
- **Situation:** Real-world usage scenarios need to validate exact threshold behavior, not just regions
- **Root cause:** Off-by-one errors in threshold logic are common; explicit boundary tests prevent subtle bugs where 9.9% is optimal but 10.1% flips status unexpectedly
- **How to avoid:** More test cases but significantly higher confidence in threshold logic correctness

#### [Pattern] Real-world scenario tests use semantic domain values (Monday morning 10% elapsed, Wednesday 50% elapsed) paired with actual behavior verification (2026-01-10)
- **Problem solved:** Module must work correctly across different quota types (weekly, session-based, period-based)
- **Why this works:** Semantic scenarios make test intent clear and catch logic that works for one quota type but fails for another; tests document expected behavior patterns
- **Trade-offs:** Test code is more verbose but immediately shows if logic handles diverse real-world patterns

#### [Pattern] Comprehensive boundary testing with exact threshold values (-10, +10) and zones (under-utilizing, optimal, over-utilizing) rather than sampling approach (2026-01-10)
- **Problem solved:** Threshold-based logic has sharp boundaries where off-by-one errors cause incorrect status/color assignment
- **Why this works:** Boundary value analysis is critical for threshold systems. Testing delta values -20, -10, -5, 0, +5, +10, +20 covers both sides of boundaries and interior zones, catching common off-by-one errors that sampling would miss
- **Trade-offs:** More verbose test cases but much higher confidence in correctness at critical boundaries; prevents expensive production bugs from threshold miscalculations

### Status description messages include contextual keywords ('below expected', 'capacity', 'on track', 'above expected', 'pacing') rather than fixed enum strings (2026-01-10)
- **Context:** UI/UX needed human-readable explanations of efficiency status for end users
- **Why:** Allows UI to display different messages for same status in different contexts without creating separate status types. Keywords approach enables i18n and future message templating. Using substring matching in tests (toContain) creates loose contract that allows description variation.
- **Rejected:** Hard-coded description enum - inflexible for localization and different use cases; would require new status types for variations
- **Trade-offs:** Tests are less strict (toContain vs toBe), making them more brittle if descriptions are accidentally shortened, but enables flexible messaging
- **Breaking if changed:** If descriptions are refactored and keywords removed, tests pass but user experience degrades without test failures

#### [Gotcha] Test created synthetic HTML structure instead of running against actual claude.ai/settings/usage page (2026-01-10)
- **Situation:** Playwright tests need to verify DOM injection behavior without requiring authentication to real Claude usage page
- **Root cause:** Synthetic approach isolates indicator logic from page structure changes. Real page testing would be flaky if Claude changes layout. Synthetic allows testing injection logic independently
- **How to avoid:** Synthetic tests verify injection mechanism but don't catch breaks in DOM selector changes on real page. Must maintain separate validation for real page selectors

### Verification test created in temporary file, deleted after passing instead of committed to repository (2026-01-10)
- **Context:** Need confidence that integration works but integration test is synthetic and wouldn't catch real page selector changes
- **Why:** Temporary test validates implementation during development without false confidence from always-passing synthetic test. Real validation requires manual testing on actual Claude page
- **Rejected:** Committing synthetic test would provide false sense of security - test passes but feature breaks on real page if selectors change. No test at all risks integration bugs
- **Trade-offs:** Temporary test catches logic errors during development but doesn't prevent regressions. Manual validation required after Chrome extension updates or Claude changes page layout
- **Breaking if changed:** If test file deleted without passing, missing integration validation means bugs ship. If test committed, test passes but real feature breaks because synthetic HTML doesn't match production page structure

### Playwright tests evaluate DOM structure and text content in browser context rather than unit testing logic functions independently (2026-01-10)
- **Context:** Tests verify tooltip generation, HTML structure creation, and indicator properties by executing in page context
- **Why:** Catches integration issues where component renders correctly but DOM selectors or CSS class names are wrong. Tests the actual output that users see, not just function logic.
- **Rejected:** Could unit test generateTooltipText() and createWeeklySummary() with mock objects in Node, but wouldn't catch rendering failures or selector mismatches
- **Trade-offs:** Slower test execution and more environmental setup vs. higher confidence in actual browser behavior. Tests are more brittle to CSS/selector changes.
- **Breaking if changed:** If CSS class names change (e.g., 'claude-usage-weekly-summary__status' renamed), tests fail even if logic is correct. Tight coupling between test expectations and DOM structure.

#### [Gotcha] Had to clean up temporary Playwright test files after verification - test file deletion was explicit requirement, not automatic (2026-01-10)
- **Situation:** Created indicator-injection.spec.ts for verification but had to manually delete it post-test
- **Root cause:** Test files used Playwright browser automation for real DOM verification (not mocked). After tests pass, artifact cleanup is manual responsibility. Leaving test files pollutes repo and causes confusion about test coverage
- **How to avoid:** Manual cleanup adds step to workflow, but keeps repo clean. Playwright tests verify real behavior vs unit test false positives

#### [Gotcha] ES module compatibility issue with __dirname/__filename in Playwright tests required manual polyfill using fileURLToPath(import.meta.url) (2026-01-10)
- **Situation:** Playwright test used CommonJS path resolution pattern (__dirname) with ES6 imports, causing undefined reference errors
- **Root cause:** ES modules don't provide __dirname by default (CommonJS feature). fileURLToPath polyfill converts file:// URL to system path, enabling CommonJS-style path operations
- **How to avoid:** Extra setup code but enables standard path.join() patterns; could have simplified by using import.meta.url directly but less readable

#### [Pattern] Comprehensive test coverage for CSS file structure verification rather than just visual/functional testing - verifying design token presence, organization, and synchronization across files (2026-01-10)
- **Problem solved:** Multiple CSS files (indicator.css, content.css) needed to stay synchronized with design tokens; risk of accidental inconsistencies during maintenance
- **Why this works:** CSS is not automatically type-checked or linted for content structure. File-based assertions detect desynchronization early and ensure design tokens are actually present. Catches scenarios where minification or build processes might strip values
- **Trade-offs:** Catches structural issues but doesn't validate visual correctness or rendering; test passes even if values are mathematically wrong (e.g., wrong hex code); requires updating tests if organization comments change

#### [Pattern] Using test.beforeAll() to read CSS file once rather than per-test, treating entire CSS file as single assertion target with regex matching (2026-01-10)
- **Problem solved:** 20 test cases needed to verify different aspects of the same CSS file without reloading it repeatedly
- **Why this works:** Avoids I/O overhead (fs.readFileSync per test is expensive); CSS file is treated as immutable during test run. Single read enables multiple grep-style assertions against consistent content
- **Trade-offs:** Fast execution but requires all tests to fit in memory; file changes during test run won't be detected (acceptable for this use case); long regex patterns are hard to maintain

### Partial data handling tested as valid case (isValid=true) rather than invalid case, with hasSessionData/hasWeeklyData flags indicating what succeeded (2026-01-10)
- **Context:** Real-world browser environments often have partial data: one metric visible, another not loaded yet, or one removed by DOM mutation. System must continue functioning.
- **Why:** Marking partial data as 'invalid' would force cascading failures. Instead, partial success is valid; downstream consumers check hasSessionData/hasWeeklyData flags to determine what they can use. This matches graceful degradation principle.
- **Rejected:** Could return error state for any missing data, but this would break real usage where user opens extension mid-page-load or after some DOM updates
- **Trade-offs:** Easier: system stays functional. Harder: callers must check individual data availability flags rather than simple boolean validity check
- **Breaking if changed:** If this changed to treat partial data as invalid, the tracking UI would go blank in common scenarios (page loading, DOM mutations) instead of showing available metrics.

#### [Pattern] Playwright tests verify retry behavior by checking 'attempts' counter increments to exact expected value, proving retry actually happened (2026-01-10)
- **Problem solved:** withGracefulDegradation has retry configuration. Must verify it's not just documented or ignored but actually controls behavior.
- **Why this works:** Counting attempts proves: (1) retry configuration is read, (2) retry delay actually happens (test would be slower), (3) function keeps retrying correct number of times. Simple success/failure check wouldn't catch if retry was broken.
- **Trade-offs:** Easier: directly validates behavior. Harder: test must be written to instrument the function (attempts counter)

#### [Gotcha] Timing assumptions break tests: Adding DOM elements triggers MutationObserver before observer is ready or state is reset (2026-01-10)
- **Situation:** Initial test added unrelated element immediately, causing observer to fire before test counters were initialized
- **Root cause:** MutationObserver fires asynchronously but synchronously added DOM changes queue mutations immediately. Test needed to add element first, wait for mutations to settle, THEN reset counters.
- **How to avoid:** Added 700ms wait to test vs trying to debounce test execution itself, but explicit waits are clearer than implicit timing

#### [Gotcha] Module imports in test HTML fail silently - bundled dist files not available in file:// protocol context (2026-01-10)
- **Situation:** Test HTML tried to import tooltip functions from dist/content.js using ES6 module syntax
- **Root cause:** File protocol doesn't support module resolution and bundled files may not exist or be accessible. Had to inline tooltip implementation in test page instead of importing from built source
- **How to avoid:** Inlined code duplication in test but ensures tests run in isolated environment. Trade-off between DRY principle and test reliability

#### [Pattern] Separated edge-case test infrastructure from primary feature tests to isolate complex scenarios and avoid polluting main test suite with boundary condition coverage (2026-01-10)
- **Problem solved:** Testing comprehensive edge cases (0%, 50%, 100% usage, threshold boundaries at -10%/-9%/+9%/+10%, timezone offsets UTC-12 to UTC+14, rapid state changes) required 33+ test cases that would clutter standard test files
- **Why this works:** Edge cases represent low-probability scenarios that are important for robustness but create maintenance burden if mixed with happy-path tests. Separate dedicated test infrastructure allows focused validation without noise in primary test suite
- **Trade-offs:** Gained: Clear separation of concerns, easier to maintain and extend edge-case coverage. Lost: Single test run visibility (must run dedicated test file separately)

#### [Gotcha] Threshold boundary testing requires testing BOTH sides of exact boundary values (-10%, -9%, +9%, +10%) because off-by-one errors in comparison operators (< vs <=) cause color misclassification (2026-01-10)
- **Situation:** Indicator color determination uses delta thresholds (delta <= -10 = green, -10 < delta < 10 = yellow, delta >= 10 = red). A single test at boundary value would miss operator errors
- **Root cause:** Comparison operator mistakes (< instead of <=) are common in threshold logic and only detectable by testing immediately adjacent values. Testing only exact boundaries (delta = -10.0) misses that -10.1 might be classified incorrectly
- **How to avoid:** Gained: Detection of operator-level bugs that would slip through normal testing. Lost: Test code verbosity (5 tests instead of 3 for threshold coverage)

#### [Pattern] Week boundary transition testing covers not just week-start moments but also mid-week, near-end, and final-hours scenarios to catch accumulation/reset logic errors that only manifest at specific temporal positions (2026-01-10)
- **Problem solved:** Weekly efficiency tracking resets on week boundaries. Testing only at boundary moments (Monday 00:00) misses bugs that manifest when accumulated usage patterns reach reset points
- **Why this works:** Accumulation bugs often depend on the amount of data accumulated before reset. Testing only at boundaries catches 'reset works' but not 'reset with 80 hours accumulated' or 'reset with 1 minute before boundary'. Different accumulated states stress different code paths
- **Trade-offs:** Gained: Detection of state-accumulation bugs. Lost: Simplicity (5 tests instead of 2 for week coverage)

#### [Gotcha] Timezone testing with full UTC offset range (UTC-12 to UTC+14) is necessary because timezone edge cases manifest differently at extreme offsets where local time can be 26+ hours ahead/behind UTC (2026-01-10)
- **Situation:** Extension handles user timezone to determine local week boundaries. Testing only typical timezones (UTC-5 to UTC+1) misses bugs that only appear at extreme offsets where day boundaries shift dramatically
- **Root cause:** Extreme timezone offsets cause unusual situations: a user in UTC+14 on Monday might be in UTC's previous Sunday, or a user in UTC-12 might be in UTC's next day. These reversals reveal assumptions about date/time relationships that break at extremes
- **How to avoid:** Gained: Detection of timezone assumption bugs and localization errors. Lost: Test complexity (3 dedicated timezone tests instead of assuming time handling works everywhere)

#### [Pattern] Rapid change simulation (13 state changes at 100ms intervals) catches race conditions and animation/rendering artifacts that stable-state tests miss by exercising state mutation speed (2026-01-10)
- **Problem solved:** Indicator component must update visual state (SVG colors, labels, classes) when efficiency data changes. Slow state changes in manual testing won't reveal race conditions or animation glitches
- **Why this works:** State updates, DOM mutations, and CSS animations interact in ways that only become visible under rapid change. Testing at production-speed change rates (which could occur when usage data syncs) ensures the component handles concurrent updates without visual corruption
- **Trade-offs:** Gained: Detection of timing-sensitive bugs and animation glitches. Lost: Test setup complexity (requires setTimeout coordination and timing verification)

### Verified accessibility (tabindex='0') as part of edge-case test suite rather than separate accessibility-specific tests to keep edge-case concerns unified (2026-01-10)
- **Context:** Edge-case test suite was testing indicator behavior under extreme data conditions. Keyboard accessibility check (tabindex attribute) was included to verify that indicators remain focusable even under edge-case usage percentages
- **Why:** Accessibility behavior should be invariant across all usage percentages - it shouldn't change based on efficiency data. Including the check in edge-case tests verifies this invariant holds for all tested scenarios
- **Rejected:** Creating a separate accessibility test suite would imply accessibility is only tested for typical scenarios, not for edge cases
- **Trade-offs:** Gained: Verification that accessibility is preserved even for unusual data. Lost: Separation of concerns (accessibility check mixed with data-validation tests)
- **Breaking if changed:** If accessibility validation is removed from edge-case tests, the system could drift toward indicators that lose keyboard accessibility when efficiency percentages hit extremes (e.g., lose tabindex when delta > 50%)

### Used waitForFunction with data-test-passed attributes instead of timeouts + evaluate for test synchronization (2026-01-10)
- **Context:** Performance tests were flaky with fixed timeouts because debounce/RAF timing is non-deterministic across test environments
- **Why:** waitForFunction polls actual completion signal (attribute set by tested code) rather than guessing timing. Tests pass when work actually completes, not when fixed time elapses
- **Rejected:** Fixed timeouts are simpler but race-condition prone (too short = flake, too long = slow tests). setInterval polling is tedious compared to waitForFunction
- **Trade-offs:** Requires instrumenting code with test signals but gains deterministic passing criteria. Test becomes slower to write but dramatically more reliable
- **Breaking if changed:** If data-test-passed attributes are removed from code, tests will timeout and fail. If waitForFunction timeout is too short relative to actual debounce, tests remain flaky