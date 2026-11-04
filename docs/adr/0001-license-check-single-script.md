# ADR 0001 — One script and one policy file for licence checks

- Status: accepted
- Date: 2026-11-04
- Context: PROJECT_BIBLE.md §13.4

## Context

The bible requires an automatic licence check in CI for npm and Rust dependencies and suggested
`cargo-deny` for Rust. Two tools would mean two allow lists that can drift apart (e.g. one allows
`LGPL-3.0` and the other does not).

## Decision

- A single policy file, `licenses.policy.json`, holds the allow list, the "requires ADR" list,
  the known-forbidden list with reasons, and documented per-package exceptions.
- A single script, `scripts/licenses.mjs`, reads npm production dependencies
  (`pnpm licenses list --prod`) and all crates from `Cargo.lock` (`cargo metadata`),
  evaluates SPDX expressions (`AND`/`OR`/`WITH`, legacy `A/B`) and fails on any violation.
- The evaluation logic is pure and unit-tested (`scripts/lib/license-policy.test.mjs`).
- The same script generates `THIRD_PARTY_NOTICES.md` (de-duplicated licence texts). The file is
  generated at build/release time and not committed (~700 KB).

`cargo-deny` may be added later for advisories (security), not for licences.

## Consequences

- Adding a licence to the allow list is a reviewed change to one file.
- Rust build-time and other-platform crates are checked too — stricter than necessary, on purpose.
