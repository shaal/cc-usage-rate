---
tags: [api]
summary: api implementation decisions and patterns
relevantTo: [api]
importance: 0.7
relatedFiles: []
usageStats:
  loaded: 2
  referenced: 1
  successfulFeatures: 1
---
# api

### Unified time parsing through dual-type system (RelativeTimeResult | AbsoluteTimeResult) with type guards rather than separate parsing pipelines (2026-01-10)
- **Context:** Need to parse two fundamentally different time representations (duration vs moment-in-time) from user input
- **Why:** Single parseTimeString() entry point with runtime type discrimination allows callers to handle both formats uniformly. Type guards enable safe TypeScript narrowing without casting.
- **Rejected:** Separate parseRelativeTime() and parseAbsoluteTime() only - would require caller to know format in advance or implement their own detection logic
- **Trade-offs:** Adds detection complexity at parse time but eliminates duplicate caller logic and enforces single responsibility (parser detects AND parses). Easier to extend with new time formats.
- **Breaking if changed:** Removing type guards breaks all code relying on isAbsoluteTime()/isRelativeTime() narrowing. Changing union type to single return type breaks type safety.

#### [Pattern] Day-of-week matching finds most recent occurrence (past-biased) rather than next occurrence when computing absoluteTimeToDate (2026-01-10)
- **Problem solved:** When user specifies 'Thu 3:00 PM' without explicit date, determine which Thursday they meant
- **Why this works:** Past-biased default matches user mental model for scheduling utilities ('I meant last Thursday') and session tracking context (looking back at recent sessions). Future-biased would be confusing.
- **Trade-offs:** Past-bias works for history/tracking features but would be wrong for future scheduling. Function intent matters. Consider adding parameter for bias direction.

#### [Gotcha] Status determination uses ±10% threshold but treats under-usage differently from over-usage (both mark isOnTrack=true for under, but false for over when exceeding threshold) (2026-01-10)
- **Situation:** analyzeSession() returns different isOnTrack boolean values despite similar delta magnitudes on opposite sides of threshold
- **Root cause:** Under-usage (using less than expected) is acceptable behavior and doesn't require urgent action; over-usage (burning through allocation faster) is a warning condition requiring attention. This asymmetry reflects real-world user priorities
- **How to avoid:** More intuitive status for users but creates non-obvious boolean semantics that could confuse developers; the isOnTrack field doesn't always mean 'performing as expected'

### Reset time parsing supports both 12-hour (Thu 7:59 AM) and 24-hour (Wednesday 14:30) formats with fuzzy day matching (Thu, Thursday both valid) (2026-01-10)
- **Context:** Claude UI returns reset times in variable formats; need to extract configuration from uncontrolled user-facing strings
- **Why:** Users see multiple Claude UI instances with different time formats; fuzzy day matching handles both abbreviated and full day names without requiring exact format enforcement. Single parsing function centralizes format conversion logic
- **Rejected:** Strict single-format requirement would fail on some Claude UI versions; separate 12/24-hour parsers would duplicate logic; regex-free solution would lose validation benefits
- **Trade-offs:** More permissive parsing reduces brittle failures; added complexity in validation (checking bounds: hour 0-23, minute 0-59); null return for invalid input forces caller to handle gracefully
- **Breaking if changed:** If format validation becomes stricter (rejecting valid variations), integration with Claude UI extraction could fail silently

#### [Gotcha] Day normalization (Thursday -> 'Thursday', Thu -> 'Thursday') doesn't validate day exists; invalid inputs silently fall through map lookup returning undefined (2026-01-10)
- **Situation:** parseResetTimeString() extracts day name and calls normalizeDay(), which uses DAY_NAME_MAP lookup
- **Root cause:** Test shows parsing returns null for invalid hour (25) and minute (60) but doesn't test invalid day names; normalizeDay() assumes valid input from parser
- **How to avoid:** Simpler code if input guaranteed valid; if parser regex doesn't anchor correctly, invalid days could reach normalizeDay() and cause silent failures downstream

### Symmetric ±10% threshold band for 'optimal' utilization instead of asymmetric penalties (2026-01-10)
- **Context:** Defining when user is pacing correctly vs wasteful vs conservative
- **Why:** Symmetry treats under and over-utilization as equally important deviations from the ideal linear path. Simple threshold band is easier to understand and configure than penalty functions
- **Rejected:** Asymmetric penalties (penalize over-utilization more than under-utilization) would add cognitive load; percentage-based thresholds that scale with actual usage would be harder to reason about
- **Trade-offs:** Simple configuration vs inability to express that wasting quota is worse than conserving it - requires application layer to apply business logic
- **Breaking if changed:** If threshold changes from ±10% to different values, all real-world scenarios in test suite would fail; consumers expecting 'optimal' at specific deltas would break

#### [Pattern] Provide both granular functions (getUtilizationStatus, isOptimalUtilization) AND convenience wrappers (calculateEfficiencyDelta, calculateEfficiencyDeltaWithColor) (2026-01-10)
- **Problem solved:** API consumers have different needs: some need just status, some need full result object, some need color
- **Why this works:** Reduces call sites and boilerplate for common patterns while preserving composability for edge cases. Matches existing project patterns
- **Trade-offs:** More exports to maintain but clearer intent at call sites; easier to test individual pieces

### Configurable thresholds via EfficiencyDeltaConfig interface with sensible defaults rather than hard-coded magic numbers (2026-01-10)
- **Context:** Different use cases might require different tolerance levels for what constitutes 'optimal' usage
- **Why:** Allows single implementation to serve multiple scenarios without code duplication. Defaults (-10, +10) handle typical case while power users can tune. Prevents proliferation of similar functions (calculateEfficiencyDeltaStrict, calculateEfficiencyDeltaLoose, etc.)
- **Rejected:** Hard-coded thresholds - creates inflexible system; different contexts need different tolerances. Separate functions - creates code duplication and maintenance burden.
- **Trade-offs:** Slightly more complex API surface, but eliminates need for multiple similar functions and future proof against requirements changes
- **Breaking if changed:** Code relying on specific threshold values must pass explicit config; defaults changing breaks all implicit behavior

#### [Pattern] Configuration interface (SessionTrackerConfig) with boolean flags for each optional behavior (autoUpdate, injectStyles, debug, etc) instead of single mode enum (2026-01-10)
- **Problem solved:** Feature has multiple optional behaviors that need independent toggle: automatic updates, CSS injection, logging, showing specific indicators
- **Why this works:** Boolean flags allow fine-grained control - users can disable CSS injection but keep auto-updates. Enum-based modes force all-or-nothing choices. Makes feature composable
- **Trade-offs:** More config options create user choice but increase mental model complexity. Easier to extend than enum but harder to guarantee consistent presets

#### [Pattern] Global Window interface declaration for TypeScript to expose observer internals for testing (2026-01-10)
- **Problem solved:** Test code needed access to mutationLog and refreshCount tracked inside content script closure
- **Why this works:** TypeScript strict mode prevents accessing unknown properties. Declaring global interface allows test code to safely read observer state without casting to any.
- **Trade-offs:** Adds global state exposure specifically for testing vs cleaner encapsulation, but enables type-safe test assertions