---
tags: [gotcha, mistake, edge-case, bug, warning]
summary: Mistakes and edge cases to avoid
relevantTo: [error, bug, fix, issue, problem]
importance: 0.9
relatedFiles: []
usageStats:
  loaded: 24
  referenced: 18
  successfulFeatures: 18
---
# Gotchas

Mistakes and edge cases to avoid. These are lessons learned from past issues.

---



#### [Gotcha] 12-hour to 24-hour conversion requires special handling: 12:00 AM = 0, 12:xx AM = 12, 12:00 PM = 12, 12:xx PM = 12+xx (not simple +12 offset) (2026-01-10)
- **Situation:** Converting parsed 12-hour time with AM/PM indicator to 24-hour format for internal consistency
- **Root cause:** Naive offset logic (add 12 if PM) fails at midnight (12 AM) and noon (12 PM). Root cause: 12-hour format uses 12 as anchor, not 0. Explicit conditional logic handles each quadrant.
- **How to avoid:** Verbose but explicit reduces bugs. Could extract to helper function if conversion reused elsewhere.

#### [Gotcha] Relative time parsing must handle variable format inputs ('2 hr 48 min', '2 hours 30 minutes', '5 min ago', '1 hr') - regex pattern complexity grows combinatorially (2026-01-10)
- **Situation:** Supporting natural language time entry for better UX
- **Root cause:** Root cause: English grammar allows singular/plural (hour/hours), abbreviations (hr/hour), temporal markers (ago), and varied orderings. Separate parsing for hours/minutes with optional markers keeps patterns manageable vs monolithic mega-regex.
- **How to avoid:** Multiple simpler regexes instead of one complex one. More code lines but much easier to understand and extend. Slightly slower (multiple test passes) but parsing is not performance-critical.

#### [Gotcha] SVG stroke-dashoffset animation offset calculation is counter-intuitive: negative values move the dash pattern, requiring `offset = circumference * (1 - percentage/100)` not `offset = circumference * percentage/100` (2026-01-10)
- **Situation:** Initial attempt to show progress ring from 0% to 100% produced opposite animation direction
- **Root cause:** SVG stroke-dashoffset uses negative values to 'shift' the visible dash pattern. Starting with full circumference hidden (dasharray = circumference, offset = 0) means reducing offset reveals progress. Inverse of typical percentage representations
- **How to avoid:** Requires mental model shift but enables CSS-only animation without JavaScript calculations per frame

#### [Gotcha] DOMContentLoaded event fires before async content loads on Claude.ai; must handle already-fired DOMContentLoaded and use waitForUsageElements() (2026-01-10)
- **Situation:** Initial implementation only listened to DOMContentLoaded, but usage stats load asynchronously after page render completes
- **Root cause:** Claude.ai lazy-loads the usage settings via JavaScript after initial page paint. DOMContentLoaded fires when DOM parsing completes, not when all content loads
- **How to avoid:** Must implement dual-path initialization (event listener + document.readyState check) and async waiting with timeout. Adds complexity but ensures detection works on both fast and slow networks

#### [Gotcha] Chrome Web Store short description character count validation must account for actual UTF-8 byte length, not just string length (2026-01-10)
- **Situation:** Test initially failed showing description as 1 character over limit when display showed it under the limit
- **Root cause:** JavaScript string length counts characters, not bytes. Some Unicode characters take multiple bytes. Chrome Web Store validator may count differently
- **How to avoid:** Requires explicit verification rather than relying on editor's character counter

#### [Gotcha] Input clamping to 0-100 range happens silently; out-of-range values don't error but get transformed, potentially masking upstream data quality issues (2026-01-10)
- **Situation:** Actual and expected usage percentages should theoretically never exceed 100%, but implementation clamps rather than validates
- **Root cause:** Defensive programming prevents crashes from bad data, but clamping can hide bugs where upstream systems emit invalid percentages (>100% actual usage shouldn't silently become 100%)
- **How to avoid:** System stays operational but false 100% values could mask real problems. Error approach would catch issues but reduce fault tolerance.