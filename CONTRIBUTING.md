# Contributing

Thank you for helping! A few rules keep the project free and maintainable.

## Source of truth

[PROJECT_BIBLE.md](PROJECT_BIBLE.md) defines what we build and how. If a change contradicts it,
either change the code or propose a change to the bible (with a changelog entry, §20).

## Developer Certificate of Origin (DCO)

We do not ask you to transfer copyright. Instead, every commit must be signed off, certifying the
[Developer Certificate of Origin 1.1](https://developercertificate.org/):

```sh
git commit -s -m "Describe the change"
```

This adds `Signed-off-by: Your Name <you@example.org>` to the commit message.

## Licences

The project is GPL-3.0-or-later. Every dependency and asset must be compatible (§13):

- run `pnpm licenses:check` before opening a pull request;
- record fonts, sounds, icons and images with source and licence in `src/assets/ASSETS.md`;
- never add paid/"pro" extensions, source-available or non-commercial licences.

Every source file starts with `SPDX-License-Identifier: GPL-3.0-or-later`.

## Rules of thumb

- Small, verifiable steps; the app must run after every change.
- UI strings go into `src/i18n/de.json`, `en.json` and `ru.json` at the same time (a test checks this).
- Never hard-code the product name; import it from `src/config/product.ts`.
- UI never calls AI providers or writes project files directly (§14).
- Significant decisions are recorded as ADRs in `docs/adr/`.
