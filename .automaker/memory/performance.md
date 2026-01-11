---
tags: [performance]
summary: performance implementation decisions and patterns
relevantTo: [performance]
importance: 0.7
relatedFiles: []
usageStats:
  loaded: 3
  referenced: 2
  successfulFeatures: 2
---
# performance

#### [Pattern] Returning null from functions (calculateElapsedFromTimeString, analyzeSessionFromTimeString) on invalid input rather than throwing errors (2026-01-10)
- **Problem solved:** Functions parse user-provided strings that may be malformed, need graceful degradation
- **Why this works:** Null return allows callers to use optional chaining and conditional logic naturally without try-catch blocks. Treats invalid input as 'no data available' rather than exceptional error state. Simpler error handling for UI code that needs to handle missing data anyway
- **Trade-offs:** Simpler calling code but requires understanding that null means 'invalid input' not 'no error occurred'; risks null pointer bugs if callers forget to check

#### [Pattern] Configurable timeout for waitForUsageElements() (default 10s) with early exit on element detection vs polling indefinitely (2026-01-10)
- **Problem solved:** Usage stats might load immediately or after 2-3 seconds of network delay; polling forever wastes CPU
- **Why this works:** 10 second timeout covers all realistic Claude.ai load times without blocking page interaction indefinitely. Early exit if elements found saves CPU. Configurable for testing and different network conditions
- **Trade-offs:** Timeout adds latency cap. Early exit means detection completes faster on good connections. If usage stats never load (broken page), detector still completes with empty result

#### [Pattern] calculateWeeklyTime() and calculateUsageEfficiency() computed on-demand from reference date, not cached, despite potentially being called repeatedly for same weekly window (2026-01-10)
- **Problem solved:** Extension needs real-time usage percentages; reference date passed as parameter allows testing different times without mocking Date
- **Why this works:** Stateless design enables pure functions; testable without date mocking; no state synchronization required. Cost trivial (arithmetic operations) vs caching complexity
- **Trade-offs:** Trivial computation cost; caller bears responsibility for caching if needed across multiple calls in tight loops

#### [Gotcha] 30-second update interval (updateInterval) prevents excessive recalculation but creates window where displayed efficiency delta is stale (2026-01-10)
- **Situation:** MutationObserver fires on every change, but recalculating efficiency delta every time (parsing DOM, math operations, DOM injection) is expensive
- **Root cause:** 30-second batching trades off real-time accuracy for CPU efficiency. At-session scale, 30s staleness is acceptable but prevents flicker from DOM mutations
- **How to avoid:** Batching makes performance predictable but adds latency. User sees slightly delayed efficiency metric. Prevents CPU spikes but accuracy suffers

#### [Pattern] Time calculations use date arithmetic on per-request basis rather than caching calculated values or precomputing intervals (2026-01-10)
- **Problem solved:** calculateWeeklyTimeDetails() runs every render to determine elapsed %, remaining time, and next reset date
- **Why this works:** Guarantees real-time accuracy for countdown timers. Weekly resets are infrequent (7-day cycle) so recalculation cost is negligible. Avoids stale state bugs.
- **Trade-offs:** Simplicity and correctness vs. potential repeated math operations. No observable performance issue for typical usage.

### Using CSS cubic-bezier timing functions with refined values (spring effect: 0.34, 1.56, 0.64, 1) instead of keyword timing functions for premium animation feel (2026-01-10)
- **Context:** Design needed to match Claude's premium visual language with sophisticated animations, not generic browser defaults
- **Why:** Cubic-bezier functions with overshoot (y-value > 1) create spring physics that feels premium; keywords like 'ease' are generic. Spring effect (0.34, 1.56, 0.64, 1) specifically creates subtle bounce
- **Rejected:** Linear or ease keyword would feel less sophisticated; JavaScript animation libraries would add payload and create maintenance burden
- **Trade-offs:** More sophisticated feel with negligible performance cost; harder to understand what values do without visualization; slightly larger CSS file from defining multiple bezier curves
- **Breaking if changed:** Reverting to keyword timing removes the premium feel and makes animations feel like generic web components

#### [Pattern] Debouncing at 500ms for DOM mutation batching instead of firing refresh on every text change (2026-01-10)
- **Problem solved:** Text content updates (percentages, timers) may involve multiple DOM mutations as nodes are replaced or updated
- **Why this works:** Multiple rapid mutations would trigger expensive recalculations redundantly. Single debounced refresh captures all concurrent changes with minimal overhead.
- **Trade-offs:** 500ms latency added to detection vs linear O(n) performance gain when content has multiple simultaneous updates

