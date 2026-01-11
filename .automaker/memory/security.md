---
tags: [security]
summary: security implementation decisions and patterns
relevantTo: [security]
importance: 0.7
relatedFiles: []
usageStats:
  loaded: 2
  referenced: 1
  successfulFeatures: 1
---
# security

### Manifest V3 with specific host permission pattern https://claude.ai/* instead of broad <all_urls> (2026-01-10)
- **Context:** Content script needs to access Claude.ai usage page but extension should have minimal permissions
- **Why:** Principle of least privilege: restricts execution to only intended domain, reducing attack surface and improving extension review likelihood on Chrome Web Store
- **Rejected:** Broad <all_urls> permission (violates security best practices), content_scripts matching all URLs
- **Trade-offs:** More secure and auditable, but harder to debug if wrong domain specified. Must update manifest if expanding to other sites.
- **Breaking if changed:** Changing host pattern from claude.ai to different domain requires manifest edit. If user loads extension on restricted domain, content script silently won't execute - hard to diagnose without checking host_permissions.

### Added esnext target for Chrome extensions instead of es2020 or lower compatibility (2026-01-10)
- **Context:** Chrome extensions have a known target runtime (Chromium), not generic browser compatibility concerns
- **Why:** esnext removes transpilation overhead and follows Chrome extension best practices - Chromium supports modern JS natively. Extensions control their runtime environment.
- **Rejected:** Lowering target to es2020 - adds unnecessary transpilation complexity without benefit for extension context
- **Trade-offs:** Smaller bundle size and faster builds vs zero backward compatibility (acceptable for extensions)
- **Breaking if changed:** If plugin needs to run on older Chrome versions (pre-ES2020), lowering target is mandatory; current config makes that impossible

#### [Gotcha] Heading-based detection uses text content matching (textContent.toLowerCase().includes()) which can false-match user-generated content (2026-01-10)
- **Situation:** Text pattern matching as fallback when data attributes and test IDs fail
- **Root cause:** Handles pages where 'session' and 'weekly' sections exist but aren't explicitly marked with selectors
- **How to avoid:** More robust detection but potential false positives if page contains other elements with matching text (e.g., help text mentioning 'session usage')

#### [Pattern] Metadata validation through automated test suite before extension publication (2026-01-10)
- **Problem solved:** Chrome Web Store has strict requirements for descriptions (character limits), icons (exact sizes), and privacy policies. Manual verification is error-prone
- **Why this works:** Programmatic validation catches configuration errors before submission, preventing rejection or store violations. Tests document expected state
- **Trade-offs:** Requires writing and maintaining tests, but prevents expensive re-submission cycles and store policy violations

### Clamp percentage inputs to 0-100 range for safety; no explicit error throwing on invalid input (2026-01-10)
- **Context:** Percentages can be calculated from various sources and may have floating point errors or caller bugs
- **Why:** Graceful degradation - invalid inputs still produce sensible results rather than NaN/undefined; prevents cascade failures in visualizations
- **Rejected:** Throwing errors would require all callers to implement error handling; validating but not clamping would let NaN propagate downstream
- **Trade-offs:** Caller bugs go silent (percentage > 100 becomes 100) but system remains stable vs explicit failures that interrupt workflows
- **Breaking if changed:** If clamping is removed and caller relies on it to prevent invalid states, bugs surface elsewhere in rendering/UI logic