---
name: test-runner
description: Runs end-to-end and unit test suites, parsing errors and reporting actionable diffs.
---

# Test Verification Protocol
1. Execute `make test`.
2. If tests fail:
   - Identify whether failure is an assertion mismatch, missing mock, or DB schema conflict.
   - Fix the underlying code or migration—do NOT alter test assertions to force a pass unless the spec changed.