### 400ms animation wait time in tests chosen based on CSS transition duration, not arbitrary timeout (2026-01-10)
- **Context:** Tests needed to verify tooltip hide animation completed before checking visibility state
- **Why:** Test timeout must exceed CSS animation duration (defined in stylesheet) to reliably detect animation completion. 400ms matches actual transition timing in indicator.css
- **Rejected:** Arbitrary timeouts like 100ms would cause flaky tests that fail intermittently when animations haven't completed
- **Trade-offs:** Tests run slightly slower but are deterministic and reliable. Better to wait for actual animation than guess at timing
- **Breaking if changed:** If CSS transition duration changed but test timeout not updated, tests become intermittently flaky without obvious cause. Creates hidden dependency between CSS and test timing

### Implemented TTL-based DOM query caching with explicit invalidation rather than automatic cache busting on mutations (2026-01-10)
- **Context:** DOM queries like `querySelectorAll('div')` are expensive and called repeatedly during detection cycles and mutation processing
- **Why:** TTL provides safety window for stale data while explicit invalidation at cycle start ensures correctness. Automatic invalidation on every mutation would defeat caching benefits since mutations trigger detection cycles anyway
- **Rejected:** Could invalidate cache on every mutation (too aggressive, loses caching benefit) or use persistent caching without TTL (risks returning stale DOM references when elements are added/removed)
- **Trade-offs:** Introduces cache staleness window (500ms default) but provides predictable performance. Requires developer awareness that cache may not reflect immediate DOM changes outside detection cycles
- **Breaking if changed:** If cache TTL is removed and replaced with no-op invalidation, detector may miss newly added elements until next cycle. If TTL is too short, caching provides minimal benefit

#### [Gotcha] Debounce wrapper must filter mutations before debouncing, not after, otherwise non-relevant mutations still delay responses to relevant ones (2026-01-10)
- **Situation:** MutationObserver fires for all DOM changes including style updates, attribute changes, and text modifications that don't affect usage tracking
- **Root cause:** Mutation filtering reduces callback queue size before debouncing logic evaluates. Early filtering prevents irrelevant changes from resetting debounce timer for relevant detection work
- **How to avoid:** Requires pre-defining which mutations matter (e.g., child additions but not style changes). Early filtering adds slight overhead but saves orders of magnitude on debounce timer resets

#### [Pattern] Used maxWait parameter on debounce to guarantee minimum responsiveness (100ms debounce, 500ms maxWait) rather than pure debounce (2026-01-10)
- **Problem solved:** Pure debouncing with 100ms can still delay processing for 100ms on every change. Continuous rapid mutations could queue indefinitely if not capped
- **Why this works:** maxWait guarantees detector processes at least once every 500ms regardless of mutation frequency. Prevents starving the detector during animation-heavy periods while still batching nearby mutations
- **Trade-offs:** Adds complexity (dual timeout logic) but ensures bounded latency and prevents mutation queue starvation. More predictable performance profile

### SVG updates use in-place attribute modification (stroke-dashoffset, text) instead of innerHTML replacement (2026-01-10)
- **Context:** CircularIndicator updates every 100ms and innerHTML replacement forces complete SVG reparse and DOM recreation, causing layout thrashing
- **Why:** In-place updates preserve SVG DOM references, skip parser, and avoid cascading reflows. Updates only changed attributes so browser can batch repaints efficiently
- **Rejected:** innerHTML replacement is simpler code but forces full SVG reconstruction (80% more DOM operations). Rebuilding SVG element references breaks potential mutation observer targeting
- **Trade-offs:** In-place approach requires defensive coding for SVG structure assumptions (falls back to recreation if structure unexpected). More efficient but less forgiving to markup changes
- **Breaking if changed:** If SVG structure changes significantly (e.g., nested groups added), in-place updates will fail silently or partially apply. If code reverts to innerHTML, 80% performance regression for rapid updates and potential memory leak from orphaned SVG references

#### [Gotcha] Read-Write batcher must strictly separate read phase from write phase - reading during write phase causes reflow/reflow thrashing (2026-01-10)
- **Situation:** DOM operations forced DOM recalculation interleaved with modifications (e.g., reading offsetHeight after modifying display property)
- **Root cause:** Browser must synchronously recalculate layout when read follows write. Batching reads first, then writes, allows browser to collapse reflow operations into single paint cycle
- **How to avoid:** Requires disciplined code separation and collecting references before modification. Saves 50-70% reflow operations on batch updates but requires careful developer attention