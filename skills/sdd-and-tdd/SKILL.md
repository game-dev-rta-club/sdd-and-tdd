---
name: sdd-and-tdd
description: Keep specifications, tests and implementation aligned while developing features, fixing bugs or refactoring, one observable behavior at a time. Use for code changes or requests for SDD or TDD.
license: MIT
---

# SDD and TDD

Keep the requested behavior consistent across specs, tests and code. Readers should understand what the feature does from its specification, and tests should verify its important promises.

## Work one behavior at a time

1. **Understand the next change.**

   Read the relevant specification in full alongside existing tests and code. Use the project's discovery tools and documentation conventions. Choose one observable behavior and how to verify it; resolve unclear intent with the requester.

   Search references to the affected code, containing folders and shared feature names. Missing links do not establish that no specification exists. If none exists, record the intended behavior in an appropriate canonical project document before implementing it.

2. **Express the expectation in both spec and test.**

   Before implementing a behavior or usage change, update its canonical specification. Write a test for the same behavior and confirm it fails for the intended reason. Derive expectations from the specification or an independent worked example, not a copy of the implementation's calculation.

3. **Make it work.**

   Implement enough to pass the test, then run affected regression tests. Repeat this loop one behavior at a time rather than writing all tests before all implementation. When a decision changes, revisit spec and test together; do not weaken either just to accommodate a bug.

4. **Reconcile before moving on.**

   Check both directions: does the implementation fulfill the spec, and did implementation introduce behavior or conditions the spec omits? Refactor with tests green and verify again after relevant changes. Keep planned or unverified behavior distinguishable from working features; unrelated plans remain out of scope.

## Keep it lightweight

- Check specs every cycle; edit only when their meaning changes. A regression may need a new test while the existing promise stays unchanged. Behavior-preserving refactors can retain both specs and tests.
- Test results through real public interfaces, not internal call sequences. Choose the cheapest reliable verification for the risk: focused tests for logic, integration checks for lifecycle or persistence, and visual inspection for appearance. Shared-component changes may need representative consumer checks. If automation is impractical, explain the alternative and any remaining verification gap.
- Keep short, canonical pages rather than duplicating specifications in task documents. Link to relevant implementation entry points using the project's conventions, and repair inbound links when targets move or are renamed. If documentation previews or discovery metadata exist, refresh them after changes.

Finish when the requested behavior is verified and its specs, tests and code agree. Report what changed and any unverified behavior; test success alone does not establish visual correctness.
